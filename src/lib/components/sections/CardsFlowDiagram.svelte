<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type Card = { media?: unknown; title?: string; accent?: string };
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	const bars: Record<string, string> = { accent1: 'bg-brand-blue', accent2: 'bg-brand-green', accent3: 'bg-brand-amber', accent4: 'bg-brand-blue', accent5: 'bg-brand-green', accent6: 'bg-brand-amber' };
	const bar = (accent?: string) => bars[accent ?? ''] ?? bars.accent1;
</script>

<section
	class="lumo-section"
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={String(section.background ?? 'none')}
	data-width={String(section.width ?? 'contained')}
	data-spacing-top={String(section.spacingTop ?? 'md')}
	data-spacing-bottom={String(section.spacingBottom ?? 'md')}
>
	<div class="lumo-inner">
		{#if section.eyebrow || section.heading || section.intro}
			<Reveal>
				<div class="mb-12 text-center">
					{#if section.eyebrow}<p class="text-eyebrow text-brand-blue mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
					{#if section.heading}<h2 class="font-display text-statement text-ink">{titleCase(String(section.heading))}</h2>{/if}
					{#if section.intro}<p class="text-lead mx-auto mt-6 max-w-3xl">{String(section.intro)}</p>{/if}
				</div>
			</Reveal>
		{/if}

		<Reveal>
			<div class="grid items-start justify-items-center md:grid-cols-9 md:gap-x-3">
				{#each cards as card, index (index)}
					{@const image = resolveMedia(card.media, media, 320)}
					<article class="flex w-full flex-col items-center text-center">
						<h3 class="font-display text-ink text-base md:flex md:min-h-12 md:items-start">{titleCase(card.title ?? '')}</h3>
						<span aria-hidden="true" class={`mt-3 block h-1 w-8 rounded-full ${bar(card.accent)}`}></span>
						{#if image}
							<div class="rounded-card mt-4 size-28 overflow-hidden md:size-36">
								<img class="size-full object-cover" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
							</div>
						{/if}
					</article>
					{#if index < cards.length - 1}
						<div aria-hidden="true" class="text-brand-blue flex h-10 w-full flex-col items-center md:mt-38 md:h-0 md:flex-row">
							<span class="border-brand-blue h-full border-l border-dashed md:h-0 md:w-full md:border-t md:border-l-0"></span>
							<svg viewBox="0 0 16 16" class="size-4 shrink-0 rotate-90 md:rotate-0" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
						</div>
					{/if}
				{/each}
			</div>
		</Reveal>
	</div>
</section>
