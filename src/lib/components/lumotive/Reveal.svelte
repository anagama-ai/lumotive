<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { prefersReducedMotion } from '$lib/motion';
	import { IN_PEEL_SCENE } from '$lib/components/lumotive/peel/context';

	let { children, delay = 0 }: { children: Snippet; delay?: number } = $props();
	const inPeel = getContext<boolean>(IN_PEEL_SCENE);

	function reveal(element: HTMLDivElement) {
		if (inPeel || prefersReducedMotion()) return;

		gsap.registerPlugin(ScrollTrigger);
		const tween = gsap.fromTo(
			element,
			{ opacity: 0, y: 28 },
			{
				opacity: 1,
				y: 0,
				duration: .9,
				delay,
				ease: 'power3.out',
				scrollTrigger: { trigger: element, start: 'top 85%', once: true }
			}
		);

		return () => {
			tween.scrollTrigger?.kill();
			tween.revert();
		};
	}
</script>

<div data-peel={inPeel ? 'rise' : undefined} {@attach reveal}>
	{@render children()}
</div>
