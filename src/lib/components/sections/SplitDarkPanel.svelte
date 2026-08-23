<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import SplitDefault from './SplitDefault.svelte';

	let { section, media }: { section: Section; media: MediaMap } = $props();
</script>

<SplitDefault {section} {media} variant="darkPanel" />
