import { error } from '@sveltejs/kit';

export async function load({ params, locals }: { params: { slug: string }; locals: App.Locals }) {
	if (!params.slug || params.slug.length > 200) error(404, 'Post not found');

	try {
		const post = await locals.pb.collection('posts').getFirstListItem(
			locals.pb.filter(
				locals.editor
					? 'slug = {:slug} && sourceUrl != ""'
					: 'slug = {:slug} && sourceUrl != "" && status = "published"',
				{ slug: params.slug }
			),
			{ fields: 'title,slug,excerpt,body,publishedAt,coverImage,sourceUrl' }
		);
		let source: { href: string; hostname: string } | null = null;
		try {
			const url = new URL(String(post.sourceUrl));
			if (url.protocol === 'http:' || url.protocol === 'https:') {
				source = { href: url.href, hostname: url.hostname.replace(/^www\./i, '') };
			}
		} catch {
			// Invalid CMS values do not become public links.
		}

		return {
			post: {
				title: String(post.title),
				slug: String(post.slug),
				excerpt: String(post.excerpt ?? ''),
				body: String(post.body ?? ''),
				publishedAt: String(post.publishedAt ?? ''),
				coverImage: post.coverImage ?? null,
				source
			}
		};
	} catch (cause) {
		if (cause && typeof cause === 'object' && 'status' in cause && cause.status === 404) {
			error(404, 'Post not found');
		}
		throw cause;
	}
}
