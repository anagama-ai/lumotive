import type PocketBase from 'pocketbase';
import { fileUrl } from '$lib/pb';
import { variantCandidates, variantPath, type VariantWidth } from '$lib/imagesizes';
import { mediaValue, sectionSpecs, type FieldSpec, type Section } from '$lib/sections';

export type MediaEntry = { file: string; alt: string; width?: number; height?: number };
export type MediaMap = Record<string, MediaEntry>;
export type MediaRecord = MediaEntry & { id: string };

export function filenameStem(raw: string): string {
	// Dots are dropped rather than kept: a stem like `evil.php` would otherwise be
	// stored as `evil.php.webp`, the double extension that upload filters miss.
	return raw
		.replace(/[^A-Za-z0-9._-]/g, '')
		.replace(/\.[A-Za-z0-9]{1,8}$/, '')
		.replace(/\./g, '')
		.replace(/^[-_]+/, '')
		.slice(0, 100);
}

/** A public image ready to render: sized src, responsive candidates, intrinsic size. */
export type ResolvedImage = {
	src: string;
	alt: string;
	srcset?: string;
	width?: number;
	height?: number;
};

export function collectMediaIds(sections: Section[]): string[] {
	const ids = new Set<string>();

	const collect = (record: Record<string, unknown>, fields: FieldSpec[]) => {
		for (const field of fields) {
			if (field.type === 'media') {
				const value = mediaValue(record[field.name]);
				if (value?.kind === 'media') ids.add(value.value);
			} else if (field.type === 'list') {
				const rows = record[field.name];
				if (Array.isArray(rows)) {
					for (const row of rows) {
						if (row && typeof row === 'object') {
							collect(row as Record<string, unknown>, field.fields);
						}
					}
				}
			}
		}
	};

	for (const section of sections) {
		const spec = sectionSpecs[section.type];
		if (spec) collect(section, spec.fields);
	}

	return [...ids];
}

/**
 * URL for a stored media image. With a width it addresses a resized variant;
 * without one it addresses the stored file itself, which only the resize route
 * and the rich-text migration path should need.
 */
export function mediaSrc(entry: { id: string; file: string }, width?: VariantWidth): string {
	return width
		? variantPath(entry.id, entry.file, width)
		: fileUrl('media', entry.id, entry.file);
}

/** Responsive candidate list for a stored media image, as a srcset value. */
export function mediaSrcset(entry: { id: string; file: string }, sourceWidth?: number): string {
	return variantCandidates(sourceWidth)
		.map(({ width, rendered }) => `${variantPath(entry.id, entry.file, width)} ${rendered}w`)
		.join(', ');
}

/**
 * Resolve a stored image field to something renderable. A media reference gains
 * a sized src, responsive candidates, and intrinsic dimensions. A legacy plain
 * URL is returned untouched, because an external image cannot be resized here.
 */
export function resolveMedia(
	raw: unknown,
	media: MediaMap,
	width?: VariantWidth
): ResolvedImage | null {
	const value = mediaValue(raw);
	if (!value) return null;
	if (value.kind === 'url') return { src: value.value, alt: '' };

	const entry = media[value.value];
	if (!entry?.file) return null;

	const target = { id: value.value, file: entry.file };
	if (!width) return { src: mediaSrc(target), alt: entry.alt };

	return {
		src: mediaSrc(target, width),
		alt: entry.alt,
		srcset: mediaSrcset(target, entry.width),
		width: entry.width,
		height: entry.height
	};
}

export async function loadMediaMap(pb: PocketBase, ids: Iterable<string>): Promise<MediaMap> {
	const unique = [...new Set(ids)];
	if (!unique.length) return {};

	const values = Object.fromEntries(unique.map((id, index) => [`id${index}`, id]));
	const filter = unique.map((_, index) => `id = {:id${index}}`).join(' || ');
	const records = await pb.collection('media').getFullList({ filter: pb.filter(filter, values) });

	return Object.fromEntries(
		records.map((record) => [
			record.id,
			{
				file: String(record.file ?? ''),
				alt: String(record.alt ?? ''),
				width: Number(record.width) || undefined,
				height: Number(record.height) || undefined
			}
		])
	);
}
