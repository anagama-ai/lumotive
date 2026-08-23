import { fail } from '@sveltejs/kit';
import sharp from 'sharp';
import { CONVERT_CONCURRENCY, UPLOAD_MAX_WIDTH } from '$lib/imagesizes';
import { filenameStem, mediaSrc, mediaSrcset } from '$lib/media';
import { fileUrl } from '$lib/pb';
import { MAX_FILE_SIZE } from '$lib/uploads';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 24;
const ORIGINAL_CONTENT_TYPES: Record<string, string> = {
	gif: 'image/gif',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp'
};

function detectedImageType(bytes: Uint8Array): 'JPEG' | 'PNG' | 'WebP' | 'GIF' | null {
	if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'JPEG';
	if (
		bytes[0] === 0x89 &&
		bytes[1] === 0x50 &&
		bytes[2] === 0x4e &&
		bytes[3] === 0x47 &&
		bytes[4] === 0x0d &&
		bytes[5] === 0x0a &&
		bytes[6] === 0x1a &&
		bytes[7] === 0x0a
	) return 'PNG';
	if (
		String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
		String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
	) return 'WebP';
	const gif = String.fromCharCode(...bytes.slice(0, 6));
	return gif === 'GIF87a' || gif === 'GIF89a' ? 'GIF' : null;
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const requestedPage = Number(url.searchParams.get('page'));
	const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
	const collection = locals.pb.collection('media');
	const [records, missingAlt] = await Promise.all([
		collection.getList(page, PAGE_SIZE, {
			sort: '-created',
			fields: 'id,file,alt,width,height'
		}),
		collection.getList(1, 1, {
			filter: 'alt = ""',
			fields: 'id'
		})
	]);

	// Records stored before dimensions were recorded would publish srcset
	// descriptors that overstate what the resize route can deliver, because the
	// route clamps every variant to the source width. Measure them once here,
	// where the request is already editor-authenticated, so the claim becomes
	// truthful and stays that way without a data migration.
	for (const record of records.items) {
		const file = String(record.file ?? '');
		if (!file || Number(record.width) > 0) continue;
		try {
			const response = await fetch(fileUrl('media', record.id, file));
			if (!response.ok) continue;
			const { width, height } = await sharp(
				Buffer.from(await response.arrayBuffer())
			).metadata();
			if (!width || !height) continue;
			await locals.pb
				.collection('media')
				.update(record.id, { width, height }, { requestKey: null });
			record.width = width;
			record.height = height;
		} catch {
			// A measurement failure must not break the library listing.
		}
	}

	const items = records.items.map((record) => {
		const file = String(record.file ?? '');
		const width = Number(record.width) || undefined;
		return {
			id: record.id,
			file,
			alt: String(record.alt ?? ''),
			src: mediaSrc({ id: record.id, file }, 640),
			srcset: mediaSrcset({ id: record.id, file }, width),
			width,
			height: Number(record.height) || undefined
		};
	});
	return {
		items,
		missingAlt: missingAlt.totalItems,
		pagination: {
			page: records.page,
			perPage: records.perPage,
			totalItems: records.totalItems,
			totalPages: records.totalPages
		}
	};
};

export const actions: Actions = {
	upload: async ({ request, locals }) => {
		const form = await request.formData();
		const uploads = form
			.getAll('file')
			.filter((upload): upload is File => upload instanceof File && upload.size > 0);

		if (!uploads.length) {
			return fail(400, { error: 'Choose a JPEG, PNG, WebP, or GIF image to upload.' });
		}

		const outcomes: { filename: string; stored: boolean; error?: string }[] = new Array(
			uploads.length
		);
		let next = 0;
		await Promise.all(
			Array.from({ length: Math.min(CONVERT_CONCURRENCY, uploads.length) }, async () => {
				while (next < uploads.length) {
					const index = next++;
					const upload = uploads[index];

					if (upload.size > MAX_FILE_SIZE) {
						outcomes[index] = {
							filename: upload.name,
							stored: false,
							error: 'The image is larger than the 10 MiB maximum file size.'
						};
						continue;
					}

					let normalized: { data: Buffer; width: number; height: number };
					try {
						const header = new Uint8Array(await upload.slice(0, 12).arrayBuffer());
						const type = detectedImageType(header);
						if (!type) {
							outcomes[index] = {
								filename: upload.name,
								stored: false,
								error: 'Unsupported file type. Upload a JPEG, PNG, WebP, or GIF image.'
							};
							continue;
						}
						const source = Buffer.from(await upload.arrayBuffer());
						if (type === 'GIF') {
							const { width, height } = await sharp(source).metadata();
							if (!width || !height) throw new Error('Image dimensions are unavailable.');
							normalized = { data: source, width, height };
						} else {
							let pipeline = sharp(source)
								.rotate()
								.resize({ width: UPLOAD_MAX_WIDTH, withoutEnlargement: true });
							if (type === 'JPEG') pipeline = pipeline.jpeg();
							else if (type === 'PNG') pipeline = pipeline.png();
							else pipeline = pipeline.webp();
							const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
							normalized = { data, width: info.width, height: info.height };
						}
					} catch {
						outcomes[index] = {
							filename: upload.name,
							stored: false,
							error: 'Could not process the image. The file may be damaged.'
						};
						continue;
					}

					try {
						// requestKey: null disables the SDK's auto-cancellation. These
						// creates run concurrently on one shared client, and the default
						// cancel key is derived from the endpoint, so without this each
						// new create aborts the previous one and only the last survives.
						await locals.pb.collection('media').create(
							{
								file: new File([new Uint8Array(normalized.data)], upload.name, {
									type: upload.type
								}),
								alt: '',
								width: normalized.width,
								height: normalized.height
							},
							{ requestKey: null }
						);
						outcomes[index] = { filename: upload.name, stored: true };
					} catch {
						outcomes[index] = {
							filename: upload.name,
							stored: false,
							error: 'Could not upload the image. Please try again.'
						};
					}
				}
			})
		);

		const stored = outcomes.filter((outcome) => outcome.stored).length;
		if (!stored) {
			return fail(400, {
				error: uploads.length === 1 ? outcomes[0].error : 'No images were stored.',
				outcomes,
				stored
			});
		}
		return {
			message: stored === 1 ? 'Image uploaded.' : `${stored} images uploaded.`,
			outcomes,
			stored
		};
	},

	alt: async ({ request, locals }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		try {
			await locals.pb.collection('media').update(id, {
				alt: String(form.get('alt') ?? '').trim()
			});
		} catch {
			return fail(400, { error: 'Could not update the alt text.' });
		}
		return { message: 'Alt text updated.' };
	},

	rename: async ({ request, locals }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const name = String(form.get('name') ?? '');

		if (!locals.editor) {
			return fail(403, { error: 'Your role cannot rename images.' });
		}

		const stem = filenameStem(name);
		if (!stem) {
			return fail(400, {
				error: 'Choose a name using letters, numbers, dots, dashes, or underscores.'
			});
		}

		try {
			const collection = locals.pb.collection('media');
			const record = await collection.getOne(id);
			const extensionIndex = record.file.lastIndexOf('.');
			const extension = extensionIndex === -1 ? '' : record.file.slice(extensionIndex);
			const type =
				ORIGINAL_CONTENT_TYPES[extension.slice(1).toLowerCase()] ?? 'application/octet-stream';
			const response = await fetch(fileUrl('media', id, record.file));
			if (!response.ok) {
				return fail(400, { error: 'Could not rename the image.' });
			}
			const bytes = await response.arrayBuffer();
			const updated = await collection.update(id, {
				file: new File([bytes], `${stem}${extension}`, { type })
			});
			return { message: `Image renamed to ${updated.file}.` };
		} catch {
			return fail(400, { error: 'Could not rename the image.' });
		}
	},

	bulk: async ({ request, locals }) => {
		const form = await request.formData();
		const ids = [...new Set(form.getAll('id').map(String).filter(Boolean))];

		if (ids.length === 0) {
			return fail(400, {
				bulk: true,
				error: 'No records were selected.',
				changed: 0,
				results: []
			});
		}

		if (!locals.editor) {
			return fail(403, {
				bulk: true,
				error: 'Your role cannot delete images.',
				changed: 0,
				results: ids.map((id) => ({
					id,
					ok: false,
					changed: false,
					message: 'Not attempted: insufficient permission.'
				}))
			});
		}

		const collection = locals.pb.collection('media');
		const results: Array<{
			id: string;
			ok: boolean;
			changed: boolean;
			message: string;
		}> = [];
		let changed = 0;

		for (const id of ids) {
			try {
				await collection.delete(id);
				changed += 1;
				results.push({
					id,
					ok: true,
					changed: true,
					message: 'Deleted.'
				});
			} catch {
				results.push({
					id,
					ok: false,
					changed: false,
					message: 'Could not delete this image.'
				});
			}
		}

		if (results.some((result) => !result.ok)) {
			return fail(400, {
				bulk: true,
				error: `Changed ${changed} ${changed === 1 ? 'image' : 'images'}; some records failed.`,
				changed,
				results
			});
		}

		return {
			bulk: true,
			changed,
			results
		};
	},

	remove: async ({ request, locals }) => {
		const id = String((await request.formData()).get('id') ?? '');
		try {
			await locals.pb.collection('media').delete(id);
		} catch {
			return fail(400, { error: 'Could not delete the image.' });
		}
		return { message: 'Image deleted.' };
	}
};
