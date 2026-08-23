import { json } from '@sveltejs/kit';
import type { MediaRecord } from '$lib/media';
import type { RequestHandler } from './$types';

const headers = { 'cache-control': 'no-store' };

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.editor) return new Response(null, { status: 401, headers });

	const records = await locals.pb.collection('media').getFullList({
		sort: '-created',
		fields: 'id,file,alt,width,height'
	});
	const items = records.map((record) => {
		const item: MediaRecord = {
			id: record.id,
			file: String(record.file ?? ''),
			alt: String(record.alt ?? '')
		};
		const width = Number(record.width);
		const height = Number(record.height);
		if (Number.isFinite(width) && width > 0) item.width = width;
		if (Number.isFinite(height) && height > 0) item.height = height;
		return item;
	});

	return json(items, { headers });
};
