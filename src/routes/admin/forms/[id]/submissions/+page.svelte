<script lang="ts">
	import { when } from '$lib/components/admin/fmt';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const display = (value: unknown) => {
		if (value === true) return 'Yes';
		if (value === false) return 'No';
		if (value === null || value === undefined || value === '') return '—';
		return typeof value === 'object' ? JSON.stringify(value) : String(value);
	};
	const entries = (values: Record<string, unknown>) => [
		...data.form.fields.flatMap((field) =>
			Object.hasOwn(values, field.name) ? [{ name: field.name, label: field.label, value: values[field.name] }] : []
		),
		...Object.entries(values)
			.filter(([name]) => !data.form.fields.some((field) => field.name === name))
			.map(([name, value]) => ({ name, label: name, value }))
	];
</script>

<svelte:head><title>{data.form.name} submissions — Content manager</title></svelte:head>

<div class="head">
	<div>
		<h1>{data.form.name} submissions</h1>
		<p class="sub">Stored visitor responses for the {data.form.name} form.</p>
	</div>
	<div class="head-actions">
		<a class="btn" href="/admin/forms/{data.form.id}">Edit form</a>
		<a class="btn" href="/admin/forms">All forms</a>
	</div>
</div>

{#if data.submissions.length === 0}
	<section class="card">
		<div class="empty">
			<h3>No submissions yet</h3>
			<p>Accepted responses will appear here newest first.</p>
		</div>
	</section>
{:else}
	<div class="submission-list">
		{#each data.submissions as submission (submission.id)}
			<section class="card">
				<div class="card-head">
					<h2>{when(submission.created)}</h2>
					<span class="hint">Form: {data.form.name}</span>
				</div>
				<div class="card-body">
					<dl>
						{#each entries(submission.values) as entry (entry.name)}
							<div>
								<dt>{entry.label}</dt>
								<dd>{display(entry.value)}</dd>
							</div>
						{/each}
					</dl>
				</div>
			</section>
		{/each}
	</div>
{/if}

<style>
	.submission-list {
		display: grid;
		gap: 20px;
	}

	dl {
		display: grid;
		gap: 16px;
		margin: 0;
	}

	dl div {
		display: grid;
		grid-template-columns: minmax(140px, 1fr) 3fr;
		gap: 20px;
	}

	dt {
		font-weight: 650;
	}

	dd {
		margin: 0;
		white-space: pre-wrap;
		word-break: break-word;
	}

	@media (max-width: 640px) {
		dl div {
			grid-template-columns: 1fr;
			gap: 4px;
		}
	}
</style>
