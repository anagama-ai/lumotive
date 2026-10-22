<script lang="ts">
	// A short looping animation (a deck GIF converted to MP4, package page 03):
	// muted, plays while on screen and pauses off screen. Reduced motion keeps
	// it on its poster frame. The labelled Play/Pause control is always there,
	// so anyone can stop or start it (WCAG 2.2.2), whatever their motion setting.
	// `panelHeight` (a CSS length): the frame becomes a white panel as wide as
	// the content column, with the animation centred in it and no taller than
	// that length (/dev-kits/transmit-modules). Needs `aspect` to size it.
	let {
		src,
		poster,
		label = '',
		aspect,
		center = false,
		panelHeight
	}: { src: string; poster?: string; label?: string; aspect?: string; center?: boolean; panelHeight?: string } = $props();

	// Width that keeps the capped height at the video's own ratio, never wider
	// than the panel: the whole frame stays visible and is never cropped.
	let panelWidth = $derived.by(() => {
		if (!panelHeight || !aspect) return undefined;
		const [w, h] = aspect.split('/').map((part) => Number(part.trim()));
		return w > 0 && h > 0 ? `min(100%, calc(${panelHeight} * ${w / h}))` : undefined;
	});

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

<figure class="loop-video" class:center>
	<div class="loop-frame" class:panel={Boolean(panelWidth)}>
		<video
			bind:this={video}
			{@attach playWhileVisible}
			{src}
			{poster}
			style:aspect-ratio={aspect}
			style:width={panelWidth}
			muted
			loop
			playsinline
			preload="metadata"
			aria-label={label || undefined}
			onplay={() => (paused = false)}
			onpause={() => (paused = true)}
		></video>
	</div>
	<button type="button" class="loop-toggle" onclick={toggle}>
		{#if paused}
			<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M5 3.2v9.6c0 .5.6.8 1 .5l7.3-4.8c.4-.3.4-.8 0-1.1L6 2.7c-.4-.3-1 0-1 .5z" fill="currentColor" /></svg>
			Play animation
		{:else}
			<svg aria-hidden="true" viewBox="0 0 16 16"><rect x="4" y="3" width="3" height="10" rx=".8" fill="currentColor" /><rect x="9" y="3" width="3" height="10" rx=".8" fill="currentColor" /></svg>
			Pause animation
		{/if}
	</button>
</figure>

<style>
	/* The control sits under the frame, on the content's left edge: the
	   supplied animations carry their own labels and captions edge to edge,
	   so nothing may cover them. */
	.loop-video { display: grid; justify-items: start; gap: .75rem; margin: 0; }
	.loop-video.center { justify-items: center; }
	.loop-frame { width: 100%; }
	video { display: block; width: 100%; height: auto; border-radius: var(--radius-card); }
	/* White panel across the column; the animation's own white ground blends
	   into it, so only the panel's edge reads as the container. */
	.loop-frame.panel { display: flex; justify-content: center; border-radius: var(--radius-card); background: var(--color-surface); }
	.loop-frame.panel video { border-radius: 0; }
	@media (min-width: 768px) {
		.loop-frame.panel { padding: 1.5rem; }
	}
	/* 44px target; ink on white well above 4.5:1. The text names the action,
	   so the button needs no separate label. */
	.loop-toggle { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .5rem; padding: .5rem 1.1rem .5rem .9rem; border: 1px solid var(--color-border); border-radius: 999px; color: var(--color-ink); background: var(--color-surface); font: inherit; font-size: var(--text-spec); font-weight: 600; cursor: pointer; }
	.loop-toggle:hover { border-color: var(--color-muted); }
	.loop-toggle svg { width: 1rem; height: 1rem; }
	.loop-toggle:focus-visible { outline: 2px solid var(--color-brand-blue-dark); outline-offset: 2px; }
</style>
