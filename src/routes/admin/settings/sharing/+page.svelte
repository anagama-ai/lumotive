<script lang="ts">
	import { enhance } from '$app/forms';
	import MediaPicker from '$lib/components/admin/MediaPicker.svelte';
	import type { MediaValue } from '$lib/sections';
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
	let defaultOgImage = $state<MediaValue | string>(data.seo.defaultOgImage);
	let saving = $state(false);
</script>

<svelte:head><title>Search and sharing — Site settings</title></svelte:head>

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
	<input type="hidden" name="seoId" value={data.seo.id} />
	<input type="hidden" name="defaultOgImage" value={JSON.stringify(defaultOgImage)} />

	<section class="card">
		<div class="card-head"><h2>Search and sharing</h2></div>
		<div class="card-body">
			<div class="field">
				<span>Default social sharing image</span>
				<span class="hint">Used when a page or post does not set its own image.</span>
				<MediaPicker bind:value={defaultOgImage} />
			</div>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary" disabled={saving}>
			{saving ? 'Saving…' : 'Save search and sharing'}
		</button>
	</div>
</form>
