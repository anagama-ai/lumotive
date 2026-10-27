<script lang="ts">
	import type { Section } from '$lib/sections';
	import { rewriteRichTextImages } from '$lib/richtextimages';

	let { section }: { section: Section } = $props();
	let legal = $derived(section.layout === 'legal');

	// Legal headings arrive from the source document as "1." followed by a run
	// of non-breaking spaces standing in for a tab, which set a wide and uneven
	// gap (five for 1–9, one for 10). For legal pages only, the number goes into
	// its own span (with any empty anchor targets ahead of it, so in-page links
	// still land) and the title into another; the whitespace run becomes one
	// space, so the text reads "1. Introduction." The stored copy is unchanged.
	const NUMBERED_HEADING = /(<h2\b[^>]*>)((?:<a\b[^>]*><\/a>)*)(\d+\.)[\s\u00a0]+([\s\S]*?)<\/h2>/g;
	const numberHeadings = (html: string) =>
		html.replace(NUMBERED_HEADING, '$1<span class="legal-num">$2$3</span> <span class="legal-title">$4</span></h2>');
	let html = $derived.by(() => {
		const source = rewriteRichTextImages(String(section.html ?? ''));
		return legal ? numberHeadings(source) : source;
	});
</script>

{#if section.html}
	<section class="section" class:legal>
		<div class="container prose">{@html html}</div>
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
	/* A numbered heading sets its number in a column wide enough for "10.",
	   right-aligned so the gap after every number is the same, and wrapped
	   title lines stay aligned with the first. */
	.legal :global(h2:has(> .legal-num)) {
		display: grid;
		grid-template-columns: 2.25ch minmax(0, 1fr);
		column-gap: calc(var(--spacing) * 4);
		align-items: baseline;
	}
	.legal :global(.legal-num) { justify-self: end; }
	@media (min-width: 768px) {
		.legal :global(h2:has(> .legal-num)) { column-gap: calc(var(--spacing) * 5); }
	}
</style>
