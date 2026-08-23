<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import HeroFullHeight from './HeroFullHeight.svelte';

	let { section, media }: { section: Section; media: MediaMap } = $props();
</script>

<HeroFullHeight {section} {media} band />
