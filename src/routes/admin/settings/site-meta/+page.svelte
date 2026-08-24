<script lang="ts">
	import { enhance } from '$app/forms';
	import MediaPicker from '$lib/components/admin/MediaPicker.svelte';
	import NavRows from '$lib/components/admin/NavRows.svelte';
	import type { MediaValue } from '$lib/sections';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();


	// Editable copies; the hidden inputs below carry them back on submit.
	// svelte-ignore state_referenced_locally
	let social = $state(data.siteMeta.social.map((row) => ({ ...row })));
	// svelte-ignore state_referenced_locally
	let logoLight = $state<MediaValue | string>(data.siteMeta.logoLight);
	// svelte-ignore state_referenced_locally
	let logoDark = $state<MediaValue | string>(data.siteMeta.logoDark);
	let saving = $state(false);
</script>

<svelte:head><title>Site meta — Site settings</title></svelte:head>

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
	<input type="hidden" name="siteMetaId" value={data.siteMeta.id} />
	<input type="hidden" name="social" value={JSON.stringify(social)} />
	<input type="hidden" name="logoLight" value={JSON.stringify(logoLight)} />
	<input type="hidden" name="logoDark" value={JSON.stringify(logoDark)} />

	<section class="card">
		<div class="card-head"><h2>Business details</h2></div>
		<div class="card-body">
			<label class="field">
				<span>Business address</span>
				<span class="hint">Line breaks are kept.</span>
				<textarea name="address" rows="4">{data.siteMeta.address}</textarea>
			</label>
			<label class="field" style="max-width:340px">
				<span>Phone</span>
				<input name="phone" type="tel" value={data.siteMeta.phone} />
			</label>
		</div>
	</section>

	<section class="card">
		<div class="card-body">
			<NavRows
				title="Social accounts"
				rows={social}
				empty="No social accounts yet — each row is a platform name plus the profile address."
				sampleLabel="Instagram"
				sampleHref="https://instagram.com/yourbrand"
			/>
		</div>
	</section>

	<section class="card">
		<div class="card-head"><h2>Logos</h2></div>
		<div class="card-body">
			<div class="field">
				<span>Logo for light backgrounds</span>
				<span class="hint">Used on the public site.</span>
				<MediaPicker bind:value={logoLight} />
			</div>
			<div class="field">
				<span>Logo for dark backgrounds</span>
				<span class="hint">Used in this content manager's sidebar.</span>
				<MediaPicker bind:value={logoDark} />
			</div>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary" disabled={saving}>{saving ? 'Saving…' : 'Save site meta'}</button>
	</div>
</form>
