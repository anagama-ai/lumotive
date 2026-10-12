<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	// The approved page-07 hero: copy on the left, the chip photo on the right,
	// rather than the full-bleed background the band hero paints. The type, the
	// amber eyebrow, the white pill and the arrow link are the staging hero's,
	// so only the arrangement differs.
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let heading = $derived(titleCase(section.heading == null ? null : String(section.heading)));
	let visual = $derived(resolveMedia(section.media, media, 1024));
	let primaryNewTab = $derived(section.primaryLinkNewTab === true || section.primaryLinkNewTab === 'true');
	let secondaryNewTab = $derived(section.secondaryLinkNewTab === true || section.secondaryLinkNewTab === 'true');
</script>

<section
	class="lumo-section hero-split bg-panel relative isolate overflow-hidden"
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={String(section.background ?? 'none')}
	data-width={String(section.width ?? 'contained')}
	data-spacing-top={String(section.spacingTop ?? 'none')}
	data-spacing-bottom={String(section.spacingBottom ?? 'none')}
	data-align={section.align === 'container' ? 'container' : undefined}
	data-peel-cover
>
	<div class="lumo-inner relative z-10">
		<!-- Without the photo the copy keeps the full column instead of holding a
		     half-width gap open beside itself. -->
		<div class={`hero-grid items-center gap-10 lg:gap-16 ${visual ? 'grid lg:grid-cols-2' : ''}`}>
			<Reveal immediate stagger=".hero-copy > *" delay={0.15}>
				<div class="hero-copy">
					{#if section.eyebrow}<p class="text-eyebrow text-brand-amber mb-5 uppercase">{String(section.eyebrow)}</p>{/if}
					{#if heading}<h1 class="font-display text-display text-white">{heading}</h1>{/if}
					{#if section.body}<div class="text-lead hero-body mt-6 text-white/75">{@html String(section.body)}</div>{/if}
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

			{#if visual}
				<Reveal immediate delay={0.25} y={24} scale={0.985} duration={1.1}>
					<div class="hero-visual rounded-panel relative overflow-hidden">
						<img
							class="size-full object-contain"
							src={visual.src}
							srcset={visual.srcset}
							sizes="(min-width: 1024px) 40rem, 100vw"
							alt={visual.alt}
							width={visual.width ?? 1200}
							height={visual.height ?? 900}
						/>
					</div>
				</Reveal>
			{/if}
		</div>
	</div>
</section>

<style>
	.hero-copy { padding-block: clamp(3.5rem, 7vw, 6rem); }
	.hero-copy h1 { max-width: 16ch; margin: 0; letter-spacing: -.045em; line-height: .95; text-wrap: balance; }
	.hero-body { max-width: 34rem; }
	.hero-body :global(p) { margin: 0; }
	.hero-visual { aspect-ratio: 4 / 3; }
	@media (min-width: 1024px) {
		/* The photo column keeps the band hero's lower bound so a short copy
		   block cannot collapse the stage. */
		.hero-visual { aspect-ratio: 5 / 4; min-height: 24rem; }
	}
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
