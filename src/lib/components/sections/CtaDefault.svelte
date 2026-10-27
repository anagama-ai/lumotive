<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type RawLink = { label?: unknown; url?: unknown; newTab?: unknown; link?: RawLink };
	type Link = { label: string; href: string; newTab: boolean };

	let { section, media }: { section: Section; media: MediaMap } = $props();
	let body = $derived(typeof section.body === 'string' ? section.body : '');
	let heading = $derived(titleCase(typeof section.heading === 'string' ? section.heading : null));
	// `mode: "stacked"` turns the split CTA into one left-aligned column with a
	// button-led action row. Opt-in per section, so the two-column CTAs on
	// /contact and /culture are unchanged.
	let stacked = $derived(section.type === 'ctaSplitLinks' && String(section.mode ?? '') === 'stacked');
	// Optional lead-in printed before the secondary action. Unset elsewhere.
	let note = $derived(String(section.note ?? '').trim());
	// Optional small trailing line under the action row, for the reference
	// design caveat the package prints at the foot of a category page.
	let caveat = $derived(String(section.caveat ?? '').trim());
	// `tone: "light"` drops the dark panel and its backdrop for the page field,
	// for the per-kit action rows a category page repeats between kit sections,
	// where a dark slab after every kit would read as several closing CTAs.
	// Stacked only; the page's own closing CTA keeps the dark panel.
	let light = $derived(stacked && String(section.tone ?? '') === 'light');
	let split = $derived(section.type === 'ctaSplitLinks' && !stacked);
	// Opt-in, phones only (<768px): less padding above and below the content,
	// for a closing CTA that would otherwise stand taller than the content
	// above it. Text, buttons, links and the caveat are unchanged; tablet and
	// desktop use the section spacing.
	let compactMobile = $derived(section.compactMobile === true || section.compactMobile === 'true');
	// Stacked only: an optional image beside the copy (right from 768px,
	// above the copy on phones, as split sections set it), for a block the
	// package prints with a visual next to its two actions. Unset elsewhere,
	// where the stacked markup is unchanged.
	let visual = $derived(stacked ? resolveMedia(section.media, media, 1024) : null);
	// `textAlign: "left"`: the centred closing CTA set on the container's left
	// edge instead (/applications, as its PDF page prints it). Same panel,
	// type, buttons and width; unset elsewhere, where it stays centred.
	let leftAligned = $derived(String(section.textAlign ?? '') === 'left');

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
	class="lumo-section relative isolate overflow-hidden"
	class:bg-panel={!light}
	class:cta-light={light}
	class:compact-mobile={compactMobile}
	id={section.anchor ? String(section.anchor) : undefined}
	data-design-version={section.designVersion ? String(section.designVersion) : undefined}
	data-background={enumValue(section.background, ['none', 'subtle', 'strong', 'inverse'], 'none')}
	data-width={enumValue(section.width, ['contained', 'wide', 'full'], 'contained')}
	data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'compact', 'md', 'lg', 'xl'], 'md')}
	data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'compact', 'md', 'lg', 'xl'], 'md')}
	data-align={stacked || section.align === 'container' ? 'container' : undefined}
	style:background-image={light ? undefined : `url("${backdrop.src}")`}
	style:background-position={light ? undefined : backdrop.position}
	style:background-size={light ? undefined : 'cover'}
>
	{#if !light}
		<div
			class={`pointer-events-none absolute inset-0 -z-10 ${split || stacked ? 'from-panel/70 via-panel/45 to-panel/20 bg-linear-75 from-25% via-60%' : 'bg-[radial-gradient(ellipse_55%_70%_at_50%_50%,rgba(10,18,38,0.94),rgba(10,18,38,0.55)_65%,rgba(10,18,38,0.15))]'}`}
		></div>
	{/if}
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
			{#if visual}
				<div class="grid items-center gap-10 md:grid-cols-2 md:gap-16">
					<Reveal x={24} y={12} duration={1.1} class="md:order-2">
						<img class="rounded-card block h-auto w-full" src={visual.src} srcset={visual.srcset} sizes="(min-width: 768px) 50vw, 100vw" alt={visual.alt} width={visual.width ?? 1600} height={visual.height ?? 900} loading="lazy" />
					</Reveal>
					{@render stackedCopy()}
				</div>
			{:else}
				{@render stackedCopy()}
			{/if}
		{:else}
			<Reveal stagger class={leftAligned ? 'max-w-3xl text-left' : 'mx-auto max-w-3xl text-center'}>
				{#if section.eyebrow}<p class="text-eyebrow mb-4 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
				{#if heading}<h2 class="font-display text-statement text-white">{heading}</h2>{/if}
				{#if body}<div class="prose mt-6 text-lead text-white/75" class:mx-auto={!leftAligned}>{@html body}</div>{/if}
				{#if links.length}
					<div class="mt-9 flex flex-wrap items-center gap-4" class:justify-center={!leftAligned} class:justify-start={leftAligned}>
						{#each links as item, index (`${item.label}:${item.href}`)}
							<!-- The secondary action is outlined on the dark panel. Its
							     colours are scoped CSS, not utilities: a bare `text-white`
							     loses to the global anchor colour, which left the label at
							     Slate Text on the panel, and the border colour fell back to
							     the light `--color-border` token. -->
							<a class={`rounded-full px-7 py-3 text-base font-medium no-underline transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none ${index === 0 ? 'bg-white text-ink' : 'cta-pill-outline'}`} href={item.href} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined}>{item.label}</a>
						{/each}
					</div>
				{/if}
			</Reveal>
		{/if}
	</div>
</section>

{#snippet stackedCopy()}
	<Reveal stagger class="max-w-3xl">
		{#if section.eyebrow}<p class="text-eyebrow mb-5 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
		{#if heading}<h2 class={`font-display text-white ${enumValue(section.headingSize, ['heading', 'statement'], 'heading') === 'statement' ? 'text-statement' : 'text-heading'}`}>{heading}</h2>{/if}
		{#if body}<div class="prose mt-5 text-lead text-white/75">{@html body}</div>{/if}
		{#if links.length}
			<div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
				{#each links as item, index (`${item.label}:${item.href}`)}
					<!-- The package prints a lead-in before the secondary action
					     ("Designing at the chip level? Explore LCM chips →"), so the
					     note sits with that link rather than under the pair. -->
					{#if index === 1 && note}<span class="cta-note">{note}</span>{/if}
					{#if index === 0}
						<a class="cta-button" href={item.href} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined}>{item.label}</a>
					{:else}
						<a class="cta-text-link" href={item.href} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined}>{item.label} <span aria-hidden="true">→</span></a>
					{/if}
				{/each}
			</div>
		{/if}
		{#if caveat}<p class="cta-caveat">{caveat}</p>{/if}
	</Reveal>
{/snippet}

<style>
	/* Matches the hero's primary button: a bare `text-ink` utility loses to the
	   global anchor colour, so the pill is styled in scoped CSS. */
	.cta-note { color: rgb(255 255 255 / 75%); font-size: var(--text-spec); line-height: 1.5; }
	/* Same small, quiet treatment as the lead-in note, set apart from the
	   action row above it. */
	.cta-caveat { margin-top: 2rem; max-width: 46rem; color: rgb(255 255 255 / 75%); font-size: var(--text-spec); line-height: 1.5; }
	/* The heading's default top margin collapses through its wrapper and
	   added 28px above the content only, so the padding is the whole gap,
	   the same on both sides, as the other compact phone settings do. */
	@media (max-width: 767px) {
		.compact-mobile > .lumo-inner { padding-block: 4.5rem; }
		.compact-mobile > .lumo-inner > :global(:first-child > :first-child) { margin-top: 0; }
	}
	.cta-button { display: inline-flex; padding: .75rem 1.75rem; border-radius: 999px; color: var(--color-ink); background: #fff; font-weight: 650; text-decoration: none; transition: transform 200ms ease, background 200ms ease; }
	.cta-button:hover { transform: translateY(-2px); background: rgb(255 255 255 / 85%); }
	@media (prefers-reduced-motion: reduce) {
		.cta-button { transition: none; }
		.cta-button:hover { transform: none; }
	}
	/* A bare utility loses to the global anchor colour, so the secondary action
	   is coloured the same scoped way the other section links are. White on the
	   dark panel, matching the primary button's contrast. */
	/* The 2.75rem minimum the other standalone actions carry: at the body
	   line-height alone this was a 25px tap target. */
	.cta-text-link { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .5rem; color: #fff; font-weight: 650; text-decoration: none; }
	.cta-text-link span { transition: transform 200ms ease; }
	.cta-text-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.cta-text-link span { transition: none; }
		.cta-text-link:hover span { transform: none; }
	}
	/* Light tone. The stacked markup is shared, so the dark-panel colours are
	   re-pointed here rather than branched in the template. Every value is an
	   existing token: Optical Ink for the heading and the pill, Slate Text for
	   the body and the small lines, Laser Blue for the secondary action. */
	.cta-light :global(h2) { color: var(--color-ink); }
	.cta-light :global(.prose) { color: var(--color-text); }
	.cta-light :global(.text-eyebrow) { color: var(--color-brand-blue-dark); }
	.cta-light .cta-note, .cta-light .cta-caveat { color: var(--color-text); }
	.cta-light .cta-button { color: #fff; background: var(--color-ink); }
	.cta-light .cta-button:hover { background: rgb(10 18 38 / 88%); }
	/* Deep Laser Blue, not Laser Blue: at the action's 16px the lighter blue is
	   4.15:1 on the page field, under the 4.5:1 floor. Same correction the
	   section links elsewhere carry. */
	.cta-light .cta-text-link { color: var(--color-brand-blue-dark); }
	/* Outlined secondary action on the dark panel: white label at 16:1 and a
	   border at 70% white, which clears the 3:1 floor a non-text control needs.
	   Hover fills faintly and takes the border to solid white; focus draws a
	   visible ring rather than relying on the default outline, which is nearly
	   invisible against this backdrop. */
	.cta-pill-outline { border: 1px solid rgb(255 255 255 / 70%); color: #fff; }
	.cta-pill-outline:hover { border-color: #fff; background: rgb(255 255 255 / 12%); }
	.cta-pill-outline:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
</style>
