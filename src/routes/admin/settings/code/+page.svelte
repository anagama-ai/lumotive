<script lang="ts">
	import { enhance } from '$app/forms';
	import { showToast } from '$lib/toast.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	$effect(() => {
		if (!form) return;
		if ('error' in form && form.error) showToast(form.error);
		else if ('saved' in form) showToast('Saved. Your changes are live.', 'ok');
	});

	let saving = $state(false);
</script>

<svelte:head><title>Custom code — Site settings</title></svelte:head>

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
	<input type="hidden" name="code_injectionId" value={data.code.id} />

	<section class="card">
		<div class="card-head">
			<h2>Custom code</h2>
			<span class="hint" style="font-size:13px">Advanced</span>
		</div>
		<div class="card-body">
			<p class="hint">Paste snippets given to you by a service such as an analytics or chat provider.</p>

			<label class="field">
				<span>In the page head</span>
				<textarea name="codeHead" class="code" rows="6">{data.code.head}</textarea>
			</label>

			<label class="field">
				<span>After the opening body tag</span>
				<textarea name="codeBodyStart" class="code" rows="6">{data.code.bodyStart}</textarea>
			</label>

			<label class="field">
				<span>In the page footer</span>
				<textarea name="codeFooter" class="code" rows="6">{data.code.footer}</textarea>
			</label>

			<label class="field">
				<span>Before the closing body tag</span>
				<textarea name="codeBodyEnd" class="code" rows="6">{data.code.bodyEnd}</textarea>
			</label>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary" disabled={saving}>{saving ? 'Saving…' : 'Save custom code'}</button>
	</div>
</form>
