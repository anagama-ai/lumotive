<script lang="ts">
	type NavItem = { label: string; href: string };
	type FooterData = { text?: string; nav?: NavItem[] };

	let { data = {}, injectedHtml = '' }: { data?: FooterData; injectedHtml?: string } = $props();
</script>

<footer class="site-footer">
	<div class="container footer-inner">
		<p>{data.text || ''}</p>
		{#if data.nav?.length}
			<nav aria-label="Footer navigation">
				{#each data.nav as item}
					<a href={item.href}>{item.label}</a>
				{/each}
			</nav>
		{/if}
		{@html injectedHtml}
	</div>
</footer>
