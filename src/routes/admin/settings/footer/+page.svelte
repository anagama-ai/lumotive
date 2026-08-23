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
	let footerNav = $state(data.footer.nav.map((row) => ({ ...row })));
	let saving = $state(false);
</script>

<svelte:head><title>Footer — Site settings</title></svelte:head>

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
	<input type="hidden" name="footerId" value={data.footer.id} />
	<input type="hidden" name="footerNav" value={JSON.stringify(footerNav)} />

	<section class="card">
		<div class="card-head"><h2>Footer</h2></div>
		<div class="card-body">
			<label class="field">
				<span>Footer text</span>
				<textarea name="footerText" rows="2" value={data.footer.text}></textarea>
			</label>

			<NavRows
				title="Footer links"
				rows={footerNav}
				empty="No footer links yet."
				sampleLabel="Privacy"
				sampleHref="/privacy"
			/>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary" disabled={saving}>{saving ? 'Saving…' : 'Save footer'}</button>
	</div>
</form>
