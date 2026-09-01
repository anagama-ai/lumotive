import { error } from '@sveltejs/kit';
import sharp from 'sharp';
import { cacheKey, readCached, writeCached } from '$lib/imagecache.server';
import {
	CONVERT_CONCURRENCY,
	CONVERT_QUEUE_LIMIT,
	isVariantWidth,
	VARIANT_CONTENT_TYPE,
	VARIANT_FORMAT
} from '$lib/imagesizes';
import { createPB, pbFileUrl } from '$lib/pb';
import type { RequestHandler } from './$types';

const CACHE_CONTROL = 'public, max-age=31536000, immutable';
const ORIGINAL_CONTENT_TYPES: Record<string, string> = {
	gif: 'image/gif',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp'
};
const inFlight = new Map<string, Promise<Buffer | null>>();
const conversionQueue: Array<() => void> = [];
let activeConversions = 0;

async function acquireConversionPermit() {
	if (activeConversions < CONVERT_CONCURRENCY) {
		activeConversions += 1;
		return true;
	}
	if (conversionQueue.length >= CONVERT_QUEUE_LIMIT) return false;

	await new Promise<void>((resolve) => conversionQueue.push(resolve));
	return true;
}

function releaseConversionPermit() {
	const next = conversionQueue.shift();
	if (next) next();
	else activeConversions -= 1;
}

function originalContentType(filename: string) {
	const extension = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
	return ORIGINAL_CONTENT_TYPES[extension] ?? 'application/octet-stream';
}

function responseHeaders(response: Response, etag: string, includeEntityHeaders = true) {
	const headers = new Headers({
		'Cache-Control': CACHE_CONTROL,
		ETag: etag
	});
	if (includeEntityHeaders) {
		for (const name of ['Content-Type', 'Content-Length']) {
			const value = response.headers.get(name);
			if (value) headers.set(name, value);
		}
	}
	return headers;
}

function matchesEtag(condition: string | null, etag: string | null) {
	if (!condition || !etag) return false;
	const target = etag.replace(/^W\//, '');
	return condition
		.split(',')
		.some((candidate) => candidate.trim() === '*' || candidate.trim().replace(/^W\//, '') === target);
}

async function proxyOriginal(
	method: 'GET' | 'HEAD',
	request: Request,
	url: URL,
	id: string,
	filename: string
) {
	const upstreamUrl = new URL(pbFileUrl('media', id, filename));
	const thumb = url.searchParams.get('thumb');
	if (thumb !== null) upstreamUrl.searchParams.set('thumb', thumb);
	const fallbackEtag = `W/"${encodeURIComponent(`${id}/${filename}?thumb=${thumb ?? ''}`)}"`;
	const ifNoneMatch = request.headers.get('If-None-Match');
	let upstream: Response;
	try {
		upstream = await fetch(upstreamUrl, {
			method,
			headers: ifNoneMatch ? { 'If-None-Match': ifNoneMatch } : undefined
		});
	} catch {
		return new Response(null, { status: 502 });
	}

	if (upstream.status === 404) return new Response(null, { status: 404 });
	const etag = upstream.headers.get('ETag') ?? fallbackEtag;
	if (upstream.status === 304) {
		return new Response(null, {
			status: 304,
			headers: responseHeaders(upstream, etag, false)
		});
	}
	if (!upstream.ok) return new Response(null, { status: 502 });

	if (matchesEtag(ifNoneMatch, etag)) {
		return new Response(null, {
			status: 304,
			headers: responseHeaders(upstream, etag, false)
		});
	}

	return new Response(method === 'HEAD' ? null : upstream.body, {
		status: upstream.status,
		headers: responseHeaders(upstream, etag)
	});
}

function imageResponse(bytes: Buffer, filename: string) {
	const isWebp =
		bytes.length >= 12 &&
		bytes.toString('ascii', 0, 4) === 'RIFF' &&
		bytes.toString('ascii', 8, 12) === 'WEBP';

	return new Response(bytes as Uint8Array<ArrayBuffer>, {
		headers: {
			'Cache-Control': CACHE_CONTROL,
			'Content-Length': String(bytes.byteLength),
			'Content-Type': isWebp ? VARIANT_CONTENT_TYPE : originalContentType(filename)
		}
	});
}

export const GET: RequestHandler = async ({ params, locals, request, url }) => {
	if (params.variant === 'original') {
		return proxyOriginal('GET', request, url, params.id, params.file);
	}
	const variantParts = params.variant.split('.');
	const width = Number(variantParts[0]);
	if (
		variantParts.length !== 2 ||
		variantParts[1] !== VARIANT_FORMAT ||
		!/^[0-9]+$/.test(variantParts[0]) ||
		!Number.isInteger(width)
	) {
		error(404, 'Image variant not found.');
	}
	if (!isVariantWidth(width)) error(404, 'Image variant not found.');

	const key = cacheKey(params.id, params.file, width, VARIANT_FORMAT);
	if (!key) error(404, 'Image variant not found.');

	const pb = locals.pb ?? createPB();
	let record;
	try {
		record = await pb.collection('media').getOne(params.id);
	} catch {
		error(404, 'Image not found.');
	}
	if (record.file !== params.file) error(404, 'Image not found.');

	const cached = await readCached(key);
	if (cached) return imageResponse(cached, params.file);

	let pending = inFlight.get(key);
	if (!pending) {
		pending = (async () => {
			if (!(await acquireConversionPermit())) return null;

			try {
				let stored: Buffer;
				try {
					const response = await fetch(pbFileUrl('media', params.id, params.file));
					if (!response.ok) error(404, 'Image not found.');
					stored = Buffer.from(await response.arrayBuffer());
				} catch {
					error(404, 'Image not found.');
				}

				let output = stored;
				if (originalContentType(params.file) !== 'image/gif') {
					let sourceWidth = Number(record.width);
					if (!(sourceWidth > 0)) sourceWidth = (await sharp(stored).metadata()).width ?? 0;
					if (!(sourceWidth > 0)) error(404, 'Image dimensions unavailable.');

					const target = Math.min(width, sourceWidth);
					const encoded = await sharp(stored)
						.resize({ width: target, withoutEnlargement: true })
						.webp()
						.toBuffer();
					if (encoded.byteLength < stored.byteLength) output = encoded;
				}

				try {
					await writeCached(key, output);
				} catch {
					// The cache is disposable; a failed write must not discard valid image bytes.
				}
				return output;
			} finally {
				releaseConversionPermit();
			}
		})();
		inFlight.set(key, pending);
	}

	try {
		const output = await pending;
		if (!output) {
			return new Response('Image service busy.', {
				status: 503,
				headers: { 'Retry-After': '1' }
			});
		}
		return imageResponse(output, params.file);
	} finally {
		if (inFlight.get(key) === pending) inFlight.delete(key);
	}
};

export const HEAD: RequestHandler = async (event) => {
	if (event.params.variant === 'original') {
		return proxyOriginal('HEAD', event.request, event.url, event.params.id, event.params.file);
	}

	const response = await GET(event);
	return new Response(null, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
};
