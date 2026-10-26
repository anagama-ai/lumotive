import { fail } from '@sveltejs/kit';
import {
	cleanLinkRows,
	fromLinkRow,
	parseLinkRows,
	putGlobal,
	readGlobal,
	toLinkRows,
	type LinkRow
} from '$lib/settings.server';
import type { Actions, PageServerLoad } from './$types';

// The fields `Header.svelte` renders: `items` (a plain link, or a menu with a
// label, its own page link and `subitems`, each with an optional
// `Description` and one more level of `subitems`) and `buttons`.

type Json = Record<string, unknown>;
type SubRow = LinkRow & { description: string; children: LinkRow[] };
type ItemRow = LinkRow & { kind: 'link' | 'sub'; children: SubRow[] };

export const load: PageServerLoad = async ({ locals }) => {
	const header = await readGlobal(locals.pb, 'header');
	const items: ItemRow[] = toLinkRows(header.data.items).map((row) => {
		if (row.item.blockType !== 'sub') return { ...row, kind: 'link', children: [] };
		return {
			...row,
			kind: 'sub',
			label: String(row.item.label ?? ''),
			children: toLinkRows(row.item.subitems).map((sub) => ({
				...sub,
				description: String(sub.item.Description ?? ''),
				children: toLinkRows(sub.item.subitems)
			}))
		};
	});
	return { header: { id: header.id, items, buttons: toLinkRows(header.data.buttons) } };
};

/** One menu entry back in the stored shape. A change of kind starts from a
 *  fresh object, since a link and a menu share no other fields. */
function storedItem(row: Json): Json | null {
	const [link] = cleanLinkRows([row]);
	if (!link) return null;
	const source = link.item;
	if (row.kind !== 'sub') {
		return { ...fromLinkRow({ ...link, item: source.blockType === 'link' ? source : {} }), blockType: 'link' };
	}
	const base = source.blockType === 'sub' ? source : {};
	const subitems = (Array.isArray(row.children) ? row.children : []).flatMap((child: Json) => {
		const [sub] = cleanLinkRows([child]);
		if (!sub) return [];
		const out = fromLinkRow(sub);
		const description = String(child.description ?? '').trim();
		const nested = cleanLinkRows(child.children).map(fromLinkRow);
		if (description) out.Description = description;
		else delete out.Description;
		if (nested.length) out.subitems = nested;
		else delete out.subitems;
		return [out];
	});
	return {
		...base,
		blockType: 'sub',
		label: link.label,
		link: { type: 'custom', newTab: false, ...(base.link as Json), label: link.label, url: link.href },
		subitems
	};
}

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const form = await request.formData();
		let rows: unknown;
		try {
			rows = JSON.parse(String(form.get('headerItems') ?? '[]'));
		} catch {
			rows = [];
		}
		const items = (Array.isArray(rows) ? rows : []).flatMap((row: Json) => storedItem(row) ?? []);
		try {
			await putGlobal(locals.pb, 'header', String(form.get('headerId') ?? ''), {
				items,
				buttons: parseLinkRows(form.get('headerButtons')).map(fromLinkRow),
				// Written by the old form, never rendered (the logo is fixed).
				// Undefined drops the key from the saved JSON.
				siteName: undefined,
				nav: undefined
			});
		} catch {
			return fail(400, { error: 'Could not save the header. Please try again.' });
		}
		return { saved: true, message: 'Saved. Your changes are live.' };
	}
};
