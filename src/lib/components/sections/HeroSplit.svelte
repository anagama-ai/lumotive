<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import { videoEmbedUrl } from '$lib/video';

	// Keep copy first in both the split desktop layout and the stacked phone layout.
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let heading = $derived(titleCase(section.heading == null ? null : String(section.heading)));
	let visual = $derived(resolveMedia(section.media, media, 1024));
	let embedUrl = $derived(videoEmbedUrl(section.videoUrl));
	// Horizontal crop anchor for the photo (a percentage), for a wide banner
	// whose subject sits at one edge, e.g. `100%` keeps the right edge.
	let mediaAnchor = $derived.by(() => {
		const value = String(section.mediaAnchor ?? '').trim();
		return /^\d{1,3}(\.\d+)?%$/.test(value) ? value : undefined;
	});
	let primaryNewTab = $derived(section.primaryLinkNewTab === true || section.primaryLinkNewTab === 'true');
	let secondaryNewTab = $derived(section.secondaryLinkNewTab === true || section.secondaryLinkNewTab === 'true');
</script>

<section
	class="lumo-section hero-split bg-background relative isolate overflow-hidden"
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={String(section.background ?? 'none')}
	data-width={String(section.width ?? 'contained')}
	data-spacing-top={String(section.spacingTop ?? 'none')}
	data-spacing-bottom={String(section.spacingBottom ?? 'none')}
	data-align={section.align === 'container' ? 'container' : undefined}
	data-peel-cover
>
	<div class="lumo-inner relative z-10">
		<!-- Without media the copy keeps the full column. -->
		<div class={`hero-grid items-center gap-10 lg:gap-14 ${embedUrl || visual ? 'grid lg:grid-cols-12' : ''}`}>
			<Reveal immediate stagger=".hero-copy > *" delay={0.15} class={embedUrl || visual ? 'lg:col-span-5' : ''}>
				<div class="hero-copy">
					{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-5 uppercase">{String(section.eyebrow)}</p>{/if}
					{#if heading}<h1 class="font-display text-display text-ink">{heading}</h1>{/if}
					{#if section.body}<div class="text-lead hero-body text-text mt-6">{@html String(section.body)}</div>{/if}
					{#if (section.primaryLinkLabel && section.primaryLinkUrl) || (section.secondaryLinkLabel && section.secondaryLinkUrl)}
						<div class="mt-9 flex flex-wrap items-center gap-8">
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

			{#if embedUrl || visual}
				<Reveal immediate delay={0.25} y={24} scale={0.985} duration={0.8} class="pb-12 lg:col-span-7 lg:py-16">
					<div class="hero-visual rounded-panel relative overflow-hidden" class:has-video={Boolean(embedUrl)}>
						{#if embedUrl}
							<iframe
								src={embedUrl}
								title={heading || 'Embedded video'}
								class="video-embed"
								loading="lazy"
								allow="autoplay; fullscreen; picture-in-picture"
								allowfullscreen
							></iframe>
						{:else if visual}
							<img
								class="size-full object-cover"
								style:object-position={mediaAnchor ? `${mediaAnchor} 50%` : undefined}
								src={visual.src}
								srcset={visual.srcset}
								sizes="(min-width: 1024px) 40rem, 100vw"
								alt={visual.alt}
								width={visual.width ?? 1200}
								height={visual.height ?? 900}
							/>
						{/if}
					</div>
				</Reveal>
			{/if}
		</div>
	</div>
</section>

<style>
	.hero-copy { padding-block: clamp(4.5rem, 10vw, 9rem); }
	.hero-copy h1 { max-width: 16ch; margin: 0; line-height: 1.05; text-wrap: balance; }
	.hero-body { max-width: 34rem; }
	.hero-body :global(p) { margin: 0; }
	.hero-visual { aspect-ratio: 4 / 3; }
	@media (min-width: 1024px) {
		/* The photo column keeps the band hero's lower bound so a short copy
		   block cannot collapse the stage. */
		.hero-visual { aspect-ratio: 5 / 4; min-height: 24rem; }
	}
	.hero-visual.has-video { aspect-ratio: 16 / 9; min-height: 0; }
	.video-embed { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; }
	.primary-link { display: inline-flex; padding: .75rem 1.75rem; border-radius: 999px; color: white; background: var(--color-ink); font-weight: 650; text-decoration: none; transition: transform 200ms ease, background 200ms ease; }
	.primary-link:hover { transform: translateY(-2px); background: rgb(10 18 38 / 88%); }
	.secondary-link { display: inline-flex; min-height: 2.75rem; align-items: center; color: var(--color-ink); font-weight: 650; text-decoration: none; }
	.secondary-link span { display: inline-block; margin-left: .25rem; transition: transform 200ms ease; }
	.secondary-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.primary-link, .secondary-link span { transition: none; }
		.primary-link:hover, .secondary-link:hover span { transform: none; }
	}
</style>
