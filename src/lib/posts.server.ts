import type PocketBase from 'pocketbase';
import type { Section } from '$lib/sections';

/** A published post reduced to what a teaser card renders. No date: the
 *  approved home page carries none. */
export type TeaserPost = {
	title: string;
	slug: string;
	excerpt: string;
	category: string;
	image: unknown;
};

const SECTION_TYPE = 'postsFeatured';
const TEASER_COUNT = 3;

/** The category the seed and the news build script write for press releases.
 *  It is the documented fill when fewer than three posts are featured. */
const PRESS_RELEASE_CATEGORY = 'Press Releases';

const FIELDS = 'title,slug,excerpt,category,coverImage';

const toTeaser = (post: Record<string, unknown>): TeaserPost => ({
	title: String(post.title ?? ''),
	slug: String(post.slug ?? ''),
	excerpt: String(post.excerpt ?? ''),
	category: String(post.category ?? ''),
	image: post.coverImage ?? null
});

/**
 * Posts for a `postsFeatured` section: the three most recent published posts
 * flagged Featured, topped up with the most recent press releases when fewer
 * than three are flagged. Returns an empty list when no page section asks for
 * them, so every other page costs no query.
 */
export async function loadFeaturedPosts(
	pb: PocketBase,
	sections: Section[]
): Promise<TeaserPost[]> {
	if (!sections.some((section) => section?.type === SECTION_TYPE)) return [];

	const featured = await pb
		.collection('posts')
		.getList(1, TEASER_COUNT, {
			filter: pb.filter('status = "published" && featured = true'),
			sort: '-publishedAt',
			fields: FIELDS
		})
		.then((result) => result.items.map(toTeaser))
		.catch(() => [] as TeaserPost[]);

	if (featured.length >= TEASER_COUNT) return featured;

	const taken = new Set(featured.map((post) => post.slug));
	const fill = await pb
		.collection('posts')
		.getList(1, TEASER_COUNT + taken.size, {
			filter: pb.filter('status = "published" && category = {:category}', {
				category: PRESS_RELEASE_CATEGORY
			}),
			sort: '-publishedAt',
			fields: FIELDS
		})
		.then((result) => result.items.map(toTeaser))
		.catch(() => [] as TeaserPost[]);

	for (const post of fill) {
		if (featured.length >= TEASER_COUNT) break;
		if (taken.has(post.slug)) continue;
		taken.add(post.slug);
		featured.push(post);
	}

	return featured;
}
