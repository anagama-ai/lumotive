<script lang="ts">
	import Counter from '$lib/components/lumotive/Counter.svelte';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type Stat = {
		value?: unknown;
		label?: unknown;
		prefix?: unknown;
		suffix?: unknown;
		description?: unknown;
	};

	let { section, media }: { section: Section; media: MediaMap } = $props();
	let stats = $derived((Array.isArray(section.stats) ? section.stats : []) as Stat[]);
	let image = $derived(resolveMedia(section.media, media, 1440));
	let body = $derived(typeof section.body === 'string' ? section.body : '');
	let heading = $derived(titleCase(typeof section.heading === 'string' ? section.heading : null));
	let variant = $derived(section.type);

	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};
	const numeric = (stat: Stat) => Number.parseFloat(String(stat.value ?? ''));
</script>

{#if stats.length}
	<section
		class="lumo-section"
		id={section.anchor ? String(section.anchor) : undefined}
		data-design-version={section.designVersion ? String(section.designVersion) : undefined}
		data-background={enumValue(section.background, ['none', 'subtle', 'strong', 'inverse'], 'none')}
		data-width={enumValue(section.width, ['contained', 'wide', 'full'], 'contained')}
		data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'md', 'lg'], 'md')}
		data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'md', 'lg'], 'md')}
	>
		<div class="lumo-inner">
			{#if variant === 'statsSpecPills'}
				<Reveal>
					<div class="mx-auto max-w-3xl text-center">
						{#if heading}<h2 class="text-statement">{heading}</h2>{/if}
						{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
					</div>
					<ul class="mt-10 flex flex-wrap justify-center gap-3" aria-label="Specifications">
						{#each stats as stat, index (index)}
							<li class="rounded-full border border-current/15 bg-surface px-5 py-2 text-base text-ink">
								{String(stat.value ?? '')}
							</li>
						{/each}
					</ul>
				</Reveal>
			{:else if variant === 'statsDarkTraits'}
				<Reveal>
					<div class="relative min-h-96 overflow-hidden rounded-panel bg-panel p-8 text-white md:p-14 lg:p-16">
						{#if image}
							<img
								class="absolute inset-0 size-full object-cover object-right-top"
								src={image.src}
								srcset={image.srcset}
								sizes="(min-width: 1160px) 1160px, 100vw"
								alt=""
								aria-hidden="true"
								width={image.width ?? 1200}
								height={image.height ?? 675}
							/>
							<div class="absolute inset-0 bg-linear-to-r from-panel via-panel/85 to-panel/35"></div>
						{/if}
						<div class="relative z-10 max-w-3xl">
							{#if section.eyebrow}<p class="text-eyebrow mb-4 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
							{#if heading}<h2 class="text-heading text-white">{heading}</h2>{/if}
							{#if body}<div class="prose mt-5 text-lead text-white/70">{@html body}</div>{/if}
							{#if section.intro}<p class="text-spec mt-5 text-white/55">{String(section.intro)}</p>{/if}
						</div>
						<dl class="relative z-10 mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
							{#each stats as stat, index (index)}
								<div>
									<dt class="text-base text-white">{String(stat.label ?? '')}</dt>
									<dd class:text-brand-blue={index % 3 === 0} class:text-brand-green={index % 3 === 1} class:text-brand-amber={index % 3 === 2} class="text-spec mt-1">
										{String(stat.prefix ?? '')}{String(stat.value ?? '')}{String(stat.suffix ?? '')}
									</dd>
									{#if stat.description}<dd class="mt-2 text-sm text-white/55">{String(stat.description)}</dd>{/if}
								</div>
							{/each}
						</dl>
					</div>
				</Reveal>
			{:else if variant === 'statsLightTraits'}
				<Reveal>
					<div class="max-w-4xl">
						{#if section.eyebrow}<p class="text-eyebrow mb-4 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
						{#if heading}<h2 class="text-heading text-ink">{heading}</h2>{/if}
						{#if body}<div class="prose mt-5 text-lead">{@html body}</div>{/if}
						{#if section.intro}<p class="mt-5">{String(section.intro)}</p>{/if}
					</div>
					<dl class="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
						{#each stats as stat, index (index)}
							<div>
								<dt class="text-base">{String(stat.label ?? '')}</dt>
								<dd class:text-brand-blue={index % 3 === 0} class:text-brand-green={index % 3 === 1} class:text-brand-amber={index % 3 === 2} class="text-spec mt-1">
									{String(stat.prefix ?? '')}{String(stat.value ?? '')}{String(stat.suffix ?? '')}
								</dd>
								{#if stat.description}<dd class="mt-2 text-sm opacity-65">{String(stat.description)}</dd>{/if}
							</div>
						{/each}
					</dl>
				</Reveal>
			{:else}
				<Reveal>
					<div class="mx-auto max-w-5xl text-center">
						{#if section.eyebrow}<p class="text-eyebrow mb-4 uppercase text-brand-blue">{String(section.eyebrow)}</p>{/if}
						{#if heading}<h2 class="text-statement text-ink">{heading}</h2>{/if}
						{#if section.intro}<p class="text-lead mx-auto mt-4 max-w-3xl">{String(section.intro)}</p>{/if}
						{#if body}<div class="prose mx-auto mt-5 max-w-3xl text-lead">{@html body}</div>{/if}
						{#if image}
							<img class="mx-auto mt-8 w-full max-w-sm" src={image.src} srcset={image.srcset} sizes="384px" alt={image.alt} width={image.width ?? 640} height={image.height ?? 480} />
						{/if}
						<dl class="mt-12 grid gap-10 sm:grid-cols-3">
							{#each stats as stat, index (index)}
								<div>
									<dd class:text-brand-blue={index % 3 === 0} class:text-brand-green={index % 3 === 1} class:text-brand-amber={index % 3 === 2} class="text-5xl font-medium tracking-tight">
										{#if Number.isFinite(numeric(stat))}
											<Counter value={numeric(stat)} prefix={String(stat.prefix ?? '')} suffix={String(stat.suffix ?? '')} />
										{:else}
											{String(stat.prefix ?? '')}{String(stat.value ?? '')}{String(stat.suffix ?? '')}
										{/if}
									</dd>
									<dt class="text-spec mt-2">{String(stat.label ?? '')}</dt>
									{#if stat.description}<dd class="mt-2 text-sm opacity-70">{String(stat.description)}</dd>{/if}
								</div>
							{/each}
						</dl>
					</div>
				</Reveal>
			{/if}
		</div>
	</section>
{/if}
