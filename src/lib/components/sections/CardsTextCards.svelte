<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type CardLink = { label?: string; url?: string; newTab?: boolean };
	type Card = { eyebrow?: string; title?: string; body?: string; link?: CardLink; linkLabel?: string; linkUrl?: string; badge?: string; accent?: string };
	let { section, media: _media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	const tones: Record<string, { text: string; bar: string }> = {
		accent1: { text: 'text-brand-blue', bar: 'bg-brand-blue' }, accent2: { text: 'text-brand-green', bar: 'bg-brand-green' }, accent3: { text: 'text-brand-amber', bar: 'bg-brand-amber' },
		accent4: { text: 'text-brand-blue', bar: 'bg-brand-blue' }, accent5: { text: 'text-brand-green', bar: 'bg-brand-green' }, accent6: { text: 'text-brand-amber', bar: 'bg-brand-amber' }
	};
	const tone = (accent?: string) => tones[accent ?? ''] ?? tones.accent1;
	const linkFor = (card: Card) => ({ href: card.linkUrl || card.link?.url || '', label: card.linkLabel || card.link?.label || '', newTab: Boolean(card.link?.newTab) });
</script>

<section class="lumo-section" id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')}>
	<div class="lumo-inner">
		{#if section.eyebrow || section.heading || section.intro}
			<Reveal><div class="mb-12 max-w-4xl">
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink whitespace-pre-line">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
			</div></Reveal>
		{/if}
		<Reveal stagger class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each cards as card, index (index)}
				{@const link = linkFor(card)}
				{@const colors = tone(card.accent)}
				<svelte:element
					this={link.href ? 'a' : 'article'}
					class={`rounded-card bg-surface hover:shadow-card group flex flex-col p-8 transition duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none${link.href ? ' focus-visible:outline-2 focus-visible:outline-offset-4' : ''}`}
					href={link.href || undefined}
					target={link.href && link.newTab ? '_blank' : undefined}
					rel={link.href && link.newTab ? 'noopener noreferrer' : undefined}
				>
					<span aria-hidden="true" class={`mb-6 block h-1 w-10 rounded-full ${colors.bar}`}></span>
					{#if card.eyebrow}<p class={`text-eyebrow uppercase ${colors.text}`}>{card.eyebrow}</p>{/if}
					<h3 class="font-display text-subheading text-ink mt-3">{titleCase(card.title ?? '')}</h3>
					{#if card.body}<div class="mt-3 text-base leading-relaxed">{@html card.body}</div>{/if}
					{#if card.badge}<span class="text-spec bg-background text-ink mt-4 self-start rounded-full px-3 py-1">{card.badge}</span>{/if}
					{#if link.href && link.label}<span class={`mt-auto inline-flex items-center gap-2 self-start pt-6 text-base font-medium ${colors.text}`}>{link.label}<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg></span>{/if}
				</svelte:element>
			{/each}
		</Reveal>
	</div>
</section>
