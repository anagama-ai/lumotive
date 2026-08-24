<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

</script>

<div class="head">
	<div>
		<h1>Redirects</h1>
		<p class="sub">Send visitors from an old address to its replacement.</p>
	</div>
</div>

	<section class="card create-card">
		<div class="card-head"><h2>New redirect</h2></div>
		<form class="redirect-form card-body" method="POST" action="?/create">
			<label class="field">
				<span>Old path</span>
				<input name="from" placeholder="/old-page" required />
			</label>
			<label class="field">
				<span>Destination</span>
				<input name="to" placeholder="/new-page" required />
			</label>
			<label class="active">
				<input type="checkbox" name="active" checked />
				<span>Active</span>
			</label>
			<button class="primary">Create redirect</button>
		</form>
	</section>

	<section class="card">
		<div class="card-head">
			<h2>Existing redirects</h2>
			<span class="count">{data.redirects.length}</span>
		</div>
		{#if data.redirects.length === 0}
			<div class="empty">
				<h3>No redirects yet</h3>
				<p>Create one when an address changes.</p>
			</div>
		{:else}
			<div class="redirects">
				{#each data.redirects as redirect (redirect.id)}
					<form class="redirect-form redirect-row" method="POST" action="?/save">
						<input type="hidden" name="id" value={redirect.id} />
						<label class="field">
							<span>Old path</span>
							<input name="from" value={redirect.from} required />
						</label>
						<label class="field">
							<span>Destination</span>
							<input name="to" value={redirect.to} required />
						</label>
						<label class="active">
							<input type="checkbox" name="active" checked={redirect.active} />
							<span>Active</span>
						</label>
						<div class="buttons">
							<button>Save</button>
							<button class="danger" formaction="?/delete">Delete</button>
						</div>
					</form>
				{/each}
			</div>
		{/if}
	</section>

<style>
	.create-card {
		margin-bottom: 20px;
	}

	h2 {
		font-size: 16px;
	}

	.redirect-form {
		display: grid;
		grid-template-columns: minmax(180px, 1fr) minmax(220px, 1.5fr) auto auto;
		gap: 16px;
		align-items: end;
	}

	.redirects {
		display: grid;
	}

	.redirect-row {
		padding: 16px 20px;
		border-bottom: 1px solid var(--line);
	}

	.redirect-row:last-child {
		border-bottom: 0;
	}

	.active {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 36px;
		font-size: 14px;
	}

	.active input {
		width: auto;
	}

	.buttons {
		display: flex;
		align-items: center;
		gap: 4px;
		min-height: 36px;
	}

	.count {
		color: var(--muted);
		font-size: 13px;
	}

	@media (max-width: 760px) {
		.redirect-form {
			grid-template-columns: 1fr;
			align-items: stretch;
		}
	}
</style>
