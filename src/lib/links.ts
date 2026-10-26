/**
 * A same-site link to a file rather than a page, such as the self-hosted
 * explorer at /lcm-explorer/index.html. CMS pages never have a dot in their
 * last path segment, so a file extension marks a static document. SvelteKit's
 * client router would otherwise try to route it (and preload its data on
 * hover), land on the catch-all page route and render a 404; links that pass
 * this test take `data-sveltekit-reload` and load as ordinary documents.
 */
export function isStaticFileLink(href: string): boolean {
	if (!href.startsWith('/') || href.startsWith('//')) return false;
	const path = href.split(/[?#]/, 1)[0];
	return /\/[^/]*\.[A-Za-z0-9]{2,5}$/.test(path);
}
