<script lang="ts">
	type NavItem = { label: string; href: string };
	type HeaderData = { siteName?: string; nav?: NavItem[] };

	let { data = {} }: { data?: HeaderData } = $props();
</script>

<header class="site-header">
	<div class="container header-inner">
		<a class="site-name" href="/">{data.siteName || 'Site'}</a>
		{#if data.nav?.length}
			<nav aria-label="Main navigation">
				{#each data.nav as item}
					<a href={item.href}>{item.label}</a>
				{/each}
			</nav>
		{/if}
	</div>
</header>
