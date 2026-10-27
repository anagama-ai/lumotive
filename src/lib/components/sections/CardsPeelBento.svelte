<script lang="ts">
	import { setContext } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import { IN_PEEL_SCENE } from '$lib/components/lumotive/peel/context';
	import LogosSceneBand from './LogosSceneBand.svelte';
	import StatsSceneBand from './StatsSceneBand.svelte';

	type CardLink = { label?: string; url?: string; newTab?: boolean };
	type Card = { media?: unknown; eyebrow?: string; title?: string; body?: string; link?: CardLink; linkLabel?: string; linkUrl?: string; badge?: string; accent?: string };
	let { section, media, band }: { section: Section; media: MediaMap; band?: Section } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Card[]) : []);
	// The bento spans assume a long, uneven set. A set of four or fewer is an
	// even row instead, so the feature spans are opt-in by length.
	let bento = $derived(cards.length > 4);
	let sectionLink = $derived.by(() => {
		const label = String(section.linkLabel ?? '').trim();
		const href = String(section.linkUrl ?? '').trim();
		if (!label || !href) return null;
		return { label, href, newTab: section.linkNewTab === true || section.linkNewTab === 'true' };
	});

	const linkFor = (card: Card) => ({ href: card.linkUrl || card.link?.url || '', label: card.linkLabel || card.link?.label || '', newTab: Boolean(card.link?.newTab) });
	const bar = (accent?: string) => accent === 'accent2' ? 'bg-brand-red' : accent === 'accent3' ? 'bg-brand-amber' : 'bg-surface';

	// This scene owns all motion inside it. A nested `Reveal` (the scene band's
	// heading) would otherwise start its own ScrollTrigger inside the pinned
	// element, where its start is offset by the whole pin distance.
	setContext(IN_PEEL_SCENE, true);

	/** Scroll distance, in px, per second of timeline: the pin length follows the choreography. */
	const SCROLL_PER_SECOND = 260;
	/** Clearance kept between the pinned content and the sticky header / the viewport's lower edge. */
	const GAP = 24;

	let root: HTMLDivElement;
	let pin: HTMLDivElement;

	// On a reload SvelteKit restores the scroll position before hydration (see
	// the `data-measured` rule in the styles). The peel scenes above then resize
	// while they hydrate and can clamp it, so the position as restored is kept
	// here, read before any effect runs, and put back once the pin is measured.
	const entryScroll = typeof window === 'undefined' ? 0 : window.scrollY;
	let entering = false;
	afterNavigate((navigation) => {
		entering = navigation.type === 'enter';
	});

	$effect(() => {
		// Rebuild when the content changes (CMS live preview re-renders the cards).
		void cards;
		void sectionLink;
		void band;

		const scene = root;
		const pinned = pin;
		gsap.registerPlugin(ScrollTrigger);

		let disposed = false;
		// ScrollTrigger's own debounced, scroll-safe refresh: it waits for a scroll
		// in progress to end instead of measuring, and stopping it, mid-way.
		const refresh = () => {
			if (!disposed) ScrollTrigger.refresh(true);
		};

		// Scroll writes on this page stay instant until the pin is measured (see
		// the `data-measured` rule in the styles).
		let measuredFrame = 0;
		let userScrolled = false;
		const onUserScroll = () => (userScrolled = true);
		const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
		for (const type of inputs) window.addEventListener(type, onUserScroll, { passive: true, once: true });
		const markMeasured = () => {
			ScrollTrigger.removeEventListener('refresh', measuredAfterRefresh);
			cancelAnimationFrame(measuredFrame);
			for (const type of inputs) window.removeEventListener(type, onUserScroll);
			if (pinning && entering && !userScrolled && Math.abs(window.scrollY - entryScroll) > 1) {
				window.scrollTo({ top: entryScroll, behavior: 'instant' });
			}
			entering = false;
			scene.setAttribute('data-measured', '');
		};
		const measuredAfterRefresh = () => {
			ScrollTrigger.removeEventListener('refresh', measuredAfterRefresh);
			measuredFrame = requestAnimationFrame(markMeasured);
		};
		let pinning = false;

		const mm = gsap.matchMedia(scene);
		mm.add(
			{
				pinned: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
				flow: '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)'
			},
			(context) => {
				const cardEls = gsap.utils.toArray<HTMLElement>('[data-bento-card]', scene);
				const cta = scene.querySelector<HTMLElement>('[data-bento-cta]');
				// The heading's first line (not its block, which starts at the section top).
				const heading = scene.querySelector<HTMLElement>('[data-bento-heading] > *');
				const content = scene.querySelector<HTMLElement>('[data-bento-section]');
				if (!content || !cardEls.length) return;

				if (context.conditions?.flow) {
					// No pin below 1024px: the grid stays in natural document flow and
					// each card (then the action) settles in as it enters the viewport.
					const tweens = [...cardEls, ...(cta ? [cta] : [])].map((el) =>
						gsap.fromTo(
							el,
							{ opacity: 0, '--bento-y': '24px' },
							{
								opacity: 1,
								'--bento-y': '0px',
								duration: 0.6,
								ease: 'power2.out',
								scrollTrigger: { trigger: el, start: 'top 92%', once: true }
							}
						)
					);
					// Tabbing to a card that has not entered yet must not land on an
					// invisible element.
					const onFocus = (event: FocusEvent) => {
						for (const tween of tweens) {
							const target = tween.targets()[0] as HTMLElement;
							if (target.contains(event.target as Node)) tween.progress(1);
						}
					};
					scene.addEventListener('focusin', onFocus);
					return () => scene.removeEventListener('focusin', onFocus);
				}

				// Desktop: pin the scene and let scroll assemble the grid. Heading and
				// introduction never move; each card rises, fades and settles from a
				// slight scale, overlapping its neighbour; the action arrives last.
				const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });
				cardEls.forEach((el, index) => {
					timeline.fromTo(
						el,
						{ opacity: 0, '--bento-y': '40px', '--bento-scale': 0.97 },
						{ opacity: 1, '--bento-y': '0px', '--bento-scale': 1, duration: 0.9 },
						index * 0.4
					);
				});
				if (cta) timeline.fromTo(cta, { opacity: 0, '--bento-y': '16px' }, { opacity: 1, '--bento-y': '0px', duration: 0.5 }, '>-0.15');
				// A short hold on the finished grid before the pin lets go.
				timeline.to({}, { duration: 0.3 });

				const top = (el: HTMLElement) => el.getBoundingClientRect().top - pinned.getBoundingClientRect().top;
				// Where the pinned element sits in the viewport while held. 0 (its top
				// at the viewport top) whenever heading-to-action fits below the sticky
				// header; otherwise shift up just enough to show the action, but never
				// so far that the heading slides under the header.
				const offset = () => {
					const header = document.querySelector<HTMLElement>('[data-lumotive-header]')?.offsetHeight ?? 0;
					const headTop = top(heading ?? content);
					const contentBottom = top(content) + content.offsetHeight;
					const showAction = window.innerHeight - GAP - contentBottom;
					const clearHeader = header + GAP - headTop;
					return Math.round(Math.min(0, Math.max(clearHeader, showAction)));
				};

				const trigger = ScrollTrigger.create({
					trigger: pinned,
					pin: pinned,
					pinSpacing: true,
					start: () => `top ${offset()}px`,
					end: () => `+=${Math.round(timeline.duration() * SCROLL_PER_SECOND)}`,
					scrub: 0.4,
					animation: timeline,
					invalidateOnRefresh: true
				});
				// The pin queues a full refresh; the page counts as measured once it
				// has run (see the `data-measured` rule in the styles).
				pinning = true;
				ScrollTrigger.addEventListener('refresh', measuredAfterRefresh);

				// Keyboard focus reaching a card or the action, from above or below,
				// lands on the finished grid rather than on a hidden or displaced
				// element. Focus events run before the browser scrolls the element
				// into view, so the pin is moved to its end state first and updated
				// synchronously; where the action sits below the fold at that point
				// (short viewports), the page continues past the pin to show it.
				const onFocus = (event: FocusEvent) => {
					const target = event.target as Element;
					if (!target.closest('[data-bento-card], [data-bento-cta]')) return;
					const inView = (box: DOMRect) => box.top >= 0 && box.bottom <= window.innerHeight - GAP;
					if (trigger.progress >= 1 && inView(target.getBoundingClientRect())) return;
					// Instant: the site's smooth scroll-behavior would defer the jump.
					const jump = (top: number) => {
						window.scrollTo({ top, behavior: 'instant' });
						ScrollTrigger.update();
					};
					const end = Math.ceil(trigger.end);
					jump(end);
					const below = target.getBoundingClientRect().bottom - (window.innerHeight - GAP);
					if (below > 0) jump(end + Math.ceil(below));
				};
				scene.addEventListener('focusin', onFocus);
				return () => scene.removeEventListener('focusin', onFocus);
			}
		);

		// Nothing pinned (phones, tablets, reduced motion): no measurement to wait for.
		if (!pinning) markMeasured();

		// Fonts and late images move everything after them; re-measure once they
		// settle so the pin starts and ends where the layout really is.
		const pending = Array.from(document.querySelectorAll<HTMLImageElement>('main img')).filter((img) => !img.complete);
		for (const img of pending) {
			img.addEventListener('load', refresh, { once: true });
			img.addEventListener('error', refresh, { once: true });
		}
		if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(refresh);

		return () => {
			disposed = true;
			ScrollTrigger.removeEventListener('refresh', measuredAfterRefresh);
			cancelAnimationFrame(measuredFrame);
			for (const type of inputs) window.removeEventListener(type, onUserScroll);
			scene.removeAttribute('data-measured');
			for (const img of pending) {
				img.removeEventListener('load', refresh);
				img.removeEventListener('error', refresh);
			}
			// Kills the trigger and timeline and unwraps the pin spacer.
			mm.revert();
		};
	});
</script>

<!-- Homepage "When light becomes programmable". From 1024px the scene pins
     with GSAP ScrollTrigger (pinSpacing) while the cards assemble; below that,
     and under reduced motion, it is ordinary document flow. The pinned element
     takes its content's height, so a tall screen gets no empty band after it. -->
<div bind:this={root} data-bento-scene class="bento-scene">
	<div bind:this={pin} class="bento-pin">
		<section
			class="lumo-section"
			data-bento-section
			id={section.anchor ? String(section.anchor) : undefined}
			data-background={String(section.background ?? 'none')}
			data-width={String(section.width ?? 'contained')}
			data-spacing-top={String(section.spacingTop ?? 'md')}
			data-spacing-bottom={String(section.spacingBottom ?? 'md')}
			data-align="container"
		>
			<div class="lumo-inner flex min-h-full flex-col justify-center py-10">
				{#if section.eyebrow || section.heading || section.intro}
					<div data-bento-heading class="mb-12 max-w-6xl">
						{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
						{#if section.heading}<h2 class="font-display text-display text-ink whitespace-pre-line">{titleCase(String(section.heading))}</h2>{/if}
						{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
					</div>
				{/if}

				<div class="grid gap-6 md:grid-cols-2 lg:grid-flow-dense lg:auto-rows-fr lg:grid-cols-4">
					{#each cards as card, index (index)}
						{@const image = resolveMedia(card.media, media, 1024)}
						{@const link = linkFor(card)}
						{@const solid = !image}
						{@const amber = solid && card.accent === 'accent3'}
						{@const darkText = amber || (solid && card.accent !== 'accent2')}
						<!-- Only the hover properties transition: GSAP drives opacity while
						     scrolling, and a CSS transition on it would lag the scrub. -->
						<svelte:element
							this={link.href ? 'a' : 'article'}
							data-bento-card
							class={`rounded-card group relative flex min-h-72 flex-col overflow-hidden p-8 transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card motion-reduce:transform-none motion-reduce:transition-none ${bento && index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''} ${bento && index === 2 ? 'lg:row-span-2' : ''} ${bento && index === 4 ? 'lg:col-span-3' : ''} ${solid ? bar(card.accent) : 'bg-surface'}${link.href ? ' no-underline focus-visible:outline-2 focus-visible:outline-offset-4' : ''}`}
							href={link.href || undefined}
							target={link.href && link.newTab ? '_blank' : undefined}
							rel={link.href && link.newTab ? 'noopener noreferrer' : undefined}
						>
							{#if image}
								<img class="absolute inset-0 size-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105" src={image.src} srcset={image.srcset} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
								<!-- Ink to 80% at mid-card: at 50% the title measured 2.8:1 over
								     the bright warehouse photo (white text needs 4.5:1). -->
								<div aria-hidden="true" class="from-ink via-ink/80 to-ink/15 absolute inset-0 bg-linear-to-t"></div>
							{/if}
							<div class="relative z-10 flex flex-1 flex-col justify-end">
								{#if card.eyebrow}<p class={`text-eyebrow uppercase ${darkText ? 'text-ink' : 'text-white/75'}`}>{card.eyebrow}</p>{/if}
								<h3 class={`font-display mt-3 ${bento && index === 0 ? 'text-heading' : 'text-subheading'} ${darkText ? 'text-ink' : 'text-white'}`}>{titleCase(card.title ?? '')}</h3>
								{#if card.body}<div class={`mt-3 text-base leading-relaxed ${darkText ? 'text-ink' : 'text-white/75'}`}>{@html card.body}</div>{/if}
								{#if card.badge}<span class={`text-spec mt-4 self-start rounded-full px-3 py-1 ${darkText ? 'bg-ink/10 text-ink' : 'bg-white/15 text-white'}`}>{card.badge}</span>{/if}
								{#if link.href && link.label}
									<span class={`mt-auto inline-flex items-center gap-2 self-start pt-6 text-base font-medium ${darkText ? 'text-ink' : 'text-white'}`}>
										{link.label}<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg>
									</span>
								{/if}
							</div>
						</svelte:element>
					{/each}
				</div>
				{#if sectionLink}
					<div data-bento-cta>
						<a class="section-link" href={sectionLink.href} target={sectionLink.newTab ? '_blank' : undefined} rel={sectionLink.newTab ? 'noreferrer' : undefined}>{sectionLink.label} <span aria-hidden="true">→</span></a>
					</div>
				{/if}
			</div>
		</section>
		{#if band?.type === 'logosSceneBand'}
			<LogosSceneBand section={band} {media} />
		{:else if band?.type === 'statsSceneBand'}
			<StatsSceneBand section={band} {media} />
		{/if}
	</div>
</div>


<style>
	/* SvelteKit restores the scroll position on reload (before hydration, so
	   against this server-rendered markup) and on back/forward. Until the scene
	   is measured, that restore must land as-is: the site's `scroll-behavior:
	   smooth` would animate it (and setting up the pin, which writes the scroll
	   position, would stop it part-way), and scroll anchoring would shift it
	   while hydration resizes the scenes above. */
	:global(html:has([data-bento-scene]:not([data-measured]))) {
		scroll-behavior: auto;
		overflow-anchor: none;
	}

	.bento-scene,
	.bento-pin {
		background: var(--color-background, var(--paper));
	}

	.bento-pin {
		display: flex;
		flex-direction: column;
	}

	/* The 5rem top padding and horizontal-only clip the panel had inside
	   PeelScene, so the settled layout is unchanged from 768px up. */
	@media (min-width: 768px) {
		.bento-pin {
			padding-top: 5rem;
			overflow-x: clip;
		}
	}

	/* The scroll motion moves cards and the action through these variables
	   rather than `transform` inline: GSAP would otherwise pin the `translate`
	   property to `none` and cancel the card's 4px hover lift. */
	@media (prefers-reduced-motion: no-preference) {
		[data-bento-card],
		[data-bento-cta] {
			transform: translateY(var(--bento-y, 0px)) scale(var(--bento-scale, 1));
			transform-origin: 50% 100%;
		}
	}

	/* A bare utility loses to the global anchor colour, so the section action is
	   coloured the same scoped way the other section links are. */
	.section-link { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .5rem; margin-top: 2.5rem; color: var(--color-brand-blue-dark); font-weight: 650; text-decoration: none; }
	.section-link span { transition: transform 200ms ease; }
	.section-link:hover span { transform: translateX(.25rem); }
	@media (prefers-reduced-motion: reduce) {
		.section-link span { transition: none; }
		.section-link:hover span { transform: none; }
	}
</style>
