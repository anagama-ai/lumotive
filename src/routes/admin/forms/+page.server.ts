import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const records = await locals.pb.collection('forms').getFullList({ sort: '-updated' });
	return {
		forms: records.map((record) => ({
			id: record.id,
			name: String(record.name ?? ''),
			fieldCount: Array.isArray(record.fields) ? record.fields.length : 0,
			updated: String(record.updated ?? '')
		}))
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const name = String((await request.formData()).get('name') ?? '').trim();
		if (!name) return fail(400, { error: 'Enter a name for the form.' });

		const record = await locals.pb.collection('forms').create({
			name,
			fields: [],
			confirmation: 'Thank you. Your response has been received.',
			recipients: ''
		});
		redirect(303, `/admin/forms/${record.id}`);
	},

	delete: async ({ request, locals }) => {
		const id = String((await request.formData()).get('id') ?? '').trim();
		if (!id) return fail(400, { error: 'Nothing to delete.' });

		const pages = await locals.pb.collection('pages').getFullList({ fields: 'id,title,sections' });
		const references = pages.filter(
			(page) =>
				Array.isArray(page.sections) &&
				page.sections.some(
					(section: unknown) =>
						section !== null &&
						typeof section === 'object' &&
						(section as Record<string, unknown>).type === 'form' &&
						String((section as Record<string, unknown>).formId ?? '') === id
				)
		);

		if (references.length > 0) {
			return fail(409, {
				error: `This form is still used on: ${references
					.map((page) => String(page.title ?? '').trim() || `Untitled page (${page.id})`)
					.join(', ')}. Remove those form sections before deleting it.`
			});
		}

		try {
			// The required relation cascade permanently removes this form's submissions atomically.
			await locals.pb.collection('forms').delete(id);
		} catch {
			return fail(400, { error: 'That form could not be deleted.' });
		}

		return { deleted: true, message: 'Form and its submissions deleted.' };
	}
};
