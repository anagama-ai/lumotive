import { ClientResponseError } from 'pocketbase';
import type PocketBase from 'pocketbase';

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
 *  A form only carries its own fields; a full replace would delete the rest. */
export async function putGlobal(pb: PocketBase, key: string, id: string, data: Record<string, unknown>) {
	if (!id) return pb.collection('globals').create({ key, data });
	const current = await readGlobal(pb, key);
	return pb.collection('globals').update(id, { data: { ...current.data, ...data } });
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
