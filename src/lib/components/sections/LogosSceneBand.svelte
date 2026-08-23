<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import LogosMarquee from './LogosMarquee.svelte';

	let { section, media }: { section: Section; media: MediaMap } = $props();
</script>

<LogosMarquee {section} {media} sceneBand />
