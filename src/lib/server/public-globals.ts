import PocketBase, { ClientResponseError } from 'pocketbase';
import { createPB } from '$lib/pb';

/**
 * The four site-wide globals every public page renders (header, footer, code
 * injection, SEO defaults), cached briefly in this server process.
 *
 * Why: PocketBase's default `/api/` rate limit (300 requests per 10 s per IP)
 * is shared by every visitor, because every server-side render reaches
 * PocketBase from this app's own address. Four of the five to seven calls a
 * render made were these globals, one request each.
 *
 * What may be cached: only data any anonymous visitor can already read. The
 * cache is filled through a fresh, never-authenticated client, so its content
 * cannot depend on who triggered the refresh. Signed-in editors bypass it
 * (see the site layout) and read live, so their edits show at once; anonymous
 * visitors see a saved global within `TTL_MS`, or at once when the save goes
 * through `putGlobal`, which clears this cache.
 */
export const PUBLIC_GLOBAL_KEYS = ['header', 'footer', 'code_injection', 'seo'] as const;
export type PublicGlobalKey = (typeof PUBLIC_GLOBAL_KEYS)[number];
export type PublicGlobals = Record<PublicGlobalKey, Record<string, unknown>>;

const TTL_MS = 60_000;
// After a failed refresh, keep serving the last good copy for this long rather
// than failing every page; past it, the failure surfaces as before.
const STALE_IF_ERROR_MS = 10 * 60_000;

let cached: { value: PublicGlobals; at: number } | null = null;
// One refresh at a time: concurrent renders on a cold or expired cache share
// it instead of each sending its own request.
let refreshing: Promise<PublicGlobals> | null = null;

/**
 * All four globals in one list request, through `pb` (anonymous unless the
 * caller passes an editor's client). A missing global reads as empty. Retries
 * one transient failure, as the layout always has, then throws.
 */
export async function readPublicGlobals(pb: PocketBase = createPB()): Promise<PublicGlobals> {
	const filter = pb.filter(
		PUBLIC_GLOBAL_KEYS.map((_, index) => `key = {:k${index}}`).join(' || '),
		Object.fromEntries(PUBLIC_GLOBAL_KEYS.map((key, index) => [`k${index}`, key]))
	);
	for (let attempt = 0; ; attempt += 1) {
		try {
			const globals: PublicGlobals = { header: {}, footer: {}, code_injection: {}, seo: {} };
			for (const record of await pb.collection('globals').getFullList({ filter })) {
				const key = record.key as PublicGlobalKey;
				if (PUBLIC_GLOBAL_KEYS.includes(key)) globals[key] = (record.data ?? {}) as Record<string, unknown>;
			}
			return globals;
		} catch (error) {
			if (attempt === 0 && !(error instanceof ClientResponseError && error.status === 403)) {
				console.warn('Failed to read public globals; retrying once', { error });
				continue;
			}
			throw error;
		}
	}
}

/** Cached globals for anonymous renders. */
export async function getPublicGlobals(): Promise<PublicGlobals> {
	const now = Date.now();
	if (cached && now - cached.at < TTL_MS) return cached.value;
	refreshing ??= readPublicGlobals()
		.then((value) => {
			cached = { value, at: Date.now() };
			return value;
		})
		.catch((error) => {
			if (cached && now - cached.at < STALE_IF_ERROR_MS) {
				console.warn('Serving cached public globals after a failed refresh', { error });
				return cached.value;
			}
			console.error('Failed to read public globals after retry', { error });
			throw error;
		})
		.finally(() => {
			refreshing = null;
		});
	return refreshing;
}

/** Drop the cached copy; the next anonymous render reads fresh values. */
export function invalidatePublicGlobals() {
	cached = null;
}
