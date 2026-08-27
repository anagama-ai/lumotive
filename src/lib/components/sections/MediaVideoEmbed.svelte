<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type Item = { media?: unknown; caption?: unknown };

	let { section, media }: { section: Section; media: MediaMap } = $props();
	let items = $derived((Array.isArray(section.items) ? section.items : []) as Item[]);
	let heading = $derived(titleCase(typeof section.heading === 'string' ? section.heading : null));
	let mode = $derived(
		['image', 'gallery', 'video'].includes(String(section.mode))
			? String(section.mode)
			: section.videoUrl
				? 'video'
				: 'image'
	);

	const videoId = (value: string | null) => (value && /^[A-Za-z0-9_-]+$/.test(value) ? value : null);
	const toEmbedUrl = (value: unknown) => {
		if (!value) return null;
		let url: URL;
		try {
			url = new URL(String(value));
		} catch {
			return null;
		}
		if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
		const host = url.hostname.toLowerCase();
		if (host === 'player.vimeo.com') return /^\/video\/\d+\/?$/.test(url.pathname) ? url.href : null;
		if (host === 'vimeo.com' || host === 'www.vimeo.com') {
			const id = url.pathname.match(/^\/(\d+)\/?$/)?.[1];
			return id ? `https://player.vimeo.com/video/${id}` : null;
		}
		if (host === 'youtube.com' || host === 'www.youtube.com') {
			const embedded = url.pathname.match(/^\/embed\/([^/]+)\/?$/)?.[1];
			if (videoId(embedded ?? null)) return `https://www.youtube.com/embed/${embedded}`;
			const id = url.pathname === '/watch' ? videoId(url.searchParams.get('v')) : null;
			return id ? `https://www.youtube.com/embed/${id}` : null;
		}
		if (host === 'youtu.be') {
			const id = videoId(url.pathname.match(/^\/([^/]+)\/?$/)?.[1] ?? null);
			return id ? `https://www.youtube.com/embed/${id}` : null;
		}
		return null;
	};
	let embedUrl = $derived(mode === 'video' ? toEmbedUrl(section.videoUrl) : null);

	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};
</script>

<section
	class="lumo-section"
	id={section.anchor ? String(section.anchor) : undefined}
	data-design-version={section.designVersion ? String(section.designVersion) : undefined}
	data-background={enumValue(section.background, ['none', 'subtle', 'strong', 'inverse'], 'none')}
	data-width={enumValue(section.width, ['contained', 'wide', 'full'], 'contained')}
	data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'md', 'lg'], 'md')}
	data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'md', 'lg'], 'md')}
>
	<div class="lumo-inner">
		{#if heading || section.intro}
			<Reveal>
				<div class="mx-auto mb-10 max-w-5xl text-center">
					{#if heading}
						<h2 class="text-statement text-ink">
							{#each heading.split('\n') as line, index (index)}{#if index}<br />{/if}{line}{/each}
						</h2>
					{/if}
					{#if section.intro}<p class="text-lead mx-auto mt-4 max-w-3xl">{String(section.intro)}</p>{/if}
				</div>
			</Reveal>
		{/if}

		{#if embedUrl}
			<Reveal>
				<iframe src={embedUrl} title={heading || 'Embedded video'} class="aspect-video w-full overflow-hidden rounded-panel border-0" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
			</Reveal>
		{:else if mode === 'image' && items[0]}
			{@const image = resolveMedia(items[0].media, media, 1440)}
			{#if image}
				<figure>
					<img class="w-full rounded-panel" src={image.src} srcset={image.srcset} sizes="100vw" alt={image.alt} width={image.width ?? 1440} height={image.height ?? 900} />
					{#if items[0].caption}<figcaption class="mt-2 text-sm opacity-65">{String(items[0].caption)}</figcaption>{/if}
				</figure>
			{/if}
		{:else if mode === 'gallery' && items.length}
			<div class="grid gap-6 sm:grid-cols-2">
				{#each items as item, index (index)}
					{@const image = resolveMedia(item.media, media, 1024)}
					{#if image}
						<figure>
							<img class="w-full rounded-panel" src={image.src} srcset={image.srcset} sizes="(min-width: 640px) 50vw, 100vw" alt={image.alt} width={image.width ?? 960} height={image.height ?? 640} />
							{#if item.caption}<figcaption class="mt-2 text-sm opacity-65">{String(item.caption)}</figcaption>{/if}
						</figure>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</section>
