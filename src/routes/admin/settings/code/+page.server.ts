import { fail } from '@sveltejs/kit';
import { putGlobal, readGlobal } from '$lib/settings.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const code = await readGlobal(locals.pb, 'code_injection');
	return {
		code: {
			id: code.id,
			head: String(code.data.head ?? ''),
			bodyStart: String(code.data.bodyStart ?? ''),
			footer: String(code.data.footer ?? ''),
			bodyEnd: String(code.data.bodyEnd ?? '')
		}
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const form = await request.formData();
		try {
			await putGlobal(locals.pb, 'code_injection', String(form.get('code_injectionId') ?? ''), {
				head: String(form.get('codeHead') ?? ''),
				bodyStart: String(form.get('codeBodyStart') ?? ''),
				footer: String(form.get('codeFooter') ?? ''),
				bodyEnd: String(form.get('codeBodyEnd') ?? '')
			});
		} catch {
			return fail(400, { error: 'Could not save the custom code. Please try again.' });
		}
		return { saved: true, message: 'Saved. Your changes are live.' };
	}
};
