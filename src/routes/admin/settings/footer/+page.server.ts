import { fail } from '@sveltejs/kit';
import {
	cleanLinkRows,
	fromLinkRow,
	parseLinkRows,
	putGlobal,
	readGlobal,
	toLinkRows
} from '$lib/settings.server';
import type { Actions, PageServerLoad } from './$types';

// The fields `Footer.svelte` renders: `copyright`, `navItems` (titled columns
// of `subNavItems`), `legalLinks` and `socialLinks` ({ platform, url, label }).
// Social rows reuse the link editor: its label is the platform, its address
// the profile URL.

export const load: PageServerLoad = async ({ locals }) => {
	const footer = await readGlobal(locals.pb, 'footer');
	const groups = Array.isArray(footer.data.navItems) ? footer.data.navItems : [];
	const socials = Array.isArray(footer.data.socialLinks) ? footer.data.socialLinks : [];
	return {
		footer: {
			id: footer.id,
			copyright: String(footer.data.copyright ?? ''),
			groups: groups.map((group: Record<string, unknown>) => ({
				title: String(group?.title ?? ''),
				links: toLinkRows(group?.subNavItems),
				item: group ?? {}
			})),
			legal: toLinkRows(footer.data.legalLinks),
			social: socials.map((entry: Record<string, unknown>) => ({
				label: String(entry?.platform ?? ''),
				href: String(entry?.url ?? ''),
				item: entry ?? {}
			}))
		}
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const form = await request.formData();
		let groups: Array<{ title: string; links: unknown; item: Record<string, unknown> }>;
		try {
			groups = JSON.parse(String(form.get('footerGroups') ?? '[]'));
			if (!Array.isArray(groups)) groups = [];
		} catch {
			groups = [];
		}
		const navItems = groups.flatMap((group) => {
			const title = String(group?.title ?? '').trim();
			const links = cleanLinkRows(group?.links).map(fromLinkRow);
			return title || links.length ? [{ ...(group?.item ?? {}), title, subNavItems: links }] : [];
		});
		try {
			await putGlobal(locals.pb, 'footer', String(form.get('footerId') ?? ''), {
				copyright: String(form.get('copyright') ?? '').trim(),
				navItems,
				legalLinks: parseLinkRows(form.get('footerLegal')).map(fromLinkRow),
				socialLinks: parseLinkRows(form.get('footerSocial')).map((row) => ({
					...row.item,
					platform: row.label,
					url: row.href
				})),
				// Written by the old form, never rendered. Undefined drops the key
				// from the saved JSON, so a save also clears that leftover.
				text: undefined,
				nav: undefined
			});
		} catch {
			return fail(400, { error: 'Could not save the footer. Please try again.' });
		}
		return { saved: true, message: 'Saved. Your changes are live.' };
	}
};
