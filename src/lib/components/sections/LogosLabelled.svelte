<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap, type ResolvedImage } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type Logo = { image: ResolvedImage; name: string; linkLabel: string; linkUrl: string; newTab: boolean };
	let {
		section,
		media,
		dark = false
	}: { section: Section; media: MediaMap; dark?: boolean } = $props();
	let heading = $derived(titleCase(section.heading == null ? null : String(section.heading)));
	let logos = $derived(
		(Array.isArray(section.logos) ? section.logos : []).flatMap((raw): Logo[] => {
			if (!raw || typeof raw !== 'object') return [];
			const row = raw as Record<string, unknown>;
			const image = resolveMedia(row.media, media, 640);
			return image
				? [{
						image,
						name: String(row.name || ''),
						linkLabel: String(row.linkLabel || ''),
						linkUrl: String(row.linkUrl || ''),
						newTab: row.linkNewTab === true || row.linkNewTab === 'true'
					}]
				: [];
		})
	);
</script>

{#snippet logoList()}
	<ul>
		{#each logos as logo (logo.name)}
			<li>
				{#if logo.linkUrl}
					<a
						href={logo.linkUrl}
						aria-label={logo.linkLabel || logo.name}
						target={logo.newTab ? '_blank' : undefined}
						rel={logo.newTab ? 'noreferrer' : undefined}
					>
						<img src={logo.image.src} srcset={logo.image.srcset} sizes="12rem" alt={logo.name} width={logo.image.width ?? 240} height={logo.image.height ?? 100} />
					</a>
				{:else}
					<div class="logo-item">
						<img src={logo.image.src} srcset={logo.image.srcset} sizes="12rem" alt={logo.name} width={logo.image.width ?? 240} height={logo.image.height ?? 100} />
					</div>
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{#if logos.length}
	<section
		class="lumo-section logo-grid-section"
		class:dark
		id={section.anchor ? String(section.anchor) : undefined}
		data-background={section.background ?? 'none'}
		data-width={section.width ?? 'contained'}
		data-spacing-top={section.spacingTop ?? 'md'}
		data-spacing-bottom={section.spacingBottom ?? 'md'}
	>
		<div class="lumo-inner">
			{#if dark}
				<Reveal delay={0}>
					<div class="logo-panel">
						{#if heading}<h2 class="font-display text-heading">{heading}</h2>{/if}
						{#if section.intro}<p class="text-lead intro">{String(section.intro)}</p>{/if}
						{@render logoList()}
					</div>
				</Reveal>
			{:else}
				{#if heading || section.intro}
					<Reveal delay={0}>
						<div class="heading-block">
							{#if heading}<h2 class="font-display text-statement">{heading}</h2>{/if}
							{#if section.intro}<p class="text-lead intro">{String(section.intro)}</p>{/if}
						</div>
					</Reveal>
				{/if}
				<Reveal delay={0}>
					<div class="logo-panel">{@render logoList()}</div>
				</Reveal>
			{/if}
		</div>
	</section>
{/if}

<style>
	.logo-panel { padding: clamp(2rem, 5vw, 3.5rem); border-radius: var(--radius-panel); background: var(--color-surface); }
	h2 { margin: 0; color: var(--color-ink); }
	.heading-block { max-width: 56rem; margin-bottom: 3rem; }
	.intro { max-width: 48rem; margin: .75rem 0 0; color: var(--color-muted); }
	ul { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); align-items: stretch; gap: 2rem; margin: 0; padding: 0; list-style: none; }
	li, li a, .logo-item { min-width: 0; }
	li a, .logo-item { display: flex; height: 100%; min-height: 7.5rem; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--color-ink); text-align: center; text-decoration: none; }
	li img { width: auto; max-width: 11rem; height: auto; max-height: 3.5rem; object-fit: contain; transition: transform 250ms ease; }
	li a:hover img { transform: scale(1.05); }
	.dark .logo-panel { color: white; background: var(--color-panel); }
	.dark h2 { color: white; }
	.dark .intro { color: rgb(255 255 255 / 70%); }
	.dark ul { grid-template-columns: repeat(5, minmax(0, 1fr)); margin-top: 3rem; }
	@media (max-width: 900px) {
		ul, .dark ul { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	}
	@media (max-width: 560px) {
		ul, .dark ul { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
		.logo-panel { padding-inline: 1.25rem; }
	}
	@media (prefers-reduced-motion: reduce) {
		li img { transition: none; }
		li a:hover img { transform: none; }
	}
</style>
