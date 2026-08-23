<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type Card = { title?: string; eyebrow?: string; body?: string; accent?: string };
	let { section, media: _media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	const bars: Record<string, string> = { accent1: 'bg-brand-blue', accent2: 'bg-brand-green', accent3: 'bg-brand-amber', accent4: 'bg-brand-blue', accent5: 'bg-brand-green', accent6: 'bg-brand-amber' };
	const bar = (accent?: string) => bars[accent ?? ''] ?? bars.accent1;
</script>

<section class="lumo-section" id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')}>
	<div class="lumo-inner">
		{#if section.eyebrow || section.heading || section.intro}
			<Reveal><div class="max-w-4xl">
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
			</div></Reveal>
		{/if}

		<Reveal><div class={`rounded-card border-border bg-surface overflow-x-auto border ${section.eyebrow || section.heading || section.intro ? 'mt-10' : ''}`}>
			<table class="w-full min-w-180 table-fixed border-collapse text-left">
				<caption class="sr-only">{section.heading ? `${titleCase(String(section.heading))} comparison` : 'Offering comparison'}</caption>
				<thead class="bg-background">
					<tr>
						<th class="text-eyebrow text-ink w-1/4 px-6 py-4 uppercase" scope="col">Offering</th>
						<th class="text-eyebrow text-ink w-1/4 px-6 py-4 uppercase" scope="col">Evaluation level</th>
						<th class="text-eyebrow text-ink px-6 py-4 uppercase" scope="col">Best for</th>
					</tr>
				</thead>
				<tbody class="divide-border divide-y">
					{#each cards as card, index (card.title || index)}
						<tr>
							<th class="text-ink px-6 py-5 align-top font-medium" scope="row"><span class="flex items-center gap-3"><span aria-hidden="true" class={`size-2.5 shrink-0 rounded-full ${bar(card.accent)}`}></span>{titleCase(card.title ?? '')}</span></th>
							<td class="text-muted px-6 py-5 align-top">{card.eyebrow ?? ''}</td>
							<td class="text-ink px-6 py-5 align-top">{#if card.body}<div class="[&_p]:m-0">{@html card.body}</div>{/if}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div></Reveal>
	</div>
</section>
