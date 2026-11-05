<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type CardLink = { label?: string; url?: string; newTab?: boolean };
	type Card = { media?: unknown; eyebrow?: string; title?: string; body?: string; link?: CardLink; linkLabel?: string; linkUrl?: string; badge?: string; imageZoom?: string; accent?: string };
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	// The bento spans assume a long, uneven set. A set of four or fewer is an
	// even row instead, so the feature spans are opt-in by length.
	let bento = $derived(cards.length > 4);
	let sectionLink = $derived.by(() => {
		const label = String(section.linkLabel ?? '').trim();
		const href = String(section.linkUrl ?? '').trim();
		if (!label || !href) return null;
		return { label, href, newTab: section.linkNewTab === true || section.linkNewTab === 'true' };
	});

	const linkFor = (card: Card) => ({ href: card.linkUrl || card.link?.url || '', label: card.linkLabel || card.link?.label || '', newTab: Boolean(card.link?.newTab) });
	const bar = (accent?: string) => accent === 'accent2' ? 'bg-brand-red' : accent === 'accent3' ? 'bg-brand-amber' : 'bg-surface';
	// Phone-only spacing override (app.css): xs | sm | md, else unset.
	const phoneSpacing = (value: unknown) => (['xs', 'sm', 'md'].includes(String(value)) ? String(value) : undefined);
</script>

<!-- Homepage "When light becomes programmable". An ordinary flow section that
     reveals the way "Latest From Lumotive" (PostsFeatured) does: the heading
     block, then the card grid with its cards staggered, then the action, each
     a one-time `Reveal` as it enters the viewport. -->
<section
	class="lumo-section"
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={String(section.background ?? 'none')}
	data-width={String(section.width ?? 'contained')}
	data-spacing-top={String(section.spacingTop ?? 'md')}
	data-spacing-bottom={String(section.spacingBottom ?? 'md')}
	data-phone-top={phoneSpacing(section.phoneSpacingTop)}
	data-align="container"
>
	<div class="lumo-inner flex flex-col">
		{#if section.eyebrow || section.heading || section.intro}
			<!-- The Reveal is the heading block itself, so the block stays the flex
			     item it has always been and its spacing to the grid is unchanged. -->
			<Reveal class="mb-12 max-w-6xl">
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink whitespace-pre-line">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
			</Reveal>
		{/if}

		<Reveal stagger class="grid gap-6 md:grid-cols-2 lg:grid-flow-dense lg:auto-rows-fr lg:grid-cols-4">
			{#each cards as card, index (index)}
				{@const image = resolveMedia(card.media, media, 1024)}
				{@const link = linkFor(card)}
				{@const solid = !image}
				{@const amber = solid && card.accent === 'accent3'}
				{@const darkText = amber || (solid && card.accent !== 'accent2')}
				<!-- `Reveal` animates the grid's direct children with inline GSAP
				     transforms, which would cancel a hover translate on the same
				     element. The wrapper is the grid item and takes the reveal; the card
				     inside fills it (single-cell grid) and keeps the lift and shadow. -->
				<div class={`grid ${bento && index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''} ${bento && index === 2 ? 'lg:row-span-2' : ''} ${bento && index === 4 ? 'lg:col-span-3' : ''}`}>
				<svelte:element
					this={link.href ? 'a' : 'article'}
					class={`rounded-card group relative flex min-h-72 flex-col overflow-hidden p-8 transition duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:transform-none motion-reduce:transition-none ${solid ? bar(card.accent) : 'bg-surface'}${link.href ? ' no-underline focus-visible:outline-2 focus-visible:outline-offset-4' : ''}`}
					href={link.href || undefined}
					target={link.href && link.newTab ? '_blank' : undefined}
					rel={link.href && link.newTab ? 'noopener noreferrer' : undefined}
				>
					{#if image}
						<img class={`absolute inset-0 size-full object-cover motion-safe:transition-transform motion-safe:duration-500 ${card.imageZoom === 'true' ? 'scale-125 motion-safe:group-hover:scale-130' : 'motion-safe:group-hover:scale-105'}`} src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
						<!-- Ink to 80% at mid-card: at 50% the title measured 2.8:1 over
						     the bright warehouse photo (white text needs 4.5:1). -->
						<div aria-hidden="true" class="from-ink via-ink/80 to-ink/15 absolute inset-0 bg-linear-to-t"></div>
					{/if}
					<div class="relative z-10 flex flex-1 flex-col justify-end">
						{#if card.eyebrow}<p class={`text-eyebrow uppercase ${darkText ? 'text-ink' : 'text-white/75'}`}>{card.eyebrow}</p>{/if}
						<h3 class={`font-display mt-3 ${bento && index === 0 ? 'text-heading' : 'text-subheading'} ${darkText ? 'text-ink' : 'text-white'}`}>{titleCase(card.title ?? '')}</h3>
						{#if card.body}<div class={`mt-3 text-base leading-relaxed ${darkText ? 'text-ink' : 'text-white/75'}`}>{@html card.body}</div>{/if}
						{#if card.badge}<span class={`text-spec mt-4 self-start rounded-full px-3 py-1 ${darkText ? 'bg-ink/10 text-ink' : 'bg-white/15 text-white'}`}>{card.badge}</span>{/if}
						{#if link.href && link.label}
							<span class={`mt-auto inline-flex items-center gap-2 self-start pt-6 text-base font-medium ${darkText ? 'text-ink' : 'text-white'}`}>
								{link.label}<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
							</span>
						{/if}
					</div>
				</svelte:element>
				</div>
			{/each}
		</Reveal>
		{#if sectionLink}
			<Reveal delay={0.12}>
				<a class="section-link" href={sectionLink.href} target={sectionLink.newTab ? '_blank' : undefined} rel={sectionLink.newTab ? 'noreferrer' : undefined}>{sectionLink.label} <span aria-hidden="true">→</span></a>
			</Reveal>
		{/if}
	</div>
</section>


<style>
	/* A bare utility loses to the global anchor colour, so the section action is
	   coloured the same scoped way the other section links are. */
	.section-link { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .5rem; margin-top: 2.5rem; color: var(--color-brand-blue-dark); font-weight: 650; text-decoration: none; }
	.section-link span { transition: transform 200ms ease; }
	.section-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.section-link span { transition: none; }
		.section-link:hover span { transform: none; }
	}
</style>
