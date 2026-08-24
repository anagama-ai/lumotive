<script lang="ts">
	type Breadcrumb = { title: string; href: string };

	let { breadcrumbs }: { breadcrumbs: Breadcrumb[] } = $props();
</script>

{#if breadcrumbs.length}
	<nav class="container breadcrumbs" aria-label="Breadcrumb">
		<ol>
			{#each breadcrumbs as breadcrumb, index (index)}
				<li><a href={breadcrumb.href}>{breadcrumb.title}</a></li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	.breadcrumbs {
		padding-block: 1rem;
	}

	ol {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li + li::before {
		margin-inline-end: 0.5rem;
		color: #6b7280;
		content: '/';
	}

	a {
		color: inherit;
	}
</style>
