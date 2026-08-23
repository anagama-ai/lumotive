<script lang="ts">
	import type { Section } from '$lib/sections';

	let { section }: { section: Section } = $props();
</script>

<section class="section">
	<div class="container cta">
		<div>
			{#if section.heading}<h2>{String(section.heading)}</h2>{/if}
			{#if section.body}<p>{String(section.body)}</p>{/if}
		</div>
		{#if section.buttonLabel && section.buttonHref}
			<a class="button button-light" href={String(section.buttonHref)}>{String(section.buttonLabel)}</a>
		{/if}
	</div>
</section>
