import { collectMediaIds, loadMediaMap } from '$lib/media';
import type { Section } from '$lib/sections';

const PAGE_SIZE = 9;

// The approved tab set on package page 20, in its order. The value is the
// category as the posts collection stores it, so every link already in the wild
// keeps working; only the label changes. "Events" has no posts yet, and the tab
// lands on the page's existing empty state rather than disappearing.
const TABS = [
	{ label: 'All', category: '' },
	{ label: 'Press releases', category: 'Press Releases' },
	{ label: 'In the news', category: 'Media Coverage' },
	{ label: 'Events', category: 'Events' }
];

export async function load({ url, locals }: { url: URL; locals: App.Locals }) {
	const requestedPage = Number(url.searchParams.get('page') ?? '1');
	const currentPage = Number.isSafeInteger(requestedPage)
		? Math.min(Math.max(requestedPage, 1), 1000)
		: 1;
	const query = (url.searchParams.get('q') ?? '')
		.replace(/[\u0000-\u001f\u007f]/g, '')
		.trim()
		.slice(0, 100);
	const category = (url.searchParams.get('category') ?? '')
		.replace(/[\u0000-\u001f\u007f]/g, '')
		.trim()
		.slice(0, 64);

	// The featured story leads the unfiltered first page only. On a filtered
	// page, a search or page two it would be a second copy of a post the reader
	// is already looking past.
	const leads = currentPage === 1 && !category && !query;
	let featured: Record<string, unknown> | null = null;
	if (leads) {
		for (const filter of ['status = "published" && featured = true', 'status = "published"']) {
			try {
				featured = await locals.pb.collection('posts').getFirstListItem(filter, {
					sort: '-publishedAt',
					// `id` is in the list because the grid filter below excludes this post;
					// without it the lookup returns no id and the exclusion silently
					// matches nothing.
					fields: 'id,title,slug,excerpt,publishedAt,category,coverImage,sourceUrl'
				});
				break;
			} catch {
				// No post marked featured: fall through to the most recent one.
			}
		}
	}

	const filters = ['status = "published"'];
	if (query) filters.push('(title ~ {:query} || excerpt ~ {:query} || body ~ {:query})');
	if (category) filters.push('category = {:category}');
	if (featured) filters.push('id != {:featuredId}');

	const result = await locals.pb.collection('posts').getList(currentPage, PAGE_SIZE, {
		filter: locals.pb.filter(filters.join(' && '), {
			query,
			category,
			featuredId: featured?.id ?? ''
		}),
		sort: '-publishedAt',
		fields: 'title,slug,excerpt,publishedAt,category,coverImage,sourceUrl'
	});

	// `coverImage` is a JSON field the CMS fills as `{ kind, value }`, so the
	// path is narrowed rather than asserted: a record saved without one, or
	// with some other shape, simply has no card image.
	const imageOf = (cover: unknown) => {
		if (!cover || typeof cover !== 'object' || !('value' in cover)) return '';
		return typeof cover.value === 'string' ? cover.value : '';
	};

	// Coverage from another site links straight to it; only an http(s) URL from
	// the CMS becomes a public link.
	const externalOf = (value: unknown) => {
		try {
			const url = new URL(String(value ?? ''));
			return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
		} catch {
			return '';
		}
	};
	const shape = (post: Record<string, unknown>) => ({
		title: String(post.title),
		slug: String(post.slug),
		excerpt: String(post.excerpt ?? ''),
		category: String(post.category ?? ''),
		publishedAt: String(post.publishedAt ?? ''),
		image: imageOf(post.coverImage),
		external: externalOf(post.sourceUrl)
	});

	// Editable blocks under the feed live on the CMS page at path "news"; this
	// route outranks the catch-all, so that record only supplies sections.
	const sections = await locals.pb
		.collection('pages')
		.getFirstListItem(locals.pb.filter('path = "news" && status = "published"'))
		.then((record) => (Array.isArray(record.sections) ? (record.sections as Section[]) : []))
		.catch((cause) => {
			if (cause?.status === 404) return [] as Section[];
			throw cause;
		});
	const media = await loadMediaMap(locals.pb, collectMediaIds(sections));

	return {
		sections,
		media,
		featured: featured ? shape(featured) : null,
		posts: result.items.map(shape),
		tabs: TABS,
		query,
		category,
		currentPage,
		totalPages: result.totalPages,
		totalItems: result.totalItems + (featured ? 1 : 0)
	};
}
