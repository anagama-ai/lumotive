import { loadMediaMap, resolveMedia } from '$lib/media';
import { mediaValue } from '$lib/sections';
import { readGlobal } from '$lib/settings.server';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const onLogin = url.pathname === '/admin/login';

	if (!locals.editor && !onLogin) redirect(303, '/admin/login');

	let brandLogo = '';
	if (locals.editor) {
		try {
			const { data } = await readGlobal(locals.pb, 'site_meta');
			const logo = mediaValue(data.logoDark);
			const media =
				logo?.kind === 'media' ? await loadMediaMap(locals.pb, [logo.value]) : {};
			brandLogo = resolveMedia(logo, media, 320)?.src ?? '';
		} catch {
			// A broken optional brand must not take down the admin shell.
			brandLogo = '';
		}
	}

	let divergence: { collections: string[]; checkedAt: string } | null = null;
	if (locals.editor) {
		try {
			const record = await locals.pb
				.collection('promotion_state')
				.getFirstListItem(locals.pb.filter('key = "divergence"'));
			const state = record.data as Record<string, unknown> | null;
			if (
				state?.diverged === true &&
				Array.isArray(state.collections) &&
				state.collections.length > 0 &&
				state.collections.every((collection) => typeof collection === 'string') &&
				typeof state.checkedAt === 'string' &&
				state.checkedAt
			) {
				divergence = { collections: state.collections, checkedAt: state.checkedAt };
			}
		} catch {
			divergence = null;
		}
	}

	return {
		editor: locals.editor
			? {
					name: String(locals.editor.name ?? ''),
					email: String(locals.editor.email ?? ''),
					role: String(locals.editor.role ?? '')
				}
			: null,
		brandLogo,
		divergence
	};
};
