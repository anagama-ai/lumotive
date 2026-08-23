import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const PAGE_SIZE = 100;
const REVIEW_LIMIT = 50;
const FIELDS =
	'id,publishedAt,rating,reviewText,reviewUrl,reviewerImageUrl,reviewerIsLocalGuide,reviewerName,timeAgo';
const headers = {
	'cache-control': 'public, max-age=300, stale-while-revalidate=3600'
};

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const docs = [];
		let ratingCount = 0;
		let ratingTotal = 0;
		let totalDocs = 0;
		let totalReviews = 0;
		let page = 1;

		while (true) {
			const result = await locals.pb.collection('reviews').getList(page, PAGE_SIZE, {
				sort: '-publishedAt',
				fields: FIELDS
			});

			for (const record of result.items) {
				totalReviews += 1;
				const rating = record.rating;
				const reviewText = typeof record.reviewText === 'string' ? record.reviewText : '';
				// A Google rating is 1..5. PocketBase number fields cannot hold null, so an
				// unrated review lands as 0 — count it as absent, never as a score of zero.
				const hasNumericRating = typeof rating === 'number' && Number.isFinite(rating) && rating >= 1;

				if (hasNumericRating) {
					ratingTotal += rating;
					ratingCount += 1;
				}

				const isDisplayed = hasNumericRating && rating >= 4 && reviewText.trim() !== '';
				if (!isDisplayed) continue;

				totalDocs += 1;
				if (docs.length >= REVIEW_LIMIT) continue;

				docs.push({
					id: record.id,
					publishedAt: record.publishedAt,
					rating,
					reviewText,
					reviewUrl: record.reviewUrl,
					reviewerImageUrl: record.reviewerImageUrl,
					reviewerIsLocalGuide: record.reviewerIsLocalGuide,
					reviewerName: record.reviewerName,
					timeAgo: record.timeAgo
				});
			}

			if (page >= result.totalPages) break;
			page += 1;
		}

		return json(
			{
				averageRating: ratingCount === 0 ? null : ratingTotal / ratingCount,
				docs,
				totalDocs,
				totalReviews
			},
			{ headers }
		);
	} catch {
		return json(
			{ averageRating: null, docs: [], totalDocs: 0, totalReviews: 0 },
			{ headers }
		);
	}
};
