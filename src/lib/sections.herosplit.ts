import type { FieldSpec, SectionSpec } from '$lib/sections';

const presentationFields = (designVersion: string): FieldSpec[] => [
	{ name: 'designVersion', label: `Design version (${designVersion})`, type: 'text' },
	{ name: 'background', label: 'Background (none | subtle | strong | inverse)', type: 'text' },
	{ name: 'width', label: 'Width (contained | wide | full)', type: 'text' },
	{ name: 'spacingTop', label: 'Top spacing (none | sm | md | lg)', type: 'text' },
	{ name: 'spacingBottom', label: 'Bottom spacing (none | sm | md | lg)', type: 'text' },
	{ name: 'anchor', label: 'Anchor', type: 'text' }
];

const heroFields: FieldSpec[] = [
	{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
	{ name: 'heading', label: 'Heading', type: 'text' },
	{ name: 'body', label: 'Body', type: 'richtext' },
	{ name: 'media', label: 'Media', type: 'media' },
	{ name: 'primaryLinkLabel', label: 'Primary link label', type: 'text' },
	{ name: 'primaryLinkUrl', label: 'Primary link URL', type: 'url' },
	{ name: 'primaryLinkNewTab', label: 'Primary link opens a new tab (true | false)', type: 'text' },
	{ name: 'secondaryLinkLabel', label: 'Secondary link label', type: 'text' },
	{ name: 'secondaryLinkUrl', label: 'Secondary link URL', type: 'url' },
	{ name: 'secondaryLinkNewTab', label: 'Secondary link opens a new tab (true | false)', type: 'text' }
];

const splitFields: FieldSpec[] = [
	{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
	{ name: 'heading', label: 'Heading', type: 'text' },
	{ name: 'body', label: 'Body', type: 'richtext' },
	{ name: 'media', label: 'Media', type: 'media' },
	{ name: 'mediaPosition', label: 'Media position (left | right)', type: 'text' },
	{ name: 'linkLabel', label: 'Link label', type: 'text' },
	{ name: 'linkUrl', label: 'Link URL', type: 'url' },
	{ name: 'linkNewTab', label: 'Link opens a new tab (true | false)', type: 'text' }
];

const logosFields: FieldSpec[] = [
	{ name: 'heading', label: 'Heading', type: 'text' },
	{ name: 'intro', label: 'Intro', type: 'textarea' },
	{
		name: 'logos',
		label: 'Logos',
		type: 'list',
		fields: [
			{ name: 'media', label: 'Logo', type: 'media' },
			{ name: 'name', label: 'Name', type: 'text' },
			{ name: 'linkLabel', label: 'Link label', type: 'text' },
			{ name: 'linkUrl', label: 'Link URL', type: 'url' },
			{ name: 'linkNewTab', label: 'Link opens a new tab (true | false)', type: 'text' }
		]
	}
];

export const heroSplitSpecs: Record<string, SectionSpec> = {
	heroFullHeight: {
		label: 'Hero — full height',
		fields: [...heroFields, ...presentationFields('fullHeight')]
	},
	heroBand: {
		label: 'Hero — band',
		fields: [...heroFields, ...presentationFields('band')]
	},
	splitDefault: {
		label: 'Split — default',
		fields: [...splitFields, ...presentationFields('default')]
	},
	splitDarkPanel: {
		label: 'Split — dark panel',
		fields: [...splitFields, ...presentationFields('darkPanel')]
	},
	splitPeelBleed: {
		label: 'Split — peel bleed',
		fields: [...splitFields, ...presentationFields('peelBleed')]
	},
	splitStackedCard: {
		label: 'Split — stacked card',
		fields: [...splitFields, ...presentationFields('stackedCard')]
	},
	logosMarquee: {
		label: 'Logos — marquee',
		fields: [...logosFields, ...presentationFields('marquee')]
	},
	logosGridOnDark: {
		label: 'Logos — grid on dark',
		fields: [...logosFields, ...presentationFields('gridOnDark')]
	},
	logosLabelled: {
		label: 'Logos — labelled',
		fields: [...logosFields, ...presentationFields('labelled')]
	},
	logosSceneBand: {
		label: 'Logos — scene band',
		fields: [...logosFields, ...presentationFields('sceneBand')]
	}
};
