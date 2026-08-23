<script lang="ts">
	import Counter from '$lib/components/lumotive/Counter.svelte';
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';

	type Stat = { value?: unknown; label?: unknown; prefix?: unknown; suffix?: unknown; description?: unknown };

	let { section, media: _media }: { section: Section; media: MediaMap } = $props();
	let stats = $derived((Array.isArray(section.stats) ? section.stats : []) as Stat[]);

	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};
</script>

{#if stats.length}
	<section
		class="lumo-section stats-scene-band"
		id={section.anchor ? String(section.anchor) : undefined}
		data-design-version={section.designVersion ? String(section.designVersion) : undefined}
		data-background={enumValue(section.background, ['none', 'subtle', 'strong', 'inverse'], 'none')}
		data-width={enumValue(section.width, ['contained', 'wide', 'full'], 'contained')}
		data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'md', 'lg'], 'md')}
		data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'md', 'lg'], 'md')}
	>
		<div class="lumo-inner">
			<dl data-peel="rise-each" class="grid gap-8 text-center sm:grid-cols-3">
				{#each stats as stat, index (index)}
					<div>
						<dd class:text-brand-blue={index % 3 === 0} class:text-brand-green={index % 3 === 1} class:text-brand-amber={index % 3 === 2} class="text-5xl font-medium tracking-tight">
							{#if Number.isFinite(Number.parseFloat(String(stat.value ?? '')))}
								<Counter value={Number.parseFloat(String(stat.value))} prefix={String(stat.prefix ?? '')} suffix={String(stat.suffix ?? '')} />
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
	</section>
{/if}
