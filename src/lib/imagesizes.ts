/**
 * The one media delivery contract. The public resize route enforces it, the
 * cache keys off it, and every consumer builds its URLs from it.
 */

/**
 * Widths the public route will serve. Any other width is refused with 404.
 * This list is a security boundary, not a tuning knob: without it the route is
 * an unauthenticated endpoint that decodes an image and writes a file for any
 * integer a caller supplies.
 */
export const VARIANT_WIDTHS = [320, 640, 768, 1024, 1440, 1920] as const;

export type VariantWidth = (typeof VARIANT_WIDTHS)[number];

export const VARIANT_FORMAT = 'webp';
export const VARIANT_CONTENT_TYPE = 'image/webp';

/** Uploads are reduced to this width. Narrower images are never enlarged. */
export const UPLOAD_MAX_WIDTH = 1920;

/** Conversions allowed to run at once. Sharp's memory cost is per operation. */
export const CONVERT_CONCURRENCY = 2;

/** Conversions allowed to wait for the two active slots. */
export const CONVERT_QUEUE_LIMIT = 4;

export function isVariantWidth(value: number): value is VariantWidth {
	return (VARIANT_WIDTHS as readonly number[]).includes(value);
}

/**
 * Path of one variant. The stored filename is part of the address, and
 * PocketBase gives every stored file a random suffix, so replacing an image
 * changes every one of its variant addresses. That is what makes a cached
 * entry impossible to serve staleley and removes the need for invalidation.
 */
export function variantPath(recordId: string, filename: string, width: VariantWidth): string {
	return `/media/${encodeURIComponent(recordId)}/${encodeURIComponent(filename)}/${width}.${VARIANT_FORMAT}`;
}

export type VariantCandidate = { width: VariantWidth; rendered: number };

/**
 * srcset candidates for a source image. Each permitted width is paired with the
 * width actually served, which the route clamps to the source, and duplicates
 * are dropped. A descriptor therefore never claims more pixels than arrive.
 * With an unknown source width every permitted width is offered.
 */
export function variantCandidates(sourceWidth?: number): VariantCandidate[] {
	const candidates: VariantCandidate[] = [];
	const seen = new Set<number>();

	for (const width of VARIANT_WIDTHS) {
		const rendered = sourceWidth && sourceWidth > 0 ? Math.min(width, sourceWidth) : width;
		if (seen.has(rendered)) continue;
		seen.add(rendered);
		candidates.push({ width, rendered });
	}

	return candidates;
}
