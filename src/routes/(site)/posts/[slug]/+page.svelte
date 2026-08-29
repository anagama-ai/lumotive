<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/site/Seo.svelte';
	import Prose from '$lib/components/sections/Prose.svelte';

	let { data } = $props();
	let coverImage = $derived(
		data.post.coverImage?.kind === 'url' && typeof data.post.coverImage.value === 'string'
			? data.post.coverImage.value
			: ''
	);
	const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });
</script>

<Seo
	title={`${data.post.title} | Lumotive`}
	twitterTitle={data.post.title}
	description={data.post.excerpt}
	image={coverImage}
	canonical={`${page.url.origin}${page.url.pathname}`}
/>

<article>
	<header class="bg-panel relative isolate overflow-hidden text-white">
		<div aria-hidden="true" class="bg-metasurface mask-hero-dots absolute inset-0"></div>
		<div aria-hidden="true" class="from-panel via-panel/95 to-brand-blue/35 absolute inset-0 bg-linear-75"></div>
		<div class="max-w-shell relative mx-auto px-4 py-14 md:px-7 md:py-20">
			<a class="back-link" href="/news">← All news</a>
			{#if data.post.publishedAt}
				<time class="text-spec text-white/65" datetime={data.post.publishedAt}>
					{dateFormat.format(new Date(data.post.publishedAt.replace(' ', 'T')))}
				</time>
			{/if}
			<h1 class="font-display text-statement mt-5 max-w-5xl text-balance">{data.post.title}</h1>
			{#if data.post.excerpt}<p class="text-lead mt-6 max-w-3xl text-white/75">{data.post.excerpt}</p>{/if}
			{#if data.post.source}
				<a
					class="source-link"
					href={data.post.source.href}
					rel="noopener noreferrer"
					target="_blank"
				>
					Read the original article at {data.post.source.hostname} ↗
				</a>
			{/if}
		</div>
	</header>

	{#if coverImage}
		<div class="max-w-shell mx-auto px-4 pt-12 md:px-7 md:pt-20">
			<div class="cover">
				<img src={coverImage} alt="" width="1216" height="684" />
			</div>
		</div>
	{/if}
	<Prose section={{ id: `news-${data.post.slug}`, type: 'prose', html: data.post.body }} />
</article>

<style>
	.back-link { display: block; margin-bottom: 2.5rem; color: rgb(255 255 255 / .75); font-weight: 600; text-decoration: none; }
	time { display: block; }
	.source-link { display: inline-flex; margin-top: 2rem; border-radius: var(--radius-button); padding: .8rem 1.2rem; color: var(--color-ink); background: var(--color-brand-amber); font-weight: 600; text-decoration: none; }
	.cover { overflow: hidden; border-radius: var(--radius-card); background: var(--color-surface); }
	.cover img { width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; }
</style>
