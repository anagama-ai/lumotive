<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type Card = { media?: unknown; title?: string; body?: string; accent?: string };
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

		<Reveal stagger="[data-flow-panel]">
			<div class="flex flex-col items-stretch md:flex-row">
				{#each cards as card, index (index)}
					{@const image = resolveMedia(card.media, media, 640)}
					<article data-flow-panel class="rounded-card bg-surface relative flex min-w-0 flex-1 flex-col overflow-hidden p-6 text-center md:p-8">
						<span aria-hidden="true" class={`pointer-events-none absolute inset-0 opacity-10 ${bar(card.accent)}`}></span>
						<div class="relative flex h-full flex-col">
							<h3 class="font-display text-ink text-xl">{titleCase(card.title ?? '')}</h3>
							{#if card.body}<div class="text-text mt-4 text-base leading-relaxed">{@html card.body}</div>{/if}
							{#if image}
								<div class="mt-auto flex aspect-4/3 w-full items-end pt-8">
									<img class="h-auto w-full object-contain" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
								</div>
							{/if}
						</div>
					</article>
					{#if index < cards.length - 1}
						<div aria-hidden="true" class="text-brand-blue flex h-12 shrink-0 items-center justify-center md:h-auto md:w-12">
							<svg viewBox="0 0 16 16" class="size-6 rotate-90 md:rotate-0" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
						</div>
					{/if}
				{/each}
			</div>
		</Reveal>
	</div>
</section>
