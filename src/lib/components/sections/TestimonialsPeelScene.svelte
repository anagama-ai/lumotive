<script lang="ts">
	import PeelScene from '$lib/components/lumotive/peel/PeelScene.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import { titleCase } from '$lib/titlecase';
	import type { Section } from '$lib/sections';

	type Quote = {
		quote?: unknown;
		author?: unknown;
		role?: unknown;
		company?: unknown;
		avatar?: unknown;
	};

	let { section, media, band }: { section: Section; media: MediaMap; band?: Section } = $props();
	let quotes = $derived((Array.isArray(section.quotes) ? section.quotes : []) as Quote[]);
	let heading = $derived(titleCase(section.heading == null ? null : String(section.heading)));
	let track = $state<HTMLDivElement>();

	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};
	const slide = (step: number) => {
		if (!track) return;
		const width = track.clientWidth;
		const index = Math.round(track.scrollLeft / width);
		const next = (index + step + quotes.length) % quotes.length;
		track.scrollTo({ left: next * width, behavior: 'smooth' });
	};
</script>

{#if quotes.length}
	<PeelScene {band} {media}>
		<section
			class="lumo-section"
			id={section.anchor ? String(section.anchor) : undefined}
			data-design-version={section.designVersion ? String(section.designVersion) : undefined}
			data-background={enumValue(section.background, ['none', 'subtle', 'strong', 'inverse'], 'none')}
			data-width={enumValue(section.width, ['contained', 'wide', 'full'], 'contained')}
			data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'md', 'lg'], 'md')}
			data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'md', 'lg'], 'md')}
			data-align={section.align === 'container' ? 'container' : undefined}
		>
			<div class="lumo-inner quote-stage relative flex flex-col justify-center py-6">
				{#if heading}
					<h2 class="font-display text-statement text-ink mb-8">{heading}</h2>
				{/if}
				<div
					bind:this={track}
					class="flex snap-x snap-mandatory items-center overflow-x-auto [scrollbar-width:none]"
					aria-roledescription="carousel"
				>
				{#each quotes as quote, quoteIndex (quoteIndex)}
					{@const avatar = resolveMedia(quote.avatar, media, 320)}
					<div class="w-full shrink-0 snap-center px-4">
						<figure class="mx-auto max-w-5xl text-center">
						<blockquote data-peel="tint-each" class="text-quote text-ink">
							<!-- The trailing space must live inside the expression: Svelte trims literal whitespace between elements, which welds the words together. -->
							{#each `“${String(quote.quote ?? '')}”`.split(' ') as word, index (index)}<span>{word + ' '}</span>{/each}
						</blockquote>

						{#if avatar}
							<img
								data-peel="rise"
								class="mx-auto mt-8 size-20 rounded-full object-cover"
								src={avatar.src}
								srcset={avatar.srcset}
								sizes="80px"
								alt={String(quote.author ?? '')}
								width={avatar.width ?? 160}
								height={avatar.height ?? 160}
								loading="lazy"
							/>
						{/if}
						<figcaption data-peel="rise" class="text-eyebrow mt-4 uppercase text-brand-blue">
							{String(quote.author ?? '')}
							{#if quote.role}<span class="text-ink/70"> — {String(quote.role)}</span>{/if}
							{#if quote.company}<span class="text-ink/70">, {String(quote.company)}</span>{/if}
						</figcaption>
						</figure>
					</div>
				{/each}
				</div>
				{#if quotes.length > 1}
					<button type="button" class="absolute top-1/2 left-0 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-border text-ink hover:bg-surface md:grid" aria-label="Previous testimonial" onclick={() => slide(-1)}>
						<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4" fill="none"><path d="m10 3-5 5 5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
					</button>
					<button type="button" class="absolute top-1/2 right-0 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-border text-ink hover:bg-surface md:grid" aria-label="Next testimonial" onclick={() => slide(1)}>
						<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
					</button>
				{/if}
			</div>
		</section>
	</PeelScene>
{/if}

<style>
	/* The stage held 70dvh of minimum height around a quote that rarely needs
	   half of it, which left the carousel floating in its own section. A little
	   under half a viewport still centres the quote without pinning empty space
	   above and below it. */
	.quote-stage { min-height: 48dvh; }
	/* The display size the quote inherits is a page headline's. At the widest
	   breakpoints that set it larger than the section heading above it; this
	   keeps it the most prominent thing in the section while letting the lines
	   settle into a comfortable measure. */
	@media (min-width: 1024px) {
		.quote-stage blockquote { font-size: clamp(2.5rem, 3.2vw, 3.25rem); line-height: 1.2; }
	}
</style>
