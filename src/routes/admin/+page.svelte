<script lang="ts">
	import { when } from '$lib/components/admin/fmt';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="head">
	<div>
		<h1>Your website</h1>
		<p class="sub">Edit pages, publish posts and update site-wide settings.</p>
	</div>
	<div class="head-actions">
		<a class="btn" href="/" target="_blank" rel="noreferrer">View site</a>
		<form method="POST" action="/admin/pages?/create">
			<button class="primary">New page</button>
		</form>
	</div>
</div>

<dl class="stats">
	<div class="stat">
		<dt>Pages</dt>
		<dd>{data.counts.pages}</dd>
	</div>
	<div class="stat">
		<dt>Posts</dt>
		<dd>{data.counts.posts}</dd>
	</div>
</dl>

<section class="card">
	<div class="card-head">
		<h2>Recently edited pages</h2>
		<a class="btn tiny" href="/admin/pages">All pages</a>
	</div>

	{#if data.recentPages.length === 0}
		<div class="empty">
			<h3>No pages yet</h3>
			<p>Pages are the main screens of your website — a homepage, an about page, and so on.</p>
			<form method="POST" action="/admin/pages?/create">
				<button class="primary">Create your first page</button>
			</form>
		</div>
	{:else}
		<table>
			<thead>
				<tr><th>Title</th><th>Status</th><th>Last edited</th></tr>
			</thead>
			<tbody>
				{#each data.recentPages as p (p.id)}
					<tr>
						<td><a class="title-cell" href="/admin/pages/{p.id}">{p.title || 'Untitled'}</a></td>
						<td><span class="badge {p.status}">{p.status}</span></td>
						<td class="when">{when(p.updated)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>

<section class="card">
	<div class="card-head">
		<h2>Recent posts</h2>
		<a class="btn tiny" href="/admin/posts">All posts</a>
	</div>

	{#if data.recentPosts.length === 0}
		<div class="empty">
			<h3>No posts yet</h3>
			<p>Posts are dated articles — news, updates or a blog.</p>
			<form method="POST" action="/admin/posts?/create">
				<button class="primary">Write your first post</button>
			</form>
		</div>
	{:else}
		<table>
			<thead>
				<tr><th>Title</th><th>Status</th><th>Last edited</th></tr>
			</thead>
			<tbody>
				{#each data.recentPosts as p (p.id)}
					<tr>
						<td><a class="title-cell" href="/admin/posts/{p.id}">{p.title || 'Untitled'}</a></td>
						<td><span class="badge {p.status}">{p.status}</span></td>
						<td class="when">{when(p.updated)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>
