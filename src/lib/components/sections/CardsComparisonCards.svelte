<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type Card = { media?: unknown; eyebrow?: string; title?: string };
	type Column = { label: string; rows: Card[] };
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	let columns = $derived(groupCards(cards));

	function groupCards(rows: Card[]) {
		const groups: Column[] = [];
		for (const row of rows) {
			const label = row.eyebrow?.trim() ?? '';
			const current = groups.at(-1);
			if (current?.label === label) current.rows.push(row);
			else groups.push({ label, rows: [row] });
		}
		return groups;
	}
</script>

<section class="lumo-section" id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')}>
	<div class="lumo-inner">
		<div class="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
			<div class="lg:col-span-2">
				<Reveal><div>
					<span aria-hidden="true" class="bg-brand-blue mb-8 block h-1 w-10 rounded-full"></span>
					{#if section.heading}<h2 class="font-display text-statement text-ink">{titleCase(String(section.heading))}</h2>{/if}
					{#if section.intro}<p class="text-lead mt-6">{String(section.intro)}</p>{/if}
				</div></Reveal>
			</div>

			<div class="lg:col-span-3">
				<Reveal><div class="relative grid gap-4 sm:grid-cols-2">
				{#each columns as column, index (column.label || index)}
					<div class={`rounded-card px-6 py-10 ${index === 0 ? 'bg-background' : 'bg-brand-blue/6'}`}>
						<p class={`font-display text-subheading text-center ${index === 0 ? 'text-ink' : 'text-brand-blue'}`}>{column.label}</p>
						<ul class="mt-8">
							{#each column.rows as row, rowIndex (row.title || rowIndex)}
								{@const image = resolveMedia(row.media, media, 320)}
								<li class="text-center">
									{#if rowIndex > 0}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" class="text-muted mx-auto my-2"><path d="m3 6 5 5 5-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>{/if}
									<span class="text-ink inline-flex items-center justify-center gap-2 text-lg">
										{#if image}<img class="size-6 shrink-0 object-contain" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" />{/if}
										{row.title ?? ''}
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
				{#if columns.length === 2}<span aria-hidden="true" class="bg-ink absolute top-1/2 left-1/2 hidden size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-sm font-semibold text-white sm:grid">vs.</span>{/if}
				</div></Reveal>
			</div>
		</div>
	</div>
</section>
