/**
 * Turn a stored video URL into a player URL that is safe to put in an iframe.
 * Only Vimeo and YouTube are accepted, in the shapes those hosts publish;
 * anything else returns null so the caller can fall back to its own media.
 */
export function videoEmbedUrl(value: unknown): string | null {
	if (!value) return null;
	let url: URL;
	try {
		url = new URL(String(value));
	} catch {
		return null;
	}
	if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;

	const id = (candidate: string | null) =>
		candidate && /^[A-Za-z0-9_-]+$/.test(candidate) ? candidate : null;
	const host = url.hostname.toLowerCase();

	if (host === 'player.vimeo.com') return /^\/video\/\d+\/?$/.test(url.pathname) ? url.href : null;
	if (host === 'vimeo.com' || host === 'www.vimeo.com') {
		const video = url.pathname.match(/^\/(\d+)\/?$/)?.[1];
		return video ? `https://player.vimeo.com/video/${video}` : null;
	}
	if (host === 'youtube.com' || host === 'www.youtube.com') {
		const embedded = url.pathname.match(/^\/embed\/([^/]+)\/?$/)?.[1];
		if (id(embedded ?? null)) return `https://www.youtube.com/embed/${embedded}`;
		const watched = url.pathname === '/watch' ? id(url.searchParams.get('v')) : null;
		return watched ? `https://www.youtube.com/embed/${watched}` : null;
	}
	if (host === 'youtu.be') {
		const short = id(url.pathname.match(/^\/([^/]+)\/?$/)?.[1] ?? null);
		return short ? `https://www.youtube.com/embed/${short}` : null;
	}
	return null;
}
