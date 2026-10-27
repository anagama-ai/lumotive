<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { TeaserPost } from '$lib/posts.server';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	let {
		section,
		media,
		posts = []
	}: { section: Section; media: MediaMap; posts?: TeaserPost[] } = $props();

	// Accents cycle so the three teasers read as a set, matching the other
	// card grids on the page.
	// Text-safe variants (Deep Laser Blue, Signal Green Text, Optical Amber
	// Text): the bright accents measure 4.15, 3.19 and 1.82:1 as 12px text.
	const TONES = ['text-brand-blue-dark', 'text-brand-green-text', 'text-brand-amber-text'];

	let linkLabel = $derived(String(section.linkLabel ?? '').trim());
	let linkUrl = $derived(String(section.linkUrl ?? '').trim());

	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};
</script>

<!-- Renders nothing until the CMS has posts to show, so the home page never
     carries an empty band. -->
{#if posts.length}
	<section
		class="lumo-section"
		id={section.anchor ? String(section.anchor) : undefined}
		data-design-version={section.designVersion ? String(section.designVersion) : undefined}
		data-background={enumValue(section.background, ['none', 'subtle', 'strong', 'inverse'], 'none')}
		data-width={enumValue(section.width, ['contained', 'wide', 'full'], 'contained')}
		data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'md', 'md-compact-phone', 'lg', 'xl'], 'md')}
		data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'md', 'md-compact-phone', 'lg', 'xl'], 'md')}
		data-align="container"
	>
		<div class="lumo-inner">
			{#if section.eyebrow || section.heading}
				<Reveal>
					<div class="posts-head max-w-4xl">
						{#if section.eyebrow}
							<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>
						{/if}
						{#if section.heading}
							<h2 class="font-display text-statement text-ink">
								{titleCase(String(section.heading))}
							</h2>
						{/if}
					</div>
				</Reveal>
			{/if}

			<Reveal stagger class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each posts as post (post.slug)}
					{@const image = resolveMedia(post.image, media, 1024)}
					<a
						class="rounded-card bg-surface hover:shadow-card group flex flex-col overflow-hidden no-underline transition duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transform-none motion-reduce:transition-none"
						href={`/posts/${post.slug}`}
					>
						{#if image}
							<div class="relative aspect-video w-full overflow-hidden">
								<img
									class="absolute inset-0 size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
									src={image.src}
									srcset={image.srcset}
									alt={image.alt}
									width={image.width}
									height={image.height}
									loading="lazy"
								/>
							</div>
						{/if}
						<div class="flex flex-1 flex-col p-8">
							{#if post.category}
								<p class="text-eyebrow uppercase {TONES[posts.indexOf(post) % TONES.length]}">
									{post.category}
								</p>
							{/if}
							<h3 class="font-display text-subheading text-ink mt-3">{post.title}</h3>
							{#if post.excerpt}
								<p class="post-excerpt mt-3 text-base leading-relaxed">{post.excerpt}</p>
							{/if}
						</div>
					</a>
				{/each}
			</Reveal>

			{#if linkLabel && linkUrl}
				<Reveal delay={0.12}>
					<a class="posts-link" href={linkUrl}>{linkLabel} <span aria-hidden="true">→</span></a>
				</Reveal>
			{/if}
		</div>
	</section>
{/if}

<style>
	.posts-head { margin-bottom: 2.5rem; }
	/* Summaries are post excerpts of uneven length; three lines keeps the grid
	   even without truncating a card's title or hiding its link. */
	.post-excerpt {
		display: -webkit-box;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
	}
	/* A bare utility class loses to the global anchor colour, so the section
	   action is coloured the same scoped way the other section links are. */
	.posts-link {
		display: inline-flex;
		min-height: 2.75rem;
		align-items: center;
		gap: .5rem;
		margin-top: 2.5rem;
		color: var(--color-brand-blue-dark);
		font-weight: 650;
		text-decoration: none;
	}
	.posts-link span { transition: transform 200ms ease; }
	.posts-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.posts-link span { transition: none; }
		.posts-link:hover span { transform: none; }
	}
</style>
