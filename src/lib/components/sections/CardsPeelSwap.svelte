<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import { honorReducedMotion } from '$lib/motion';
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
	let sharedImage = $derived(resolveMedia(cards.find((card) => card.media)?.media, media, 1024));
	let sharedIsVideo = $derived(Boolean(sharedImage?.isVideo));

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

<PeelScene {band} {media} uncover={false}>
	<section
		class="lumo-section my-auto"
		id={section.anchor ? String(section.anchor) : undefined}
		data-background={String(section.background ?? 'none')}
		data-width={String(section.width ?? 'contained')}
		data-spacing-top={String(section.spacingTop ?? 'md')}
		data-spacing-bottom={String(section.spacingBottom ?? 'md')}
		data-align={section.align === 'container' ? 'container' : undefined}
	>
		<div class="lumo-inner relative flex min-h-full flex-col justify-center">
			{#if section.heading || section.intro}
				<div class="text-center">
					{#if section.heading}<h2 class="font-display text-statement text-ink mt-12 md:mt-0">{titleCase(String(section.heading))}</h2>{/if}
					<!-- Slate Text, not Muted Slate: at the lead size the muted token
					     measures 3.34:1 on the page field, under the 4.5:1 floor. -->
					{#if section.intro}<p class="text-lead mx-auto mt-4 max-w-4xl">{String(section.intro)}</p>{/if}
				</div>
			{/if}

			<div class={`swap-grid relative mt-10 grid items-center gap-10 ${sharedImage ? 'md:grid-cols-2' : ''}`}>
				{#each cards as card, index (index)}
					{@const link = linkFor(card)}
					<!-- The swap is a wide-viewport choreography: the cards share one
					     grid cell and trade places as the pinned panel scrolls.
					     `data-peel-wide` keeps its beats off narrow viewports, where
					     the cards stack and every one of them has to stay readable —
					     without it the first card's fall left it permanently blank. -->
					<article
						data-peel-wide
						data-peel={[index > 0 && 'rise', index < cards.length - 1 && 'fall'].filter(Boolean).join(' ') || undefined}
						class={`swap-card md:col-start-1 md:row-start-1 ${index > 0 ? 'pointer-events-none md:motion-safe:opacity-0' : ''}`}
					>
						{#if card.eyebrow}<p class={`text-eyebrow uppercase ${tone(card.accent)}`}>{card.eyebrow}</p>{/if}
						<h3 class="font-display text-heading text-ink mt-3">{titleCase(card.title ?? '')}</h3>
						{#if card.body}<div class="mt-5 text-base leading-relaxed">{@html card.body}</div>{/if}
						{#if link.href && link.label}
							<a class={`mt-7 inline-flex items-center gap-2 text-base font-medium ${tone(card.accent)}`} href={link.href} target={link.newTab ? '_blank' : undefined} rel={link.newTab ? 'noopener noreferrer' : undefined}>
								{link.label}
								<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
							</a>
						{/if}
					</article>
				{/each}

				{#if sharedImage}
					<div class="swap-media rounded-card relative aspect-video overflow-hidden md:col-start-2 md:row-start-1">
						{#if sharedIsVideo}
							<video {@attach honorReducedMotion} class="absolute inset-0 size-full object-cover" autoplay loop muted playsinline aria-hidden="true">
								<source src={sharedImage.src} type="video/mp4" />
							</video>
						{:else}
							<img class="absolute inset-0 size-full object-cover" src={sharedImage.src} srcset={sharedImage.srcset} alt={sharedImage.alt} width={sharedImage.width} height={sharedImage.height} loading="lazy" />
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</section>
</PeelScene>

<style>
	/* Under reduced motion PeelScene runs no beats and the `motion-safe`
	   opacity utilities do not apply, so all four cards would sit in the same
	   grid cell at full opacity and overlap. The swap stops being a swap: the
	   cards and the image flow down one column, each legible in turn. */
	@media (prefers-reduced-motion: reduce) {
		.swap-grid { grid-template-columns: 1fr; }
		.swap-card, .swap-media { grid-column: auto; grid-row: auto; }
	}
</style>
