import type { RequestHandler } from './$types';

const XML_ENTITIES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&apos;'
};

const escapeXml = (value: unknown) =>
	String(value ?? '').replace(/[&<>"']/g, (character) => XML_ENTITIES[character]);

const lastModified = (value: unknown) => {
	const date = new Date(String(value ?? '').replace(' ', 'T'));
	return Number.isNaN(date.valueOf()) ? '' : date.toISOString();
};

export const GET: RequestHandler = async ({ locals, url }) => {
	const [pages, posts] = await Promise.all([
		locals.pb.collection('pages').getFullList({
			filter: 'status = "published" && noindex = false',
			sort: 'path',
			fields: 'path,slug,updated',
			batch: 500
		}),
		locals.pb.collection('posts').getFullList({
			filter: 'status = "published" && noindex = false',
			sort: '-publishedAt',
			fields: 'slug,updated',
			batch: 500
		})
	]);

	// /news is a route, not a page record, so it is listed by hand; it changes
	// whenever a post does, so its lastmod is the newest post update.
	const newsUpdated = posts.reduce((latest, post) => {
		const value = lastModified(post.updated);
		return value > latest ? value : latest;
	}, '');

	const entries = [
		...pages.map((page) => {
			const path = String(page.path || page.slug || '');
			const pathname =
				path === 'home' ? '/' : `/${path.split('/').map(encodeURIComponent).join('/')}`;
			return { location: new URL(pathname, url.origin).href, updated: lastModified(page.updated) };
		}),
		{ location: new URL('/news', url.origin).href, updated: newsUpdated },
		...posts.map((post) => ({
			location: new URL(`/posts/${encodeURIComponent(String(post.slug ?? ''))}`, url.origin).href,
			updated: lastModified(post.updated)
		}))
	];

	const body = entries
		.map(
			(entry) =>
				`  <url>\n    <loc>${escapeXml(entry.location)}</loc>\n    <lastmod>${escapeXml(entry.updated)}</lastmod>\n  </url>`
		)
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body ? `\n${body}\n` : ''}</urlset>\n`,
		{
			headers: {
				'content-type': 'application/xml; charset=utf-8',
				'cache-control': 'no-cache'
			}
		}
	);
};
