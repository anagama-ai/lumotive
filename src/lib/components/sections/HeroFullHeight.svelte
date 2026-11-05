<script lang="ts">
	import { onMount } from 'svelte';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import { videoEmbedUrl } from '$lib/video';

	let {
		section,
		media,
		band = false
	}: { section: Section; media: MediaMap; band?: boolean } = $props();
	let heading = $derived(titleCase(section.heading == null ? null : String(section.heading)));
	let visual = $derived(resolveMedia(section.media, media, 1440));
	let isVideo = $derived(Boolean(visual && /\.(mp4|webm)(?:$|\?)/i.test(visual.src)));
	let reducedMotion = $state(true);
	let embedUrl = $derived.by(() => {
		const value = videoEmbedUrl(section.videoUrl);
		if (!value) return null;
		const url = new URL(value);
		if (url.hostname.endsWith('youtube.com')) {
			// YouTube's equivalent of Vimeo's background mode; loop needs the playlist.
			const id = url.pathname.split('/').pop() ?? '';
			for (const [key, val] of Object.entries({ autoplay: '1', mute: '1', loop: '1', playlist: id, controls: '0', playsinline: '1', rel: '0' })) url.searchParams.set(key, val);
		} else {
			url.searchParams.set('background', '1');
			url.searchParams.set('dnt', '1');
		}
		return url.href;
	});
	onMount(() => {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => { reducedMotion = query.matches; };
		sync();
		query.addEventListener('change', sync);
		return () => query.removeEventListener('change', sync);
	});
	let fullVideoUrl = $derived.by(() => {
		const value = videoEmbedUrl(section.videoUrl);
		if (!value || !section.videoButtonLabel) return null;
		const url = new URL(value);
		url.searchParams.set('autoplay', '1');
		return url.href;
	});
	let videoDialog = $state<HTMLDialogElement>();
	let videoOpen = $state(false);
	let logos = $derived(
		(Array.isArray(section.logos) ? section.logos : []).flatMap((row) => {
			const image = resolveMedia((row as { media?: unknown })?.media, media, 640);
			return image ? [{ image, name: String((row as { name?: unknown }).name ?? '') }] : [];
		})
	);
	let menuLinks = $derived(
		(Array.isArray(section.menuLinks) ? section.menuLinks : []).flatMap((row) => {
			const { label, url } = (row ?? {}) as { label?: unknown; url?: unknown };
			return label && url ? [{ label: String(label), url: String(url) }] : [];
		})
	);
	let menuLabel = $derived(String(section.menuLabel ?? '').trim());
	let menuOpen = $state(false);
	// `contentAlign: "center"`: copy centred in the band both ways, not set at
	// the foot-left. Unset on every other hero.
	let centered = $derived(section.contentAlign === 'center');
	let primaryNewTab = $derived(section.primaryLinkNewTab === true || section.primaryLinkNewTab === 'true');
	let secondaryNewTab = $derived(section.secondaryLinkNewTab === true || section.secondaryLinkNewTab === 'true');
	// Optional desktop-only framing of the hero's media layer, for a product
	// shot whose own frame does not suit the band: `mediaShift` translates it
	// horizontally, so a centred subject stops running under the headline, and
	// `mediaScale` enlarges it, so an empty margin inside the photograph falls
	// outside the band instead of reading as dead space. The strip a bare
	// translation uncovers is filled with the photograph's own white backdrop
	// so the two read as one surface under the gradient. Both unset on every
	// other hero, which is therefore untouched.
	let mediaShift = $derived(String(section.mediaShift ?? '').trim());
	let mediaScale = $derived(String(section.mediaScale ?? '').trim());
	let mediaFramed = $derived(Boolean(mediaShift || mediaScale));
	// Optional horizontal anchor for the media layer at every width (a
	// percentage; `100%` keeps the photograph's right edge in frame). For a
	// banner composed with its subject on the right, so the subject stays
	// whole whatever the band's proportions. Phones use `mobileMediaPosition`
	// when that is set. Unset elsewhere, which keeps the centred crop.
	let mediaAnchor = $derived.by(() => {
		const value = String(section.mediaAnchor ?? '').trim();
		return /^\d{1,3}(\.\d+)?%$/.test(value) ? value : '';
	});
	// Opt-in shades for photographs (or video frames) bright enough to put the
	// copy under 4.5:1. Phones (<768px), where the copy spans the full width:
	// `mobileShade: strong`, or `max` for white-backed or bright-frame media,
	// which also darkens the right-hand end of the gradient. Tablets
	// (768-1023px): `tabletShade: strong`. Desktop keeps the standard shade.
	let mobileShade = $derived(section.mobileShade === 'strong' || section.mobileShade === 'max' ? section.mobileShade : '');
	let strongTabletShade = $derived(section.tabletShade === 'strong');
	// Opt-in, phones only (<768px): reframe the media layer for the narrow
	// band. `mobileMediaScale` enlarges it about its centre, so a product
	// photograph's white margins fall outside the band instead of showing as
	// light bands; `mobileMediaPosition` (a horizontal percentage) picks which
	// part of a wide photograph sits behind the copy. Unset elsewhere.
	let mobileMediaScale = $derived.by(() => {
		const value = String(section.mobileMediaScale ?? '').trim();
		return /^\d+(\.\d+)?$/.test(value) ? value : '';
	});
	let mobileMediaPosition = $derived.by(() => {
		const value = String(section.mobileMediaPosition ?? '').trim();
		return /^\d{1,3}(\.\d+)?%$/.test(value) ? value : '';
	});
	let mobileFramed = $derived(Boolean(mobileMediaScale || mobileMediaPosition));
	function manageVideo(element: HTMLVideoElement) {
		const query = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => {
			if (query.matches) element.pause();
			else void element.play().catch(() => undefined);
		};
		sync();
		query.addEventListener('change', sync);
		return () => {
			query.removeEventListener('change', sync);
			element.pause();
		};
	}
</script>

<section
	class="lumo-section hero-shell bg-panel relative isolate z-50 flex items-end overflow-hidden"
	class:band
	class:centered
	class:strong-mobile-shade={mobileShade === 'strong'}
	class:max-mobile-shade={mobileShade === 'max'}
	class:strong-tablet-shade={strongTabletShade}
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={section.background ?? 'none'}
	data-width={section.width ?? 'contained'}
	data-spacing-top={section.spacingTop ?? 'md'}
	data-spacing-bottom={section.spacingBottom ?? 'md'}
	data-align={band ? (section.align === 'container' ? 'container' : undefined) : 'container'}
	data-peel-cover
>
	{#if visual || embedUrl}
		<Reveal immediate fade={false} y={0} scale={1.06} duration={1.6} class="absolute inset-0">
			<div class="hero-media absolute inset-0" class:framed={mediaFramed} class:anchored={Boolean(mediaAnchor)} class:mobile-framed={mobileFramed} style:--hero-media-shift={mediaShift || undefined} style:--hero-media-scale={mediaScale || undefined} style:--hero-media-anchor={mediaAnchor || undefined} style:--hero-media-mobile-scale={mobileMediaScale || undefined} style:--hero-media-mobile-position={mobileMediaPosition || undefined} aria-hidden="true">
				{#if visual && isVideo}
					<video
						{@attach manageVideo}
						class="h-full w-full object-cover"
						src={visual.src}
						muted
						loop
						playsinline
						preload="metadata"
					></video>
				{:else if visual}
					<img
						class="h-full w-full object-cover"
						src={visual.src}
						srcset={visual.srcset}
						sizes="100vw"
						alt=""
						width={visual.width ?? 1600}
						height={visual.height ?? 900}
					/>
				{/if}
				{#if embedUrl && !reducedMotion}
					<iframe
						class="hero-background-video"
						src={embedUrl}
						title="Hero background video"
						allow="autoplay; fullscreen; picture-in-picture"
						aria-hidden="true"
						tabindex="-1"
					></iframe>
				{/if}
			</div>
		</Reveal>
	{/if}
	<div class="hero-shade absolute inset-0"></div>
	<div class="lumo-inner relative z-10">
		<Reveal immediate stagger=".hero-copy > *" delay={0.15}>
			<div class="hero-copy max-w-5xl">
				{#if section.eyebrow}
					<p class="text-eyebrow text-brand-amber mb-5 uppercase">{String(section.eyebrow)}</p>
				{/if}
				{#if heading}<h1 class="font-display text-display text-white">{heading}</h1>{/if}
				{#if section.body}<div class="text-lead hero-body mt-6 max-w-xl text-white/75">{@html String(section.body)}</div>{/if}
				{#if (section.primaryLinkLabel && section.primaryLinkUrl) || (section.secondaryLinkLabel && section.secondaryLinkUrl) || fullVideoUrl || (menuLabel && menuLinks.length)}
					<div class="hero-actions mt-9 flex flex-wrap items-center gap-8">
						{#if menuLabel && menuLinks.length}
							<!-- Opens upward on hover or keyboard focus; the button toggles it for touch. -->
							<div
								class="group relative"
								role="presentation"
								onmouseleave={() => (menuOpen = false)}
								onfocusout={(event) => {
									if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) menuOpen = false;
								}}
								onkeydown={(event) => event.key === 'Escape' && (menuOpen = false)}
							>
								<button type="button" class="primary-link items-center gap-2 border-0" aria-expanded={menuOpen} aria-haspopup="true" onclick={() => (menuOpen = !menuOpen)}>
									{menuLabel}
									<svg class="size-4 transition-transform duration-200 group-hover:rotate-180 motion-reduce:transition-none" class:rotate-180={menuOpen} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 10 4-4 4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
								</button>
								<ul
									class="rounded-card bg-surface shadow-card invisible absolute bottom-full left-1/2 z-20 -translate-x-1/2 m-0 min-w-full list-none p-2 pt-2 text-left opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none"
									class:menu-open={menuOpen}
								>
									{#each menuLinks as item (item.url)}
										<li><a class="text-ink hover:bg-background block rounded-lg px-4 py-3 font-medium whitespace-nowrap no-underline" href={item.url} target="_blank" rel="noreferrer">{item.label}</a></li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if section.primaryLinkLabel && section.primaryLinkUrl}
							<a
								class="primary-link"
								href={String(section.primaryLinkUrl)}
								target={primaryNewTab ? '_blank' : undefined}
								rel={primaryNewTab ? 'noreferrer' : undefined}
							>{String(section.primaryLinkLabel)}</a>
						{/if}
						{#if section.secondaryLinkLabel && section.secondaryLinkUrl}
							<a
								class="secondary-link group"
								href={String(section.secondaryLinkUrl)}
								target={secondaryNewTab ? '_blank' : undefined}
								rel={secondaryNewTab ? 'noreferrer' : undefined}
							>{String(section.secondaryLinkLabel)} <span aria-hidden="true">→</span></a>
						{/if}
						{#if fullVideoUrl}
							<button
								type="button"
								class="secondary-link gap-3 border-0 bg-transparent p-0"
								onclick={() => {
									videoOpen = true;
									videoDialog?.showModal();
								}}
							>
								<svg class="size-10 shrink-0" viewBox="0 0 40 40" aria-hidden="true">
									<circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5" />
									<path d="M16.5 13.5v13l10-6.5z" fill="currentColor" />
								</svg>
								{String(section.videoButtonLabel)}
							</button>
						{/if}
					</div>
				{/if}
				{#if logos.length}
					<ul class="hero-logos mt-12 flex flex-wrap items-center gap-x-10 gap-y-6 p-0">
						{#each logos as logo, index (index)}
							<li class="list-none"><img class="h-14 w-auto md:h-16" src={logo.image.src} srcset={logo.image.srcset} sizes="12rem" alt={logo.name} width={logo.image.width ?? 200} height={logo.image.height ?? 100} /></li>
						{/each}
					</ul>
				{/if}
			</div>
		</Reveal>
	</div>
</section>

{#if fullVideoUrl}
	<!-- The player only exists while open, so closing stops playback. -->
	<dialog
		bind:this={videoDialog}
		class="backdrop:bg-ink/85 m-auto w-[min(92vw,80rem)] overflow-visible border-0 bg-transparent p-0"
		aria-label={String(section.videoButtonLabel)}
		onclose={() => (videoOpen = false)}
		onclick={(event) => event.target === videoDialog && videoDialog.close()}
	>
		<button
			type="button"
			class="absolute -top-12 right-0 flex size-10 items-center justify-center rounded-full border-0 bg-transparent p-0 text-white"
			aria-label="Close video"
			onclick={() => videoDialog?.close()}
		>
			<svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
		</button>
		{#if videoOpen}
			<iframe
				class="rounded-panel block aspect-video w-full border-0 bg-black"
				src={fullVideoUrl}
				title={heading || 'Video'}
				allow="autoplay; fullscreen; picture-in-picture"
				allowfullscreen
			></iframe>
		{/if}
	</dialog>
{/if}

<style>
	.hero-shell { min-height: 100svh; }
	.hero-shell.band { min-height: clamp(32rem, 68svh, 47rem); }
	.hero-media { container-type: size; }
	.hero-background-video {
		position: absolute;
		top: 50%;
		left: 50%;
		width: max(100%, 177.7778cqh);
		height: max(100%, 56.25cqw);
		transform: translate(-50%, -50%);
		border: 0;
		pointer-events: none;
	}
	@media (max-width: 767px) {
		.strong-mobile-shade .hero-shade { background: linear-gradient(75deg, rgb(4 13 31 / 96%) 25%, rgb(4 13 31 / 90%) 60%, rgb(6 101 214 / 50%)); }
		.max-mobile-shade .hero-shade { background: linear-gradient(75deg, rgb(4 13 31 / 96%) 25%, rgb(4 13 31 / 92%) 60%, rgb(5 40 100 / 80%)); }
	}
	@media (min-width: 768px) and (max-width: 1023px) {
		.strong-tablet-shade .hero-shade { background: linear-gradient(75deg, rgb(4 13 31 / 96%) 25%, rgb(4 13 31 / 90%) 60%, rgb(6 101 214 / 50%)); }
	}
	.hero-media.anchored > img,
	.hero-media.anchored > video { object-position: var(--hero-media-anchor) 50%; }
	@media (max-width: 767px) {
		.hero-media.mobile-framed > img,
		.hero-media.mobile-framed > video { transform: scale(var(--hero-media-mobile-scale, 1)); object-position: var(--hero-media-mobile-position, var(--hero-media-anchor, 50%)) 50%; }
	}
	/* Desktop only. Below 1024px the hero stacks the copy over a much narrower
	   frame, where the centred subject is already clear of the headline, so the
	   tablet and mobile composition is deliberately left as it is.

	   The translation goes on the image, not on the layer: the layer stays put
	   and carries the photograph's own white backdrop, so the strip the image
	   uncovers is the same white under the same gradient and no seam appears.
	   Translating the layer itself takes the fill with it and leaves a visible
	   vertical edge against the panel. */
	@media (min-width: 1024px) {
		.hero-media.framed { background: #fff; }
		.hero-media.framed > img,
		.hero-media.framed > video { transform: translateX(var(--hero-media-shift, 0)) scale(var(--hero-media-scale, 1)); }
	}
	.hero-shade { background: linear-gradient(75deg, rgb(4 13 31 / 96%) 20%, rgb(4 13 31 / 76%) 55%, rgb(6 101 214 / 40%)); }
	.hero-copy { padding-block: clamp(4rem, 9vw, 7rem); }
	/* Webvizio #138 / rule 15: mixed-case Oswald glyphs touch below -.03em
	   ("ra", "gn", "ta", "rt"; measured by rendering each adjacent pair).
	   -.03em clears every pair but "vy", which keeps a 2px² sliver at 88px. */
	.hero-copy h1 { max-width: 13ch; margin: 0; letter-spacing: -.03em; line-height: 1.05; text-wrap: balance; }
	.band .hero-copy h1 { max-width: 18ch; }
	/* 13ch is a two-line measure: it breaks "Programmable Optics" even where the
	   column has room. From the tablet breakpoint up the heading gets a measure
	   wide enough to set on one line; below it the original wrap is unchanged.
	   The `.band` rule above is more specific, so hero bands keep 18ch. */
	@media (min-width: 768px) {
		.hero-copy h1 { max-width: 20ch; }
	}

	/* Hero refinement, full-height variant only (the `.band` hero is untouched),
	   from the tablet breakpoint up; phones take the shared rhythm below.
	   Alignment comes from the shared `data-align="container"` rule in app.css,
	   set on the section above. */
	@media (min-width: 768px) {
		/* A slightly wider measure so the copy is not boxed in. The heading keeps
		   its own 20ch cap, so "Programmable Optics" still sets on one line. */
		.hero-shell:not(.band) .hero-copy { max-width: 72rem; }
		.hero-shell:not(.band) .hero-body { max-width: 40rem; margin-top: 2rem; }
		.hero-shell:not(.band) .hero-actions { margin-top: 2.75rem; }
		/* The shell is bottom-aligned, so extra bottom padding lifts the block.
		   Section height is unchanged. */
		.hero-shell:not(.band) .hero-copy { padding-bottom: calc(clamp(4rem, 9vw, 7rem) + 1rem); }
	}
	/* Phones (<768px), band and full-height heroes alike: no viewport-based
	   minimum height, so the copy and one shared padding set the height (the
	   compact form the Sense hero introduced). The section's own spacing is
	   dropped, so a hero carrying `spacingTop/Bottom: md` matches the rest and
	   the padding below is the whole gap above and below the copy. The eyebrow,
	   heading, body and action gaps are the band's (1.25 / 1.5 / 2.25rem), and
	   two actions that wrap stack 1rem apart. Desktop and tablet keep the
	   minimum heights and spacing above. */
	@media (max-width: 767px) {
		.hero-shell, .hero-shell.band { min-height: 0; }
		.hero-shell > .lumo-inner { padding-block: 0; }
		.hero-copy { padding-block: 4rem 3.5rem; }
		.hero-actions { row-gap: 1rem; }
	}
	.hero-body :global(p) { margin: 0; }
	.primary-link { display: inline-flex; padding: .75rem 1.75rem; border-radius: 999px; color: var(--color-ink); background: white; font-weight: 650; text-decoration: none; transition: transform 200ms ease, background 200ms ease; }
	.primary-link:hover { transform: translateY(-2px); background: rgb(255 255 255 / 85%); }
	.centered { align-items: center; }
	.centered .hero-copy, .centered .hero-copy h1, .centered .hero-body { margin-inline: auto; text-align: center; }
	.centered .hero-actions, .centered .hero-logos { justify-content: center; }
	@media (min-width: 768px) {
		/* Drop the foot-left lift so the block sits on the band's true centre. */
		.hero-shell.centered .hero-copy { padding-bottom: clamp(4rem, 9vw, 7rem); }
	}
	/* Tapped open; hover and focus open it through the group utilities. The menu
	   opens upward (hero copy sits at the foot of the band) flush against the
	   button, so the pointer can cross into it without losing hover. */
	.menu-open { visibility: visible; opacity: 1; }
	.secondary-link { display: inline-flex; min-height: 2.75rem; align-items: center; color: white; font-weight: 650; text-decoration: none; cursor: pointer; }
	.secondary-link span { display: inline-block; margin-left: .25rem; transition: transform 200ms ease; }
	.secondary-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.primary-link, .secondary-link span { transition: none; }
		.primary-link:hover, .secondary-link:hover span { transform: none; }
	}
</style>
