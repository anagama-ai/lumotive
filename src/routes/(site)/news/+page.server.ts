const PAGE_SIZE = 9;

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
	const filters = ['status = "published"'];
	if (query) filters.push('(title ~ {:query} || excerpt ~ {:query} || body ~ {:query})');
	if (category) filters.push('category = {:category}');

	const [result, categoryPosts] = await Promise.all([
		locals.pb.collection('posts').getList(currentPage, PAGE_SIZE, {
			filter: locals.pb.filter(filters.join(' && '), { query, category }),
			sort: '-publishedAt',
			fields: 'title,slug,excerpt,publishedAt,category'
		}),
		locals.pb.collection('posts').getFullList({
			filter: locals.pb.filter('status = "published"'),
			fields: 'category'
		})
	]);
	const categories = [
		...new Set(
			categoryPosts.map((post) => String(post.category ?? '').trim()).filter(Boolean)
		)
	].sort();

	return {
		posts: result.items.map((post) => ({
			title: String(post.title),
			slug: String(post.slug),
			excerpt: String(post.excerpt ?? ''),
			category: String(post.category ?? ''),
			publishedAt: String(post.publishedAt ?? '')
		})),
		query,
		category,
		categories,
		currentPage,
		totalPages: result.totalPages,
		totalItems: result.totalItems
	};
}
