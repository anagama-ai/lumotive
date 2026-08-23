import PocketBase from 'pocketbase';
import { PUBLIC_PB_URL } from '$env/static/public';

if (!PUBLIC_PB_URL) {
	throw new Error(
		'PUBLIC_PB_URL is required at build time and must be the browser-reachable PocketBase URL.'
	);
}

export const PB_URL = PUBLIC_PB_URL;

/**
 * Fresh client per request. Never share one instance across requests on the server.
 *
 * Auto-cancellation is off because it exists to abort superseded browser
 * navigations, and nothing here is a browser. On the server it is actively
 * harmful: two concurrent reads of one collection share a cancel key derived
 * from method and path, so a layout load and a page load racing on the same
 * collection abort each other.
 */
export const createPB = () => new PocketBase(PUBLIC_PB_URL).autoCancellation(false);

/** Public URL of a file stored on a record. */
export const fileUrl = (collection: string, recordId: string, filename: string) =>
	`${PUBLIC_PB_URL}/api/files/${collection}/${recordId}/${filename}`;
