<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import PeelScene from '$lib/components/lumotive/peel/PeelScene.svelte';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type CardLink = { label?: string; url?: string; newTab?: boolean };
	type Card = { media?: unknown; eyebrow?: string; title?: string; body?: string; link?: CardLink; linkLabel?: string; linkUrl?: string; badge?: string; accent?: string };
	let { section, media, band }: { section: Section; media: MediaMap; band?: Section } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);

	const linkFor = (card: Card) => ({ href: card.linkUrl || card.link?.url || '', label: card.linkLabel || card.link?.label || '', newTab: Boolean(card.link?.newTab) });
	const bar = (accent?: string) => accent === 'accent2' ? 'bg-brand-red' : accent === 'accent3' ? 'bg-brand-amber' : 'bg-surface';
</script>

<!-- Homepage only: ride the edge of the hero panel above so this section fills
     the strip it vacates instead of trailing a viewport of empty scroll. -->
<PeelScene {band} {media} revealFollow>
	<section
		class="lumo-section"
		id={section.anchor ? String(section.anchor) : undefined}
		data-background={String(section.background ?? 'none')}
		data-width={String(section.width ?? 'contained')}
		data-spacing-top={String(section.spacingTop ?? 'md')}
		data-spacing-bottom={String(section.spacingBottom ?? 'md')}
	>
		<div class="lumo-inner flex min-h-full flex-col justify-center py-10">
			{#if section.eyebrow || section.heading || section.intro}
				<div data-peel="rise" class="mb-12 max-w-6xl">
					{#if section.eyebrow}<p class="text-eyebrow text-brand-blue mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
					{#if section.heading}<h2 class="font-display text-display text-ink whitespace-pre-line">{titleCase(String(section.heading))}</h2>{/if}
					{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
				</div>
			{/if}

			<Reveal stagger class="grid gap-6 md:grid-cols-2 lg:grid-flow-dense lg:auto-rows-fr lg:grid-cols-4">
					{#each cards as card, index (index)}
						{@const image = resolveMedia(card.media, media, 1024)}
						{@const link = linkFor(card)}
						{@const solid = !image}
						{@const amber = solid && card.accent === 'accent3'}
						{@const darkText = amber || (solid && card.accent !== 'accent2')}
						<svelte:element
							this={link.href ? 'a' : 'article'}
							class={`rounded-card group relative flex min-h-72 flex-col overflow-hidden p-8 transition duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:transform-none motion-reduce:transition-none ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''} ${index === 2 ? 'lg:row-span-2' : ''} ${index === 4 ? 'lg:col-span-3' : ''} ${solid ? bar(card.accent) : 'bg-surface'}${link.href ? ' no-underline focus-visible:outline-2 focus-visible:outline-offset-4' : ''}`}
							href={link.href || undefined}
							target={link.href && link.newTab ? '_blank' : undefined}
							rel={link.href && link.newTab ? 'noopener noreferrer' : undefined}
						>
							{#if image}
								<img class="absolute inset-0 size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
								<div aria-hidden="true" class="from-ink via-ink/50 absolute inset-0 bg-linear-to-t to-transparent"></div>
							{/if}
							<div class="relative z-10 flex flex-1 flex-col justify-end">
								{#if card.eyebrow}<p class={`text-eyebrow uppercase ${darkText ? 'text-ink' : 'text-white/75'}`}>{card.eyebrow}</p>{/if}
								<h3 class={`font-display mt-3 ${index === 0 ? 'text-heading' : 'text-subheading'} ${darkText ? 'text-ink' : 'text-white'}`}>{titleCase(card.title ?? '')}</h3>
								{#if card.body}<div class={`mt-3 text-base leading-relaxed ${darkText ? 'text-ink' : 'text-white/75'}`}>{@html card.body}</div>{/if}
								{#if card.badge}<span class={`text-spec mt-4 self-start rounded-full px-3 py-1 ${darkText ? 'bg-ink/10 text-ink' : 'bg-white/15 text-white'}`}>{card.badge}</span>{/if}
								{#if link.href && link.label}
									<span class={`mt-auto inline-flex items-center gap-2 self-start pt-6 text-base font-medium ${darkText ? 'text-ink' : 'text-white'}`}>
										{link.label}<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
									</span>
								{/if}
							</div>
						</svelte:element>
					{/each}
			</Reveal>
		</div>
	</section>
</PeelScene>
