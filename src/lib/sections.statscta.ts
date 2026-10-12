import type { FieldSpec, SectionSpec } from '$lib/sections';

const presentationFields: FieldSpec[] = [
	{ name: 'designVersion', label: 'Design version', type: 'text' },
	{
		name: 'background',
		label: 'Background (none | subtle | strong | inverse)',
		type: 'text'
	},
	{ name: 'width', label: 'Width (contained | wide | full)', type: 'text' },
	{ name: 'spacingTop', label: 'Top spacing (none | sm | md | lg)', type: 'text' },
	{ name: 'spacingBottom', label: 'Bottom spacing (none | sm | md | lg)', type: 'text' },
	{ name: 'anchor', label: 'Anchor', type: 'text' },
	// Opt the section's inner column into the header container, so its
	// content lines up with the navigation logo. Unset keeps the wider shell.
	{ name: 'align', label: 'Align with header container (container)', type: 'text' }
];

const statsFields: FieldSpec[] = [
	{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
	{ name: 'heading', label: 'Heading', type: 'text' },
	{ name: 'intro', label: 'Introduction', type: 'textarea' },
	{ name: 'body', label: 'Body', type: 'richtext' },
	{ name: 'media', label: 'Media', type: 'media' },
	{
		name: 'stats',
		label: 'Statistics',
		type: 'list',
		fields: [
			{ name: 'value', label: 'Value', type: 'text' },
			{ name: 'label', label: 'Label', type: 'text' },
			{ name: 'prefix', label: 'Prefix', type: 'text' },
			{ name: 'suffix', label: 'Suffix', type: 'text' },
			{ name: 'description', label: 'Description', type: 'textarea' }
		]
	},
	...presentationFields
];

const ctaFields: FieldSpec[] = [
	{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
	{ name: 'heading', label: 'Heading', type: 'text' },
	{ name: 'headingSize', label: 'Heading size (heading | statement)', type: 'text' },
	{ name: 'body', label: 'Body', type: 'richtext' },
	{ name: 'primaryLinkLabel', label: 'Primary link label', type: 'text' },
	{ name: 'primaryLinkUrl', label: 'Primary link URL', type: 'url' },
	{ name: 'primaryLinkNewTab', label: 'Primary link opens a new tab (true | false)', type: 'text' },
	{ name: 'secondaryLinkLabel', label: 'Secondary link label', type: 'text' },
	{ name: 'secondaryLinkUrl', label: 'Secondary link URL', type: 'url' },
	{
		name: 'secondaryLinkNewTab',
		label: 'Secondary link opens a new tab (true | false)',
		type: 'text'
	},
	{
		name: 'secondaryLinks',
		label: 'Additional links',
		type: 'list',
		fields: [
			{ name: 'label', label: 'Label', type: 'text' },
			{ name: 'url', label: 'URL', type: 'url' },
			{ name: 'newTab', label: 'Opens a new tab (true | false)', type: 'text' }
		]
	},
	...presentationFields
];

export const statsCtaSpecs: Record<string, SectionSpec> = {
	statsCentered: { label: 'Stats — centered', fields: statsFields },
	statsDarkTraits: { label: 'Stats — dark traits', fields: statsFields },
	statsLightTraits: { label: 'Stats — light traits (design version: lightTraits | specTable)', fields: statsFields },
	statsSpecPills: { label: 'Stats — specification pills', fields: statsFields },
	statsPeelScene: { label: 'Stats — peel scene', fields: statsFields },
	statsSceneBand: { label: 'Stats — scene band', fields: statsFields },
	ctaDefault: { label: 'CTA — default', fields: ctaFields },
	ctaSplitLinks: { label: 'CTA — split links', fields: ctaFields },
	ctaLattice: { label: 'CTA — lattice', fields: ctaFields },
	ctaFabric: { label: 'CTA — fabric', fields: ctaFields },
	ctaLightField: { label: 'CTA — light field', fields: ctaFields },
	ctaSpectrum: { label: 'CTA — spectrum', fields: ctaFields },
	testimonialsPeelScene: {
		label: 'Testimonials — peel scene',
		fields: [
			{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
			{ name: 'heading', label: 'Heading', type: 'text' },
			{ name: 'intro', label: 'Introduction', type: 'textarea' },
			{
				name: 'quotes',
				label: 'Quotes',
				type: 'list',
				fields: [
					{ name: 'quote', label: 'Quote', type: 'textarea' },
					{ name: 'author', label: 'Author', type: 'text' },
					{ name: 'role', label: 'Role', type: 'text' },
					{ name: 'company', label: 'Company', type: 'text' },
					{ name: 'avatar', label: 'Avatar', type: 'media' },
					{ name: 'rating', label: 'Rating', type: 'text' }
				]
			},
			...presentationFields
		]
	},
	mediaVideoEmbed: {
		label: 'Media — video embed',
		fields: [
			{ name: 'heading', label: 'Heading', type: 'text' },
			{ name: 'intro', label: 'Introduction', type: 'textarea' },
			{ name: 'mode', label: 'Mode (image | gallery | video)', type: 'text' },
			{
				name: 'items',
				label: 'Media items',
				type: 'list',
				fields: [
					{ name: 'media', label: 'Media', type: 'media' },
					{ name: 'caption', label: 'Caption', type: 'textarea' }
				]
			},
			{ name: 'videoUrl', label: 'Video URL', type: 'url' },
			...presentationFields
		]
	},
	postsFeatured: {
		label: 'Posts — featured teasers',
		fields: [
			{ name: 'eyebrow', label: 'Eyebrow', type: 'text' },
			{ name: 'heading', label: 'Heading', type: 'text' },
			{ name: 'linkLabel', label: 'Link label', type: 'text' },
			{ name: 'linkUrl', label: 'Link URL', type: 'url' },
			...presentationFields
		]
	},
	timeline: {
		label: 'Timeline',
		fields: [
			{ name: 'heading', label: 'Heading', type: 'text' },
			{ name: 'intro', label: 'Introduction', type: 'textarea' },
			{
				name: 'rows',
				label: 'Timeline rows',
				type: 'list',
				fields: [
					{ name: 'level', label: 'Level (stage | group | item)', type: 'text' },
					{ name: 'title', label: 'Title', type: 'text' },
					{ name: 'body', label: 'Body', type: 'richtext' },
					{ name: 'media', label: 'Media', type: 'media' }
				]
			},
			...presentationFields
		]
	}
};
