import { error, fail } from '@sveltejs/kit';
import { importState, startImport } from '$lib/server/reviews/import';
import type { Actions, PageServerLoad } from './$types';

const PAGE_SIZE = 20;
const LOOKUP_TYPES = ['place_id', 'cid', 'keyword'] as const;
const FREQUENCIES = ['manual', '7d', '14d', '30d'] as const;

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.editor) error(403, 'This screen is only available to editors.');

	const requestedPage = Number(url.searchParams.get('page'));
	const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
	const [state, config, records] = await Promise.all([
		importState(locals.pb),
		locals.pb.collection('review_config').getFirstListItem('', {
			fields: 'id,lookupType,placeId,cid,keyword,locationCoordinate,frequency'
		}),
		locals.pb.collection('reviews').getList(page, PAGE_SIZE, {
			sort: '-publishedAt',
			fields: 'id,reviewerName,rating,publishedAt,reviewText'
		})
	]);

	return {
		config: {
			id: config.id,
			lookupType: String(config.lookupType ?? 'place_id'),
			placeId: String(config.placeId ?? ''),
			cid: String(config.cid ?? ''),
			keyword: String(config.keyword ?? ''),
			locationCoordinate: String(config.locationCoordinate ?? ''),
			frequency: String(config.frequency ?? 'manual')
		},
		state,
		reviews: records.items.map((record) => ({
			id: record.id,
			reviewerName: String(record.reviewerName ?? ''),
			rating:
				record.rating === null || record.rating === undefined || record.rating === ''
					? null
					: Number(record.rating),
			publishedAt: String(record.publishedAt ?? ''),
			reviewText: String(record.reviewText ?? '')
		})),
		pagination: {
			page: records.page,
			perPage: records.perPage,
			totalItems: records.totalItems,
			totalPages: records.totalPages
		}
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.editor) return fail(403, { error: 'This action is only available to editors.' });

		const form = await request.formData();
		const lookupType = String(form.get('lookupType') ?? '').trim();
		const placeId = String(form.get('placeId') ?? '').trim();
		const cid = String(form.get('cid') ?? '').trim();
		const keyword = String(form.get('keyword') ?? '').trim();
		const locationCoordinate = String(form.get('locationCoordinate') ?? '').trim();
		const frequency = String(form.get('frequency') ?? '').trim();

		if (!LOOKUP_TYPES.includes(lookupType as (typeof LOOKUP_TYPES)[number])) {
			return fail(400, { error: 'Choose a valid lookup type.' });
		}
		if (!FREQUENCIES.includes(frequency as (typeof FREQUENCIES)[number])) {
			return fail(400, { error: 'Choose a valid import frequency.' });
		}

		const selected =
			lookupType === 'place_id'
				? { label: 'Place ID', value: placeId }
				: lookupType === 'cid'
					? { label: 'CID', value: cid }
					: { label: 'Business keyword', value: keyword };
		if (!selected.value) {
			return fail(400, { error: `${selected.label} is required for the selected lookup type.` });
		}
		if ([placeId, cid, keyword].filter(Boolean).length !== 1) {
			return fail(400, { error: 'Enter exactly one lookup identifier and clear the other two.' });
		}
		if (!locationCoordinate) {
			return fail(400, { error: 'Location coordinate is required.' });
		}

		try {
			const config = await locals.pb.collection('review_config').getFirstListItem('', {
				fields: 'id'
			});
			await locals.pb.collection('review_config').update(config.id, {
				lookupType,
				placeId,
				cid,
				keyword,
				locationCoordinate,
				frequency
			});
		} catch {
			return fail(400, { error: 'Could not save the review configuration. Please try again.' });
		}

		return { saved: true };
	},
	start: async ({ request, locals }) => {
		if (!locals.editor) return fail(403, { error: 'This action is only available to editors.' });

		const form = await request.formData();
		const mode = String(form.get('mode') ?? '') === 'full' ? 'full' : 'incremental';
		const outcome = await startImport(locals.pb, { mode });
		if (!outcome.started) return fail(400, { error: outcome.reason });

		return { started: true, mode: outcome.mode };
	}
};
