import { ClientResponseError } from 'pocketbase';
import { loadMediaMap, resolveMedia } from '$lib/media';
import { mediaValue } from '$lib/sections';

const emptyGlobals = {
	header: {},
	footer: {},
	code_injection: {},
	seo: {}
};

export async function load({ locals }: { locals: App.Locals }) {
	const pb = locals.pb;
	const getGlobal = async (key: keyof typeof emptyGlobals) => {
		for (let attempt = 0; ; attempt += 1) {
			try {
				return (
					await pb.collection('globals').getFirstListItem(pb.filter('key = {:key}', { key }))
				).data ?? {};
			} catch (error) {
				if (error instanceof ClientResponseError && error.status === 404) {
					return emptyGlobals[key];
				}
				// Retry one transient failure, then fail visibly rather than serve a broken-looking site.
				if (attempt === 0) {
					console.warn('Failed to read public global; retrying once', { key, error });
					continue;
				}
				console.error('Failed to read public global after retry', { key, error });
				throw error;
			}
		}
	};

	const [header, footer, codeInjection, rawSeo] = await Promise.all([
		getGlobal('header'),
		getGlobal('footer'),
		getGlobal('code_injection'),
		getGlobal('seo')
	]);
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
