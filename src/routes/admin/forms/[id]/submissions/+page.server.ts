import { error } from '@sveltejs/kit';
import { normaliseFormFields } from '$lib/forms';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	let form;
	try {
		form = await locals.pb.collection('forms').getOne(params.id);
	} catch {
		error(404, 'That form no longer exists.');
	}

	const submissions = await locals.pb.collection('form_submissions').getFullList({
		filter: locals.pb.filter('form = {:form}', { form: params.id }),
		sort: '-created'
	});

	return {
		form: {
			id: form.id,
			name: String(form.name ?? ''),
			fields: normaliseFormFields(form.fields)
		},
		submissions: submissions.map((submission) => ({
			id: submission.id,
			form: String(submission.form ?? ''),
			values:
				submission.values && typeof submission.values === 'object'
					? (submission.values as Record<string, unknown>)
					: {},
			created: String(submission.created ?? '')
		}))
	};
};
