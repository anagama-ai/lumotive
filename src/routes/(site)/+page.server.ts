import { error } from '@sveltejs/kit';
import { loadReferencedForms, submitForm } from '$lib/forms.server';
import { collectMediaIds, loadMediaMap } from '$lib/media';
import { mediaValue, type Section } from '$lib/sections';
import type { Actions } from './$types';

export async function load({ locals }: { locals: App.Locals }) {
	try {
		const page = await locals.pb
			.collection('pages')
			.getFirstListItem(
				locals.pb.filter(locals.editor ? 'path = "home"' : 'path = "home" && status = "published"')
			);
		const sections = Array.isArray(page.sections) ? (page.sections as Section[]) : [];
		const mediaIds = collectMediaIds(sections);
		const ogImage = mediaValue(page.ogImage);
		if (ogImage?.kind === 'media') mediaIds.push(ogImage.value);
		const [media, forms] = await Promise.all([
			loadMediaMap(locals.pb, mediaIds),
			loadReferencedForms(locals.pb, sections)
		]);
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
			breadcrumbs: []
		};
	} catch (cause) {
		if (cause && typeof cause === 'object' && 'status' in cause && cause.status === 404) {
			error(404, 'Home page not found');
		}
		throw cause;
	}
}

export const actions: Actions = {
	submitForm: (event) => submitForm(event, 'home')
};
