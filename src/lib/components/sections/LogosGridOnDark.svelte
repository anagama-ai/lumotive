<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import LogosLabelled from './LogosLabelled.svelte';

	let { section, media }: { section: Section; media: MediaMap } = $props();
</script>

<LogosLabelled {section} {media} dark />
