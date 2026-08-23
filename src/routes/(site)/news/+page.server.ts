const PAGE_SIZE = 12;

export async function load({ url, locals }: { url: URL; locals: App.Locals }) {
	const requestedPage = Number(url.searchParams.get('page') ?? '1');
	const currentPage = Number.isSafeInteger(requestedPage)
		? Math.min(Math.max(requestedPage, 1), 1000)
		: 1;
	const query = (url.searchParams.get('q') ?? '')
		.replace(/[\u0000-\u001f\u007f]/g, '')
		.trim()
		.slice(0, 100);
	const filter = query
		? locals.pb.filter(
				'status = "published" && sourceUrl != "" && (title ~ {:query} || excerpt ~ {:query} || body ~ {:query})',
				{ query }
			)
		: locals.pb.filter('status = "published" && sourceUrl != ""');
	const result = await locals.pb.collection('posts').getList(currentPage, PAGE_SIZE, {
		filter,
		sort: '-publishedAt',
		fields: 'title,slug,excerpt,publishedAt'
	});

	return {
		posts: result.items.map((post) => ({
			title: String(post.title),
			slug: String(post.slug),
			excerpt: String(post.excerpt ?? ''),
			publishedAt: String(post.publishedAt ?? '')
		})),
		query,
		currentPage,
		totalPages: result.totalPages,
		totalItems: result.totalItems
	};
}
