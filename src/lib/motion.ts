import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export type SmoothScrollTeardown = (() => void) & { lenis: Lenis | null };

let scrollTriggerRegistered = false;

function ensureScrollTrigger() {
	if (scrollTriggerRegistered) return;
	gsap.registerPlugin(ScrollTrigger);
	scrollTriggerRegistered = true;
}

/** Whether the browser has requested reduced motion. Safe during SSR. */
export function prefersReducedMotion(): boolean {
	return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Keeps an autoplaying decorative video paused while reduced motion is asked
 * for, including when the preference changes after load. Use with `{@attach}`.
 */
export function honorReducedMotion(video: HTMLVideoElement) {
	const query = window.matchMedia('(prefers-reduced-motion: reduce)');
	const enforce = () => {
		if (query.matches) video.pause();
	};
	enforce();
	video.addEventListener('play', enforce);
	query.addEventListener('change', enforce);
	return () => {
		video.removeEventListener('play', enforce);
		query.removeEventListener('change', enforce);
	};
}

/**
 * Starts Lenis on GSAP's ticker and returns its teardown. The live Lenis instance
 * is exposed on `teardown.lenis` for scroll locking and programmatic scrolling.
 */
export function initSmoothScroll(): SmoothScrollTeardown {
	if (prefersReducedMotion()) {
		return Object.assign(() => {}, { lenis: null });
	}

	ensureScrollTrigger();
	const lenis = new Lenis();
	const tick = (time: number) => lenis.raf(time * 1000);

	lenis.on('scroll', ScrollTrigger.update);
	gsap.ticker.add(tick);
	gsap.ticker.lagSmoothing(0);

	return Object.assign(
		() => {
			gsap.ticker.remove(tick);
			lenis.destroy();
		},
		{ lenis }
	);
}

/**
 * Reveals `[data-reveal]` descendants in batches.
 * Defaults: 24px upward, 0.6s, power1.inOut, 0.08s stagger.
 */
export function revealOnScroll(root: HTMLElement): () => void {
	ensureScrollTrigger();
	const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
	const mm = gsap.matchMedia();

	mm.add(
		{
			reduceMotion: '(prefers-reduced-motion: reduce)',
			allowMotion: '(prefers-reduced-motion: no-preference)'
		},
		(context) => {
			if (context.conditions?.reduceMotion || elements.length === 0) return;

			const tweens: gsap.core.Tween[] = [];
			const triggers = ScrollTrigger.batch(elements, {
				start: 'top 85%',
				once: true,
				onEnter: (batch) => {
					tweens.push(
						gsap.from(batch, {
							y: 24,
							autoAlpha: 0,
							duration: 0.6,
							ease: 'power1.inOut',
							stagger: 0.08,
							overwrite: true
						})
					);
				}
			});

			return () => {
				triggers.forEach((trigger) => trigger.kill());
				tweens.forEach((tween) => tween.revert());
			};
		},
		root
	);

	return () => mm.revert();
}
