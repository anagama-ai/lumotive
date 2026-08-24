import { fail } from '@sveltejs/kit';
import { asNav, parseNav, putGlobal, readGlobal } from '$lib/settings.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const header = await readGlobal(locals.pb, 'header');
	return {
		header: {
			id: header.id,
			siteName: String(header.data.siteName ?? ''),
			nav: asNav(header.data.nav)
		}
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const form = await request.formData();
		try {
			await putGlobal(locals.pb, 'header', String(form.get('headerId') ?? ''), {
				siteName: String(form.get('siteName') ?? '').trim(),
				nav: parseNav(form.get('headerNav'))
			});
		} catch {
			return fail(400, { error: 'Could not save the header. Please try again.' });
		}
		return { saved: true, message: 'Saved. Your changes are live.' };
	}
};
