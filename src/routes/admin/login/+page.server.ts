import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.editor) redirect(303, '/admin');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { email, error: 'Enter your email address and password.' });
		}

		try {
			await locals.pb.collection('editors').authWithPassword(email, password);
		} catch {
			// Deliberately generic: never surface raw PocketBase error text.
			return fail(400, { email, error: 'That email and password combination did not work.' });
		}

		redirect(303, '/admin');
	}
};
