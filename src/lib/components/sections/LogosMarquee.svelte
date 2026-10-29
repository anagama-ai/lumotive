<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap, type ResolvedImage } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type Logo = { image: ResolvedImage; name: string; linkLabel: string; linkUrl: string; newTab: boolean };
	let {
		section,
		media,
		sceneBand = false
	}: { section: Section; media: MediaMap; sceneBand?: boolean } = $props();
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
	let lane = $derived([...logos, ...logos]);
</script>

{#if logos.length}
	<section
		class="lumo-section logos-marquee"
		class:scene-band={sceneBand}
		id={section.anchor ? String(section.anchor) : undefined}
		data-background={section.background ?? 'none'}
		data-width={section.width ?? 'contained'}
		data-spacing-top={section.spacingTop ?? 'md'}
		data-spacing-bottom={section.spacingBottom ?? 'md'}
		data-align={section.align === 'container' ? 'container' : undefined}
	>
		<div class="lumo-inner">
			<Reveal delay={0}>
				{#if heading}<h2 class="text-eyebrow marquee-heading uppercase">{heading}</h2>{/if}
			</Reveal>
			<div class="marquee-window" aria-label={heading || 'Partner logos'}>
				<div class="marquee-lane">
					{#each lane as logo, index (index)}
						<div class="logo-cell" class:duplicate={index >= logos.length} aria-hidden={index >= logos.length ? 'true' : undefined}>
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
								<img src={logo.image.src} srcset={logo.image.srcset} sizes="12rem" alt={logo.name} width={logo.image.width ?? 240} height={logo.image.height ?? 100} />
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.marquee-heading { margin: 0 0 1rem; text-align: center; }
	.marquee-window { position: relative; overflow: hidden; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
	.marquee-lane { display: flex; width: max-content; align-items: center; animation: marquee 32s linear infinite; }
	.marquee-window:hover .marquee-lane { animation-play-state: paused; }
	.logo-cell { display: flex; width: 15rem; flex: 0 0 auto; align-items: center; justify-content: center; padding-inline: 1.5rem; }
	.logo-cell a { display: block; }
	.logo-cell img { width: auto; max-width: 12rem; height: auto; max-height: 6rem; object-fit: contain; }
	.scene-band { flex-shrink: 0; }
	.scene-band .marquee-heading { margin-bottom: .75rem; }
	.scene-band .marquee-window { padding-bottom: 2rem; }
	.scene-band .logo-cell img { max-height: 5.25rem; }
	@keyframes marquee { to { transform: translateX(-50%); } }
	@media (prefers-reduced-motion: reduce) {
		.marquee-window { mask-image: none; }
		.marquee-lane { width: 100%; flex-wrap: wrap; justify-content: center; gap: 2rem 0; animation: none; }
		.logo-cell.duplicate { display: none; }
	}
</style>
