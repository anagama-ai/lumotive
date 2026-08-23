import { loadEditorAccountOptions } from '$lib/editor-accounts.server';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { passwordMinimum, passwordMaximum } = await loadEditorAccountOptions(locals.pb);
	return { passwordMinimum, passwordMaximum };
};

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		const form = await request.formData();
		const password = String(form.get('password') ?? '');
		const passwordConfirm = String(form.get('passwordConfirm') ?? '');
		const { passwordMinimum, passwordMaximum } = await loadEditorAccountOptions(locals.pb);
		const fieldErrors: Record<string, string> = {};

		if (password.length < passwordMinimum) {
			fieldErrors.password = `Password must be at least ${passwordMinimum} characters.`;
		}
		if (password.length > passwordMaximum) {
			fieldErrors.password = `Password must be no more than ${passwordMaximum} characters.`;
		}
		if (password !== passwordConfirm) fieldErrors.passwordConfirm = 'Passwords do not match.';
		if (Object.keys(fieldErrors).length > 0) {
			return fail(400, { error: 'Check the highlighted fields.', fieldErrors });
		}

		try {
			await locals.pb
				.collection('editors')
				.confirmPasswordReset(params.token, password, passwordConfirm);
		} catch {
			return fail(400, {
				error: 'This set-password link is invalid or has expired. Request a new link.'
			});
		}

		redirect(303, '/admin/login?reset=1');
	}
};
