<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type CardLink = { label?: string; url?: string; newTab?: boolean };
	type Card = { media?: unknown; eyebrow?: string; title?: string; body?: string; link?: CardLink; linkLabel?: string; linkUrl?: string; badge?: string; accent?: string };
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	const tones: Record<string, string> = { accent1: 'text-brand-blue', accent2: 'text-brand-green', accent3: 'text-brand-amber', accent4: 'text-brand-blue', accent5: 'text-brand-green', accent6: 'text-brand-amber' };
	const tone = (accent?: string) => tones[accent ?? ''] ?? tones.accent1;
	const linkFor = (card: Card) => ({ href: card.linkUrl || card.link?.url || '', label: card.linkLabel || card.link?.label || '', newTab: Boolean(card.link?.newTab) });
	// Opt-in, per section. `iconTint: "accent"` paints each icon in its card's
	// accent, using the same tokens as the decorative bars on text cards, by
	// masking a fill with the icon's alpha. `iconSize: "sm"` sets icons at
	// 4rem instead of 5rem. Unset on every other section, so they render as before.
	const fills: Record<string, string> = { accent1: 'bg-brand-blue', accent2: 'bg-brand-green', accent3: 'bg-brand-amber', accent4: 'bg-brand-blue', accent5: 'bg-brand-green', accent6: 'bg-brand-amber' };
	const fill = (accent?: string) => fills[accent ?? ''] ?? fills.accent1;
	let tinted = $derived(section.iconTint === 'accent');
	let iconBox = $derived(section.iconSize === 'sm' ? 'size-16' : 'size-20');
</script>

<section class="lumo-section" id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')} data-align={section.align === 'container' ? 'container' : undefined}>
	<div class="lumo-inner">
		{#if section.eyebrow || section.heading || section.intro}
			<Reveal><div class="mb-12 max-w-4xl">
				<!-- Deep Laser Blue: at the eyebrow's 12px the lighter blue measures
				     4.15:1 on the page field, under the 4.5:1 floor. -->
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink whitespace-pre-line">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
			</div></Reveal>
		{/if}
		<Reveal stagger class={`grid gap-6 md:grid-cols-2 ${cards.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
			{#each cards as card, index (index)}
				{@const image = resolveMedia(card.media, media, 320)}
				{@const link = linkFor(card)}
				<svelte:element
					this={link.href ? 'a' : 'article'}
					class={`rounded-card bg-surface hover:shadow-card group flex flex-col p-8 transition duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none${link.href ? ' no-underline focus-visible:outline-2 focus-visible:outline-offset-4' : ''}`}
					href={link.href || undefined}
					target={link.href && link.newTab ? '_blank' : undefined}
					rel={link.href && link.newTab ? 'noopener noreferrer' : undefined}
				>
					{#if image && tinted}
						<span aria-hidden="true" class={`icon-mask mb-4 block ${iconBox} ${fill(card.accent)}`} style:--icon={`url("${image.src}")`}></span>
					{:else if image}
						<img class={`mb-4 ${iconBox} object-contain`} src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
					{/if}
					{#if card.eyebrow}<p class={`text-eyebrow uppercase ${tone(card.accent)}`}>{card.eyebrow}</p>{/if}
					<h3 class="font-display text-subheading text-ink mt-2 mb-0">{section.casing === 'exact' ? (card.title ?? '') : titleCase(card.title ?? '')}</h3>
					{#if card.body}<div class="mt-2 text-base leading-relaxed [&_p]:my-0 [&_p+p]:mt-2">{@html card.body}</div>{/if}
					{#if card.badge}<span class="text-spec bg-background text-ink mt-4 self-start rounded-full px-3 py-1">{card.badge}</span>{/if}
					{#if link.href && link.label}<span class={`mt-auto inline-flex items-center gap-2 self-start pt-6 text-base font-medium ${tone(card.accent)}`}>{link.label}<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg></span>{/if}
				</svelte:element>
			{/each}
		</Reveal>
		{#if section.conclusion}
			<Reveal delay={0.1}><p class="conclusion text-lead text-ink mt-10 max-w-3xl font-medium">{String(section.conclusion)}</p></Reveal>
		{/if}
	</div>
</section>

<style>
	.icon-mask { -webkit-mask: var(--icon) center / contain no-repeat; mask: var(--icon) center / contain no-repeat; }
	/* `background: inverse` (the dark panel): white type and translucent
	   cards, so the section reads as one dark band. Amber eyebrow, as on the
	   other dark sections. */
	[data-background='inverse'] h2, [data-background='inverse'] h3 { color: #fff; }
	[data-background='inverse'] .text-eyebrow.text-brand-blue-dark { color: var(--color-brand-amber); }
	[data-background='inverse'] .text-lead { color: rgb(255 255 255 / 75%); }
	[data-background='inverse'] .conclusion { color: #fff; }
	[data-background='inverse'] .rounded-card { border: 1px solid rgb(255 255 255 / 12%); background: rgb(255 255 255 / 6%); color: rgb(255 255 255 / 70%); }
</style>
