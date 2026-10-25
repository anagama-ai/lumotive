<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	let {
		section,
		media,
		band = false
	}: { section: Section; media: MediaMap; band?: boolean } = $props();
	let heading = $derived(titleCase(section.heading == null ? null : String(section.heading)));
	let visual = $derived(resolveMedia(section.media, media, 1440));
	let isVideo = $derived(Boolean(visual && /\.(mp4|webm)(?:$|\?)/i.test(visual.src)));
	let primaryNewTab = $derived(section.primaryLinkNewTab === true || section.primaryLinkNewTab === 'true');
	let secondaryNewTab = $derived(section.secondaryLinkNewTab === true || section.secondaryLinkNewTab === 'true');
	function manageVideo(element: HTMLVideoElement) {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => {
			if (query.matches) element.pause();
			else void element.play().catch(() => undefined);
		};
		sync();
		query.addEventListener('change', sync);
		return () => {
			query.removeEventListener('change', sync);
			element.pause();
		};
	}
</script>

<section
	class="lumo-section hero-shell bg-panel relative isolate z-50 flex items-end overflow-hidden"
	class:band
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={section.background ?? 'none'}
	data-width={section.width ?? 'contained'}
	data-spacing-top={section.spacingTop ?? 'md'}
	data-spacing-bottom={section.spacingBottom ?? 'md'}
	data-align={band ? undefined : 'container'}
	data-peel-cover
>
	{#if visual}
		<Reveal immediate fade={false} y={0} scale={1.06} duration={1.6} class="absolute inset-0">
			<div class="hero-media absolute inset-0" aria-hidden="true">
				{#if isVideo}
					<video
						{@attach manageVideo}
						class="h-full w-full object-cover"
						src={visual.src}
						muted
						loop
						playsinline
						preload="metadata"
					></video>
				{:else}
					<img
						class="h-full w-full object-cover"
						src={visual.src}
						srcset={visual.srcset}
						sizes="100vw"
						alt=""
						width={visual.width ?? 1600}
						height={visual.height ?? 900}
					/>
				{/if}
			</div>
		</Reveal>
	{/if}
	<div class="hero-shade absolute inset-0"></div>
	<div class="lumo-inner relative z-10">
		<Reveal immediate stagger=".hero-copy > *" delay={0.15}>
			<div class="hero-copy max-w-5xl">
				{#if section.eyebrow}
					<p class="text-eyebrow text-brand-amber mb-5 uppercase">{String(section.eyebrow)}</p>
				{/if}
				{#if heading}<h1 class="font-display text-display text-white">{heading}</h1>{/if}
				{#if section.body}<div class="text-lead hero-body mt-6 max-w-xl text-white/75">{@html String(section.body)}</div>{/if}
				{#if (section.primaryLinkLabel && section.primaryLinkUrl) || (section.secondaryLinkLabel && section.secondaryLinkUrl)}
					<div class="hero-actions mt-9 flex flex-wrap items-center gap-8">
						{#if section.primaryLinkLabel && section.primaryLinkUrl}
							<a
								class="primary-link"
								href={String(section.primaryLinkUrl)}
								target={primaryNewTab ? '_blank' : undefined}
								rel={primaryNewTab ? 'noreferrer' : undefined}
							>{String(section.primaryLinkLabel)}</a>
						{/if}
						{#if section.secondaryLinkLabel && section.secondaryLinkUrl}
							<a
								class="secondary-link group"
								href={String(section.secondaryLinkUrl)}
								target={secondaryNewTab ? '_blank' : undefined}
								rel={secondaryNewTab ? 'noreferrer' : undefined}
							>{String(section.secondaryLinkLabel)} <span aria-hidden="true">→</span></a>
						{/if}
					</div>
				{/if}
			</div>
		</Reveal>
	</div>
</section>

<style>
	.hero-shell { min-height: 100svh; }
	.hero-shell.band { min-height: clamp(32rem, 68svh, 47rem); }
	.hero-shade { background: linear-gradient(75deg, rgb(4 13 31 / 96%) 20%, rgb(4 13 31 / 76%) 55%, rgb(6 101 214 / 40%)); }
	.hero-copy { padding-block: clamp(4rem, 9vw, 7rem); }
	.hero-copy h1 { max-width: 13ch; margin: 0; letter-spacing: -.055em; line-height: .9; text-transform: uppercase; text-wrap: balance; }
	.band .hero-copy h1 { max-width: 18ch; text-transform: none; }
	/* 13ch is a two-line measure: it breaks "Programmable Optics" even where the
	   column has room. From the tablet breakpoint up the heading gets a measure
	   wide enough to set on one line; below it the original wrap is unchanged.
	   The `.band` rule above is more specific, so hero bands keep 18ch. */
	@media (min-width: 768px) {
		.hero-copy h1 { max-width: 20ch; }
	}

	/* Hero refinement, full-height variant only (the `.band` hero is untouched).
	   Alignment comes from the shared `data-align="container"` rule in app.css,
	   set on the section above. */
	/* A slightly wider measure so the copy is not boxed in. The heading keeps
	   its own 20ch cap, so "Programmable Optics" still sets on one line. */
	.hero-shell:not(.band) .hero-copy { max-width: 72rem; }
	.hero-shell:not(.band) .hero-body { max-width: 40rem; margin-top: 2rem; }
	.hero-shell:not(.band) .hero-actions { margin-top: 2.75rem; }
	/* The shell is bottom-aligned, so extra bottom padding lifts the block.
	   Section height is unchanged. */
	.hero-shell:not(.band) .hero-copy { padding-bottom: calc(clamp(4rem, 9vw, 7rem) + 1rem); }
	.hero-body :global(p) { margin: 0; }
	.primary-link { display: inline-flex; padding: .75rem 1.75rem; border-radius: 999px; color: var(--color-ink); background: white; font-weight: 650; text-decoration: none; transition: transform 200ms ease, background 200ms ease; }
	.primary-link:hover { transform: translateY(-2px); background: rgb(255 255 255 / 85%); }
	.secondary-link { display: inline-flex; min-height: 2.75rem; align-items: center; color: white; font-weight: 650; text-decoration: none; }
	.secondary-link span { display: inline-block; margin-left: .25rem; transition: transform 200ms ease; }
	.secondary-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.primary-link, .secondary-link span { transition: none; }
		.primary-link:hover, .secondary-link:hover span { transform: none; }
	}
</style>
