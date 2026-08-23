<script lang="ts">
	import { when } from '$lib/components/admin/fmt';
	import { showToast } from '$lib/toast.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	$effect(() => {
		if (!form) return;
		if ('saved' in form) showToast('Review configuration saved.', 'ok');
		else if ('started' in form) {
			showToast(
				`${form.mode === 'full' ? 'Full' : 'Incremental'} import started. Collection will finish it in the background.`,
				'ok'
			);
		} else if ('error' in form) showToast(form.error);
	});

	function configurationIssue() {
		const selected =
			data.config.lookupType === 'place_id'
				? { label: 'Place ID', value: data.config.placeId }
				: data.config.lookupType === 'cid'
					? { label: 'CID', value: data.config.cid }
					: { label: 'Business keyword', value: data.config.keyword };
		if (!selected.value.trim()) return `${selected.label} is missing for the selected lookup type.`;
		if ([data.config.placeId, data.config.cid, data.config.keyword].filter((value) => value.trim()).length !== 1) {
			return 'Exactly one lookup identifier is required.';
		}
		if (!data.config.locationCoordinate.trim()) return 'Location coordinate is missing.';
		return '';
	}

	function importsDisabled() {
		return !data.state.configured || Boolean(data.state.active) || Boolean(configurationIssue());
	}

	function excerpt(value: string) {
		const text = value.replace(/\s+/g, ' ').trim();
		return text.length > 180 ? `${text.slice(0, 177)}…` : text || 'No review text';
	}
</script>

<svelte:head><title>Google reviews — Content manager</title></svelte:head>

<div class="head">
	<div>
		<h1>Google reviews</h1>
		<p class="sub">Configure the source, request imports, and inspect stored reviews.</p>
	</div>
</div>

<form method="POST" action="?/save">
	<section class="card">
		<div class="card-head"><h2>Review source</h2></div>
		<div class="card-body">
			<label class="field">
				<span>Lookup type</span>
				<select name="lookupType">
					<option value="place_id" selected={data.config.lookupType === 'place_id'}>Place ID</option>
					<option value="cid" selected={data.config.lookupType === 'cid'}>CID</option>
					<option value="keyword" selected={data.config.lookupType === 'keyword'}>Business keyword</option>
				</select>
			</label>

			<div class="grid-2">
				<label class="field">
					<span>Place ID</span>
					<input name="placeId" type="text" value={data.config.placeId} autocomplete="off" />
				</label>
				<label class="field">
					<span>CID</span>
					<input name="cid" type="text" value={data.config.cid} inputmode="numeric" autocomplete="off" />
				</label>
				<label class="field">
					<span>Business keyword</span>
					<input name="keyword" type="text" value={data.config.keyword} autocomplete="off" />
				</label>
			</div>
			<p class="notice">
				Enter only the identifier matching the selected lookup type and clear the other two.
			</p>

			<div class="grid-2">
				<label class="field">
					<span>Location coordinate</span>
					<span class="hint" id="coordinate-hint">
						Read this as <strong>latitude,longitude</strong> from Google Maps. No geocoding happens.
					</span>
					<input
						name="locationCoordinate"
						type="text"
						value={data.config.locationCoordinate}
						placeholder="-33.8688,151.2093"
						aria-describedby="coordinate-hint"
						required
					/>
				</label>
				<label class="field">
					<span>Automatic import frequency</span>
					<select name="frequency">
						<option value="manual" selected={data.config.frequency === 'manual'}>Manual only</option>
						<option value="7d" selected={data.config.frequency === '7d'}>Every 7 days</option>
						<option value="14d" selected={data.config.frequency === '14d'}>Every 14 days</option>
						<option value="30d" selected={data.config.frequency === '30d'}>Every 30 days</option>
					</select>
				</label>
			</div>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary">Save review configuration</button>
	</div>
</form>

<section class="card">
	<div class="card-head"><h2>Import reviews</h2></div>
	<div class="card-body">
		{#if !data.state.configured}
			<p class="notice bad" role="status">
				<strong>Importing is inactive.</strong> Provider credentials are not configured. Both import controls remain disabled until the credentials are configured on the server.
			</p>
		{:else if data.state.active}
			<p class="notice ok" role="status">
				An {data.state.active.mode} import is already under way. It started
				<time datetime={data.state.active.startedAt}>{when(data.state.active.startedAt)}</time>.
			</p>
		{:else if configurationIssue()}
			<p class="notice bad" role="alert">
				<strong>Import unavailable:</strong> {configurationIssue()} Save a complete configuration first.
			</p>
		{/if}

		<div class="import-actions">
			<form method="POST" action="?/start">
				<input type="hidden" name="mode" value="incremental" />
				<button class="primary" disabled={importsDisabled()}>Start incremental import</button>
			</form>
			<p>Default and lower cost: stops after reaching reviews already stored here.</p>
		</div>

		<div class="notice bad full-import">
			<p>
				<strong>Full import — materially higher cost.</strong> This requests every available review and can cost materially more than an incremental run. Use it only when a complete refresh is intentional.
			</p>
			<form method="POST" action="?/start">
				<input type="hidden" name="mode" value="full" />
				<button class="danger" disabled={importsDisabled()}>Run full import — higher cost</button>
			</form>
		</div>
	</div>
</section>

<section class="card">
	<div class="card-head"><h2>Import state</h2></div>
	<div class="card-body">
		{#if data.state.active}
			<p class="notice ok" role="status">
				<strong>Import under way.</strong> The {data.state.active.mode} import started
				<time datetime={data.state.active.startedAt}>{when(data.state.active.startedAt)}</time> and is waiting for collection.
			</p>
		{/if}

		{#if data.state.last}
			<p
				class="notice"
				class:ok={data.state.last.state === 'succeeded'}
				class:bad={data.state.last.state === 'failed'}
				role={data.state.last.state === 'failed' ? 'alert' : 'status'}
			>
				<strong>Last import {data.state.last.state}.</strong>
				Finished <time datetime={data.state.last.finishedAt}>{when(data.state.last.finishedAt)}</time>.
				{#if data.state.last.state === 'succeeded'}
					Created {data.state.last.created} and updated {data.state.last.updated} reviews.
				{:else}
					Reason: {data.state.last.reason || 'No reason was recorded.'}
				{/if}
			</p>
		{:else if data.state.active}
			<p>No import has completed yet.</p>
		{:else}
			<p class="notice"><strong>Never run.</strong> No import has ever been requested.</p>
		{/if}
	</div>
</section>

<section class="card">
	<div class="card-head">
		<h2>Imported reviews</h2>
		<span>{data.pagination.totalItems} total</span>
	</div>
	<div class="card-body">
		{#if data.reviews.length}
			<div class="review-table">
				<table>
					<thead>
						<tr>
							<th>Reviewer</th>
							<th>Rating</th>
							<th>Published</th>
							<th>Review</th>
						</tr>
					</thead>
					<tbody>
						{#each data.reviews as review (review.id)}
							<tr>
								<td><strong>{review.reviewerName || 'Anonymous reviewer'}</strong></td>
								<td>{review.rating === null ? '—' : `${review.rating}/5`}</td>
								<td class="when">{when(review.publishedAt)}</td>
								<td class="review-text">{excerpt(review.reviewText)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<div class="empty">
				<h3>No reviews on this page</h3>
				<p>Imported reviews will appear here after a collection succeeds.</p>
			</div>
		{/if}

		{#if data.pagination.totalPages > 1}
			<nav class="pagination" aria-label="Review pages">
				<span>Page {data.pagination.page} of {data.pagination.totalPages}</span>
				<div>
					{#if data.pagination.page > 1}
						<a class="btn tiny" href="/admin/reviews?page={data.pagination.page - 1}">Previous</a>
					{/if}
					{#if data.pagination.page < data.pagination.totalPages}
						<a class="btn tiny" href="/admin/reviews?page={data.pagination.page + 1}">Next</a>
					{/if}
				</div>
			</nav>
		{/if}
	</div>
</section>

<style>
	.import-actions,
	.pagination,
	.pagination > div {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.import-actions p,
	.full-import p {
		margin: 0;
	}
	.full-import form {
		margin-top: 12px;
	}
	.review-table {
		overflow-x: auto;
	}
	.review-text {
		min-width: 18rem;
		max-width: 34rem;
	}
	.pagination {
		justify-content: space-between;
	}
</style>
