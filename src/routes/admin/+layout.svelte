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

	let navOpen = $state(false);
	let lastPath = page.url.pathname;

	$effect(() => {
		const path = page.url.pathname;
		if (path === lastPath) return;
		lastPath = path;
		navOpen = false;
	});

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

<svelte:window
	onkeydown={(event) => {
		if (event.key === 'Escape' && navOpen) navOpen = false;
	}}
/>

<div class="admin" class:nav-open={navOpen}>
	{#if data.editor}
		<header class="admin-topbar">
			<div class="admin-topbar-brand">
				<img src={data.brandLogo || fallbackLogo} alt="" />
				Content manager
			</div>

			<button
				type="button"
				class="admin-menu-btn"
				aria-controls="admin-nav"
				aria-expanded={navOpen}
				aria-label={navOpen ? 'Close menu' : 'Open menu'}
				onclick={() => (navOpen = !navOpen)}
			>
				<svg
					class="admin-menu-icon"
					viewBox="0 0 24 24"
					width="22"
					height="22"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<line class="bar-a" x1="4" y1="7" x2="20" y2="7" />
					<line class="bar-b" x1="4" y1="12" x2="20" y2="12" />
					<line class="bar-c" x1="4" y1="17" x2="20" y2="17" />
				</svg>
			</button>
		</header>

		<button
			type="button"
			class="admin-scrim"
			tabindex={navOpen ? 0 : -1}
			aria-label="Close menu"
			onclick={() => (navOpen = false)}
		></button>

		<div class="admin-shell">
			<aside id="admin-nav" class="admin-side">
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
