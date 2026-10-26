import { loadMediaMap, resolveMedia } from '$lib/media';
import { mediaValue } from '$lib/sections';
import { getPublicGlobals, readPublicGlobals } from '$lib/server/public-globals';

export async function load({ locals }: { locals: App.Locals }) {
	const pb = locals.pb;
	// Anonymous renders share a short-lived cache of the public globals (one
	// PocketBase request a minute instead of four per render; see
	// `public-globals.ts`). Signed-in editors read live through their own
	// client, so what they just saved, or preview, is never served stale.
	const globals = locals.editor ? await readPublicGlobals(pb) : await getPublicGlobals();
	const { header, footer, code_injection: injection, seo: rawSeo } = globals;
	// Stored globals are free-form JSON; the layout prints these as HTML strings.
	const html = (value: unknown) => (typeof value === 'string' ? value : '');
	const codeInjection = {
		head: html(injection.head),
		bodyStart: html(injection.bodyStart),
		footer: html(injection.footer),
		bodyEnd: html(injection.bodyEnd)
	};
	const defaultOgImage = mediaValue(rawSeo.defaultOgImage);
	const media =
		defaultOgImage?.kind === 'media'
			? await loadMediaMap(pb, [defaultOgImage.value]).catch(() => ({}))
			: {};
	const defaultOgImageUrl = resolveMedia(defaultOgImage, media, 1024)?.src ?? '';

	return {
		header,
		footer,
		codeInjection,
		editor: Boolean(locals.editor),
		seo: { defaultOgImage: defaultOgImage ?? '', defaultOgImageUrl }
	};
}
