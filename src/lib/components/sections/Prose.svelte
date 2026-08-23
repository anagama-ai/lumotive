<script lang="ts">
	import type { Section } from '$lib/sections';
	import { rewriteRichTextImages } from '$lib/richtextimages';

	let { section }: { section: Section } = $props();
</script>

{#if section.html}
	<section class="section">
		<div class="container prose">{@html rewriteRichTextImages(String(section.html))}</div>
	</section>
{/if}
