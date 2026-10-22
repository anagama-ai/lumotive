<script lang="ts">
	// A short looping animation (a deck GIF converted to MP4, package page 03):
	// muted, plays while on screen and pauses off screen. Reduced motion keeps
	// it on its poster frame. The pause control is always there, so anyone can
	// stop or start it (WCAG 2.2.2), whatever their motion setting.
	let {
		src,
		poster,
		label = '',
		aspect
	}: { src: string; poster?: string; label?: string; aspect?: string } = $props();

	let paused = $state(true);
	// Set once the visitor uses the control; scrolling never overrides it.
	let chosen: 'play' | 'pause' | null = null;
	let video: HTMLVideoElement | undefined = $state();

	const toggle = () => {
		if (!video) return;
		if (video.paused) {
			chosen = 'play';
			video.play().catch(() => {});
		} else {
			chosen = 'pause';
			video.pause();
		}
	};

	function playWhileVisible(node: HTMLVideoElement) {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
		let visible = false;
		const sync = () => {
			const wanted = chosen ? chosen === 'play' : !reduce.matches;
			if (visible && wanted) node.play().catch(() => {});
			else node.pause();
		};
		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				sync();
			},
			{ threshold: 0.25 }
		);
		observer.observe(node);
		reduce.addEventListener('change', sync);
		return () => {
			observer.disconnect();
			reduce.removeEventListener('change', sync);
		};
	}
</script>

<figure class="loop-video">
	<video
		bind:this={video}
		{@attach playWhileVisible}
		{src}
		{poster}
		style:aspect-ratio={aspect}
		muted
		loop
		playsinline
		preload="metadata"
		aria-label={label || undefined}
		onplay={() => (paused = false)}
		onpause={() => (paused = true)}
	></video>
	<button type="button" class="loop-toggle" aria-label={paused ? 'Play animation' : 'Pause animation'} onclick={toggle}>
		{#if paused}
			<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M5 3.2v9.6c0 .5.6.8 1 .5l7.3-4.8c.4-.3.4-.8 0-1.1L6 2.7c-.4-.3-1 0-1 .5z" fill="currentColor" /></svg>
		{:else}
			<svg aria-hidden="true" viewBox="0 0 16 16"><rect x="4" y="3" width="3" height="10" rx=".8" fill="currentColor" /><rect x="9" y="3" width="3" height="10" rx=".8" fill="currentColor" /></svg>
		{/if}
	</button>
</figure>

<style>
	/* The control sits under the frame, right-aligned: the supplied animations
	   carry their own labels and captions edge to edge, so nothing may cover
	   them. */
	.loop-video { display: grid; justify-items: end; gap: .5rem; margin: 0; }
	video { display: block; width: 100%; height: auto; border-radius: var(--radius-card); }
	/* 44px target; ink on white measures well above 4.5:1 for the icon. */
	.loop-toggle { display: grid; width: 2.75rem; height: 2.75rem; place-items: center; border: 1px solid var(--color-border); border-radius: 999px; color: var(--color-ink); background: var(--color-surface); cursor: pointer; }
	.loop-toggle svg { width: 1rem; height: 1rem; }
	.loop-toggle:focus-visible { outline: 2px solid var(--color-brand-blue-dark); outline-offset: 2px; }
</style>
