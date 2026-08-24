import { fail } from '@sveltejs/kit';
import { mediaValue } from '$lib/sections';
import { asNav, parseNav, putGlobal, readGlobal } from '$lib/settings.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const siteMeta = await readGlobal(locals.pb, 'site_meta');
	return {
		siteMeta: {
			id: siteMeta.id,
			address: String(siteMeta.data.address ?? ''),
			phone: String(siteMeta.data.phone ?? ''),
			social: asNav(siteMeta.data.social),
			logoLight: mediaValue(siteMeta.data.logoLight) ?? '',
			logoDark: mediaValue(siteMeta.data.logoDark) ?? ''
		}
	};
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		const form = await request.formData();
		let logoLight;
		try {
			logoLight = mediaValue(JSON.parse(String(form.get('logoLight') ?? '""'))) ?? '';
		} catch {
			return fail(400, { error: 'The logo for light backgrounds could not be read.' });
		}
		let logoDark;
		try {
			logoDark = mediaValue(JSON.parse(String(form.get('logoDark') ?? '""'))) ?? '';
		} catch {
			return fail(400, { error: 'The logo for dark backgrounds could not be read.' });
		}
		try {
			await putGlobal(locals.pb, 'site_meta', String(form.get('siteMetaId') ?? ''), {
				address: String(form.get('address') ?? ''),
				phone: String(form.get('phone') ?? '').trim(),
				social: parseNav(form.get('social')),
				logoLight,
				logoDark
			});
		} catch {
			return fail(400, { error: 'Could not save site meta. Please try again.' });
		}
		return { saved: true, message: 'Saved. Your changes are live.' };
	}
};
