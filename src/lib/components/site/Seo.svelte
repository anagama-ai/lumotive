<script lang="ts">
	import { page } from '$app/state';

	let {
		title,
		twitterTitle = title,
		description = '',
		image = '',
		canonical = '',
		noindex = false
	}: {
		title: string;
		twitterTitle?: string;
		description?: string;
		image?: string;
		canonical?: string;
		noindex?: boolean;
	} = $props();
	let ogImage = $derived(image.startsWith('/') ? `${page.url.origin}${image}` : image);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if ogImage}<meta property="og:image" content={ogImage} />{/if}
	<meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={twitterTitle} />
	{#if description}<meta name="twitter:description" content={description} />{/if}
	{#if ogImage}<meta name="twitter:image" content={ogImage} />{/if}
	{#if canonical}<link rel="canonical" href={canonical} />{/if}
	{#if noindex}<meta name="robots" content="noindex" />{/if}
</svelte:head>
