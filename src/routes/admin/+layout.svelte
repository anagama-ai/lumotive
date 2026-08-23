<script lang="ts">
	import { page } from '$app/state';
	import fallbackLogo from '$lib/assets/favicon.svg';
	import '$lib/components/admin/admin.css';
	import Toasts from '$lib/components/admin/Toasts.svelte';
	import type { Snippet } from 'svelte';

	let {
		data,
		children
	}: {
		data: {
			editor: { name: string; email: string; role: string } | null;
			brandLogo: string;
			divergence: { collections: string[]; checkedAt: string } | null;
		};
		children: Snippet;
	} = $props();

	const links = [
		{ href: '/admin', label: 'Dashboard' },
		{ href: '/admin/pages', label: 'Pages' },
		{ href: '/admin/posts', label: 'Posts' },
		{ href: '/admin/forms', label: 'Forms' },
		{ href: '/admin/media', label: 'Media' },
		{ href: '/admin/reviews', label: 'Reviews' },
		{ href: '/admin/settings', label: 'Site settings' },
		{ href: '/admin/redirects', label: 'Redirects', adminOnly: true }
	];

	const current = (href: string) =>
		href === '/admin' ? page.url.pathname === '/admin' : page.url.pathname.startsWith(href);
</script>

<svelte:head><title>Content manager</title></svelte:head>

<div class="admin">
	{#if data.editor}
		<div class="admin-shell">
			<aside class="admin-side">
				<div class="admin-brand">
					<img src={data.brandLogo || fallbackLogo} alt="" />
					Content manager
				</div>

				<nav class="admin-nav">
					{#each links as link (link.href)}
						{#if !link.adminOnly || data.editor.role === 'admin'}
							<a href={link.href} aria-current={current(link.href) ? 'page' : undefined}>
								{link.label}
							</a>
						{/if}
					{/each}
				</nav>

				<div class="admin-side-foot">
					<div class="admin-who">
						<strong>{data.editor.name || 'Editor'}</strong>
						<span>{data.editor.email}</span>
					</div>
					<form method="POST" action="/admin?/logout">
						<button>Sign out</button>
					</form>
				</div>
			</aside>

			<main class="admin-main">
				{#if data.divergence}
					<p class="notice bad" role="status">
						<strong>Production changed since staging was refreshed.</strong>
						Affected collections: {data.divergence.collections.join(', ')}. Last checked
						<time datetime={data.divergence.checkedAt}>{data.divergence.checkedAt}</time>. Editing remains
						available.
					</p>
				{/if}
				{@render children()}
			</main>
		</div>
	{:else}
		{@render children()}
	{/if}

	<Toasts />
</div>
