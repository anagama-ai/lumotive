import { createPB } from '$lib/pb';

export async function load({ url }: { url: URL }) {
	const requestedPage = Number(url.searchParams.get('page') ?? '1');
	const currentPage = Number.isSafeInteger(requestedPage)
		? Math.min(Math.max(requestedPage, 1), 1000)
		: 1;
	const result = await createPB().collection('posts').getList(currentPage, 12, {
		filter: 'status = "published"',
		sort: '-publishedAt',
		fields: 'title,slug,excerpt,publishedAt'
	});

	return {
		posts: result.items.map((post) => ({
			title: post.title,
			slug: post.slug,
			excerpt: post.excerpt,
			publishedAt: post.publishedAt
		})),
		currentPage,
		hasMore: currentPage < result.totalPages
	};
}
