export const FORM_FIELD_TYPES = [
	'text',
	'email',
	'textarea',
	'number',
	'select',
	'checkbox'
] as const;

export type FormFieldType = (typeof FORM_FIELD_TYPES)[number];

export type FormField = {
	name: string;
	label: string;
	type: FormFieldType;
	required: boolean;
	options?: string[];
};

export type PublicForm = {
	id: string;
	name: string;
	fields: FormField[];
	confirmation: string;
};

export type PublicForms = Record<string, PublicForm>;

export type FormSubmissionResult = {
	success?: boolean;
	sectionId?: string;
	confirmation?: string;
	error?: string;
	fieldErrors?: Record<string, string>;
	values?: Record<string, string | boolean>;
};

export function normaliseFormFields(raw: unknown): FormField[] {
	if (!Array.isArray(raw)) return [];

	return raw.flatMap((value, index) => {
		if (!value || typeof value !== 'object') return [];
		const field = value as Record<string, unknown>;
		const type = FORM_FIELD_TYPES.includes(field.type as FormFieldType)
			? (field.type as FormFieldType)
			: 'text';
		const name = String(field.name ?? `field-${index + 1}`).trim() || `field-${index + 1}`;
		const options = Array.isArray(field.options)
			? field.options.map(String).map((option) => option.trim()).filter(Boolean)
			: [];

		return [
			{
				name,
				label: String(field.label ?? '').trim(),
				type,
				required: field.required === true,
				...(type === 'select' ? { options } : {})
			}
		];
	});
}
