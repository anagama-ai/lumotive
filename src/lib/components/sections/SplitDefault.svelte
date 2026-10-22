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
	// Player frame ratio. 16:9 by default; a wider clip (the 21:9 HDR demo on
	// /sense) sets its own so the player is not letterboxed inside the frame.
	let videoAspect = $derived.by(() => {
		const value = String(section.videoAspect ?? '').trim();
		return /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(value) ? value : undefined;
	});
	// `mediaFrame: "panel"`: for a transparent product cut-out. The white panel
	// the photo used to carry in its own background is drawn by the frame
	// instead, from 768px up; on phones the product sits on the page field
	// with no box around it. Unset on every other section.
	let panelFrame = $derived(String(section.mediaFrame ?? '') === 'panel' && !embedUrl);
	// `mediaMaxHeight` (a rem length): from 768px the photograph is capped at
	// that height and contained, so a tall product shot does not stand taller
	// than the copy beside it; the whole product stays visible and a panel
	// frame shrinks with it. Phones keep their own 75% / 50svh limits.
	let mediaMaxHeight = $derived.by(() => {
		const value = String(section.mediaMaxHeight ?? '').trim();
		return /^\d+(\.\d+)?rem$/.test(value) ? value : '';
	});
	// Opt-in, phones only (<768px): 2.5rem above the section's content instead
	// of its `spacingTop`, for a section that opens with its photograph.
	let compactMobile = $derived(section.compactMobile === true || section.compactMobile === 'true');
	// `mediaLayout: "below"`: one column, the copy first and the visual under
	// it at the full container width, for a wide diagram whose own labels
	// would be unreadable in half a row (/sense/automotive's coverage
	// diagram). Unset elsewhere.
	let mediaBelow = $derived(String(section.mediaLayout ?? '') === 'below' && !embedUrl);
	// Alt text for a URL-referenced image, which carries none of its own.
	let mediaAlt = $derived(String(section.mediaAlt ?? '').trim());
	// Phones only: a short line under a "below" diagram that scrolls sideways.
	// The hint is what opts the diagram into scrolling: on phones it keeps a
	// readable 45rem width inside its frame rather than shrinking. A "below"
	// image without a hint (large baked-in labels) fits the phone width.
	let mediaHint = $derived(String(section.mediaHint ?? '').trim());
	let phoneScroll = $derived(mediaBelow && Boolean(mediaHint));
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
	class:compact-mobile={compactMobile}
	class:no-media={variant === 'default' && !embedUrl && !visual}
	class:media-below={mediaBelow}
	class:phone-scroll={phoneScroll}
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={section.background ?? 'none'}
	data-width={section.width ?? 'contained'}
	data-spacing-top={section.spacingTop ?? 'md'}
	data-spacing-bottom={section.spacingBottom ?? 'md'}
	data-align={section.align === 'container' ? 'container' : undefined}
	data-bleed={variant === 'peelBleed' && section.bleed === 'compact' ? 'compact' : undefined}
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
						<!-- A "below" diagram scrolls sideways on phones; a scrollable region must be keyboard-focusable (WCAG 2.1.1), which is what the tabindex is for. -->
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<div class="art-frame" class:panel-frame={panelFrame} class:media-capped={Boolean(mediaMaxHeight) && !embedUrl} style:--art-max-height={mediaMaxHeight || undefined} role={phoneScroll ? 'region' : undefined} aria-label={phoneScroll ? heading || undefined : undefined} tabindex={phoneScroll ? 0 : undefined}>
							{#if embedUrl}
								<iframe
									src={embedUrl}
									title={heading || 'Embedded video'}
									class="video-embed"
									style:aspect-ratio={videoAspect}
									loading="lazy"
									allow="autoplay; fullscreen; picture-in-picture"
									allowfullscreen
								></iframe>
							{:else if visual?.isVideo}
								<video {@attach honorReducedMotion} src={visual.src} autoplay loop muted playsinline aria-label={visual.alt || undefined}></video>
							{:else if visual}
								<img src={visual.src} srcset={visual.srcset} sizes={mediaBelow ? '(min-width: 1312px) 1280px, 100vw' : '(min-width: 768px) 50vw, 100vw'} alt={mediaAlt || visual.alt} width={visual.width ?? 960} height={visual.height ?? 720} />
							{/if}
						</div>
						{#if phoneScroll}<p class="swipe-hint">{mediaHint}</p>{/if}
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
	@media (min-width: 768px) {
		.panel-frame { background: var(--color-surface); }
	}
	@media (min-width: 768px) {
		.media-capped img { max-height: var(--art-max-height); object-fit: contain; }
	}
	@media (max-width: 767px) {
		.compact-mobile > .lumo-inner { padding-top: 2.5rem; }
	}
	/* Deep Laser Blue on light: at the eyebrow's 12px, Laser Blue measures
	   4.15:1 on the page field, under the 4.5:1 floor. Dark variants below
	   keep their own colours, which are measured against the navy panel. */
	.split-eyebrow { margin: 0 0 1.25rem; color: var(--color-brand-blue-dark); }
	h2 { margin: 0; color: var(--color-ink); text-wrap: balance; }
	/* Slate Text, not Muted Slate: the body is the section's reading copy and
	   muted measured 3.34:1 on the page field. */
	.split-body { margin-top: 1.25rem; color: var(--color-text); }
	.split-body :global(p:first-child) { margin-top: 0; }
	.split-body :global(p:last-child) { margin-bottom: 0; }
	/* A split body may carry a bullet list where the package prints one; the
	   global stylesheet only styles lists inside `.prose`. */
	.split-body :global(ul) { margin: 1rem 0 0; padding-left: 1.15rem; list-style: disc; }
	.split-body :global(li) { margin-top: .4rem; }
	.split-body :global(li::marker) { color: var(--color-muted); }
	.split-link { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .5rem; margin-top: 1.75rem; color: var(--color-brand-blue-dark); font-weight: 650; text-decoration: none; }
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
	/* `mediaLayout: "below"`: copy at the reading measure, the visual under it
	   at the container width. With `mediaMaxHeight` the image keeps its own
	   proportions at that height, left-aligned, and the frame hugs it. Phones:
	   full width, or (with a hint) a readable 45rem-wide diagram that scrolls
	   sideways in its frame (keyboard-focusable), never cropped. */
	.media-below .split-layout { grid-template-columns: 1fr; gap: 2.5rem; }
	.media-below .art-column { order: 2; }
	.media-below .copy-column { order: 1; max-width: 48rem; }
	.media-below .art-frame:focus-visible { outline: 2px solid var(--color-brand-blue-dark); outline-offset: 3px; }
	@media (min-width: 768px) {
		.media-below .media-capped { width: fit-content; max-width: 100%; }
		.media-below .media-capped img { width: auto; max-width: 100%; }
	}
	@media (max-width: 767px) {
		.media-below .art-frame img { width: 100%; max-width: 100%; max-height: none; margin: 0; }
		.phone-scroll .art-frame { overflow-x: auto; overscroll-behavior-x: contain; }
		.phone-scroll .art-frame img { width: 45rem; max-width: none; }
	}
	/* Slate Text at the spec size (≥ 4.5:1 on the page field), phones only. */
	.swipe-hint { display: none; margin: .75rem 0 0; color: var(--color-text); font-size: var(--text-spec); }
	@media (max-width: 767px) {
		.swipe-hint { display: block; }
	}
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
	/* Opt-in compact peel bleed. The full 100svh band leaves a lot of dead
	   space around a short copy column, and the standard shade darkens the
	   bleed image until it reads as empty rather than as art. This trims the
	   band and lets more of the image through on the open side, while keeping
	   the copy side at the same 96% opacity so text contrast is unchanged.
	   The pin window the peel scene scrolls through is driven by section
	   height, so it follows the shorter band automatically. */
	.peel-bleed[data-bleed='compact'] { min-height: 80svh; }
	.peel-bleed[data-bleed='compact'] .lumo-inner { min-height: 80svh; }
	.peel-bleed[data-bleed='compact'] .bleed-shade { background: linear-gradient(90deg, rgb(4 13 31 / 96%), rgb(4 13 31 / 66%), rgb(4 13 31 / 20%)); }
	.peel-bleed[data-bleed='compact'].media-right .bleed-shade { background: linear-gradient(-90deg, rgb(4 13 31 / 96%), rgb(4 13 31 / 66%), rgb(4 13 31 / 20%)); }
	@media (max-width: 767px) {
		/* Mobile keeps the taller band: the copy stacks over the full width, so
		   the shade must stay heavy and the height must fit the text. */
		.peel-bleed[data-bleed='compact'], .peel-bleed[data-bleed='compact'] .lumo-inner { min-height: 100svh; }
		.peel-bleed[data-bleed='compact'] .bleed-shade { background: linear-gradient(90deg, rgb(4 13 31 / 96%), rgb(4 13 31 / 86%), rgb(4 13 31 / 72%)); }
	}
	@media (max-width: 767px) {
		.split-layout { grid-template-columns: 1fr; }
		.art-frame img { width: auto; max-width: 75%; max-height: 50svh; margin-inline: auto; }
		.media-right .art-column, .media-right .copy-column { order: initial; }
		.peel-bleed.media-right .copy-column { margin-left: 0; }
	}
	@media (prefers-reduced-motion: reduce) {
		.split-link span { transition: none; }
		.split-link:hover span { transform: none; }
	}
</style>
