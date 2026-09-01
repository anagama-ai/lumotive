import PocketBase from 'pocketbase';
import { env } from '$env/dynamic/private';

/**
 * Resolved per call, never at module load. `$env/dynamic/private` is a runtime
 * value, but this module is still imported while SvelteKit builds — so a
 * top-level throw fails `vite build` on any machine without a populated `.env`,
 * which is exactly what CI is. Validating here keeps the build configuration-free
 * and still fails loudly on the first request if the variable is missing.
 */
const pbUrl = () => {
	const raw = env.PB_URL?.replace(/\/+$/, '');
	if (!raw) {
		throw new Error(
			'PB_URL is required at runtime and must be the server-reachable PocketBase URL.'
		);
	}
	return raw;
};

/**
 * Fresh client per request. Never share one instance across requests on the server.
 *
 * Auto-cancellation is off because it exists to abort superseded browser
 * navigations, and nothing here is a browser. On the server it is actively
 * harmful: two concurrent reads of one collection share a cancel key derived
 * from method and path, so a layout load and a page load racing on the same
 * collection abort each other.
 */
export const createPB = () => new PocketBase(pbUrl()).autoCancellation(false);

/** Internal URL of a file stored on a PocketBase record. */
export const pbFileUrl = (collection: string, recordId: string, filename: string) =>
	`${pbUrl()}/api/files/${encodeURIComponent(collection)}/${encodeURIComponent(recordId)}/${encodeURIComponent(filename)}`;
