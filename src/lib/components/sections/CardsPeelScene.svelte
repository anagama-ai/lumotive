<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import PeelScene from '$lib/components/lumotive/peel/PeelScene.svelte';

	type CardLink = { label?: string; url?: string; newTab?: boolean };
	type Card = {
		media?: unknown;
		eyebrow?: string;
		title?: string;
		body?: string;
		link?: CardLink;
		linkLabel?: string;
		linkUrl?: string;
		accent?: string;
	};

	let {
		section,
		media,
		band
	}: { section: Section; media: MediaMap; band?: Section } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	let heading = $derived(titleCase(String(section.heading ?? '')) ?? '');
	let split = $derived(heading.indexOf('. '));

	// Eyebrows and the card link are text, so they take the text-safe variants
	// (the bright accents measure 4.15, 3.19 and 1.82:1 on white).
	const tones: Record<string, string> = {
		accent1: 'text-brand-blue-dark',
		accent2: 'text-brand-green-text',
		accent3: 'text-brand-amber-text',
		accent4: 'text-brand-blue-dark',
		accent5: 'text-brand-green-text',
		accent6: 'text-brand-amber-text'
	};
	const tone = (value?: string) => tones[value ?? ''] ?? tones.accent1;
	const linkFor = (card: Card) => ({
		href: card.linkUrl || card.link?.url || '',
		label: card.linkLabel || card.link?.label || '',
		newTab: Boolean(card.link?.newTab)
	});
</script>

<!-- Homepage only: ride the hero's lower edge so this section fills the strip
     the hero vacates instead of trailing an empty viewport behind it. -->
<PeelScene {band} {media} revealFollow>
	<section
		class="lumo-section"
		id={section.anchor ? String(section.anchor) : undefined}
		data-background={String(section.background ?? 'none')}
		data-width={String(section.width ?? 'contained')}
		data-spacing-top={String(section.spacingTop ?? 'md')}
		data-spacing-bottom={String(section.spacingBottom ?? 'md')}
		data-align="container"
	>
		<div class="lumo-inner flex min-h-full flex-col justify-center py-10">
			{#if heading}
				<h2 class="cards-heading font-display text-statement text-center">
					<span data-peel="rise tint" class="text-ink block">
						{split >= 0 ? heading.slice(0, split + 1) : heading}
					</span>
					{#if split >= 0}
						<span data-peel="rise" class="text-brand-blue block">{heading.slice(split + 2)}</span>
					{/if}
				</h2>
			{/if}

			<div data-peel="rise-each" class="cards-grid mt-10 grid gap-6 md:grid-cols-2">
				{#each cards as card, index (index)}
					{@const image = resolveMedia(card.media, media, 1024)}
					{@const link = linkFor(card)}
					<svelte:element
						this={link.href ? 'a' : 'article'}
						class={`rounded-card bg-surface hover:shadow-card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none${link.href ? ' no-underline focus-visible:outline-2 focus-visible:outline-offset-4' : ''}`}
						href={link.href || undefined}
						target={link.href && link.newTab ? '_blank' : undefined}
						rel={link.href && link.newTab ? 'noopener noreferrer' : undefined}
					>
						{#if image}
							<div class="relative aspect-4/1 w-full overflow-hidden">
								<img
									class="absolute inset-0 size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
									src={image.src}
									srcset={image.srcset}
									alt={image.alt}
									width={image.width}
									height={image.height}
									loading="lazy"
								/>
							</div>
						{/if}
						<div class="flex flex-1 flex-col p-6">
							{#if card.eyebrow}<p class={`text-eyebrow uppercase ${tone(card.accent)}`}>{card.eyebrow}</p>{/if}
							<h3 class="card-title font-display text-subheading text-ink mt-2">{titleCase(card.title ?? '')}</h3>
							{#if card.body}<div class="card-body mt-3 text-base leading-relaxed">{@html card.body}</div>{/if}
							{#if link.href && link.label}
								<span class={`card-link mt-auto inline-flex items-center gap-2 self-start pt-5 text-base font-medium ${tone(card.accent)}`}>
									{link.label}
									<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
								</span>
							{/if}
						</div>
					</svelte:element>
				{/each}
			</div>
		</div>
	</section>
</PeelScene>

<style>
	/* Spacing pass. The heading-to-cards gap was 90px: the h2's own 50px bottom
	   margin plus the grid's 40px top margin. The in-card gap between title and
	   description was 36px: the h3's 24px bottom margin plus the body's 12px top
	   margin. Both are tightened by roughly a quarter, set explicitly so the
	   total no longer depends on the global heading margin.

	   Outer section padding, the 24px grid gap, the card padding, the equal
	   card heights and the `mt-auto` link alignment are all untouched. */
	.cards-heading { margin-bottom: 2.5rem; }
	.cards-grid { margin-top: 1.75rem; }
	.card-title { margin-bottom: 0; }
	.card-body { margin-top: 1.6875rem; }
	.card-link { padding-top: .9375rem; }
</style>
