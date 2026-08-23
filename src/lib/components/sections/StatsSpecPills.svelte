<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import StatsCentered from './StatsCentered.svelte';

	let { section, media }: { section: Section; media: MediaMap } = $props();
</script>

<StatsCentered {section} {media} />
