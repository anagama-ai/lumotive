<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type CardLink = { label?: string; url?: string; newTab?: boolean };
	type Card = { media?: unknown; eyebrow?: string; title?: string; body?: string; link?: CardLink; linkLabel?: string; linkUrl?: string; badge?: string; accent?: string; anchor?: string };
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	const tones: Record<string, string> = { accent1: 'text-brand-blue', accent2: 'text-brand-green', accent3: 'text-brand-amber', accent4: 'text-brand-blue', accent5: 'text-brand-green', accent6: 'text-brand-amber' };
	const tone = (accent?: string) => tones[accent ?? ''] ?? tones.accent1;
	const linkFor = (card: Card) => ({ href: card.linkUrl || card.link?.url || '', label: card.linkLabel || card.link?.label || '', newTab: Boolean(card.link?.newTab) });
	// Optional shared action under the grid, mirroring the section-level link
	// the bento cards already support. Sections that leave the fields empty
	// render exactly as before, so /dev-kits and /applications are untouched.
	let sectionLink = $derived.by(() => {
		const label = String(section.linkLabel ?? '').trim();
		const href = String(section.linkUrl ?? '').trim();
		if (!label || !href) return null;
		return { label, href, newTab: section.linkNewTab === true || section.linkNewTab === 'true' };
	});
	// `density` tightens the card rhythm. `compact` closes the heading and
	// description gap and the space above the shared action. `tight` goes
	// further for a grid with no photographs: smaller card padding and the card
	// action pinned to the foot of the card. Unset keeps the default rhythm, so
	// the media-card grids that do not ask for either are unaffected.
	let density = $derived(['compact', 'tight'].includes(String(section.density ?? '')) ? String(section.density) : undefined);
	// Optional trailing line under the grid, for a caveat the package prints
	// beneath a set of cards. Unset on every existing section.
	let note = $derived(String(section.note ?? '').trim());
	// Label for this section's own group of cards, printed above its grid.
	let label = $derived(String(section.label ?? '').trim());
	// `mediaFrame: "panel"` is the page-03 kit-card treatment: the product
	// photo sits contained on a light-grey (Cool Field) panel inside the card
	// padding, at one fixed height so every family row matches, instead of a
	// full-bleed 16:9 crop. For transparent product cut-outs. Unset on every
	// other section, which keeps the full-bleed photo.
	let panel = $derived(String(section.mediaFrame ?? '') === 'panel');
	let fourUp = $derived(String(section.columns ?? '') === '4');
	// `columns: "1"`: one card per row at every width, so a single card spans
	// the content width of a multi-card row below it (the /dev-kits TX10 card
	// above the iToF row, as PDF page 12 prints it). Unset elsewhere.
	let threeUp = $derived(String(section.columns ?? '') === '3');
	let oneUp = $derived(String(section.columns ?? '') === '1');
	// Desktop column count. Unset keeps the historic behaviour exactly: two-up,
	// widening to three only for a three-card section. `columns: "4"` opts a
	// section into an even four-up row, for a grid of eight that would
	// otherwise set as four ragged rows of two. Classes are written out in full
	// so Tailwind emits them.
	let gridClass = $derived(
		fourUp
			? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4'
			: oneUp
				? 'grid gap-6'
				: `grid gap-6 md:grid-cols-2 ${threeUp || cards.length === 3 ? 'lg:grid-cols-3' : ''}`
	);
	// Phone-only spacing override (app.css): xs | sm | md, else unset.
	const phoneSpacing = (value: unknown) => (['xs', 'sm', 'md'].includes(String(value)) ? String(value) : undefined);
</script>

<section class="lumo-section" id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')} data-phone-top={phoneSpacing(section.phoneSpacingTop)} data-phone-bottom={phoneSpacing(section.phoneSpacingBottom)} data-align={section.align === 'container' ? 'container' : undefined} data-density={density}>
	<div class="lumo-inner">
		{#if section.eyebrow || section.heading || section.intro}
			<Reveal><div class="mb-12 max-w-4xl">
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink whitespace-pre-line">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
			</div></Reveal>
		{/if}
		<!-- A group label sits with its own grid, below any section heading, so a
		     heading can introduce several labelled groups in a row rather than
		     being pushed under the first group's label. -->
		{#if label}
			<Reveal><p class="text-eyebrow text-brand-blue-dark mb-5 uppercase">{label}</p></Reveal>
		{/if}
		<Reveal stagger class={gridClass}>
			{#each cards as card, index (index)}
				{@const image = resolveMedia(card.media, media, 1024)}
				{@const link = linkFor(card)}
				<svelte:element
					this={link.href ? 'a' : 'article'}
					id={card.anchor ? String(card.anchor) : undefined}
					class={`rounded-card bg-surface hover:shadow-card group flex scroll-mt-32 flex-col overflow-hidden transition duration-300 hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none${link.href ? ' no-underline focus-visible:outline-2 focus-visible:outline-offset-4' : ''}`}
					href={link.href || undefined}
					target={link.href && link.newTab ? '_blank' : undefined}
					rel={link.href && link.newTab ? 'noopener noreferrer' : undefined}
				>
					{#if image && !panel}<div class="relative aspect-video w-full overflow-hidden"><img class="absolute inset-0 size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" /></div>{/if}
					<div class="card-pad flex flex-1 flex-col p-8">
						{#if image && panel}<div class="kit-panel bg-background mb-6 overflow-hidden rounded-lg"><img class="size-full object-contain p-5 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" /></div>{/if}
						<!-- Optical Ink, and Laser Blue on the action below: at these
						     sizes Signal Green measures 3.19:1 and Optical Amber less
						     still on the white card. The accent cycle stays on
						     sections that use it decoratively. -->
						{#if card.eyebrow}<p class="text-eyebrow text-ink uppercase">{card.eyebrow}</p>{/if}
						<!-- At four-up a two-line title would drop its body a line below
						     its siblings', so the heading reserves two lines from 1024px
						     to 1279px, where the narrow cards wrap titles. From 1280px
						     the titles fit one line, so the reservation is dropped and
						     the body sits close under its heading. Narrower grids are
						     two-up or stacked and keep the natural height. -->
						<h3 class={`font-display text-subheading text-ink ${card.eyebrow ? 'mt-3' : 'mt-0'}${fourUp ? ' lg:flex lg:min-h-14 lg:items-start xl:min-h-0' : ''}`}>{titleCase(card.title ?? '')}</h3>
						{#if card.body}<div class="card-body mt-2 text-base leading-relaxed">{@html card.body}</div>{/if}
						{#if card.badge}<span class="text-spec bg-background text-ink mt-4 self-start rounded-full px-3 py-1">{card.badge}</span>{/if}
						{#if link.href && link.label}<span class="card-link text-brand-blue mt-7 inline-flex items-center gap-2 self-start text-base font-medium">{link.label}<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg></span>{/if}
					</div>
				</svelte:element>
			{/each}
		</Reveal>
		{#if sectionLink}
			<Reveal><div class="section-action mt-12">
				<a class="section-button" href={sectionLink.href} target={sectionLink.newTab ? '_blank' : undefined} rel={sectionLink.newTab ? 'noreferrer' : undefined}>{sectionLink.label}</a>
			</div></Reveal>
		{/if}
		{#if note}
			<Reveal delay={0.12}><p class="section-note mt-8 block max-w-3xl">{note}</p></Reveal>
		{/if}
	</div>
</section>

<style>
	/* The brand primary button as the header uses it: a bare utility loses to
	   the global anchor colour, so the pill is styled in scoped CSS, the same
	   way the hero and CTA sections style theirs. */
	.section-button { display: inline-flex; align-items: center; justify-content: center; min-height: 3rem; padding: .75rem 1.75rem; border-radius: 999px; color: #fff; background: var(--color-primary); font-weight: 650; text-decoration: none; transition: background 180ms ease, transform 180ms ease; }
	.section-button:hover { background: var(--color-primary-hover); transform: translateY(-2px); }
	@media (prefers-reduced-motion: reduce) {
		.section-button { transition: none; }
		.section-button:hover { transform: none; }
	}
	/* Headings keep the browser's default 1em block margins here, so the card
	   title carries them unless a utility overrides it. `mt-3` is the gap under
	   an eyebrow; without one the same margin is dead space that pushed the
	   title 44px below a 32px-padded card top, so the markup asks for `mt-0`.
	   Every density: the heading's bottom margin and the paragraph margins
	   inside the rich-text body would stack on top of the body's `mt-2`
	   (48px between a heading and its description), so both are zeroed and
	   the gap is the 8px the utility asks for. */
	h3 { margin-bottom: 0; }
	.card-body :global(p) { margin: 0; }
	.card-body :global(p + p) { margin-top: .75rem; }
	/* Compact density: the shared action drops from 48px to 36px below the
	   grid. */
	[data-density='compact'] .section-action { margin-top: 2.25rem; }
	/* Tight density: for a grid whose cards carry no photograph, where the
	   default rhythm leaves the text floating in a tall box. The card padding
	   comes in from 2rem to 1.5rem, and the action is pushed to the foot of the
	   card, so the slack a row's tallest card creates is absorbed between the
	   copy and the action instead of trailing below it. Row heights still
	   equalise, and sections that do not ask for this density are untouched. */
	[data-density='tight'] .card-pad { padding: 1.5rem; }
	[data-density='tight'] .card-link { margin-top: auto; padding-top: 1.25rem; }
	/* A card body may carry a spec list where the package prints one. The global
	   stylesheet only styles lists inside `.prose`, so the card supplies its own
	   marker and indent rather than inheriting the browser's. */
	.card-body :global(ul) { margin: .75rem 0 0; padding-left: 1.1rem; list-style: disc; }
	.card-body :global(li) { margin-top: .35rem; }
	.card-body :global(li::marker) { color: var(--color-muted); }
	/* A small trailing line under the grid, for a caveat the package prints
	   beneath a set of cards. Slate, not muted: at the spec size muted slate
	   falls under 4.5:1 on the page field. */
	.section-note { color: var(--color-text); font-size: var(--text-spec); line-height: 1.5; }
	/* Kit panel: one height across every family row, so a single TX10 card,
	   a row of three and a row of two all frame their products alike. */
	.kit-panel { height: 12rem; }
	@media (min-width: 768px) { .kit-panel { height: 14rem; } }
</style>
