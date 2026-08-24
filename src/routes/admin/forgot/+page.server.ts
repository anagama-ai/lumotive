import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const email = String((await request.formData()).get('email') ?? '')
			.trim()
			.toLowerCase();

		if (!EMAIL.test(email)) {
			return fail(400, { email, error: 'Enter a valid email address.' });
		}

		try {
			await locals.pb.collection('editors').requestPasswordReset(email);
		} catch {
			// Keep valid-address responses indistinguishable, including mail and backend failures.
		}

		return {
			requested: true,
			message: 'If an account exists for that email, a set-password link has been sent.'
		};
	}
};
