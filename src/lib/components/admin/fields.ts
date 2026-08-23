import type { FieldSpec } from '$lib/sections';

/**
 * Shape a stored record to a field spec: missing values become '' (or [] for
 * lists), unknown keys are dropped, list rows are filled recursively.
 * Called with no `src` it returns a blank row.
 *
 * `media` values are objects, so they are passed through rather than coerced.
 */
export function fill(
	fields: FieldSpec[],
	src: Record<string, unknown> = {}
): Record<string, unknown> {
	const out: Record<string, unknown> = {};

	for (const f of fields) {
		if (f.type === 'list') {
			const rows = Array.isArray(src[f.name]) ? (src[f.name] as unknown[]) : [];
			out[f.name] = rows.map((r) => fill(f.fields, (r ?? {}) as Record<string, unknown>));
		} else if (f.type === 'media') {
			const v = src[f.name];
			out[f.name] = typeof v === 'string' || (v && typeof v === 'object') ? v : '';
		} else {
			out[f.name] = typeof src[f.name] === 'string' ? src[f.name] : '';
		}
	}

	return out;
}

/** Swap an item with its neighbour. No-op at the ends. */
export function move<T>(arr: T[], i: number, dir: -1 | 1): void {
	const j = i + dir;
	if (j < 0 || j >= arr.length) return;
	[arr[i], arr[j]] = [arr[j], arr[i]];
}
