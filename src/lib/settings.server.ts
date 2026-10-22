import { ClientResponseError } from 'pocketbase';
import type PocketBase from 'pocketbase';
import { invalidatePublicGlobals } from '$lib/server/public-globals';

export type NavItem = { label: string; href: string };

/** Shape an unknown stored value as label/href rows. Stored globals are free-form JSON. */
export function asNav(value: unknown): NavItem[] {
	if (!Array.isArray(value)) return [];
	return value.map((row) => ({
		label: String((row as NavItem)?.label ?? ''),
		href: String((row as NavItem)?.href ?? '')
	}));
}

/** Read one global by key. A global that does not exist yet reads as empty. */
export async function readGlobal(
	pb: PocketBase,
	key: string
): Promise<{ id: string; data: Record<string, unknown> }> {
	try {
		const record = await pb
			.collection('globals')
			.getFirstListItem(pb.filter('key = {:key}', { key }));
		return { id: record.id, data: (record.data ?? {}) as Record<string, unknown> };
	} catch (error) {
		if (error instanceof ClientResponseError && error.status === 404) {
			return { id: '', data: {} };
		}
		console.error('Failed to read global', { key, error });
		throw error;
	}
}

/** Create the global on first save, otherwise merge into the stored data.
 *  A form only carries its own fields; a full replace would delete the rest.
 *  Clears the public-globals cache so anonymous pages show the save at once. */
export async function putGlobal(pb: PocketBase, key: string, id: string, data: Record<string, unknown>) {
	const saved = id
		? await pb.collection('globals').update(id, { data: { ...(await readGlobal(pb, key)).data, ...data } })
		: await pb.collection('globals').create({ key, data });
	invalidatePublicGlobals();
	return saved;
}

/** Rows arrive as a JSON string in a hidden input. Entirely blank rows are dropped. */
export function parseNav(raw: unknown): NavItem[] {
	try {
		return asNav(JSON.parse(String(raw ?? '[]'))).filter(
			(row) => row.label.trim() || row.href.trim()
		);
	} catch {
		return [];
	}
}

type Json = Record<string, unknown>;
const obj = (value: unknown): Json =>
	value && typeof value === 'object' && !Array.isArray(value) ? (value as Json) : {};
const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const text = (value: unknown) => (typeof value === 'string' ? value : '');

/**
 * One stored site link as an editor row. The header and footer render
 * `item.link` ({ label, url, newTab }); `item` is the whole stored object,
 * carried through the form untouched so the fields the form does not edit
 * (new-tab flag, button appearance, social label) survive a save.
 */
export type LinkRow = { label: string; href: string; item: Json };

export function toLinkRows(value: unknown): LinkRow[] {
	return list(value).map((entry) => {
		const item = obj(entry);
		const link = obj(item.link);
		return { label: text(link.label), href: text(link.url), item };
	});
}

/** A row back in the stored shape. The flat `linkLabel`/`linkUrl` copies every
 *  stored link carries are kept in step, and written for new rows too. */
export function fromLinkRow(row: LinkRow): Json {
	const source = obj(row.item);
	const link = { type: 'custom', newTab: false, ...obj(source.link), label: row.label, url: row.href };
	const out: Json = { ...source, link };
	if (!('link' in source) || 'linkLabel' in source) {
		Object.assign(out, { linkLabel: row.label, linkNewTab: link.newTab, linkUrl: row.href });
	}
	return out;
}

/** Rows posted as JSON from a hidden input, trimmed; entirely blank rows are dropped. */
export function parseLinkRows(raw: unknown): LinkRow[] {
	try {
		return cleanLinkRows(JSON.parse(String(raw ?? '[]')));
	} catch {
		return [];
	}
}

export function cleanLinkRows(value: unknown): LinkRow[] {
	return list(value)
		.map((entry) => {
			const row = obj(entry);
			return { label: text(row.label).trim(), href: text(row.href).trim(), item: obj(row.item) };
		})
		.filter((row) => row.label || row.href);
}
