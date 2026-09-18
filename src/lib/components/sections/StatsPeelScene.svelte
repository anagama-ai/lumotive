<script lang="ts">
	import PeelScene from '$lib/components/lumotive/peel/PeelScene.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type Stat = { value?: unknown; label?: unknown; prefix?: unknown; suffix?: unknown; description?: unknown };

	let { section, media, band }: { section: Section; media: MediaMap; band?: Section } = $props();
	let stats = $derived((Array.isArray(section.stats) ? section.stats : []) as Stat[]);
	let image = $derived(resolveMedia(section.media, media, 1440));
	let body = $derived(typeof section.body === 'string' ? section.body : '');
	let heading = $derived(titleCase(typeof section.heading === 'string' ? section.heading : null));

	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};
</script>

{#if stats.length}
	<PeelScene {band} {media}>
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
				<div data-peel-from="dim" class="relative flex min-h-[75dvh] flex-col justify-center overflow-hidden rounded-panel bg-panel">
					{#if image}
						<img class="absolute inset-0 size-full object-cover" src={image.src} srcset={image.srcset} sizes="100vw" alt="" aria-hidden="true" width={image.width ?? 1440} height={image.height ?? 900} />
					{/if}
					<div class="absolute inset-0 bg-panel/35"></div>
					<div class="absolute inset-0 bg-linear-to-b from-panel via-panel/10 to-panel"></div>
					<div class="relative z-10 px-6 py-12 md:px-10 lg:px-14">
						{#if section.eyebrow}<p data-peel="rise" class="text-eyebrow mb-4 uppercase text-brand-amber">{String(section.eyebrow)}</p>{/if}
						{#if heading}
							<h2 data-peel="tint-each" class="text-display max-w-4xl text-white">
								<!-- The trailing space must live inside the expression: Svelte trims literal whitespace between elements, which welds the words together. -->
								{#each heading.split(' ') as word, index (index)}<span>{word + ' '}</span>{/each}
							</h2>
						{/if}
						{#if section.intro}<p data-peel="rise" class="text-lead mt-6 max-w-3xl text-white/70">{String(section.intro)}</p>{/if}
						{#if body}<div data-peel="rise" class="prose body-cta mt-6 max-w-3xl text-lead text-white/70">{@html body}</div>{/if}
						<dl data-peel="rise-each" class="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
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
				</div>
			</div>
		</section>
	</PeelScene>
{/if}

<style>
	/* The body's call to action uses the site's primary CTA pill — the same white
	   fill, ink label, rounded shape and padding as the hero's "Talk to our team"
	   button. `.prose a` in app.css is unlayered, so the override is scoped here
	   rather than written as utilities. */
	.body-cta :global(a) {
		display: inline-flex;
		padding: .75rem 1.75rem;
		border-radius: 999px;
		color: var(--color-ink);
		background: white;
		font-weight: 650;
		text-decoration: none;
		transition: transform 200ms ease, background 200ms ease;
	}
	.body-cta :global(a:hover) { transform: translateY(-2px); background: rgb(255 255 255 / 85%); }
	@media (prefers-reduced-motion: reduce) {
		.body-cta :global(a) { transition: none; }
		.body-cta :global(a:hover) { transform: none; }
	}
</style>
