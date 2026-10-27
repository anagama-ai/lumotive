<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import { isStaticFileLink } from '$lib/links';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import LoopVideo from '$lib/components/lumotive/LoopVideo.svelte';
	import { videoEmbedUrl } from '$lib/video';

	type CardLink = { label?: string; url?: string; newTab?: boolean };
	type Card = { media?: unknown; eyebrow?: string; title?: string; body?: string; link?: CardLink; linkLabel?: string; linkUrl?: string; badge?: string; accent?: string };
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	// Optional single action under the grid, for a section whose cards share one
	// destination. Unset on every existing section, so nothing else gains a link.
	let sectionLink = $derived.by(() => {
		const label = String(section.linkLabel ?? '').trim();
		const href = String(section.linkUrl ?? '').trim();
		if (!label || !href) return null;
		return { label, href, newTab: section.linkNewTab === true || section.linkNewTab === 'true' };
	});
	// Small trailing line under the grid: the reference-design caveat, or the
	// lead-in that precedes the shared action. Unset on every existing section.
	let note = $derived(String(section.note ?? '').trim());
	// Second trailing line, kept as its own element rather than appended to the
	// note: the package prints two captions here and merging them into one
	// paragraph loses which caption belongs to which panel.
	let outro = $derived(String(section.outro ?? '').trim());
	// `steps` renders the cards as one compact numbered list instead of a card
	// grid, for an ordered sequence whose entries are a label and a short value.
	let steps = $derived(String(section.designVersion ?? '') === 'steps');
	// `numbered: "true"` keeps the card grid but marks each card with its
	// two-digit position (01, 02 …) in place of the accent bar, for a sequence
	// the package prints as numbered cards. Unset on every existing section.
	let numbered = $derived(section.numbered === true || section.numbered === 'true');
	// Two optional emphasised lines the package uses around a card grid: a
	// proposition under the introduction, and a closing result under the cards.
	// Both are plain sentences set in the lead size at medium weight, which is
	// how the package prints them. Unset on every existing section.
	let statement = $derived(String(section.statement ?? '').trim());
	let conclusion = $derived(String(section.conclusion ?? '').trim());
	// `casing: "exact"` prints card titles exactly as the editor typed them, for
	// a section whose approved card wording is sentence case and must not be
	// re-capitalised. Section headings are unaffected: the package title-cases
	// those and sentence-cases the cards beneath them.
	let exactCase = $derived(String(section.casing ?? '') === 'exact');
	// Optional single visual between the introduction and the cards. Unset on
	// every other section. `videoAspect` ("1000 / 604") reserves the frame
	// before the video's metadata arrives, as on SplitDefault.
	let visual = $derived(resolveMedia(section.media, media, 1440));
	let visualPoster = $derived(resolveMedia(section.mediaPoster, media, 1440));
	let visualAlt = $derived(String(section.mediaAlt ?? '').trim());
	let visualAspect = $derived.by(() => {
		const value = String(section.videoAspect ?? '').trim();
		return /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(value) ? value : undefined;
	});
	// `mediaMaxWidth` (rem): a narrower cap than the 1000px column, for a
	// visual the package prints at half width (/dev-kits/transmit-modules).
	let visualMaxWidth = $derived.by(() => {
		const value = String(section.mediaMaxWidth ?? '').trim();
		return /^\d+(\.\d+)?rem$/.test(value) ? value : undefined;
	});
	// `mediaPlacement: "afterGrid"`: the visual follows the cards instead of
	// leading them, where the package prints a figure under a feature row
	// (/dev-kits/itof ON140's shared point cloud). Unset elsewhere.
	let visualAfterGrid = $derived(String(section.mediaPlacement ?? '') === 'afterGrid' && !steps);
	// `visualLayout: "beside"`: the visual sits in a column to the right of
	// the heading and intro, cards below (/dev-kits/transmit-modules
	// "Programmable illumination"). Unset elsewhere.
	let visualBeside = $derived(String(section.visualLayout ?? '') === 'beside' && Boolean(visual) && !visualAfterGrid && !steps);
	// `visualLayout: "cards"`: the photo on the left and the card grid on the
	// right, from 1024px (stacked below), under the heading (/dev-kits/dtof
	// "Modular by design"). Unset elsewhere.
	let visualCards = $derived(String(section.visualLayout ?? '') === 'cards' && Boolean(visual) && !steps);
	// `contentMaxWidth` (px or rem): caps the section's content at that width,
	// centred in the container (/dev-kits/itof "Better data"). Unset elsewhere.
	let contentMaxWidth = $derived.by(() => {
		const value = String(section.contentMaxWidth ?? '').trim();
		return /^\d+(\.\d+)?(px|rem)$/.test(value) ? value : undefined;
	});
	// `mediaMinWidth` (rem): an image whose baked-in labels need a readable
	// width (/dev-kits/itof's scan-modes strip). It spans the container, never
	// narrower than this; a narrower screen scrolls it sideways inside its
	// frame, and `mediaHint` appears only while it actually overflows.
	let visualMinWidth = $derived.by(() => {
		const value = String(section.mediaMinWidth ?? '').trim();
		return /^\d+(\.\d+)?rem$/.test(value) ? value : undefined;
	});
	let visualHint = $derived(String(section.mediaHint ?? '').trim());
	let visualOverflows = $state(false);
	function trackOverflow(node: HTMLElement) {
		const observer = new ResizeObserver(() => (visualOverflows = node.scrollWidth > node.clientWidth + 1));
		observer.observe(node);
		return () => observer.disconnect();
	}
	// With a visual, a step list, its note and the outro sit in the visual's
	// column instead of trailing the section.
	let supportInBlock = $derived(Boolean(visual) && steps);
	// `textAlign: "center"`: a centred composition (the /lcm-chips "How LCM
	// fits" section and its capability cards). Header, visual column, control,
	// step block and captions centre; cards centre their bar, title and copy.
	// Unset on every other section.
	let centered = $derived(String(section.textAlign ?? '') === 'center');
	const cardTitle = (value?: string | null) => (exactCase ? (value ?? '') : (titleCase(value ?? '') ?? ''));
	// `titleLines: "2"` reserves two lines for every card title from 768px up,
	// so a row whose titles wrap differently still starts every description at
	// the same height. Phones keep the natural title height.
	let twoLineTitles = $derived(String(section.titleLines ?? '') === '2');
	// `titleLines: "row"` does the same per row, at any column count: from
	// 768px each card becomes a subgrid of the grid's rows, so a title takes
	// the height of the tallest title in its own row and no more. Phones keep
	// the stacked flex layout.
	let rowAlign = $derived(String(section.titleLines ?? '') === 'row');
	const cardRows = (card: Card, image: unknown, link: { href: string; label: string }) =>
		[image, true, card.eyebrow, card.title, card.body, card.badge, link.href && link.label].filter(Boolean).length;
	// Desktop column count. Default stays the three-up grid every existing
	// section renders; `columns: "2"` opts a section into an even two-up, for a
	// pair of cards that would otherwise leave a third of the row empty, and
	// `columns: "5"` into a single wide row of five, stepping 1 → 2 → 3 → 5 so
	// no breakpoint leaves a short orphan row. The classes are written out in
	// full so Tailwind emits them.
	let gridClass = $derived.by(() => {
		const columns = String(section.columns ?? '');
		if (columns === '2') return 'grid gap-6 md:grid-cols-2';
		if (columns === '4') return 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4';
		if (columns === '5') return 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
		return 'grid gap-6 md:grid-cols-2 lg:grid-cols-3';
	});
	// The accent cycle distinguishes adjacent cards on the decorative bar only.
	// Text keeps Laser Blue: green and amber fall under 4.5:1 on the white card,
	// and DESIGN.md reserves the primary action colour for actions anyway.
	const bars: Record<string, string> = {
		accent1: 'bg-brand-blue', accent2: 'bg-brand-green', accent3: 'bg-brand-amber',
		accent4: 'bg-brand-blue', accent5: 'bg-brand-green', accent6: 'bg-brand-amber'
	};
	const bar = (accent?: string) => bars[accent ?? ''] ?? bars.accent1;
	// `cardTint: "accent"`: each card takes a light wash of its accent colour
	// over the white card, so a benefit row reads apart from white spec tiles
	// (/dev-kits/itof LI140 benefits). Text keeps its ink and slate colours;
	// the washes stay light enough for both (≥ 4.5:1). Unset elsewhere.
	const tints: Record<string, string> = {
		// Blue and green need 10% to separate from the #f3f4f7 page field;
		// amber reads stronger at a lower share, so 13% keeps the three even.
		accent1: 'color-mix(in srgb, var(--color-brand-blue) 10%, var(--color-surface))',
		accent2: 'color-mix(in srgb, var(--color-brand-green) 10%, var(--color-surface))',
		accent3: 'color-mix(in srgb, var(--color-brand-amber) 13%, var(--color-surface))',
		accent4: 'color-mix(in srgb, var(--color-brand-blue) 10%, var(--color-surface))',
		accent5: 'color-mix(in srgb, var(--color-brand-green) 10%, var(--color-surface))',
		accent6: 'color-mix(in srgb, var(--color-brand-amber) 13%, var(--color-surface))'
	};
	let tinted = $derived(String(section.cardTint ?? '') === 'accent');
	const tint = (accent?: string) => (tinted ? (tints[accent ?? ''] ?? tints.accent1) : undefined);
	// Numerals (`numbered`) follow the card's accent in its text-safe variant.
	const numerals: Record<string, string> = {
		accent1: 'text-brand-blue', accent2: 'text-brand-green-text', accent3: 'text-brand-amber-text',
		accent4: 'text-brand-blue', accent5: 'text-brand-green-text', accent6: 'text-brand-amber-text'
	};
	const numeral = (accent?: string) => numerals[accent ?? ''] ?? numerals.accent1;
	const linkFor = (card: Card) => ({ href: card.linkUrl || card.link?.url || '', label: card.linkLabel || card.link?.label || '', newTab: Boolean(card.link?.newTab) });
	// `videoUrl` (Vimeo/YouTube): the section becomes a split, header, cards
	// and `body` on the left, the click-to-play player on the right, as
	// /sense/robotics "One Sensor, Three Jobs" prints it. From 1280px only:
	// below that the left column is too narrow for three cards, so everything
	// stacks with the player last. Unset on every other section.
	let embedUrl = $derived(videoEmbedUrl(section.videoUrl));
	// `videoLayout: "above"`: the player takes the visual's place between the
	// introduction and the cards, at the visual column's width, instead of the
	// split (/dev-kits/itof "Better Data, Safer Robots"). Unset elsewhere.
	let videoAbove = $derived(Boolean(embedUrl) && String(section.videoLayout ?? '') === 'above');
	let videoSplit = $derived(Boolean(embedUrl) && !videoAbove);
	// Rich text under the cards (the benefits list beside the player).
	let body = $derived(typeof section.body === 'string' ? section.body.trim() : '');
	// Phone-only spacing override (app.css): xs | sm | md, else unset.
	const phoneSpacing = (value: unknown) => (['xs', 'sm', 'md'].includes(String(value)) ? String(value) : undefined);
</script>

<section class="lumo-section" class:has-visual={Boolean(visual)} class:has-video={Boolean(embedUrl)} class:centered id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')} data-phone-top={phoneSpacing(section.phoneSpacingTop)} data-phone-bottom={phoneSpacing(section.phoneSpacingBottom)} data-align={section.align === 'container' ? 'container' : undefined}>
	<div class="lumo-inner">
		{#if videoSplit}
			<div class="video-split">
				<div class="min-w-0">{@render content()}</div>
				<div class="video-split-media min-w-0">
					<Reveal x={24} y={12} duration={0.8}>
						<iframe src={embedUrl} title={titleCase(String(section.heading ?? '')) || 'Embedded video'} class="rounded-card block aspect-video w-full border-0" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
					</Reveal>
				</div>
			</div>
		{:else if contentMaxWidth}
			<div class="mx-auto" style:max-width={contentMaxWidth}>{@render content()}</div>
		{:else}
			{@render content()}
		{/if}
	</div>
</section>

{#snippet content()}
		{#snippet sectionHead()}
			<Reveal><div class="section-head mb-12 max-w-4xl">
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-3 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink mt-0 whitespace-pre-line">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
				{#if statement}<p class="text-lead text-ink mt-4 font-medium">{statement}</p>{/if}
			</div></Reveal>
		{/snippet}
		{#if (section.eyebrow || section.heading || section.intro) && !visualBeside}
			{@render sectionHead()}
		{/if}
		{#snippet stepList()}
			<!-- One compact list, not four cards: the entries are an ordered
			     sequence of short label/value pairs, and a card each would spread
			     a signal path over a full-width row of mostly empty boxes. -->
			<ol class="step-list rounded-card border-border bg-surface divide-border list-none divide-y border p-0" class:max-w-3xl={!visual} class:my-0={Boolean(visual)}>
				{#each cards as card, index (index)}
					<li class="flex items-baseline gap-4 px-6 py-4">
						{#if card.eyebrow}<span class="font-display text-subheading text-brand-blue shrink-0 tabular-nums">{card.eyebrow}</span>{/if}
						<span class="min-w-0">
							<span class="font-display text-subheading text-ink">{cardTitle(card.title)}</span>
							{#if card.body}<span class="step-value text-base leading-relaxed">{@html card.body}</span>{/if}
						</span>
					</li>
				{/each}
			</ol>
		{/snippet}
		{#snippet visualBlock()}
			<!-- The visual and everything that explains it share one column, as
			     wide as the supplied animation (never upscaled): the steps and
			     their note on the left, the second caption on the right. -->
			<div class="visual-block" class:visual-above-grid={!steps && !visualAfterGrid} class:visual-below-grid={visualAfterGrid} class:visual-wide={Boolean(visualMinWidth)} style:max-width={visualMaxWidth}>
				<Reveal>
					{#if visual?.isVideo}
						<LoopVideo src={visual.src} poster={visualPoster?.src} label={visualAlt} aspect={visualAspect} center={centered} />
					{:else if visual && visualMinWidth}
						<!-- A scrollable region must be keyboard-focusable (WCAG 2.1.1). -->
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<div class="visual-scroll rounded-card" {@attach trackOverflow} role="region" aria-label={titleCase(String(section.heading ?? '')) || undefined} tabindex={visualOverflows ? 0 : undefined}>
							<img src={visual.src} srcset={visual.srcset} sizes={`(min-width: 1328px) 1280px, ${visualMinWidth}`} style:min-width={visualMinWidth} alt={visualAlt || visual.alt} width={visual.width ?? 1000} height={visual.height ?? 600} />
						</div>
						{#if visualHint && visualOverflows}<p class="section-note mt-3 mb-0">{visualHint}</p>{/if}
					{:else if visual}
						<img class="rounded-card block h-auto w-full" src={visual.src} srcset={visual.srcset} sizes="(min-width: 1064px) 1000px, calc(100vw - 2rem)" alt={visualAlt || visual.alt} width={visual.width ?? 1000} height={visual.height ?? 600} />
					{/if}
				</Reveal>
				{#if steps}
					<Reveal>
						<div class="visual-support">
							<div>
								{@render stepList()}
								{#if note}<p class="section-note mt-4 mb-0">{note}</p>{/if}
							</div>
							{#if outro}<p class="section-note visual-caption m-0">{outro}</p>{/if}
						</div>
					</Reveal>
				{/if}
			</div>
		{/snippet}
		{#if videoAbove}
			<div class="visual-block visual-above-grid">
				<Reveal>
					<iframe src={embedUrl} title={titleCase(String(section.heading ?? '')) || 'Embedded video'} class="rounded-card block aspect-video w-full border-0" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
				</Reveal>
			</div>
		{/if}
		{#if visualBeside}
			<div class="intro-beside">
				{@render sectionHead()}
				{@render visualBlock()}
			</div>
		{:else if visual && !visualAfterGrid && !visualCards}
			{@render visualBlock()}
		{/if}
		{#snippet cardGrid()}
		<Reveal stagger class={gridClass}>
			{#each cards as card, index (index)}
				{@const link = linkFor(card)}
				{@const image = resolveMedia(card.media, media, 1024)}
				{@const barClass = bar(card.accent)}
				<svelte:element
					this={link.href ? 'a' : 'article'}
					class={`rounded-card bg-surface hover:shadow-card group flex flex-col ${videoSplit ? 'p-6' : 'p-8'} transition duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none${link.href ? ' no-underline focus-visible:outline-2 focus-visible:outline-offset-4' : ''}${rowAlign ? ' row-card' : ''}${centered ? ' card-centered' : ''}`}
					style:--card-rows={rowAlign ? cardRows(card, image, link) : undefined}
					style:background-color={tint(card.accent)}
					href={link.href || undefined}
					target={link.href && link.newTab ? '_blank' : undefined}
					rel={link.href && link.newTab ? 'noopener noreferrer' : undefined}
					data-sveltekit-reload={link.href && isStaticFileLink(link.href) ? '' : undefined}
				>
					{#if image}
						<div class="mb-6 aspect-video overflow-hidden rounded-lg">
							<img class="size-full object-contain" src={image.src} srcset={image.srcset} sizes="(min-width: 768px) 50vw, 100vw" alt="" width={image.width ?? 960} height={image.height ?? 540} loading="lazy" />
						</div>
					{/if}
					{#if numbered}
						<p class={`font-display text-subheading m-0 tabular-nums ${numeral(card.accent)}`}>{String(index + 1).padStart(2, '0')}</p>
					{:else if section.accentBar !== 'none'}
						<span aria-hidden="true" class={`accent-bar mb-6 block h-1 w-10 rounded-full ${barClass}`}></span>
					{/if}
					{#if card.eyebrow}<p class="text-eyebrow text-ink uppercase">{card.eyebrow}</p>{/if}
					{#if card.title}<h3 class={`font-display text-subheading text-ink mt-3 mb-0${twoLineTitles ? ' md:min-h-[2lh]' : ''}`}>{cardTitle(card.title)}</h3>{/if}
					{#if card.body}<div class="card-copy mt-2 text-base leading-relaxed [&_p]:my-0 [&_p+p]:mt-2">{@html card.body}</div>{/if}
					{#if card.badge}<span class="text-spec bg-background text-ink mt-4 self-start rounded-full px-3 py-1">{card.badge}</span>{/if}
					{#if link.href && link.label}<span class="text-brand-blue mt-auto inline-flex items-center gap-2 self-start pt-6 text-base font-medium">{link.label}<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg></span>{/if}
				</svelte:element>
			{/each}
		</Reveal>
		{/snippet}
		{#if steps && !visual}
			<Reveal>{@render stepList()}</Reveal>
		{:else if visualCards && visual}
			<div class="visual-cards">
				<Reveal>
					<img class="rounded-card block size-full object-cover" src={visual.src} srcset={visual.srcset} sizes="(min-width: 1024px) 50vw, 100vw" alt={visualAlt || visual.alt} width={visual.width ?? 1200} height={visual.height ?? 900} loading="lazy" />
				</Reveal>
				{@render cardGrid()}
			</div>
		{:else if !steps}
			{@render cardGrid()}
		{/if}
		{#if visual && visualAfterGrid}
			{@render visualBlock()}
		{/if}
		{#if body}
			<Reveal delay={0.08}><div class="cards-body text-lead">{@html body}</div></Reveal>
		{/if}
		{#if conclusion}
			<Reveal delay={0.1}><p class="text-lead text-ink mt-10 max-w-3xl font-medium">{conclusion}</p></Reveal>
		{/if}
		{#if (note && !supportInBlock) || sectionLink}
			<Reveal delay={0.12}>
				<div class="section-foot">
					{#if note && !supportInBlock}<span class="section-note">{note}</span>{/if}
					{#if sectionLink}
						<a
							class="section-link"
							href={sectionLink.href}
							target={sectionLink.newTab ? '_blank' : undefined}
							rel={sectionLink.newTab ? 'noreferrer' : undefined}
							data-sveltekit-reload={isStaticFileLink(sectionLink.href) ? '' : undefined}
						>{sectionLink.label} <span aria-hidden="true">→</span></a>
					{/if}
				</div>
			</Reveal>
		{/if}
		{#if outro && !supportInBlock}
			<Reveal delay={0.16}><p class="section-note mt-6 block max-w-3xl">{outro}</p></Reveal>
		{/if}
{/snippet}

<style>
	/* The trailing row carries the gap, so a note and the shared action sit on
	   one line with the same 2.5rem above the pair that the action alone used
	   to set on itself. A bare `text-brand-blue` utility loses to the global
	   anchor colour, so the action is coloured the same scoped way
	   `.split-link` is, and it takes `.split-link`'s 2.75rem minimum height:
	   at the body line-height alone the link was a 25px tap target, the only
	   standalone action on the page under the 44px floor the rest of the site
	   already meets. */
	.section-foot { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem 1rem; margin-top: 2.5rem; }
	/* Slate, not muted: at the spec size muted slate falls under 4.5:1 on both
	   the page field and the white card, and a caption is still body text. */
	.section-note { color: var(--color-text); font-size: var(--text-spec); line-height: 1.5; }
	/* In the section foot the note leads into the link beside it, so both
	   read at body size. */
	.section-foot .section-note { font-size: inherit; }
	/* The step value sits on the same line as its label where there is room and
	   wraps under it where there is not, so the list stays one compact block. */
	.step-list .step-value { color: var(--color-text); }
	.step-list .step-value::before { content: ' — '; color: var(--color-muted); }
	.step-list .step-value :global(p) { display: inline; margin: 0; }
	/* Visual layout (a section with `media`). The heading drops the browser's
	   default block margins (about 50px each side at the statement size), so
	   eyebrow, heading and introduction keep their own 1rem steps and 2rem
	   lead into the visual. One column, as wide as the supplied 1000px
	   animation so it is never upscaled, holds the visual and its support. */
	.has-visual .section-head { margin-bottom: 2rem; }
	.has-visual .section-head h2 { margin: 0; }
	/* Video split (`videoUrl`). Same heading treatment as the visual layout;
	   cards take 1.5rem padding so three fit the left column. From 1280px the
	   copy and the player sit side by side, as SplitDefault proportions them;
	   below, the player follows the benefits list. */
	.has-video .section-head { margin-bottom: 2rem; }
	.has-video .section-head h2 { margin: 0; }
	.video-split-media { margin-top: 2.5rem; }
	@media (min-width: 1280px) {
		.video-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: clamp(2.5rem, 6vw, 5rem); }
		.video-split-media { margin-top: 0; }
	}
	/* Rich text under the cards: the split sections' bullet list. */
	.cards-body { margin-top: 1.75rem; color: var(--color-text); }
	.cards-body :global(ul) { margin: 0; padding-left: 1.15rem; list-style: disc; }
	.cards-body :global(li) { margin-top: .4rem; }
	.cards-body :global(li:first-child) { margin-top: 0; }
	.cards-body :global(li::marker) { color: var(--color-muted); }
	.cards-body :global(p) { margin: 0; }
	.visual-block { max-width: 62.5rem; }
	/* `visualLayout: "cards"`: photo left, card grid right (from 1024px). */
	.visual-cards { display: grid; gap: 1.5rem; }
	@media (min-width: 1024px) {
		.visual-cards { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: stretch; }
	}
	/* `visualLayout: "beside"`: heading and intro left, the visual right, the
	   cards below at full width (from 1024px; stacked below). */
	.intro-beside { display: grid; gap: 2rem; margin-bottom: 2.5rem; }
	.intro-beside .section-head { margin-bottom: 0; }
	.intro-beside .visual-block { margin: 0; }
	@media (min-width: 1024px) {
		.intro-beside { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: clamp(2.5rem, 6vw, 5rem); }
	}
	/* A visual over a card grid (no step list): the grid's own gap below it. */
	.visual-above-grid { margin-bottom: 2.5rem; }
	/* A visual under the cards (`mediaPlacement: "afterGrid"`). */
	.visual-below-grid { margin-top: 2.5rem; }
	/* `mediaMinWidth`: the full container; the frame scrolls sideways only when
	   the container is narrower than the image's readable width. */
	.visual-block.visual-wide { max-width: none; }
	.visual-scroll { overflow-x: auto; overscroll-behavior-x: contain; }
	.visual-scroll img { display: block; width: 100%; height: auto; }
	.visual-scroll:focus-visible { outline: 2px solid var(--color-brand-blue-dark); outline-offset: 3px; }
	.visual-support { display: grid; gap: 1.5rem; margin-top: 1.5rem; }
	@media (min-width: 768px) {
		.visual-support { grid-template-columns: minmax(0, 3fr) minmax(0, 2fr); gap: 2.5rem; align-items: start; }
	}
	/* Centred composition (`textAlign: "center"`). The step list's rows stay
	   left-aligned inside their centred block, so numbers and labels still
	   line up; the two captions centre beneath it in one column. */
	.centered .section-head { margin-inline: auto; text-align: center; }
	.centered .visual-block { margin-inline: auto; }
	.centered .visual-support { grid-template-columns: minmax(0, 1fr); justify-items: center; gap: .75rem; text-align: center; }
	.centered .visual-support > * { width: 100%; max-width: 48rem; }
	.centered .step-list { text-align: left; }
	.centered .card-centered { text-align: center; }
	.centered .card-centered .accent-bar { margin-inline: auto; }
	.section-link { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .5rem; color: var(--color-brand-blue-dark); font-weight: 650; text-decoration: none; }
	.section-link span { transition: transform 200ms ease; }
	.section-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.section-link span { transition: none; }
		.section-link:hover span { transform: none; }
	}
	/* A card body may carry a bullet list where the package prints one. The
	   global stylesheet only styles lists inside `.prose`, so the card supplies
	   its own marker and indent rather than inheriting the browser's. */
	.card-copy :global(ul) { margin: .75rem 0 0; padding-left: 1.1rem; list-style: disc; }
	.card-copy :global(li) { margin-top: .35rem; }
	.card-copy :global(li::marker) { color: var(--color-muted); }
	/* `titleLines: "row"`: each card spans as many grid rows as it has
	   children and adopts them as a subgrid, so titles in one row share a
	   height and every description starts on the same line. The card's own
	   margins still space its children; the grid's 1.5rem gap stays between
	   cards only. */
	@media (min-width: 768px) {
		.row-card { display: grid; grid-template-rows: subgrid; grid-row: span var(--card-rows); row-gap: 0; align-content: start; }
	}
</style>
