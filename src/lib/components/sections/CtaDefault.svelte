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
	let split = $derived(section.type === 'ctaSplitLinks');

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
	data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'md', 'lg'], 'md')}
	data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'md', 'lg'], 'md')}
	style:background-image={`url("${backdrop.src}")`}
	style:background-position={backdrop.position}
	style:background-size="cover"
>
	<div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_85%_at_50%_50%,rgba(10,18,38,0.96),rgba(10,18,38,0.62)_65%,rgba(10,18,38,0.2))]"></div>
	<div class="lumo-inner relative z-10">
		{#if split}
			<div class="grid gap-10 md:grid-cols-2 md:gap-16">
				<Reveal>
					<div class="self-center">
						{#if section.eyebrow}<p class="text-eyebrow mb-5 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
						{#if heading}<h2 class="text-heading text-white">{heading}</h2>{/if}
						{#if body}<div class="prose mt-5 max-w-md text-lead text-white/70">{@html body}</div>{/if}
					</div>
				</Reveal>
				<Reveal delay={0.12}>
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
		{:else}
			<Reveal>
				<div class="mx-auto max-w-3xl text-center">
					{#if section.eyebrow}<p class="text-eyebrow mb-4 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
					{#if heading}<h2 class="text-statement text-white">{heading}</h2>{/if}
					{#if body}<div class="prose mx-auto mt-6 text-lead text-white/75">{@html body}</div>{/if}
					{#if links.length}
						<div class="mt-9 flex flex-wrap items-center justify-center gap-4">
							{#each links as item, index (`${item.label}:${item.href}`)}
								<a class={`rounded-full px-7 py-3 text-base font-medium no-underline transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none ${index === 0 ? 'bg-white text-ink' : 'border border-white/30 text-white'}`} href={item.href} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined}>{item.label}</a>
							{/each}
						</div>
					{/if}
				</div>
			</Reveal>
		{/if}
	</div>
</section>
