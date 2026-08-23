<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type Card = { title?: string; eyebrow?: string; accent?: string };
	let { section, media: _media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	let accessiblePoints = $derived(cards.map((card) => `${titleCase(card.title ?? '')}${card.eyebrow ? `, ${card.eyebrow}` : ''}`).join('; '));
	const positions = ['top-[30%] left-[28%]', 'top-[26%] left-[70%]', 'top-[52%] left-[49%]', 'top-[74%] left-[68%]', 'top-[76%] left-[28%]'];
	const bars: Record<string, string> = { accent1: 'bg-brand-blue', accent2: 'bg-brand-green', accent3: 'bg-brand-amber', accent4: 'bg-brand-blue', accent5: 'bg-brand-green', accent6: 'bg-brand-amber' };
	const bar = (accent?: string) => bars[accent ?? ''] ?? bars.accent1;
</script>

<section class="lumo-section" id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')}>
	<div class="lumo-inner">
		<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<Reveal><div>
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-6 max-w-2xl">{String(section.intro)}</p>{/if}
			</div></Reveal>

			<Reveal><div>
				<div role="img" aria-label={`LM10 Design Space. Plotted offerings: ${accessiblePoints}`} class="rounded-panel border-border bg-surface relative hidden min-h-120 overflow-hidden border md:block">
					<div aria-hidden="true" class="border-brand-blue/30 absolute inset-8 rounded-[45%_55%_48%_52%] border"></div>
					<p class="text-eyebrow text-brand-blue absolute bottom-6 left-10 uppercase">LM10 Design Space</p>
					{#each cards as card, index (index)}
						<div class={`absolute w-40 -translate-x-1/2 -translate-y-1/2 text-center ${positions[index % positions.length]}`}>
							<span aria-hidden="true" class={`ring-surface mx-auto block size-3 rounded-full ring-4 ${bar(card.accent)}`}></span>
							<span class="bg-background/95 text-ink rounded-card mt-3 block px-3 py-2 shadow-sm"><strong class="font-display block text-base font-medium">{titleCase(card.title ?? '')}</strong>{#if card.eyebrow}<span class="text-muted mt-0.5 block text-xs">{card.eyebrow}</span>{/if}</span>
						</div>
					{/each}
				</div>

				<div class="md:hidden">
					<div aria-hidden="true" class="rounded-card border-border bg-surface relative h-40 overflow-hidden border">
						<div class="border-brand-blue/30 absolute inset-5 rounded-[45%_55%_48%_52%] border"></div>
						<p class="text-eyebrow text-brand-blue absolute bottom-4 left-6 uppercase">LM10 Design Space</p>
						{#each cards as card, index (index)}<span class={`absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${positions[index % positions.length]} ${bar(card.accent)}`}></span>{/each}
					</div>
					<ul class="mt-5 grid gap-3">{#each cards as card, index (index)}<li class="flex items-start gap-3"><span aria-hidden="true" class={`mt-1.5 size-2.5 shrink-0 rounded-full ${bar(card.accent)}`}></span><span><strong class="font-display text-ink block text-base font-medium">{titleCase(card.title ?? '')}</strong>{#if card.eyebrow}<span class="text-muted block text-sm">{card.eyebrow}</span>{/if}</span></li>{/each}</ul>
				</div>
				<dl class="mt-5 grid gap-3 sm:grid-cols-3"><div><dt class="text-eyebrow text-muted uppercase">Field of view</dt><dd class="text-ink text-sm">Narrow to wide</dd></div><div><dt class="text-eyebrow text-muted uppercase">Range</dt><dd class="text-ink text-sm">Short to long</dd></div><div><dt class="text-eyebrow text-muted uppercase">Integration level</dt><dd class="text-ink text-sm">Component to complete lidar system</dd></div></dl>
			</div></Reveal>
		</div>
	</div>
</section>
