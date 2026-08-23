// Single source of truth for page sections.
// The admin UI renders edit forms from this; the frontend renders components from it.
// Add a section: add an entry here, then add the matching component in
// src/lib/components/sections/ and register it in Sections.svelte.

import { cardsSpecs } from '$lib/sections.cards';
import { heroSplitSpecs } from '$lib/sections.herosplit';
import { statsCtaSpecs } from '$lib/sections.statscta';

export type FieldKind = 'text' | 'textarea' | 'richtext' | 'url' | 'media' | 'form';

export type FieldSpec =
	| { name: string; label: string; type: FieldKind }
	| { name: string; label: string; type: 'list'; fields: FieldSpec[] };

export type SectionSpec = { label: string; fields: FieldSpec[] };

export const sectionSpecs: Record<string, SectionSpec> = {
	...cardsSpecs,
	...heroSplitSpecs,
	...statsCtaSpecs,
	hero: {
		label: 'Hero',
		fields: [
			{ name: 'heading', label: 'Heading', type: 'text' },
			{ name: 'subheading', label: 'Subheading', type: 'textarea' },
			{ name: 'ctaLabel', label: 'Button label', type: 'text' },
			{ name: 'ctaHref', label: 'Button link', type: 'url' },
			{ name: 'image', label: 'Background image', type: 'media' }
		]
	},
	prose: {
		label: 'Rich text',
		fields: [{ name: 'html', label: 'Content', type: 'richtext' }]
	},
	cards: {
		label: 'Cards',
		fields: [
			{ name: 'heading', label: 'Heading', type: 'text' },
			{
				name: 'items',
				label: 'Cards',
				type: 'list',
				fields: [
					{ name: 'title', label: 'Title', type: 'text' },
					{ name: 'body', label: 'Body', type: 'textarea' },
					{ name: 'href', label: 'Link', type: 'url' }
				]
			}
		]
	},
	cta: {
		label: 'Call to action',
		fields: [
			{ name: 'heading', label: 'Heading', type: 'text' },
			{ name: 'body', label: 'Body', type: 'textarea' },
			{ name: 'buttonLabel', label: 'Button label', type: 'text' },
			{ name: 'buttonHref', label: 'Button link', type: 'url' }
		]
	},
	form: {
		label: 'Form',
		fields: [
			{ name: 'heading', label: 'Heading', type: 'text' },
			{ name: 'body', label: 'Intro text', type: 'textarea' },
			{ name: 'formId', label: 'Form', type: 'form' },
			{ name: 'confirmation', label: 'Confirmation message', type: 'textarea' }
		]
	}
};

export type SectionType = keyof typeof sectionSpecs;

export type Section = { id: string; type: string } & Record<string, unknown>;

/**
 * A `media` field holds either a media library reference or a plain URL.
 * A bare string is legacy content and is read as a URL, so pre-existing pages
 * keep rendering without a data migration.
 */
export type MediaValue = { kind: 'media' | 'url'; value: string };

/** Normalise any stored `media` field value. Returns null when empty. */
export function mediaValue(raw: unknown): MediaValue | null {
	if (typeof raw === 'string') {
		const value = raw.trim();
		return value ? { kind: 'url', value } : null;
	}

	if (raw && typeof raw === 'object') {
		const { kind, value } = raw as { kind?: unknown; value?: unknown };
		const trimmed = String(value ?? '').trim();
		if (trimmed && (kind === 'media' || kind === 'url')) return { kind, value: trimmed };
	}

	return null;
}

/** New empty section of the given type, with every field seeded to its zero value. */
export function blankSection(type: string): Section {
	const seed = (fields: FieldSpec[]) =>
		Object.fromEntries(fields.map((f) => [f.name, f.type === 'list' ? [] : '']));
	return { id: crypto.randomUUID().slice(0, 8), type, ...seed(sectionSpecs[type].fields) };
}
