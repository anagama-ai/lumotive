import { error } from '@sveltejs/kit';
import { loadReferencedForms, submitForm } from '$lib/forms.server';
import { collectMediaIds, loadMediaMap } from '$lib/media';
import { mediaValue, type Section } from '$lib/sections';
import type { Actions } from './$types';

export async function load({
	params,
	locals
}: {
	params: { slug: string };
	locals: App.Locals;
}) {
	try {
		const page = await locals.pb.collection('pages').getFirstListItem(
			locals.pb.filter(locals.editor ? 'path = {:path}' : 'path = {:path} && status = "published"', {
				path: params.slug
			})
		);
		const sections = Array.isArray(page.sections) ? (page.sections as Section[]) : [];
		const mediaIds = collectMediaIds(sections);
		const ogImage = mediaValue(page.ogImage);
		if (ogImage?.kind === 'media') mediaIds.push(ogImage.value);
		const [media, forms] = await Promise.all([
			loadMediaMap(locals.pb, mediaIds),
			loadReferencedForms(locals.pb, sections)
		]);
		const segments = params.slug.split('/').filter(Boolean);
		const ancestorPaths = segments.slice(0, -1).map((_, index) => segments.slice(0, index + 1).join('/'));
		let breadcrumbs: { title: string; href: string }[] = [];
		if (ancestorPaths.length) {
			const values = Object.fromEntries(ancestorPaths.map((path, index) => [`path${index}`, path]));
			const pathFilter = ancestorPaths.map((_, index) => `path = {:path${index}}`).join(' || ');
			const ancestors = await locals.pb.collection('pages').getFullList({
				filter: locals.pb.filter(
					locals.editor ? `(${pathFilter})` : `(${pathFilter}) && status = "published"`,
					values
				)
			});
			const ancestorByPath = new Map(ancestors.map((ancestor) => [String(ancestor.path), ancestor]));
			breadcrumbs = ancestorPaths.flatMap((path) => {
				const ancestor = ancestorByPath.get(path);
				return ancestor ? [{ title: String(ancestor.title || ancestor.slug), href: `/${path}` }] : [];
			});
		}


		return {
			page: {
				title: page.title,
				seoTitle: page.seoTitle,
				seoDescription: page.seoDescription,
				ogImage: page.ogImage,
				canonical: String(page.canonical ?? ''),
				noindex: Boolean(page.noindex),
				sections
			},
			media,
			forms,
			breadcrumbs
		};
	} catch (cause) {
		if (cause && typeof cause === 'object' && 'status' in cause && cause.status === 404) {
			error(404, 'Page not found');
		}
		throw cause;
	}
}

export const actions: Actions = {
	submitForm: (event) => submitForm(event, event.params.slug)
};
