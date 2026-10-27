<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import { honorReducedMotion } from '$lib/motion';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

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

	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	let sharedImage = $derived(resolveMedia(cards.find((card) => card.media)?.media, media, 1024));
	let sharedIsVideo = $derived(Boolean(sharedImage?.isVideo));
	// `layout: "numbered"`: left-aligned heading, then the shared media on the
	// left and the cards as a numbered, rule-divided list on the right (from
	// 768px; stacked below with the list first). Unset keeps the centred
	// heading and cards-beside-media layout.
	let numbered = $derived(section.layout === 'numbered');

	const tones: Record<string, string> = {
		accent1: 'text-brand-blue', accent2: 'text-brand-green', accent3: 'text-brand-amber',
		accent4: 'text-brand-blue', accent5: 'text-brand-green', accent6: 'text-brand-amber'
	};
	const tone = (value?: string) => tones[value ?? ''] ?? tones.accent1;
	const linkFor = (card: Card) => ({
		href: card.linkUrl || card.link?.url || '',
		label: card.linkLabel || card.link?.label || '',
		newTab: Boolean(card.link?.newTab)
	});
</script>

<!-- Normal flow. The cards used to trade places in one grid cell inside a
     pinned `PeelScene`; its sticky panel and viewport-measured runway went
     stale whenever the browser bars resized the viewport, so content slid
     behind the header on touch devices. Every card now stays readable in
     turn, beside the shared media from 768px up, and the heading and grid
     reveal once with the shared `Reveal`. -->
<section
	class="lumo-section"
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={String(section.background ?? 'none')}
	data-width={String(section.width ?? 'contained')}
	data-spacing-top={String(section.spacingTop ?? 'md')}
	data-spacing-bottom={String(section.spacingBottom ?? 'md')}
	data-align={section.align === 'container' ? 'container' : undefined}
>
	<div class="lumo-inner">
		{#if section.heading || section.intro}
			<Reveal>
				<div class={numbered ? 'max-w-4xl' : 'text-center'}>
					{#if section.heading}<h2 class="font-display text-statement text-ink">{titleCase(String(section.heading))}</h2>{/if}
					<!-- Slate Text, not Muted Slate: at the lead size the muted token
					     measures 3.34:1 on the page field, under the 4.5:1 floor. -->
					{#if section.intro}<p class={`text-lead mt-4 max-w-4xl ${numbered ? '' : 'mx-auto'}`}>{String(section.intro)}</p>{/if}
				</div>
			</Reveal>
		{/if}

		{#if cards.length}
		<Reveal
			stagger=":scope > .swap-cards > article, :scope > .swap-media"
			class={numbered
				? `mt-10 grid items-center gap-10 ${sharedImage ? 'md:grid-cols-12 md:gap-12' : ''}`
				: `mt-10 grid items-center gap-10 ${sharedImage ? 'md:grid-cols-2' : ''}`}
		>
			<div class={`swap-cards grid ${numbered ? `numbered md:order-2 ${sharedImage ? 'md:col-span-5' : ''}` : 'gap-10'}`}>
				{#each cards as card, index (index)}
					{@const link = linkFor(card)}
					<article>
						{#if numbered}
							<p class={`text-eyebrow ${tone(card.accent)}`}>{String(index + 1).padStart(2, '0')}</p>
						{/if}
						{#if card.eyebrow}<p class={`text-eyebrow uppercase ${tone(card.accent)}`}>{card.eyebrow}</p>{/if}
						<h3 class={`font-display text-ink ${numbered ? 'text-subheading mt-2' : 'text-heading mt-3'}`}>{titleCase(card.title ?? '')}</h3>
						{#if card.body}<div class={`text-base leading-relaxed ${numbered ? 'mt-3' : 'mt-5'}`}>{@html card.body}</div>{/if}
						{#if link.href && link.label}
							<a class={`mt-7 inline-flex items-center gap-2 text-base font-medium ${tone(card.accent)}`} href={link.href} target={link.newTab ? '_blank' : undefined} rel={link.newTab ? 'noopener noreferrer' : undefined}>
								{link.label}
								<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
							</a>
						{/if}
					</article>
				{/each}
			</div>

			{#if sharedImage}
				<div class={`swap-media rounded-card relative aspect-video overflow-hidden ${numbered ? 'md:col-span-7' : ''}`}>
					{#if sharedIsVideo}
						<video {@attach honorReducedMotion} class="absolute inset-0 size-full object-cover" autoplay loop muted playsinline aria-hidden="true">
							<source src={sharedImage.src} type="video/mp4" />
						</video>
					{:else}
						<img class="absolute inset-0 size-full object-cover" src={sharedImage.src} srcset={sharedImage.srcset} alt={sharedImage.alt} width={sharedImage.width} height={sharedImage.height} loading="lazy" />
					{/if}
				</div>
			{/if}
		</Reveal>
		{/if}
	</div>
</section>

<style>
	.numbered > article { padding-block: 1.75rem; border-top: 1px solid var(--color-border); }
	.numbered > article:last-child { border-bottom: 1px solid var(--color-border); }
	.numbered :global(p) { margin: 0; }
</style>
