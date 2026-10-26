<script lang="ts">
	import type { Section } from '$lib/sections';
	import { rewriteRichTextImages } from '$lib/richtextimages';

	let { section }: { section: Section } = $props();
	let legal = $derived(section.layout === 'legal');
</script>

{#if section.html}
	<section class="section" class:legal>
		<div class="container prose">{@html rewriteRichTextImages(String(section.html))}</div>
	</section>
{/if}

<style>
	/* Legal copy opts into a reading measure without changing news articles. */
	.legal .prose { max-width: var(--container-narrow); overflow-wrap: break-word; }
	.legal :global(h1), .legal :global(h2), .legal :global(h3) { font-family: var(--font-display); font-weight: 600; color: var(--color-ink); text-wrap: balance; }
	.legal :global(h1) { font-size: var(--text-statement); line-height: 1.08; margin-bottom: 1.5rem; }
	.legal :global(h2) { font-size: var(--text-heading); line-height: 1.2; margin: 3rem 0 1rem; }
	.legal :global(h3) { font-size: var(--text-subheading); line-height: 1.3; margin: 2rem 0 1rem; }
	.legal :global(ul), .legal :global(ol) { padding-left: 1.5rem; }
	.legal :global(li + li) { margin-top: .5rem; }
	.legal :global([id]) { scroll-margin-top: 6rem; }
	.legal :global(a[href]) { color: var(--color-brand-blue-dark); }
</style>
