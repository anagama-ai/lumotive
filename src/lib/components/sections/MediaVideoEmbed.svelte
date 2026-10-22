<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import { videoEmbedUrl } from '$lib/video';

	// `videos` mode: two or more embedded players side by side, each with its
	// own title and action, for a section the package prints as a video pair.
	// The player shows its poster frame and plays on click; nothing autoplays.
	//
	// `interactive` mode: a self-hosted interactive page (the LCM explorer)
	// behind a 16:9 poster, per package page 03. Nothing loads until the
	// visitor asks: the button swaps the poster for the iframe, and the
	// full-screen link opens the page on its own in a new tab.
	type Item = { media?: unknown; caption?: unknown; videoUrl?: unknown; title?: unknown; linkLabel?: unknown; linkUrl?: unknown };

	let { section, media }: { section: Section; media: MediaMap } = $props();
	let items = $derived((Array.isArray(section.items) ? section.items : []) as Item[]);
	let heading = $derived(titleCase(typeof section.heading === 'string' ? section.heading : null));
	let mode = $derived(
		['image', 'gallery', 'video', 'videos', 'interactive'].includes(String(section.mode))
			? String(section.mode)
			: section.videoUrl
				? 'video'
				: 'image'
	);
	let embedUrl = $derived(mode === 'video' ? videoEmbedUrl(section.videoUrl) : null);
	// Same-origin paths only: the frame is for files this site hosts, never an
	// arbitrary page an editor pastes in.
	let interactiveSrc = $derived.by(() => {
		const path = String(section.embedUrl ?? '').trim();
		return mode === 'interactive' && /^\/(?![/\\])[^\s"'<>\\]*$/.test(path) ? path : null;
	});
	let poster = $derived(mode === 'interactive' ? resolveMedia(section.media, media, 1440) : null);
	let fullScreen = $derived.by(() => {
		const href = String(section.linkUrl ?? '').trim();
		const label = String(section.linkLabel ?? '').trim();
		return href && label ? { href, label } : null;
	});
	let launched = $state(false);
	let launchLabel = $derived(String(section.launchLabel ?? '').trim() || 'Launch');
	// Phones (<768px) open the page itself in a new tab: in a frame that
	// narrow, the explorer's own captions overlap its timeline.
	let launchHref = $derived(fullScreen?.href ?? interactiveSrc);
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
		{#if mode === 'videos' || mode === 'interactive'}
			{#if section.eyebrow || heading || section.intro}
				<Reveal><div class="max-w-4xl" class:mb-12={mode === 'videos'} class:mb-10={mode === 'interactive'}>
					{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
					<!-- Interactive mode sits among split sections, so it takes their heading size. -->
					{#if heading}<h2 class="font-display text-ink" class:text-statement={mode === 'videos'} class:text-heading={mode === 'interactive'}>{heading}</h2>{/if}
					{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
				</div></Reveal>
			{/if}
		{/if}
		{#if mode === 'interactive'}
			{#if interactiveSrc}
				<Reveal>
					<div class="interactive-frame rounded-panel bg-panel relative aspect-video w-full overflow-hidden">
						{#if launched}
							<iframe {@attach (frame) => frame.focus({ preventScroll: true })} class="absolute inset-0 h-full w-full border-0" src={interactiveSrc} title={String(section.embedTitle ?? '').trim() || heading || 'Interactive embed'} allow="fullscreen" allowfullscreen></iframe>
						{:else}
							{#if poster}<img class="absolute inset-0 h-full w-full object-cover" src={poster.src} srcset={poster.srcset} sizes="(min-width: 1312px) 1280px, calc(100vw - 2rem)" alt="" width={poster.width ?? 1280} height={poster.height ?? 720} />{/if}
							<!-- Lower edge, not centre: the supplied poster carries its own centred title. -->
							<div class="launch-bar absolute inset-x-0 bottom-0 flex justify-center">
								<button type="button" class="launch-button launch-inline" onclick={() => (launched = true)}>{launchLabel}</button>
								<a class="launch-button launch-tab" href={launchHref} target="_blank" rel="noreferrer">{launchLabel}<span class="sr-only"> (opens in a new tab)</span><svg aria-hidden="true" viewBox="0 0 16 16" class="size-4" fill="none"><path d="M9 3h4v4M13 3 7.5 8.5M11 9.5V13H3V5h3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></a>
							</div>
						{/if}
					</div>
				</Reveal>
				{#if fullScreen}
					<a class="fullscreen-link" href={fullScreen.href} target="_blank" rel="noreferrer">{fullScreen.label} <span aria-hidden="true">→</span></a>
				{/if}
			{/if}
		{:else if mode === 'videos'}
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
	.launch-bar { padding: clamp(.75rem, 4%, 2.5rem); }
	/* Same pill as the section actions elsewhere ("See all applications"). */
	.launch-button { display: inline-flex; min-height: 3rem; align-items: center; justify-content: center; padding: .75rem 1.75rem; border: 0; border-radius: 999px; color: #fff; background: var(--color-primary); font-weight: 650; cursor: pointer; box-shadow: var(--shadow-card); transition: background 180ms ease, transform 180ms ease; }
	.launch-button:hover { background: var(--color-primary-hover); transform: translateY(-2px); }
	.launch-button:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
	/* A link pill: the global anchor colour must not win. Narrower sides so
	   label and icon stay on one line in a 360px phone's poster. */
	.launch-tab { gap: .5rem; padding-inline: 1.25rem; color: #fff; text-decoration: none; }
	.launch-inline { display: none; }
	@media (min-width: 768px) {
		.launch-inline { display: inline-flex; }
		.launch-tab { display: none; }
	}
	/* Deep Laser Blue, as the split sections' links: Laser Blue is 4.15:1 here. */
	.fullscreen-link { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .5rem; margin-top: 1rem; color: var(--color-brand-blue-dark); font-weight: 650; text-decoration: none; }
	.fullscreen-link span { transition: transform 200ms ease; }
	.fullscreen-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.launch-button, .fullscreen-link span { transition: none; }
		.launch-button:hover, .fullscreen-link:hover span { transform: none; }
	}
</style>
