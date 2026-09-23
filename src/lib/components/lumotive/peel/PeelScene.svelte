<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import LogosSceneBand from '$lib/components/sections/LogosSceneBand.svelte';
	import StatsSceneBand from '$lib/components/sections/StatsSceneBand.svelte';
	import { IN_PEEL_SCENE } from './context';

	const BEAT_VIEWPORTS = 0.9;

	let {
		children,
		band,
		media = {},
		uncover = true,
		revealFollow = false
	}: {
		children?: Snippet;
		band?: Section;
		media?: MediaMap;
		uncover?: boolean;
		/**
		 * Ride the edge of the panel above instead of waiting for it to finish
		 * clearing. This scene's content is held exactly at that panel's lower
		 * edge and rises with it, so the vacated strip is filled as it appears
		 * and the two panels never show content over one another. Off by default:
		 * every other scene keeps waiting for a full viewport of scroll.
		 */
		revealFollow?: boolean;
	} = $props();

	setContext(IN_PEEL_SCENE, true);

	let scope: HTMLDivElement;
	let panel: HTMLDivElement;

	$effect(() => {
		const root = scope;
		const stickyPanel = panel;
		const shouldUncover = uncover;
		const followReveal = revealFollow;

		gsap.registerPlugin(ScrollTrigger);

		const siblings = Array.from(root.parentElement?.children ?? []).filter((element) =>
			element.matches('[data-peel-scene]')
		);
		root.style.zIndex = String(Math.max(10, 40 - siblings.indexOf(root) * 10));

		const beats: { el: HTMLElement; kind: 'rise' | 'fall' | 'tint' }[] = [];
		for (const node of gsap.utils.toArray<HTMLElement>('[data-peel]', root)) {
			for (const token of node.dataset.peel?.split(/\s+/) ?? []) {
				const each = token.endsWith('-each');
				const kind = each ? token.slice(0, -'-each'.length) : token;
				if (kind !== 'rise' && kind !== 'fall' && kind !== 'tint') continue;
				const targets = each ? (Array.from(node.children) as HTMLElement[]) : [node];
				for (const el of targets) beats.push({ el, kind });
			}
		}

		if (!beats.length) {
			return () => {
				root.style.zIndex = '';
			};
		}

		const muted = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-muted')
			.trim();
		const unlit = (el: HTMLElement) =>
			el.closest('[data-peel-from="dim"]') ? 'rgb(255 255 255 / 25%)' : muted;
		const mm = gsap.matchMedia();

		mm.add(
			{
				motion: '(prefers-reduced-motion: no-preference)',
				reduced: '(prefers-reduced-motion: reduce)',
				wide: '(min-width: 768px)'
			},
			(context) => {
				if (context.conditions?.reduced) {
					root.style.marginTop = '0';
					root.style.height = 'auto';
					stickyPanel.style.position = 'static';
					return () => {
						root.style.marginTop = '';
						root.style.height = '';
						stickyPanel.style.position = '';
					};
				}

				const wide = context.conditions?.wide;
				const cover = shouldUncover
					? (() => {
							const previous = root.previousElementSibling;
							return (previous?.matches('[data-peel-cover]')
								? previous
								: previous?.querySelector('[data-peel-cover]')) as HTMLElement | null | undefined;
						})()
					: null;

				const size = () => {
					if (!wide) return;
					// `.uncover` lifts a scene by a viewport so it slides out from under
					// the panel above. With no such panel there is nothing to slide out
					// from, and the lift would drag the scene over the section above it.
					root.style.marginTop = shouldUncover && cover ? `-${cover.offsetHeight}px` : '0px';
					root.style.height = '';
					// A reveal-follow scene plays its beats while it rides the panel
					// above, so everything is finished once that panel has cleared.
					// Reserving the usual beat runway on top of that would pin it in
					// place for a further viewport with nothing left to animate.
					const lift = shouldUncover ? (cover?.offsetHeight ?? 0) : 0;
					const runway = followReveal && cover ? 0 : BEAT_VIEWPORTS * 100;
					root.style.height = `calc(${stickyPanel.offsetHeight + lift}px + ${runway}dvh)`;
				};
				size();

				const coverTween =
					shouldUncover && wide && cover?.children.length
						? gsap.fromTo(
								cover.children,
								{ y: 0 },
								{
									y: () => cover.offsetHeight,
									ease: 'none',
									scrollTrigger: {
										trigger: root,
										start: 'top top',
										end: () => `+=${cover.offsetHeight}`,
										scrub: true,
										invalidateOnRefresh: true
									}
								}
							)
						: undefined;

				// The panel above clears by shrinking its sticky window from a full
				// viewport down to nothing. Held at that shrinking edge, this panel's
				// content occupies the strip the moment it is vacated: no empty band,
				// and nothing of this scene is ever painted beside the panel above.
				const followTween =
					followReveal && shouldUncover && wide && cover && stickyPanel.children.length
						? gsap.fromTo(
								stickyPanel.children,
								{ y: () => cover.offsetHeight },
								{
									y: 0,
									ease: 'none',
									scrollTrigger: {
										trigger: root,
										start: 'top top',
										end: () => `+=${cover.offsetHeight}`,
										scrub: true,
										invalidateOnRefresh: true
									}
								}
							)
						: undefined;

				const timeline = gsap.timeline({
					scrollTrigger: {
						trigger: root,
						start: wide
							? shouldUncover
								? () => `top+=${followTween ? 0 : (cover?.offsetHeight ?? 0)} top`
								: 'top top'
							: 'top 80%',
						end: wide ? () => `+=${window.innerHeight * BEAT_VIEWPORTS}` : undefined,
						scrub: !!wide,
						onRefreshInit: size
					}
				});

				for (const { el, kind } of beats) {
					if (kind === 'rise') {
						timeline.fromTo(
							el,
							{ opacity: 0, y: 16 },
							{ opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
							'+=0.06'
						);
					} else if (kind === 'fall') {
						// An element that also rises must start hidden; the fall's
						// from-state would otherwise render on top of the rise's.
						timeline.fromTo(
							el,
							{ opacity: 1, y: 0 },
							{ opacity: 0, y: -16, duration: 0.45, ease: 'power3.out', immediateRender: false },
							'+=0.06'
						);
					} else {
						timeline.fromTo(
							el,
							{ color: unlit(el) },
							{ color: getComputedStyle(el).color, duration: 0.22, ease: 'none' },
							'+=0.03'
						);
					}
				}

				return () => {
					coverTween?.scrollTrigger?.kill();
					coverTween?.revert();
					followTween?.scrollTrigger?.kill();
					followTween?.revert();
					timeline.scrollTrigger?.kill();
					timeline.revert();
					root.style.marginTop = '';
					root.style.height = '';
				};
			},
			root
		);

		return () => {
			mm.revert();
			root.style.zIndex = '';
		};
	});
</script>

<div bind:this={scope} data-peel-scene class:uncover class="peel-scene">
	<div bind:this={panel} data-peel-cover class="peel-panel">
		{@render children?.()}
		{#if band?.type === 'logosSceneBand'}
			<LogosSceneBand section={band} {media} />
		{:else if band?.type === 'statsSceneBand'}
			<StatsSceneBand section={band} {media} />
		{/if}
	</div>
</div>

<style>
	.peel-scene {
		position: relative;
		margin-top: 0;
		z-index: 40;
		background: var(--color-background, var(--paper));
	}

	.peel-panel {
		display: flex;
		flex-direction: column;
	}

	@media (min-width: 768px) {

		.peel-panel {
			position: sticky;
			top: 0;
			min-height: 100dvh;
			overflow: hidden;
			padding-top: 5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {

		.peel-panel {
			position: static;
		}
	}
</style>
