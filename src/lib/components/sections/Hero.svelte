<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import { revealOnScroll } from '$lib/motion';
	import type { Section } from '$lib/sections';

	let { section, media }: { section: Section; media: MediaMap } = $props();
	let image = $derived(resolveMedia(section.image, media, 1440));
	let root = $state<HTMLElement>();

	$effect(() => {
		if (!root) return;
		return revealOnScroll(root);
	});
</script>

<section bind:this={root} class:with-image={Boolean(image)} class="hero">
	{#if image}
		<img
			class="hero-media"
			src={image.src}
			srcset={image.srcset}
			sizes="100vw"
			alt={image.alt}
			width={image.width ?? 1600}
			height={image.height ?? 900}
		/>
		<div class="hero-shade"></div>
	{/if}
	<div class="container hero-content">
		{#if section.heading}<h1 data-reveal>{String(section.heading)}</h1>{/if}
		{#if section.subheading}<p data-reveal>{String(section.subheading)}</p>{/if}
		{#if section.ctaLabel && section.ctaHref}
			<a data-reveal class="button" href={String(section.ctaHref)}>{String(section.ctaLabel)}</a>
		{/if}
	</div>
</section>

<style>
	.hero { position: relative; overflow: hidden; }
	.hero-media, .hero-shade { position: absolute; inset: 0; width: 100%; height: 100%; }
	.hero-media { object-fit: cover; }
	.hero-shade { background: linear-gradient(100deg, rgb(10 22 32 / 88%), rgb(10 22 32 / 42%)); }
	.hero-content { position: relative; z-index: 1; }
</style>
