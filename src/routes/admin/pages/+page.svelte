<script lang="ts">
	import { enhance } from '$app/forms';
	import { pageHref, when } from '$lib/components/admin/fmt';
	import type { ActionData, PageData } from './$types';

	type SortField = 'title' | 'status' | 'updated';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let selected = $state<string[]>([]);
	let allSelected = $derived(
		data.pages.length > 0 && data.pages.every((record) => selected.includes(record.id))
	);

	function toggleAll(event: Event) {
		selected = (event.currentTarget as HTMLInputElement).checked
			? data.pages.map((record) => record.id)
			: [];
	}

	function nextSort(field: SortField) {
		return data.sort === field ? `-${field}` : field;
	}

	function sortMark(field: SortField) {
		return data.sort === field ? '↑' : data.sort === `-${field}` ? '↓' : '';
	}

	function ariaSort(field: SortField) {
		return data.sort === field ? 'ascending' : data.sort === `-${field}` ? 'descending' : 'none';
	}

	function sortHref(field: SortField) {
		return `?sort=${encodeURIComponent(nextSort(field))}`;
	}

	function actionHref(action: string) {
		return `?/${action}&sort=${encodeURIComponent(data.sort)}`;
	}
</script>

<div class="head">
	<div>
		<h1>Pages</h1>
		<p class="sub">The main screens of your website. Drafts are only visible to you.</p>
	</div>
	<div class="head-actions">
		<form method="POST" action="?/create">
			<button class="primary">New page</button>
		</form>
	</div>
</div>

{#if form && 'bulk' in form && 'results' in form && form.results?.some((result) => !result.ok)}
	<ul class="bulk-results" aria-label="Bulk action results">
		{#each form.results as result (result.id)}
			<li class:failed={!result.ok}><code>{result.id}</code> — {result.message}</li>
		{/each}
	</ul>
{/if}

<section class="card">
	{#if data.pages.length === 0}
		<div class="empty">
			<h3>No pages yet</h3>
			<p>
				Create your first page, then build it up section by section.
			</p>
			<form method="POST" action="?/create">
				<button class="primary">Create a page</button>
			</form>
		</div>
	{:else}
		<div class="bulk-bar">
			<form id="bulk-pages" class="bulk-form" method="POST" action={actionHref('bulk')}>
				<strong>{selected.length} selected</strong>
				<button type="button" class="tiny" disabled={selected.length === 0} onclick={() => (selected = [])}>
					Clear selection
				</button>
				{#if data.editor?.role === 'admin'}
					<button class="tiny" name="status" value="published">Publish</button>
					<button class="tiny" name="status" value="draft">Unpublish</button>
				{:else}
					<span class="permission-note">Only admins can change status in bulk.</span>
				{/if}
			</form>
		</div>
		<table>
			<thead>
				<tr>
					<th class="select-cell">
						<input
							type="checkbox"
							checked={allSelected}
							onchange={toggleAll}
							aria-label="Select all pages shown"
						/>
					</th>
					<th aria-sort={ariaSort('title')}>
						<a class="sort-link" href={sortHref('title')}>
							Title <span class="sort-mark">{sortMark('title')}</span>
						</a>
					</th>
					<th>Address</th>
					<th>Sections</th>
					<th aria-sort={ariaSort('status')}>
						<a class="sort-link" href={sortHref('status')}>
							Status <span class="sort-mark">{sortMark('status')}</span>
						</a>
					</th>
					<th aria-sort={ariaSort('updated')}>
						<a class="sort-link" href={sortHref('updated')}>
							Last edited <span class="sort-mark">{sortMark('updated')}</span>
						</a>
					</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.pages as p (p.id)}
					<tr>
						<td class="select-cell" data-label="">
							<input
								type="checkbox"
								name="id"
								value={p.id}
								form="bulk-pages"
								bind:group={selected}
								aria-label={`Select ${p.title || 'Untitled'}`}
							/>
						</td>
						<td data-label="Title"><a class="title-cell" href="/admin/pages/{p.id}">{p.title || 'Untitled'}</a></td>
						<td class="slug" data-label="Address"><code>{pageHref(p.path)}</code></td>
						<td class="when" data-label="Sections">{p.sectionCount}</td>
						<td data-label="Status"><span class="badge {p.status}">{p.status}</span></td>
						<td class="when" data-label="Last edited">{when(p.updated)}</td>
						<td class="actions" data-label="">
							<a class="btn tiny" href="/admin/pages/{p.id}">Edit</a>
							<form
								method="POST"
								action={actionHref('delete')}
								style="display:inline"
								use:enhance={({ cancel }) => {
									if (!confirm(`Delete “${p.title || 'Untitled'}”? This cannot be undone.`))
										cancel();
								}}
							>
								<input type="hidden" name="id" value={p.id} />
								<button class="danger">Delete</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>

<style>
	.bulk-bar {
		padding: 10px 20px;
		border-bottom: 1px solid var(--line);
	}

	.bulk-form {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.bulk-form strong,
	.permission-note {
		font-size: 13px;
	}

	.permission-note {
		color: var(--muted);
	}

	.select-cell {
		width: 1%;
		text-align: center;
	}

	.select-cell input {
		width: auto;
		padding: 0;
	}

	.sort-link {
		color: inherit;
		text-decoration: none;
		white-space: nowrap;
	}

	.sort-link:hover {
		color: var(--brand);
	}

	.sort-mark {
		display: inline-block;
		width: 1em;
	}

	.bulk-results {
		margin: -14px 0 0;
		padding: 12px 16px 12px 36px;
		border: 1px solid var(--line);
		border-radius: var(--r);
		font-size: 13px;
	}

	.bulk-results .failed {
		color: var(--danger);
	}
</style>
