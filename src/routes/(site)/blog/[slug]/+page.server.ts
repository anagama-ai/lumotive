import { error } from '@sveltejs/kit';
import { loadMediaMap } from '$lib/media';
import { mediaValue } from '$lib/sections';

export async function load({
	params,
	locals
}: {
	params: { slug: string };
	locals: App.Locals;
}) {
	try {
		const post = await locals.pb.collection('posts').getFirstListItem(
			locals.pb.filter(locals.editor ? 'slug = {:slug}' : 'slug = {:slug} && status = "published"', {
				slug: params.slug
			})
		);
		const mediaIds: string[] = [];
		const coverImage = mediaValue(post.coverImage);
		const ogImage = mediaValue(post.ogImage);
		if (coverImage?.kind === 'media') mediaIds.push(coverImage.value);
		if (ogImage?.kind === 'media') mediaIds.push(ogImage.value);
		const media = await loadMediaMap(locals.pb, mediaIds);


		return {
			post: {
				title: post.title,
				excerpt: post.excerpt,
				body: post.body,
				coverImage: post.coverImage ?? '',
				ogImage: post.ogImage,
				seoTitle: String(post.seoTitle ?? ''),
				seoDescription: String(post.seoDescription ?? ''),
				canonical: String(post.canonical ?? ''),
				noindex: Boolean(post.noindex),
				publishedAt: post.publishedAt
			},
			media
		};
	} catch (cause) {
		if (cause && typeof cause === 'object' && 'status' in cause && cause.status === 404) {
			error(404, 'Post not found');
		}
		throw cause;
	}
}
