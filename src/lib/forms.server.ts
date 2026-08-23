import { fail } from '@sveltejs/kit';
import type PocketBase from 'pocketbase';
import { normaliseFormFields, type PublicForms } from '$lib/forms';
import type { Section } from '$lib/sections';

export async function loadReferencedForms(pb: PocketBase, sections: Section[]): Promise<PublicForms> {
	const ids = [
		...new Set(
			sections
				.filter((section) => section.type === 'form')
				.map((section) => String(section.formId ?? '').trim())
				.filter(Boolean)
		)
	];
	if (ids.length === 0) return {};

	const filter = ids.map((id) => pb.filter('id = {:id}', { id })).join(' || ');
	const records = await pb.collection('forms').getFullList({ filter });
	return Object.fromEntries(
		records.map((record) => [
			record.id,
			{
				id: record.id,
				name: String(record.name ?? ''),
				fields: normaliseFormFields(record.fields),
				confirmation: String(record.confirmation ?? '')
			}
		])
	);
}

type SubmitEvent = { request: Request; locals: App.Locals };

export async function submitForm(event: SubmitEvent, path: string) {
	const data = await event.request.formData();
	const sectionId = String(data.get('sectionId') ?? '').trim();
	if (!sectionId) return fail(400, { error: 'This form is no longer available.', sectionId });

	let page;
	try {
		const filter = event.locals.editor
			? event.locals.pb.filter('path = {:path}', { path })
			: event.locals.pb.filter('path = {:path} && status = "published"', { path });
		page = await event.locals.pb.collection('pages').getFirstListItem(filter);
	} catch {
		return fail(404, { error: 'This form is no longer available.', sectionId });
	}

	const sections = Array.isArray(page.sections) ? (page.sections as Section[]) : [];
	const section = sections.find(
		(candidate) => candidate.type === 'form' && String(candidate.id) === sectionId
	);
	const formId = String(section?.formId ?? '').trim();
	if (!section || !formId) {
		return fail(404, { error: 'This form is no longer available.', sectionId });
	}

	let form;
	try {
		form = await event.locals.pb.collection('forms').getOne(formId);
	} catch {
		return fail(404, { error: 'This form is no longer available.', sectionId });
	}

	const fields = normaliseFormFields(form.fields);
	const values: Record<string, string | boolean> = {};
	const fieldErrors: Record<string, string> = {};

	for (const field of fields) {
		const submitted = data.get(`field:${field.name}`);
		if (field.type === 'checkbox') {
			const checked = submitted === 'true';
			values[field.name] = checked;
			if (field.required && !checked) fieldErrors[field.name] = `${field.label} is required.`;
			continue;
		}

		const value = typeof submitted === 'string' ? submitted : '';
		const trimmed = value.trim();
		values[field.name] = field.type === 'email' ? trimmed : value;
		if (field.required && !trimmed) fieldErrors[field.name] = `${field.label} is required.`;
		if (field.type === 'email' && trimmed && !/^[^\s@]+@[^\s@]+$/.test(trimmed)) {
			fieldErrors[field.name] = `${field.label} must be a valid email address.`;
		}
	}

	if (Object.keys(fieldErrors).length > 0) {
		return fail(400, {
			error: `Check ${fields
				.filter((field) => fieldErrors[field.name])
				.map((field) => field.label)
				.join(', ')}.`,
			fieldErrors,
			values,
			sectionId
		});
	}

	try {
		await event.locals.pb.collection('form_submissions').create({ form: formId, values });
	} catch {
		return fail(500, {
			error: 'Your submission could not be saved. Please try again.',
			values,
			sectionId
		});
	}

	return {
		success: true,
		sectionId,
		confirmation:
			String(section.confirmation ?? '').trim() ||
			String(form.confirmation ?? '').trim() ||
			'Thank you. Your response has been received.'
	};
}
