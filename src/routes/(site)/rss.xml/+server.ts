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

const publicationDate = (value: unknown) => {
	const date = new Date(String(value ?? '').replace(' ', 'T'));
	return Number.isNaN(date.valueOf()) ? new Date(0).toUTCString() : date.toUTCString();
};

export const GET: RequestHandler = async ({ locals, url }) => {
	const posts = await locals.pb.collection('posts').getFullList({
		filter: 'status = "published"',
		sort: '-publishedAt,-created',
		fields: 'title,slug,publishedAt,created,updated,excerpt',
		batch: 500
	});
	const channelName = url.hostname;
	const items = posts
		.map((post) => {
			const link = new URL(`/posts/${encodeURIComponent(String(post.slug ?? ''))}`, url.origin).href;
			return `    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${escapeXml(link)}</link>\n      <guid isPermaLink="true">${escapeXml(link)}</guid>\n      <pubDate>${escapeXml(publicationDate(post.publishedAt || post.created || post.updated))}</pubDate>\n      <description>${escapeXml(post.excerpt)}</description>\n    </item>`;
		})
		.join('\n');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(channelName)}</title>\n    <link>${escapeXml(url.origin)}</link>\n    <description>${escapeXml(`Latest posts from ${channelName}`)}</description>${items ? `\n${items}` : ''}\n  </channel>\n</rss>\n`,
		{
			headers: {
				'content-type': 'application/rss+xml; charset=utf-8',
				'cache-control': 'no-cache'
			}
		}
	);
};
