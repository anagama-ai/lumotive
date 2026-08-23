<script lang="ts">
	import gsap from 'gsap';
	import ScrollTrigger from 'gsap/ScrollTrigger';
	import { prefersReducedMotion } from '$lib/motion';

	let { value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string } = $props();

	function count(element: HTMLSpanElement) {
		if (prefersReducedMotion()) return;

		gsap.registerPlugin(ScrollTrigger);
		const counter = { value: 0 };
		element.textContent = '0';
		const tween = gsap.to(counter, {
			value,
			duration: 1.6,
			ease: 'power2.out',
			scrollTrigger: { trigger: element, start: 'top 88%', once: true },
			onUpdate: () => {
				element.textContent = Math.round(counter.value).toString();
			}
		});

		return () => {
			tween.scrollTrigger?.kill();
			tween.kill();
		};
	}
</script>

<span class="tabular-nums">{prefix}<span {@attach count}>{Math.round(value)}</span>{suffix}</span>
