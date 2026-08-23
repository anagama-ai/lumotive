<script lang="ts">
	import type { Section } from '$lib/sections';

	type Card = { title?: string; body?: string; href?: string };

	let { section }: { section: Section } = $props();
	let items = $derived(Array.isArray(section.items) ? (section.items as Card[]) : []);
</script>

<section class="section cards-section">
	<div class="container">
		{#if section.heading}<h2>{String(section.heading)}</h2>{/if}
		<div class="card-grid">
			{#each items as item}
				<article class="card">
					<h3>{item.title || ''}</h3>
					{#if item.body}<p>{item.body}</p>{/if}
					{#if item.href}<a href={item.href} aria-label={`Read more about ${item.title || 'this item'}`}>Learn more <span aria-hidden="true">→</span></a>{/if}
				</article>
			{/each}
		</div>
	</div>
</section>
