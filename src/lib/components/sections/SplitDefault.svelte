<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import { honorReducedMotion } from '$lib/motion';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import { videoEmbedUrl } from '$lib/video';

	type Variant = 'default' | 'darkPanel' | 'peelBleed' | 'stackedCard';
	let {
		section,
		media,
		variant = 'default'
	}: { section: Section; media: MediaMap; variant?: Variant } = $props();
	let heading = $derived(titleCase(section.heading == null ? null : String(section.heading)));
	let visual = $derived(resolveMedia(section.media, media, 1024));
	let mediaRight = $derived(String(section.mediaPosition || 'left') === 'right');
	let linkNewTab = $derived(section.linkNewTab === true || section.linkNewTab === 'true');
	// A `videoUrl` turns the art column into a real player: same frame, same
	// radius, same column proportions as the image it replaces.
	let embedUrl = $derived(videoEmbedUrl(section.videoUrl));
</script>

{#snippet copy()}
	{#if section.eyebrow}<p class="text-eyebrow split-eyebrow uppercase">{String(section.eyebrow)}</p>{/if}
	{#if heading}<h2 class="font-display text-heading">{heading}</h2>{/if}
	{#if section.body}<div class="text-lead split-body">{@html String(section.body)}</div>{/if}
	{#if section.linkLabel && section.linkUrl}
		<a
			class="split-link"
			href={String(section.linkUrl)}
			target={linkNewTab ? '_blank' : undefined}
			rel={linkNewTab ? 'noreferrer' : undefined}
		>{String(section.linkLabel)} <span aria-hidden="true">→</span></a>
	{/if}
{/snippet}

<section
	class="lumo-section split-section"
	class:dark-panel={variant === 'darkPanel'}
	class:peel-bleed={variant === 'peelBleed'}
	class:stacked-card={variant === 'stackedCard'}
	class:media-right={mediaRight}
	class:no-media={variant === 'default' && !embedUrl && !visual}
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={section.background ?? 'none'}
	data-width={section.width ?? 'contained'}
	data-spacing-top={section.spacingTop ?? 'md'}
	data-spacing-bottom={section.spacingBottom ?? 'md'}
>
	{#if variant === 'peelBleed' && visual}
		<div class="bleed-media absolute inset-0" aria-hidden="true">
			{#if visual.isVideo}
				<video {@attach honorReducedMotion} class="h-full w-full object-cover" src={visual.src} autoplay loop muted playsinline></video>
			{:else}
				<img class="h-full w-full object-cover" src={visual.src} srcset={visual.srcset} sizes="100vw" alt="" width={visual.width ?? 1600} height={visual.height ?? 900} />
			{/if}
		</div>
		<div class="bleed-shade absolute inset-0"></div>
	{/if}
	<div class="lumo-inner relative z-10">
		<div class="split-layout" class:has-bleed={variant === 'peelBleed'}>
			{#if variant !== 'peelBleed' && (embedUrl || visual)}
				<div class="art-column">
					<Reveal x={mediaRight ? 24 : -24} y={12} duration={1.1}>
						<div class="art-frame">
							{#if embedUrl}
								<iframe
									src={embedUrl}
									title={heading || 'Embedded video'}
									class="video-embed"
									loading="lazy"
									allow="autoplay; fullscreen; picture-in-picture"
									allowfullscreen
								></iframe>
							{:else if visual?.isVideo}
								<video {@attach honorReducedMotion} src={visual.src} autoplay loop muted playsinline aria-label={visual.alt || undefined}></video>
							{:else if visual}
								<img src={visual.src} srcset={visual.srcset} sizes="(min-width: 768px) 50vw, 100vw" alt={visual.alt} width={visual.width ?? 960} height={visual.height ?? 720} />
							{/if}
						</div>
					</Reveal>
				</div>
			{/if}
			<div class="copy-column" data-peel={variant === 'peelBleed' ? 'rise-each' : undefined}>
				{#if variant === 'peelBleed'}
					{@render copy()}
				{:else}
					<Reveal stagger delay={0.12}>{@render copy()}</Reveal>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.split-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: clamp(2.5rem, 6vw, 5rem); }
	.art-column { min-width: 0; }
	.media-right .art-column { order: 2; }
	.media-right .copy-column { order: 1; }
	.art-frame { overflow: hidden; border-radius: var(--radius-card); }
	.art-frame img, .art-frame video { display: block; width: 100%; height: auto; }
	.video-embed { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; }
	.split-eyebrow { margin: 0 0 1.25rem; color: var(--color-brand-blue); }
	h2 { margin: 0; color: var(--color-ink); text-wrap: balance; }
	.split-body { margin-top: 1.25rem; color: var(--color-muted); }
	.split-body :global(p:first-child) { margin-top: 0; }
	.split-body :global(p:last-child) { margin-bottom: 0; }
	.split-link { display: inline-flex; gap: .5rem; margin-top: 1.75rem; color: var(--color-brand-blue); font-weight: 650; text-decoration: none; }
	.split-link span { transition: transform 200ms ease; }
	.split-link:hover span { transform: translateX(.25rem); }
	/* First use of a pull quote in a split body: the approved page sets the
	   quote above its attribution, so the quote reads as the larger line. */
	.split-body :global(blockquote) { margin: 1.75rem 0 0; padding-left: 1.25rem; border-left: 2px solid var(--color-brand-blue); }
	.split-body :global(blockquote p:first-child) { color: var(--color-ink); font-family: var(--font-display); font-size: var(--text-subheading); line-height: 1.25; }
	.split-body :global(blockquote p:last-child) { margin-bottom: 0; font-size: var(--text-spec); }
	.dark-panel .split-body :global(blockquote p:first-child), .peel-bleed .split-body :global(blockquote p:first-child) { color: white; }
	/* A default split whose art column is absent would otherwise leave half the
	   grid empty. One column, held to the same reading measure the peel variant
	   already uses. Only the default variant: darkPanel keeps its two-column
	   frame, and stackedCard is single-column already. */
	.no-media .split-layout { grid-template-columns: 1fr; }
	.no-media .copy-column { max-width: 48rem; }
	.dark-panel .split-layout, .stacked-card .split-layout { padding: clamp(2rem, 5vw, 4rem); border-radius: var(--radius-panel); }
	.dark-panel .split-layout { color: white; background: var(--color-panel); }
	.dark-panel h2, .peel-bleed h2 { color: white; }
	.dark-panel .split-eyebrow, .peel-bleed .split-eyebrow { color: rgb(255 255 255 / 70%); }
	.dark-panel .split-body, .peel-bleed .split-body { color: rgb(255 255 255 / 72%); }
	.dark-panel .split-link, .peel-bleed .split-link { color: white; }
	.dark-panel .art-frame { border-radius: 0; }
	.stacked-card .split-layout { grid-template-columns: 1fr; gap: 2rem; background: var(--color-surface); box-shadow: var(--shadow-card); }
	.stacked-card .art-column, .stacked-card .copy-column { order: initial; }
	.stacked-card .art-frame img, .stacked-card .art-frame video { max-height: 31rem; object-fit: contain; }
	.peel-bleed { min-height: 100svh; color: white; background: var(--color-panel); overflow: hidden; }
	.peel-bleed .lumo-inner { display: flex; min-height: 100svh; align-items: center; }
	.peel-bleed .split-layout { display: block; width: 100%; }
	.peel-bleed .copy-column { max-width: 48rem; }
	.peel-bleed.media-right .copy-column { margin-left: auto; }
	.bleed-shade { background: linear-gradient(90deg, rgb(4 13 31 / 96%), rgb(4 13 31 / 74%), rgb(4 13 31 / 38%)); }
	.peel-bleed.media-right .bleed-shade { background: linear-gradient(-90deg, rgb(4 13 31 / 96%), rgb(4 13 31 / 74%), rgb(4 13 31 / 38%)); }
	@media (max-width: 767px) {
		.split-layout { grid-template-columns: 1fr; }
		.media-right .art-column, .media-right .copy-column { order: initial; }
		.peel-bleed.media-right .copy-column { margin-left: 0; }
	}
	@media (prefers-reduced-motion: reduce) {
		.split-link span { transition: none; }
		.split-link:hover span { transform: none; }
	}
</style>
