import type { FieldSpec, SectionSpec } from '$lib/sections';

const presentationFields: FieldSpec[] = [
	{ name: 'designVersion', label: 'Design version', type: 'text' },
	{ name: 'background', label: 'Background (none | subtle | strong | inverse)', type: 'text' },
	{ name: 'width', label: 'Width (contained | wide | full)', type: 'text' },
	{ name: 'spacingTop', label: 'Top spacing (none | sm | md | lg)', type: 'text' },
	{ name: 'spacingBottom', label: 'Bottom spacing (none | sm | md | lg)', type: 'text' },
	{ name: 'anchor', label: 'Anchor', type: 'text' },
	// Opt the section's inner column into the header container, so its
	// content lines up with the navigation logo. Unset keeps the wider shell.
	{ name: 'align', label: 'Align with header container (container)', type: 'text' }
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
		fields: [
			...presentationFields,
			...introFields,
			...linkFields,
			{ name: 'linkNewTab', label: 'Link opens a new tab (true | false)', type: 'text' },
			cardsField(fullCardFields)
		]
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
		fields: [
			...presentationFields,
			...introFields,
			{ name: 'iconTint', label: 'Icon colour (accent = each card’s accent)', type: 'text' },
			{ name: 'iconSize', label: 'Icon size (sm = 4rem; default 5rem)', type: 'text' },
			cardsField(fullCardFields)
		]
	},
	cardsIconQuad: {
		label: 'Cards — icon quad',
		fields: [...presentationFields, ...introFields, cardsField(fullCardFields)]
	},
	cardsMediaCards: {
		label: 'Cards — media cards',
		fields: [
			...presentationFields,
			{ name: 'mediaFrame', label: 'Card photo frame (panel = product on light-grey panel; default full-bleed)', type: 'text' },
			...introFields,
			...linkFields,
			{ name: 'linkNewTab', label: 'Link opens a new tab (true | false)', type: 'text' },
			{ name: 'density', label: 'Card density (compact)', type: 'text' },
			{ name: 'columns', label: 'Desktop columns (4; default is 2, or 3 for three cards)', type: 'text' },
			{ name: 'label', label: 'Group label above the grid', type: 'text' },
			{ name: 'note', label: 'Note under the grid', type: 'text' },
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
			// Emphasised lines around the grid: a proposition under the
			// introduction, and a closing result under the cards.
			{ name: 'statement', label: 'Statement under the introduction', type: 'text' },
			{ name: 'conclusion', label: 'Closing line under the grid', type: 'text' },
			...linkFields,
			{ name: 'linkNewTab', label: 'Link opens a new tab (true | false)', type: 'text' },
			{ name: 'columns', label: 'Desktop columns (2 | 3 | 4 | 5, default 3)', type: 'text' },
			{ name: 'numbered', label: 'Number the cards 01, 02 … (true | false)', type: 'text' },
			// Print card titles exactly as typed, for a section whose approved
			// card wording is sentence case. Section headings are unaffected.
			{ name: 'casing', label: 'Card title casing (exact)', type: 'text' },
			// Small trailing line under the grid: the reference-design caveat, or
			// the lead-in to the shared action ("New to metasurfaces?").
			{ name: 'note', label: 'Note under the grid', type: 'text' },
			// Second trailing line, kept separate from `note` where a section
			// carries two captions that belong to different panels.
			{ name: 'outro', label: 'Second note under the grid', type: 'text' },
			// Card media renders above the copy (/platform chip cards, /sense
			// perception cards), so editors can manage it like any other card.
			cardsField(fullCardFields)
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
	// Row-labelled comparison of two or more offerings. Each card is one
	// column; its `body` lists that column's values as `<li>Label: Value</li>`,
	// the spec-pair convention CardsSpecPanels established. Desktop renders a
	// table, mobile one stacked card per column.
	cardsSpecComparison: {
		label: 'Cards — specification comparison',
		fields: [
			...presentationFields,
			...introFields,
			{ name: 'outro', label: 'Closing line', type: 'textarea' },
			cardsField([
				{ name: 'media', label: 'Column photo', type: 'media' },
				{ name: 'eyebrow', label: 'Column label', type: 'text' },
				{ name: 'title', label: 'Column title', type: 'text' },
				{ name: 'body', label: 'Values (Label: Value per list item)', type: 'richtext' },
				// The column the comparison argues for: a Laser Blue wash and
				// medium-weight values.
				{ name: 'emphasis', label: 'Emphasize this column (true)', type: 'text' }
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
