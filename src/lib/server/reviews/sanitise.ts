const MAX_TEXT_LENGTH = 10_000;
const EMPTY_OBJECT: Record<string, unknown> = {};

export type SanitisedReview = {
	reviewId: string;
	reviewerName: string;
	rating: number | null;
	reviewText: string;
	publishedAt: string;
	timeAgo: string;
	reviewerProfileUrl: string | null;
	reviewerImageUrl: string | null;
	reviewerReviewCount: number | null;
	reviewerPhotoCount: number | null;
	reviewerIsLocalGuide: boolean | null;
	ratingType: string;
	ratingMax: number | null;
	votesCount: number | null;
	ownerAnswer: string;
	ownerTimeAgo: string;
	ownerPublishedAt: string;
	reviewUrl: string | null;
	originalReviewText: string;
	originalLanguage: string;
	importedAt: string;
	importTaskId: string;
};

export function normaliseUrl(value: unknown): string | null {
	if (typeof value !== 'string' || !value.trim()) return null;

	try {
		const url = new URL(value.trim());
		return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
	} catch {
		return null;
	}
}

export function normaliseText(value: unknown, maxLength = MAX_TEXT_LENGTH): string {
	return typeof value === 'string' ? value.trim().slice(0, Math.max(0, maxLength)) : '';
}

export function coerceNumber(value: unknown): number | null {
	if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return null;
	const number = Number(value);
	return Number.isFinite(number) ? number : null;
}

export function coerceBoolean(value: unknown): boolean | null {
	if (typeof value === 'boolean') return value;
	if (value === 1 || value === '1' || value === 'true') return true;
	if (value === 0 || value === '0' || value === 'false') return false;
	return null;
}

export function normaliseDate(value: unknown): string {
	if (typeof value !== 'string' && typeof value !== 'number' && !(value instanceof Date)) return '';
	const date = new Date(value instanceof Date ? value.getTime() : value);
	return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function mapDataForSeoReview(
	value: unknown,
	metadata: { importedAt?: unknown; importTaskId?: unknown } = {}
): SanitisedReview {
	const item = isObject(value) ? value : EMPTY_OBJECT;
	const rating = isObject(item.rating) ? item.rating : EMPTY_OBJECT;

	return {
		reviewId: normaliseText(item.review_id),
		reviewerName: normaliseText(item.profile_name),
		rating: coerceNumber(rating.value),
		reviewText: normaliseText(item.review_text),
		publishedAt: normaliseDate(item.timestamp),
		timeAgo: normaliseText(item.time_ago),
		reviewerProfileUrl: normaliseUrl(item.profile_url),
		reviewerImageUrl: normaliseUrl(item.profile_image_url),
		reviewerReviewCount: coerceNumber(item.reviews_count),
		reviewerPhotoCount: coerceNumber(item.photos_count),
		reviewerIsLocalGuide: coerceBoolean(item.local_guide),
		ratingType: normaliseText(rating.rating_type),
		ratingMax: coerceNumber(rating.rating_max),
		votesCount: coerceNumber(rating.votes_count),
		ownerAnswer: normaliseText(item.owner_answer),
		ownerTimeAgo: normaliseText(item.owner_time_ago),
		ownerPublishedAt: normaliseDate(item.owner_timestamp),
		reviewUrl: normaliseUrl(item.review_url),
		originalReviewText: normaliseText(item.original_review_text),
		originalLanguage: normaliseText(item.original_language),
		importedAt: normaliseDate(metadata.importedAt),
		importTaskId: normaliseText(metadata.importTaskId)
	};
}
