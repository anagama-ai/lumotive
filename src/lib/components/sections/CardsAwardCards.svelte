<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type Award = { title?: string; year?: string | number; linkUrl?: string };
	let { section, media: _media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Award[]) : []);
	// The approved About strip names five awards and prints no years, so the row
	// widens to five rather than wrapping one card onto a second line. Every
	// other count keeps the four-up grid.
	let gridClass = $derived(
		`grid gap-x-6 sm:grid-cols-2 ${cards.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`
	);
</script>

<section class="lumo-section" id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')} data-align={section.align === 'container' ? 'container' : undefined}>
	<div class="lumo-inner">
		{#if section.eyebrow || section.heading || section.intro}
			<Reveal><div class="mb-12 max-w-4xl">
				<!-- Deep Laser Blue: at the eyebrow's 12px the lighter blue measures
				     4.15:1 on the page field, under the 4.5:1 floor. -->
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
			</div></Reveal>
		{/if}
		<Reveal><div class={gridClass}>
			{#each cards as card, index (`${card.title ?? ''}:${card.year ?? ''}:${card.linkUrl ?? ''}:${index}`)}
				<article class="border-border flex flex-col border-t py-5">
					<!-- A card with no year prints no year line: the approved strip
					     carries no years in copy, and an empty eyebrow would leave a
					     blank row above every title. -->
					{#if card.year}<p class="text-eyebrow text-muted uppercase">{String(card.year)}</p>{/if}
					<h3 class="font-display text-ink mt-2 text-base">{card.title ?? ''}</h3>
					{#if card.linkUrl}<a class="text-brand-blue hover:text-brand-blue-dark mt-4 inline-flex min-h-11 items-center gap-2 self-start font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none" href={card.linkUrl} target="_blank" rel="noopener noreferrer">Learn more<span class="sr-only"> about {card.title ?? 'this award'}</span><svg aria-hidden="true" viewBox="0 0 16 16" class="size-4" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg></a>{/if}
				</article>
			{/each}
		</div></Reveal>
	</div>
</section>
