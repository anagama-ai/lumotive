<script lang="ts">
	import { enhance } from '$app/forms';
	import { when } from '$lib/components/admin/fmt';
	import { showToast } from '$lib/toast.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	$effect(() => {
		if (!form) return;
		if ('error' in form && form.error) showToast(form.error);
		else if ('deleted' in form) showToast('Form and its submissions deleted.', 'ok');
	});
</script>

<svelte:head><title>Forms — Content manager</title></svelte:head>

<div class="head">
	<div>
		<h1>Forms</h1>
		<p class="sub">Reusable forms and their visitor submissions.</p>
	</div>
</div>


<section class="card">
	<div class="card-head"><h2>Create a form</h2></div>
	<div class="card-body">
		<form method="POST" action="?/create" class="row" style="align-items:end">
			<label class="field">
				<span>Name</span>
				<input name="name" required placeholder="Contact form" />
			</label>
			<div style="flex:0 0 auto"><button class="primary">Create form</button></div>
		</form>
	</div>
</section>

<section class="card" style="margin-top:24px">
	{#if data.forms.length === 0}
		<div class="empty">
			<h3>No forms yet</h3>
			<p>Name a form above to start defining its fields.</p>
		</div>
	{:else}
		<table>
			<thead>
				<tr><th>Name</th><th>Fields</th><th>Last edited</th><th></th></tr>
			</thead>
			<tbody>
				{#each data.forms as item (item.id)}
					<tr>
						<td><a class="title-cell" href="/admin/forms/{item.id}">{item.name}</a></td>
						<td>{item.fieldCount}</td>
						<td class="when">{when(item.updated)}</td>
						<td class="actions">
							<a class="btn tiny" href="/admin/forms/{item.id}">Edit</a>
							<a class="btn tiny" href="/admin/forms/{item.id}/submissions">Submissions</a>
							<form
								method="POST"
								action="?/delete"
								style="display:inline"
								use:enhance={({ cancel }) => {
									if (!confirm(`Delete “${item.name}” and all of its submissions?`)) cancel();
								}}
							>
								<input type="hidden" name="id" value={item.id} />
								<button class="danger">Delete</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>
