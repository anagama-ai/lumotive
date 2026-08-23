import { fail } from '@sveltejs/kit';
import { asNav, parseNav, putGlobal, readGlobal } from '$lib/settings.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const footer = await readGlobal(locals.pb, 'footer');
	return {
		footer: {
			id: footer.id,
			text: String(footer.data.text ?? ''),
			nav: asNav(footer.data.nav)
		}
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const form = await request.formData();
		try {
			await putGlobal(locals.pb, 'footer', String(form.get('footerId') ?? ''), {
				text: String(form.get('footerText') ?? ''),
				nav: parseNav(form.get('footerNav'))
			});
		} catch {
			return fail(400, { error: 'Could not save the footer. Please try again.' });
		}
		return { saved: true };
	}
};
