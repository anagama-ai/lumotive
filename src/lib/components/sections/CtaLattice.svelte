<script lang="ts">
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import CtaDefault from './CtaDefault.svelte';

	let { section, media }: { section: Section; media: MediaMap } = $props();
</script>

<CtaDefault {section} {media} />
