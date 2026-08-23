<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const tabs = [
		{ href: '/admin/settings/site-meta', label: 'Site meta' },
		{ href: '/admin/settings/header', label: 'Header' },
		{ href: '/admin/settings/footer', label: 'Footer' },
		{ href: '/admin/settings/sharing', label: 'Search and sharing' },
		{ href: '/admin/settings/code', label: 'Custom code' }
	];
</script>

<div class="head">
	<div>
		<h1>Site settings</h1>
		<p class="sub">Applies to every page of your website.</p>
	</div>
</div>

<nav class="settings-tabs" aria-label="Settings sections">
	{#each tabs as tab (tab.href)}
		<a href={tab.href} aria-current={page.url.pathname === tab.href ? 'page' : undefined}>
			{tab.label}
		</a>
	{/each}
</nav>

{@render children()}

<style>
	.settings-tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		margin-bottom: 20px;
		border-bottom: 1px solid var(--line);
	}
	.settings-tabs a {
		padding: 9px 14px;
		font-size: 14px;
		font-weight: 500;
		color: var(--muted);
		text-decoration: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -1px;
	}
	.settings-tabs a:hover { color: var(--ink); }
	.settings-tabs a[aria-current='page'] {
		color: var(--brand-ink);
		border-bottom-color: var(--brand);
	}
</style>
