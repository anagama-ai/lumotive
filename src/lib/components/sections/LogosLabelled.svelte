<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap, type ResolvedImage } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type Logo = { image: ResolvedImage; name: string; linkLabel: string; linkUrl: string; newTab: boolean };
	let {
		section,
		media,
		dark = false
	}: { section: Section; media: MediaMap; dark?: boolean } = $props();
	let heading = $derived(titleCase(section.heading == null ? null : String(section.heading)));
	// `layout: "centered"` wraps the marks in a centred row instead of a fixed
	// column grid, for a set whose count does not divide evenly and would
	// otherwise leave a hole at the end of its last row. Opt-in per section, so
	// every existing logo strip keeps the grid it has.
	let centered = $derived(String(section.layout ?? '') === 'centered');
	// How many marks a centred row holds before it wraps. Unset keeps the five
	// the investor panel uses; a strip of seven asks for four, so it sets four
	// and three rather than six and a stray.
	let columns = $derived(/^[2-6]$/.test(String(section.columns ?? '')) ? String(section.columns) : '');
	let logos = $derived(
		(Array.isArray(section.logos) ? section.logos : []).flatMap((raw): Logo[] => {
			if (!raw || typeof raw !== 'object') return [];
			const row = raw as Record<string, unknown>;
			const image = resolveMedia(row.media, media, 640);
			return image
				? [{
						image,
						name: String(row.name || ''),
						linkLabel: String(row.linkLabel || ''),
						linkUrl: String(row.linkUrl || ''),
						newTab: row.linkNewTab === true || row.linkNewTab === 'true'
					}]
				: [];
		})
	);
</script>

{#snippet logoList()}
	<ul class:centered style:--logo-cols={columns || undefined}>
		{#each logos as logo, index (index)}
			<li>
				{#if logo.linkUrl}
					<a
						href={logo.linkUrl}
						aria-label={logo.linkLabel || logo.name}
						target={logo.newTab ? '_blank' : undefined}
						rel={logo.newTab ? 'noreferrer' : undefined}
					>
						<img src={logo.image.src} srcset={logo.image.srcset} sizes="12rem" alt={logo.name} width={logo.image.width ?? 240} height={logo.image.height ?? 100} />
					</a>
				{:else}
					<div class="logo-item">
						<img src={logo.image.src} srcset={logo.image.srcset} sizes="12rem" alt={logo.name} width={logo.image.width ?? 240} height={logo.image.height ?? 100} />
					</div>
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{#if logos.length}
	<section
		class="lumo-section logo-grid-section"
		class:dark
		id={section.anchor ? String(section.anchor) : undefined}
		data-background={section.background ?? 'none'}
		data-width={section.width ?? 'contained'}
		data-spacing-top={section.spacingTop ?? 'md'}
		data-spacing-bottom={section.spacingBottom ?? 'md'}
		data-align={section.align === 'container' ? 'container' : undefined}
	>
		<div class="lumo-inner">
			{#if dark}
				<Reveal delay={0} stagger="ul > *">
					<div class="logo-panel">
						{#if heading}<h2 class="font-display text-heading">{heading}</h2>{/if}
						{#if section.intro}<p class="text-lead intro">{String(section.intro)}</p>{/if}
						{@render logoList()}
					</div>
				</Reveal>
			{:else}
				{#if heading || section.intro}
					<Reveal delay={0}>
						<div class="heading-block">
							{#if heading}<h2 class="font-display text-statement">{heading}</h2>{/if}
							{#if section.intro}<p class="text-lead intro">{String(section.intro)}</p>{/if}
						</div>
					</Reveal>
				{/if}
				<Reveal delay={0} stagger="ul > *">
					<div class="logo-panel">{@render logoList()}</div>
				</Reveal>
			{/if}
		</div>
	</section>
{/if}

<style>
	.logo-panel { padding: clamp(2rem, 5vw, 3.5rem); border-radius: var(--radius-panel); background: var(--color-surface); }
	h2 { margin: 0; color: var(--color-ink); }
	.heading-block { max-width: 56rem; margin-bottom: 3rem; }
	/* Slate Text, not Muted Slate: at the lead size the muted token measures
	   3.34:1 on the page field, under the 4.5:1 floor. The dark panel keeps its
	   own white-at-70%, which clears it. */
	.intro { max-width: 48rem; margin: .75rem 0 0; color: var(--color-text); }
	ul { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: stretch; gap: 2rem; margin: 0; padding: 0; list-style: none; }
	li, li a, .logo-item { min-width: 0; }
	li a, .logo-item { display: flex; height: 100%; min-height: 7.5rem; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--color-ink); text-align: center; text-decoration: none; }
	/* `min(…, 100%)` so a wide mark is held by its cell on a phone, where the
	   two-column grid is narrower than the 11rem cap, instead of spilling into
	   its neighbour. */
	li img { width: auto; max-width: min(11rem, 100%); height: auto; max-height: 3.5rem; object-fit: contain; transition: transform 250ms ease; }
	li a:hover img { transform: scale(1.05); }
	/* The investor marks ship with their own padding trimmed away, so the box
	   the CSS constrains is the mark itself rather than a mostly empty canvas,
	   and each one lands at roughly twice the size it did before. The cell, not
	   the image, sets the width: a wordmark ten times wider than it is tall
	   fills its cell, a near-square badge is held by the height cap, and
	   `contain` keeps every one of them at its own proportions. */
	.centered li img { max-width: 100%; max-height: 4rem; }
	.dark .logo-panel { color: white; background: var(--color-panel); }
	.dark h2 { color: white; }
	.dark .intro { color: rgb(255 255 255 / 70%); }
	/* Nine logos in a five-column grid leave a hole at the end of the second
	   row. A centred wrap balances the two rows instead, and the tighter row
	   rhythm and cell height take the empty band out of the panel. */
	.dark ul { grid-template-columns: repeat(5, minmax(0, 1fr)); margin-top: 3rem; }
	ul.centered { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.5rem 2.5rem; }
	.dark ul.centered { margin-top: 2rem; }
	/* The cell is a share of the row, so a chosen column count decides how many
	   marks sit on a line and the wrap falls where it should: seven logos set
	   four and three rather than six and a stray, and the eighth joins the
	   second row without any other change. `--logo-cols` defaults to the five
	   the investor panel already used. */
	.centered li { flex: 0 0 calc((100% - (var(--logo-cols, 5) - 1) * 2.5rem) / var(--logo-cols, 5)); }
	.centered li a, .centered .logo-item { min-height: 5rem; gap: .75rem; }
	@media (max-width: 900px) {
		ul, .dark ul { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	}
	@media (max-width: 560px) {
		ul, .dark ul { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
		.logo-panel { padding-inline: 1.25rem; }
		/* The 11rem cell does not fit twice across a phone, so the wrapped list
		   would set one logo per row and run the panel to a thousand pixels. The
		   cells shrink to a pair instead; the marks keep their proportions. */
		.centered li { flex: 1 1 7rem; max-width: 9.5rem; }
		.centered li a, .centered .logo-item { min-height: 4rem; }
	}
	@media (prefers-reduced-motion: reduce) {
		li img { transition: none; }
		li a:hover img { transform: none; }
	}
</style>
