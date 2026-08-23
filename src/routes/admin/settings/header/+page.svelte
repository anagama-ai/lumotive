<script lang="ts">
	import { enhance } from '$app/forms';
	import NavRows from '$lib/components/admin/NavRows.svelte';
	import { showToast } from '$lib/toast.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	$effect(() => {
		if (!form) return;
		if ('error' in form && form.error) showToast(form.error);
		else if ('saved' in form) showToast('Saved. Your changes are live.', 'ok');
	});

	// Editable copy; the hidden input below carries it back on submit.
	// svelte-ignore state_referenced_locally
	let headerNav = $state(data.header.nav.map((row) => ({ ...row })));
	let saving = $state(false);
</script>

<svelte:head><title>Header — Site settings</title></svelte:head>

<form
	method="POST"
	action="?/save"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			await update({ reset: false });
			saving = false;
		};
	}}
>
	<input type="hidden" name="headerId" value={data.header.id} />
	<input type="hidden" name="headerNav" value={JSON.stringify(headerNav)} />

	<section class="card">
		<div class="card-head"><h2>Header</h2></div>
		<div class="card-body">
			<label class="field" style="max-width:340px">
				<span>Site name</span>
				<input name="siteName" type="text" value={data.header.siteName} />
			</label>

			<NavRows
				title="Menu links"
				rows={headerNav}
				empty="No menu links yet — use “Add link”. Addresses look like /about."
				sampleLabel="About"
				sampleHref="/about"
			/>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary" disabled={saving}>{saving ? 'Saving…' : 'Save header'}</button>
	</div>
</form>
