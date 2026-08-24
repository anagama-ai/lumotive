import { fail } from '@sveltejs/kit';
import { mediaValue } from '$lib/sections';
import { putGlobal, readGlobal } from '$lib/settings.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const seo = await readGlobal(locals.pb, 'seo');
	return {
		seo: {
			id: seo.id,
			defaultOgImage: mediaValue(seo.data.defaultOgImage) ?? ''
		}
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const form = await request.formData();
		let defaultOgImage;
		try {
			defaultOgImage =
				mediaValue(JSON.parse(String(form.get('defaultOgImage') ?? '""'))) ?? '';
		} catch {
			return fail(400, { error: 'The default sharing image could not be read.' });
		}
		try {
			await putGlobal(locals.pb, 'seo', String(form.get('seoId') ?? ''), {
				defaultOgImage
			});
		} catch {
			return fail(400, { error: 'Could not save search and sharing. Please try again.' });
		}
		return { saved: true, message: 'Saved. Your changes are live.' };
	}
};
