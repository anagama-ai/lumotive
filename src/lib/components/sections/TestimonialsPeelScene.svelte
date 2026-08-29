<script lang="ts">
	import PeelScene from '$lib/components/lumotive/peel/PeelScene.svelte';
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';

	type Quote = {
		quote?: unknown;
		author?: unknown;
		role?: unknown;
		company?: unknown;
	};

	let { section, media, band }: { section: Section; media: MediaMap; band?: Section } = $props();
	let quotes = $derived((Array.isArray(section.quotes) ? section.quotes : []) as Quote[]);

	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};
</script>

{#if quotes.length}
	<PeelScene {band} {media}>
		<section
			class="lumo-section"
			id={section.anchor ? String(section.anchor) : undefined}
			data-design-version={section.designVersion ? String(section.designVersion) : undefined}
			data-background={enumValue(section.background, ['none', 'subtle', 'strong', 'inverse'], 'none')}
			data-width={enumValue(section.width, ['contained', 'wide', 'full'], 'contained')}
			data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'md', 'lg'], 'md')}
			data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'md', 'lg'], 'md')}
		>
			<div class="lumo-inner flex min-h-[70dvh] flex-col justify-center py-10">
				{#each quotes as quote, quoteIndex (quoteIndex)}
					<figure class="mx-auto max-w-4xl text-center">
						<blockquote data-peel="tint-each" class="text-quote text-ink">
							<!-- The trailing space must live inside the expression: Svelte trims literal whitespace between elements, which welds the words together. -->
							{#each `“${String(quote.quote ?? '')}”`.split(' ') as word, index (index)}<span>{word + ' '}</span>{/each}
						</blockquote>
						<figcaption data-peel="rise" class="text-eyebrow mt-10 uppercase text-brand-blue">
							{String(quote.author ?? '')}
							{#if quote.role}<span class="text-ink/70"> — {String(quote.role)}</span>{/if}
							{#if quote.company}<span class="text-ink/70">, {String(quote.company)}</span>{/if}
						</figcaption>
					</figure>
				{/each}
			</div>
		</section>
	</PeelScene>
{/if}
