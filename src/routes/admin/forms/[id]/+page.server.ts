import { error, fail } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import { FORM_FIELD_TYPES, normaliseFormFields, type FormFieldType } from '$lib/forms';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	let record;
	try {
		record = await locals.pb.collection('forms').getOne(params.id);
	} catch {
		error(404, 'That form no longer exists.');
	}

	let recipients = '';
	try {
		const record = await locals.pb
			.collection('form_recipients')
			.getFirstListItem(locals.pb.filter('form = {:form}', { form: params.id }));
		recipients = String(record.addresses ?? '');
	} catch (cause) {
		if (!(cause instanceof ClientResponseError && cause.status === 404)) throw cause;
	}

	return {
		form: {
			id: record.id,
			name: String(record.name ?? ''),
			fields: normaliseFormFields(record.fields),
			confirmation: String(record.confirmation ?? '')
		},
		recipients
	};
};

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		if (!name) return fail(400, { error: 'Enter a name for the form.' });

		let rawFields: unknown;
		try {
			rawFields = JSON.parse(String(data.get('fields') ?? '[]'));
		} catch {
			return fail(400, { error: 'The field list could not be read. Reload and try again.' });
		}
		if (!Array.isArray(rawFields)) return fail(400, { error: 'The field list could not be read.' });
		if (
			rawFields.some(
				(field) =>
					!field ||
					typeof field !== 'object' ||
					!FORM_FIELD_TYPES.includes((field as Record<string, unknown>).type as FormFieldType)
			)
		) {
			return fail(400, { error: 'A field uses an unsupported type.' });
		}

		const fields = normaliseFormFields(rawFields);
		const unlabeled = fields.filter((field) => !field.label);
		if (unlabeled.length > 0) {
			return fail(400, { error: 'Every field needs a label.' });
		}
		if (new Set(fields.map((field) => field.name)).size !== fields.length) {
			return fail(400, { error: 'Each field must have a unique identifier.' });
		}

		let recipientId = '';
		try {
			recipientId = (
				await locals.pb
					.collection('form_recipients')
					.getFirstListItem(locals.pb.filter('form = {:form}', { form: params.id }))
			).id;
		} catch (cause) {
			if (!(cause instanceof ClientResponseError && cause.status === 404)) {
				return fail(400, { error: 'The form could not be saved.' });
			}
		}

		try {
			const batch = locals.pb.createBatch();
			batch.collection('forms').update(params.id, {
				name,
				fields,
				confirmation: String(data.get('confirmation') ?? '')
			});
			if (recipientId) {
				batch.collection('form_recipients').update(recipientId, {
					addresses: String(data.get('recipients') ?? '')
				});
			} else {
				batch.collection('form_recipients').create({
					form: params.id,
					addresses: String(data.get('recipients') ?? '')
				});
			}
			await batch.send();
		} catch {
			return fail(400, { error: 'The form could not be saved.' });
		}

		return { saved: true };
	}
};
