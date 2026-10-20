<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import { videoEmbedUrl } from '$lib/video';

	// `videos` mode: two or more embedded players side by side, each with its
	// own title and action, for a section the package prints as a video pair.
	// The player shows its poster frame and plays on click; nothing autoplays.
	type Item = { media?: unknown; caption?: unknown; videoUrl?: unknown; title?: unknown; linkLabel?: unknown; linkUrl?: unknown };

	let { section, media }: { section: Section; media: MediaMap } = $props();
	let items = $derived((Array.isArray(section.items) ? section.items : []) as Item[]);
	let heading = $derived(titleCase(typeof section.heading === 'string' ? section.heading : null));
	let mode = $derived(
		['image', 'gallery', 'video', 'videos'].includes(String(section.mode))
			? String(section.mode)
			: section.videoUrl
				? 'video'
				: 'image'
	);
	let embedUrl = $derived(mode === 'video' ? videoEmbedUrl(section.videoUrl) : null);
	let players = $derived(
		mode === 'videos'
			? items.flatMap((item) => {
					const src = videoEmbedUrl(item.videoUrl);
					if (!src) return [];
					const href = String(item.linkUrl ?? '').trim();
					const label = String(item.linkLabel ?? '').trim();
					return [{ src, title: String(item.title ?? '').trim(), link: href && label ? { href, label } : null }];
				})
			: []
	);

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
	data-align={section.align === 'container' ? 'container' : undefined}
>
	<div class="lumo-inner">
		{#if mode === 'videos'}
			{#if section.eyebrow || heading || section.intro}
				<Reveal><div class="mb-12 max-w-4xl">
					{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
					{#if heading}<h2 class="font-display text-statement text-ink">{heading}</h2>{/if}
					{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
				</div></Reveal>
			{/if}
			{#if players.length}
				<Reveal stagger class="grid gap-6 md:grid-cols-2">
					{#each players as player, index (index)}
						<article class="rounded-card bg-surface flex flex-col overflow-hidden">
							<iframe class="aspect-video w-full border-0" src={player.src} title={player.title || heading || 'Embedded video'} loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>
							<div class="flex flex-1 flex-col p-6 md:p-8">
								<!-- Printed exactly: the package sets these titles in sentence case. -->
								{#if player.title}<h3 class="font-display text-subheading text-ink m-0">{player.title}</h3>{/if}
								{#if player.link}
									<a class="video-link group text-brand-blue mt-auto self-start pt-4 font-medium" href={player.link.href}>{player.link.label}<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg></a>
								{/if}
							</div>
						</article>
					{/each}
				</Reveal>
			{/if}
		{:else}
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
		{/if}
	</div>
</section>

<style>
	/* Scoped, because a bare colour utility loses to the global anchor colour. */
	.video-link { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .5rem; color: var(--color-brand-blue); text-decoration: none; transition: color 180ms ease; }
	.video-link:hover { color: var(--color-brand-blue-dark); }
</style>
