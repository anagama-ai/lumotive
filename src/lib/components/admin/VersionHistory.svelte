<script lang="ts">
	type Version = {
		id: string;
		created: string;
		editor: string;
		canRestore: boolean;
	};

	let { versions }: { versions: Version[] } = $props();

	const when = (value: string) => new Date(value).toLocaleString();
</script>

<section class="card history">
	<div class="card-head">
		<h2>Version history</h2>
		<span class="hint">{versions.length} saved version{versions.length === 1 ? '' : 's'}</span>
	</div>
	<div class="card-body">
		{#if versions.length === 0}
			<p class="empty-history">Previous versions appear here after this content is saved.</p>
		{:else}
			<ul>
				{#each versions as version (version.id)}
					<li>
						<div>
							<time datetime={version.created}>{when(version.created)}</time>
							<span>by {version.editor}</span>
						</div>
						<form method="POST" action="?/restore">
							<input type="hidden" name="version" value={version.id} />
							<button
								type="submit"
								class="btn tiny"
								disabled={!version.canRestore}
								title={version.canRestore
									? `Restore the version from ${when(version.created)}`
									: 'Your role cannot restore this version'}
							>
								Restore
							</button>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

<style>
	.history {
		margin-top: 24px;
	}

	.history .card-head .hint {
		font-size: 13px;
	}

	.empty-history {
		margin: 0;
		color: var(--muted);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 12px 0;
		border-bottom: 1px solid var(--line);
	}

	li:first-child {
		padding-top: 0;
	}

	li:last-child {
		padding-bottom: 0;
		border-bottom: 0;
	}

	time,
	li span {
		display: block;
	}

	time {
		font-weight: 600;
	}

	li span {
		margin-top: 2px;
		font-size: 13px;
		color: var(--muted);
	}
</style>
