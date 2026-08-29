<script lang="ts">
	import { page as route } from '$app/state';
	import { getContext } from 'svelte';
	import Sections from '$lib/components/sections/Sections.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import { resolveMedia } from '$lib/media';

	let { data, form } = $props();
	const preview = getContext<{
		readonly value: { path: string; page: typeof data.page } | null;
	}>('page-preview');
	let renderedPage = $derived(
		preview?.value?.path === route.url.pathname ? preview.value.page : data.page
	);
	let socialImage = $derived(
		resolveMedia(renderedPage.ogImage, data.media, 1024)?.src || data.seo.defaultOgImageUrl
	);
</script>

<Seo
	title={renderedPage.seoTitle || renderedPage.title}
	description={renderedPage.seoDescription}
	image={socialImage}
	canonical={`${route.url.origin}${route.url.pathname === '/' ? '' : route.url.pathname}`}
	noindex={renderedPage.noindex}
/>

<Sections sections={renderedPage.sections} media={data.media} forms={data.forms} result={form} />
