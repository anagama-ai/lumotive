<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type Card = { media?: unknown; title?: string; body?: string };
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);

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
</script>

<section class="lumo-section" id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')}>
	<div class="lumo-inner">
		{#if section.eyebrow || section.heading || section.intro}
			<Reveal><div class="mb-12 max-w-4xl">
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
			</div></Reveal>
		{/if}
		<Reveal stagger class="grid gap-6 md:grid-cols-2">
			{#each cards as card, index (index)}
				{@const image = resolveMedia(card.media, media, 1024)}
				<article class="rounded-panel border-border bg-background overflow-hidden border">
					<h3 class="font-display text-ink px-6 py-7 text-center text-2xl font-bold">{card.title ?? ''}</h3>
					{#if image}<div class="bg-background relative aspect-2/1 overflow-hidden px-4 pb-2"><img class="absolute inset-0 size-full object-contain" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" /></div>{/if}
					<dl class="border-border bg-surface grid grid-cols-3 gap-4 border-t px-5 py-5">
						{#each specPairs(card.body) as spec, index (index)}
							<!-- Slate Text, not Muted Slate: at the eyebrow's 12px the muted
							     token measures 3.67:1 on the card, under the 4.5:1 floor. -->
							<div class="min-w-0"><dt class="text-eyebrow text-text uppercase">{spec.label}</dt><dd class="text-ink mt-2 text-sm leading-snug">{spec.value}</dd></div>
						{/each}
					</dl>
				</article>
			{/each}
		</Reveal>
	</div>
</section>
