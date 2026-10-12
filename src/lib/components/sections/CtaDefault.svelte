<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type RawLink = { label?: unknown; url?: unknown; newTab?: unknown; link?: RawLink };
	type Link = { label: string; href: string; newTab: boolean };

	let { section, media: _media }: { section: Section; media: MediaMap } = $props();
	let body = $derived(typeof section.body === 'string' ? section.body : '');
	let heading = $derived(titleCase(typeof section.heading === 'string' ? section.heading : null));
	// `mode: "stacked"` turns the split CTA into one left-aligned column with a
	// button-led action row. Opt-in per section, so the two-column CTAs on
	// /contact and /culture are unchanged.
	let stacked = $derived(section.type === 'ctaSplitLinks' && String(section.mode ?? '') === 'stacked');
	let split = $derived(section.type === 'ctaSplitLinks' && !stacked);

	const backdrops: Record<string, { src: string; position: string }> = {
		ctaDefault: { src: '/lumotive/img/cta-glow.jpg', position: 'right center' },
		ctaSplitLinks: { src: '/lumotive/img/cta-glow.jpg', position: 'center' },
		ctaLattice: { src: '/lumotive/img/cta-lattice.jpg', position: 'right center' },
		ctaFabric: { src: '/lumotive/img/cta-fabric.jpg', position: 'right bottom' },
		ctaLightField: { src: '/lumotive/img/cta-lightfield.jpg', position: 'left center' },
		ctaSpectrum: { src: '/lumotive/img/cta-spectrum.jpg', position: 'center bottom' }
	};
	let backdrop = $derived(backdrops[section.type] ?? backdrops.ctaDefault);

	const truthy = (value: unknown) => value === true || String(value).toLowerCase() === 'true';
	const link = (raw: unknown): Link | null => {
		if (!raw || typeof raw !== 'object') return null;
		const source = ((raw as RawLink).link ?? raw) as RawLink;
		const label = String(source.label ?? '').trim();
		const href = String(source.url ?? '').trim();
		return label && href ? { label, href, newTab: truthy(source.newTab) } : null;
	};
	let links = $derived.by(() => {
		const rows = Array.isArray(section.secondaryLinks) ? section.secondaryLinks : [];
		const candidates: unknown[] = [
			{
				label: section.primaryLinkLabel,
				url: section.primaryLinkUrl,
				newTab: section.primaryLinkNewTab
			},
			section.primaryLink,
			{
				label: section.secondaryLinkLabel,
				url: section.secondaryLinkUrl,
				newTab: section.secondaryLinkNewTab
			},
			section.secondaryLink,
			...rows
		];
		const result: Link[] = [];
		for (const candidate of candidates) {
			const value = link(candidate);
			if (!value || result.some((item) => item.label === value.label && item.href === value.href)) continue;
			result.push(value);
		}
		return result;
	});

	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};
</script>

<section
	class="lumo-section relative isolate overflow-hidden bg-panel"
	id={section.anchor ? String(section.anchor) : undefined}
	data-design-version={section.designVersion ? String(section.designVersion) : undefined}
	data-background={enumValue(section.background, ['none', 'subtle', 'strong', 'inverse'], 'none')}
	data-width={enumValue(section.width, ['contained', 'wide', 'full'], 'contained')}
	data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'md', 'lg', 'xl'], 'md')}
	data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'md', 'lg', 'xl'], 'md')}
	data-align={stacked || section.align === 'container' ? 'container' : undefined}
	style:background-image={`url("${backdrop.src}")`}
	style:background-position={backdrop.position}
	style:background-size="cover"
>
	<div
		class={`pointer-events-none absolute inset-0 -z-10 ${split || stacked ? 'from-panel/70 via-panel/45 to-panel/20 bg-linear-75 from-25% via-60%' : 'bg-[radial-gradient(ellipse_55%_70%_at_50%_50%,rgba(10,18,38,0.94),rgba(10,18,38,0.55)_65%,rgba(10,18,38,0.15))]'}`}
	></div>
	<div class="lumo-inner relative z-10">
		{#if split}
			<div class="grid gap-10 md:grid-cols-2 md:gap-16">
				<Reveal stagger class="self-center">
					{#if section.eyebrow}<p class="text-eyebrow mb-5 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
					{#if heading}<h2 class={`font-display text-white ${enumValue(section.headingSize, ['heading', 'statement'], 'heading') === 'statement' ? 'text-statement' : 'text-heading'}`}>{heading}</h2>{/if}
					{#if body}<div class="prose mt-5 max-w-md text-lead text-white/70">{@html body}</div>{/if}
				</Reveal>
				<Reveal stagger="li" delay={0.12} class="self-center">
					<ul class="self-center">
						{#each links as item, index (`${item.label}:${item.href}`)}
							<li>
								<a class="group flex items-center justify-between gap-6 border-b border-white/15 py-5 text-lg text-white no-underline transition-colors duration-200 hover:border-white/40" href={item.href} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined}>
									<span>{item.label}</span><span aria-hidden="true" class:text-brand-blue={index % 3 === 0} class:text-brand-green={index % 3 === 1} class:text-brand-amber={index % 3 === 2}>→</span>
								</a>
							</li>
						{/each}
					</ul>
				</Reveal>
			</div>
		{:else if stacked}
			<Reveal stagger class="max-w-3xl">
				{#if section.eyebrow}<p class="text-eyebrow mb-5 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
				{#if heading}<h2 class={`font-display text-white ${enumValue(section.headingSize, ['heading', 'statement'], 'heading') === 'statement' ? 'text-statement' : 'text-heading'}`}>{heading}</h2>{/if}
				{#if body}<div class="prose mt-5 text-lead text-white/75">{@html body}</div>{/if}
				{#if links.length}
					<div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
						{#each links as item, index (`${item.label}:${item.href}`)}
							{#if index === 0}
								<a class="cta-button" href={item.href} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined}>{item.label}</a>
							{:else}
								<a class="cta-text-link" href={item.href} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined}>{item.label} <span aria-hidden="true">→</span></a>
							{/if}
						{/each}
					</div>
				{/if}
			</Reveal>
		{:else}
			<Reveal stagger class="mx-auto max-w-3xl text-center">
				{#if section.eyebrow}<p class="text-eyebrow mb-4 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
				{#if heading}<h2 class="font-display text-statement text-white">{heading}</h2>{/if}
				{#if body}<div class="prose mx-auto mt-6 text-lead text-white/75">{@html body}</div>{/if}
				{#if links.length}
					<div class="mt-9 flex flex-wrap items-center justify-center gap-4">
						{#each links as item, index (`${item.label}:${item.href}`)}
							<a class={`rounded-full px-7 py-3 text-base font-medium no-underline transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none ${index === 0 ? 'bg-white text-ink' : 'border border-white/30 text-white'}`} href={item.href} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined}>{item.label}</a>
						{/each}
					</div>
				{/if}
			</Reveal>
		{/if}
	</div>
</section>

<style>
	/* Matches the hero's primary button: a bare `text-ink` utility loses to the
	   global anchor colour, so the pill is styled in scoped CSS. */
	.cta-button { display: inline-flex; padding: .75rem 1.75rem; border-radius: 999px; color: var(--color-ink); background: #fff; font-weight: 650; text-decoration: none; transition: transform 200ms ease, background 200ms ease; }
	.cta-button:hover { transform: translateY(-2px); background: rgb(255 255 255 / 85%); }
	@media (prefers-reduced-motion: reduce) {
		.cta-button { transition: none; }
		.cta-button:hover { transform: none; }
	}
	/* A bare utility loses to the global anchor colour, so the secondary action
	   is coloured the same scoped way the other section links are. White on the
	   dark panel, matching the primary button's contrast. */
	.cta-text-link { display: inline-flex; gap: .5rem; color: #fff; font-weight: 650; text-decoration: none; }
	.cta-text-link span { transition: transform 200ms ease; }
	.cta-text-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.cta-text-link span { transition: none; }
		.cta-text-link:hover span { transform: none; }
	}
</style>
