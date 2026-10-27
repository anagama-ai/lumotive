<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import SplitDefault from './SplitDefault.svelte';

	// The full-bleed band in normal flow. It no longer rides in a `PeelScene`:
	// the sticky panel, the lift over the scene above and their measured
	// offsets went stale whenever the browser bars resized the viewport,
	// leaving the band's content behind the header on touch devices.
	let { section, media }: { section: Section; media: MediaMap } = $props();
</script>

<SplitDefault {section} {media} variant="peelBleed" />
