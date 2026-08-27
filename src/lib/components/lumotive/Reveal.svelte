<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { IN_PEEL_SCENE } from '$lib/components/lumotive/peel/context';

	const REST = { x: 0, y: 0, scale: 1, opacity: 1 };

	let {
		children,
		class: className = '',
		stagger = false,
		delay = 0,
		immediate = false,
		x = 0,
		y = 28,
		scale = 1,
		fade = true,
		duration = 0.9
	}: {
		children: Snippet;
		class?: string;
		stagger?: boolean | string;
		delay?: number;
		immediate?: boolean;
		x?: number;
		y?: number;
		scale?: number;
		fade?: boolean;
		duration?: number;
	} = $props();
	const inPeel = getContext<boolean>(IN_PEEL_SCENE);

	function reveal(element: HTMLDivElement) {
		if (inPeel) return;

		gsap.registerPlugin(ScrollTrigger);
		const targets = stagger
			? gsap.utils.toArray<HTMLElement>(
					typeof stagger === 'string' ? stagger : ':scope > *',
					element
				)
			: [element];
		if (!targets.length) return;

		const matchMedia = gsap.matchMedia();
		matchMedia.add(
			{
				motion: '(prefers-reduced-motion: no-preference)',
				reduced: '(prefers-reduced-motion: reduce)',
				wide: '(min-width: 768px)'
			},
			(context) => {
				if (context.conditions?.reduced) {
					gsap.set(targets, REST);
					return;
				}

				// fromTo avoids inferring a stale inline state as the tween's end value.
				gsap.fromTo(
					targets,
					{ opacity: fade ? 0 : 1, x: context.conditions?.wide ? x : 0, y, scale },
					{
						...REST,
						duration,
						delay,
						ease: 'power3.out',
						stagger: stagger ? 0.09 : 0,
						...(immediate
							? {}
							: {
									scrollTrigger: {
										trigger: element,
										start: 'top 85%',
										once: true
									}
								})
					}
				);
			}
		);

		return () => matchMedia.revert();
	}
</script>

<div
	class={className}
	data-peel={inPeel ? (stagger ? 'rise-each' : 'rise') : undefined}
	{@attach reveal}
>
	{@render children()}
</div>
