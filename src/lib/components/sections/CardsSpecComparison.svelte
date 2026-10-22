<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	// One card per compared column. Its `body` carries the column's values as
	// `<li>Label: Value</li>`, the same spec-pair convention CardsSpecPanels
	// already uses, so the editor types one list per column instead of a grid.
	// `emphasis: "true"` marks the column the section argues for: it takes a
	// Laser Blue wash and sets its values in the medium weight, so the
	// comparison has a subject instead of two equal lists.
	type Card = { media?: unknown; eyebrow?: string; title?: string; body?: string; emphasis?: unknown };
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	let outro = $derived(String(section.outro ?? '').trim());

	const emphasised = (card: Card) => card.emphasis === true || String(card.emphasis ?? '') === 'true';

	function plainText(html: string) {
		return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
	}

	function specPairs(html?: string) {
		if (!html) return [];
		return [...html.matchAll(/<li[^>]*>(.*?)<\/li>/gis)].flatMap((match) => {
			const text = plainText(match[1]);
			const separator = text.indexOf(':');
			return separator > 0 ? [{ label: text.slice(0, separator).trim(), value: text.slice(separator + 1).trim() }] : [];
		});
	}

	let columns = $derived(cards.map((card) => ({ card, pairs: specPairs(card.body) })));

	// Row order follows the first column, then any label a later column adds, so
	// a column that is missing a row renders an empty cell instead of shifting
	// every row below it.
	let rows = $derived.by(() => {
		const labels: string[] = [];
		for (const column of columns) {
			for (const pair of column.pairs) if (!labels.includes(pair.label)) labels.push(pair.label);
		}
		return labels.map((label) => ({
			label,
			values: columns.map((column) => column.pairs.find((pair) => pair.label === label)?.value ?? '')
		}));
	});
</script>

{#if columns.length}
	<section
		class="lumo-section"
		id={section.anchor ? String(section.anchor) : undefined}
		data-background={String(section.background ?? 'none')}
		data-width={String(section.width ?? 'contained')}
		data-spacing-top={String(section.spacingTop ?? 'md')}
		data-phone-top={['xs', 'sm', 'md'].includes(String(section.phoneSpacingTop)) ? String(section.phoneSpacingTop) : undefined}
		data-spacing-bottom={String(section.spacingBottom ?? 'md')}
		data-align={section.align === 'container' ? 'container' : undefined}
	>
		<div class="lumo-inner">
			{#if section.eyebrow || section.heading || section.intro}
				<Reveal><div class="mb-12 max-w-4xl">
					{#if section.eyebrow}<p class="text-eyebrow text-brand-blue mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
					{#if section.heading}<h2 class="font-display text-statement text-ink whitespace-pre-line">{titleCase(String(section.heading))}</h2>{/if}
					{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
				</div></Reveal>
			{/if}

			<Reveal>
				<div class="rounded-card border-border bg-surface hidden overflow-hidden border md:block">
					<table class="w-full table-fixed border-collapse text-left">
						<caption class="sr-only">{section.heading ? `${titleCase(String(section.heading))} comparison` : 'Comparison'}</caption>
						<thead class="bg-background">
							<tr>
								<td class="w-1/4 px-6 py-5"></td>
								{#each columns as column, index (index)}
									{@const image = resolveMedia(column.card.media, media, 640)}
									{@const lead = emphasised(column.card)}
									<th class={`border-border border-l px-6 py-5 align-bottom ${lead ? 'bg-brand-blue/6' : ''}`} scope="col">
										{#if image}
											<div class="bg-surface rounded-card relative mb-5 aspect-3/2 overflow-hidden">
												<img class="absolute inset-0 size-full object-contain p-3" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
											</div>
										{/if}
										<!-- Optical Ink, not a spectral accent: at the eyebrow size
										     Signal Green is 3.4:1 and Muted Slate 4.0:1 on this
										     surface. The emphasised column is marked by its wash. -->
										{#if column.card.eyebrow}<p class="text-eyebrow text-ink uppercase">{column.card.eyebrow}</p>{/if}
										<p class="font-display text-subheading text-ink mt-1">{column.card.title ?? ''}</p>
									</th>
								{/each}
							</tr>
						</thead>
						<tbody class="divide-border divide-y">
							{#each rows as row, rowIndex (rowIndex)}
								<tr>
									<th class="text-ink px-6 py-4 align-top font-medium" scope="row">{row.label}</th>
									{#each row.values as value, index (index)}
										{@const lead = emphasised(columns[index].card)}
										<td class={`border-border border-l px-6 py-4 align-top ${lead ? 'bg-brand-blue/6 text-ink font-medium' : ''}`}>{value}</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<!-- The approved mobile behaviour: one stacked card per column, each
				     with its own photo on top, instead of a table that scrolls
				     sideways. -->
				<div class="grid gap-6 md:hidden">
					{#each columns as column, index (index)}
						{@const image = resolveMedia(column.card.media, media, 640)}
						{@const lead = emphasised(column.card)}
						<article class="rounded-card border-border bg-surface overflow-hidden border">
							<div class={`px-6 py-5 ${lead ? 'bg-brand-blue/6' : 'bg-background'}`}>
								{#if image}
									<div class="bg-surface rounded-card relative mb-5 aspect-3/2 overflow-hidden">
										<img class="absolute inset-0 size-full object-contain p-3" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
									</div>
								{/if}
								{#if column.card.eyebrow}<p class="text-eyebrow text-ink uppercase">{column.card.eyebrow}</p>{/if}
								<p class="font-display text-subheading text-ink mt-1">{column.card.title ?? ''}</p>
							</div>
							<dl class="divide-border divide-y">
								{#each column.pairs as pair, pairIndex (pairIndex)}
									<div class="px-6 py-4">
										<dt class="text-eyebrow text-text uppercase">{pair.label}</dt>
										<dd class={`text-ink mt-2 ml-0 text-base leading-snug ${lead ? 'font-medium' : ''}`}>{pair.value}</dd>
									</div>
								{/each}
							</dl>
						</article>
					{/each}
				</div>
			</Reveal>

			{#if outro}
				<Reveal delay={0.12}><p class="text-ink mt-10 max-w-3xl text-lg font-medium">{outro}</p></Reveal>
			{/if}
		</div>
	</section>
{/if}
