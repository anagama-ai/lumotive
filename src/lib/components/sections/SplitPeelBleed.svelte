<script lang="ts">
	import PeelScene from '$lib/components/lumotive/peel/PeelScene.svelte';
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import SplitDefault from './SplitDefault.svelte';

	let {
		section,
		media,
		band
	}: { section: Section; media: MediaMap; band?: Section } = $props();
</script>

<PeelScene {band} {media}>
	<SplitDefault {section} {media} variant="peelBleed" />
</PeelScene>
