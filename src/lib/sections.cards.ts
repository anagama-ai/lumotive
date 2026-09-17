import type { FieldSpec, SectionSpec } from '$lib/sections';

const presentationFields: FieldSpec[] = [
	{ name: 'designVersion', label: 'Design version', type: 'text' },
	{ name: 'background', label: 'Background (none | subtle | strong | inverse)', type: 'text' },
	{ name: 'width', label: 'Width (contained | wide | full)', type: 'text' },
	{ name: 'spacingTop', label: 'Top spacing (none | sm | md | lg)', type: 'text' },
	{ name: 'spacingBottom', label: 'Bottom spacing (none | sm | md | lg)', type: 'text' },
	{ name: 'anchor', label: 'Anchor', type: 'text' }
];

const introFields: FieldSpec[] = [
	{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
	{ name: 'heading', label: 'Heading', type: 'text' },
	{ name: 'intro', label: 'Introduction', type: 'textarea' }
];

const linkFields: FieldSpec[] = [
	{ name: 'linkLabel', label: 'Link label', type: 'text' },
	{ name: 'linkUrl', label: 'Link URL', type: 'url' }
];

const fullCardFields: FieldSpec[] = [
	{ name: 'media', label: 'Media', type: 'media' },
	{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
	{ name: 'title', label: 'Title', type: 'text' },
	{ name: 'body', label: 'Body', type: 'richtext' },
	...linkFields,
	{ name: 'badge', label: 'Badge', type: 'text' },
	{ name: 'accent', label: 'Accent (accent1 | accent2 | accent3 | accent4 | accent5 | accent6)', type: 'text' }
];

const cardsField = (fields: FieldSpec[]): FieldSpec => ({
	name: 'cards',
	label: 'Cards',
	type: 'list',
	fields
});

export const cardsSpecs: Record<string, SectionSpec> = {
	cardsPeelScene: {
		label: 'Cards — peel scene',
		fields: [
			...presentationFields,
			{ name: 'heading', label: 'Heading', type: 'text' },
			cardsField([
				{ name: 'media', label: 'Media', type: 'media' },
				{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
				{ name: 'title', label: 'Title', type: 'text' },
				{ name: 'body', label: 'Body', type: 'richtext' },
				...linkFields,
				{ name: 'accent', label: 'Accent (accent1 | accent2 | accent3 | accent4 | accent5 | accent6)', type: 'text' }
			])
		]
	},
	cardsPeelBento: {
		label: 'Cards — peel bento',
		fields: [...presentationFields, ...introFields, cardsField(fullCardFields)]
	},
	cardsPeelSwap: {
		label: 'Cards — peel swap',
		fields: [
			...presentationFields,
			{ name: 'heading', label: 'Heading', type: 'text' },
			{ name: 'intro', label: 'Introduction', type: 'textarea' },
			cardsField([
				{ name: 'media', label: 'Media', type: 'media' },
				{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
				{ name: 'title', label: 'Title', type: 'text' },
				{ name: 'body', label: 'Body', type: 'richtext' },
				...linkFields,
				{ name: 'accent', label: 'Accent (accent1 | accent2 | accent3 | accent4 | accent5 | accent6)', type: 'text' }
			])
		]
	},
	cardsFlowPanels: {
		label: 'Cards — flow panels',
		fields: [
			...presentationFields,
			...introFields,
			cardsField([
				{ name: 'media', label: 'Media', type: 'media' },
				{ name: 'title', label: 'Title', type: 'text' },
				{ name: 'body', label: 'Body', type: 'richtext' },
				{ name: 'accent', label: 'Accent (accent1 | accent2 | accent3 | accent4 | accent5 | accent6)', type: 'text' }
			])
		]
	},
	cardsFlowDiagram: {
		label: 'Cards — flow diagram',
		fields: [
			...presentationFields,
			...introFields,
			cardsField([
				{ name: 'media', label: 'Media', type: 'media' },
				{ name: 'title', label: 'Title', type: 'text' },
				{ name: 'accent', label: 'Accent (accent1 | accent2 | accent3 | accent4 | accent5 | accent6)', type: 'text' }
			])
		]
	},
	cardsIconCards: {
		label: 'Cards — icon cards',
		fields: [...presentationFields, ...introFields, cardsField(fullCardFields)]
	},
	cardsIconQuad: {
		label: 'Cards — icon quad',
		fields: [...presentationFields, ...introFields, cardsField(fullCardFields)]
	},
	cardsMediaCards: {
		label: 'Cards — media cards',
		fields: [
			...presentationFields,
			...introFields,
			cardsField([
				...fullCardFields,
				{ name: 'anchor', label: 'Card anchor', type: 'text' }
			])
		]
	},
	cardsTextCards: {
		label: 'Cards — text cards',
		fields: [
			...presentationFields,
			...introFields,
			cardsField(fullCardFields.filter((field) => field.name !== 'media'))
		]
	},
	cardsSpecPanels: {
		label: 'Cards — specification panels',
		fields: [
			...presentationFields,
			...introFields,
			cardsField([
				{ name: 'media', label: 'Media', type: 'media' },
				{ name: 'title', label: 'Title', type: 'text' },
				{ name: 'body', label: 'Specifications', type: 'richtext' }
			])
		]
	},
	cardsComparisonCards: {
		label: 'Cards — comparison cards',
		fields: [
			...presentationFields,
			{ name: 'heading', label: 'Heading', type: 'text' },
			{ name: 'intro', label: 'Introduction', type: 'textarea' },
			cardsField([
				{ name: 'eyebrow', label: 'Column label', type: 'text' },
				{ name: 'title', label: 'Row label', type: 'text' },
				{ name: 'media', label: 'Row icon', type: 'media' }
			])
		]
	},
	cardsComparisonTable: {
		label: 'Cards — comparison table',
		fields: [
			...presentationFields,
			...introFields,
			cardsField([
				{ name: 'title', label: 'Offering', type: 'text' },
				{ name: 'eyebrow', label: 'Evaluation level', type: 'text' },
				{ name: 'body', label: 'Best for', type: 'richtext' },
				{ name: 'accent', label: 'Accent (accent1 | accent2 | accent3 | accent4 | accent5 | accent6)', type: 'text' }
			])
		]
	},
	cardsDesignSpace: {
		label: 'Cards — design space',
		fields: [
			...presentationFields,
			...introFields,
			cardsField([
				{ name: 'title', label: 'Offering', type: 'text' },
				{ name: 'eyebrow', label: 'Detail', type: 'text' },
				{ name: 'accent', label: 'Accent (accent1 | accent2 | accent3 | accent4 | accent5 | accent6)', type: 'text' }
			])
		]
	},
	cardsApplicationBento: {
		label: 'Cards — application bento',
		fields: [...presentationFields, ...introFields, cardsField(fullCardFields)]
	},
	cardsAwardCards: {
		label: 'Cards — awards',
		fields: [
			...presentationFields,
			...introFields,
			cardsField([
				{ name: 'title', label: 'Award', type: 'text' },
				{ name: 'year', label: 'Year', type: 'text' },
				{ name: 'linkUrl', label: 'Link URL', type: 'url' }
			])
		]
	},
	cardsTeamCards: {
		label: 'Cards — team',
		fields: [
			...presentationFields,
			...introFields,
			cardsField([
				{ name: 'name', label: 'Name', type: 'text' },
				{ name: 'title', label: 'Title', type: 'text' },
				{ name: 'headshot', label: 'Headshot', type: 'media' },
				{ name: 'headshotAlt', label: 'Headshot alt text', type: 'text' },
				{ name: 'biography', label: 'Biography', type: 'richtext' }
			])
		]
	}
};
