<script lang="ts">
	import { onMount } from 'svelte';
	import { mediaSrc, type MediaRecord } from '$lib/media';
	import { mediaValue, type MediaValue } from '$lib/sections';

	// A bare string is legacy content stored before the media library existed; it is
	// read as a URL, so the picker must accept it, not just the empty string.
	let { value = $bindable() }: { value: MediaValue | string } = $props();

	let items = $state<MediaRecord[]>([]);
	let loaded = $state(false);
	let loading = $state(false);
	let loadError = $state('');
	let chooser: HTMLDialogElement;
	let current = $derived(mediaValue(value));
	let selected = $derived(
		current?.kind === 'media' ? items.find((item) => item.id === current.value) : undefined
	);

	async function loadItems() {
		if (loaded || loading) return;
		loading = true;
		loadError = '';
		try {
			const response = await fetch('/admin/api/media');
			if (!response.ok) throw new Error();
			items = (await response.json()) as MediaRecord[];
			loaded = true;
		} catch {
			loadError = 'Could not load the media library.';
		} finally {
			loading = false;
		}
	}

	async function openChooser() {
		chooser.showModal();
		await loadItems();
	}

	function choose(item: MediaRecord) {
		value = { kind: 'media', value: item.id };
		chooser.close();
	}

	function setUrl(input: string) {
		value = input ? { kind: 'url', value: input } : '';
	}

	onMount(() => {
		if (current?.kind === 'media') void loadItems();
	});
</script>

<div class="picker">
	{#if current?.kind === 'media'}
		<div class="selection">
			{#if selected}
				<img src={mediaSrc(selected, 320)} alt={selected.alt} />
				<div><strong>{selected.file}</strong><span>{selected.alt || 'No alt text'}</span></div>
			{:else if loading}
				<span class="status">Loading selected image…</span>
			{:else if loaded}
				<span class="status unavailable">The selected media item is no longer available.</span>
			{:else}
				<span class="status">Media item {current.value}</span>
			{/if}
		</div>
	{:else if current?.kind === 'url'}
		<div class="selection">
			<img src={current.value} alt="" />
			<div><strong>External image</strong><span>{current.value}</span></div>
		</div>
	{:else}
		<p class="empty">No image selected.</p>
	{/if}

	<div class="actions">
		<button type="button" class="choose" onclick={openChooser}>Choose from library</button>
		{#if current}<button type="button" class="clear" onclick={() => (value = '')}>Clear</button>{/if}
	</div>

	<label class="url-field">
		<span>Or use an image URL</span>
		<input
			type="text"
			inputmode="url"
			value={current?.kind === 'url' ? current.value : ''}
			placeholder="https://example.com/image.jpg"
			oninput={(event) => setUrl(event.currentTarget.value)}
		/>
	</label>
</div>

<dialog bind:this={chooser} aria-label="Choose an image" onclick={(event) => event.target === chooser && chooser.close()}>
	<header>
		<div>
			<h2>Choose an image</h2>
			<p>Select an item from the media library.</p>
		</div>
		<button type="button" class="close" aria-label="Close media chooser" onclick={() => chooser.close()}>×</button>
	</header>

	{#if loading}
		<p class="dialog-status">Loading media…</p>
	{:else if loadError}
		<p class="dialog-status error" role="alert">{loadError}</p>
	{:else if items.length}
		<div class="library">
			{#each items as item (item.id)}
				<button
					type="button"
					class:selected={current?.kind === 'media' && current.value === item.id}
					onclick={() => choose(item)}
				>
					<img src={mediaSrc(item, 320)} alt={item.alt} />
					<strong>{item.file}</strong>
					<span>{item.alt || 'No alt text'}</span>
				</button>
			{/each}
		</div>
	{:else}
		<p class="dialog-status">The media library is empty. Upload an image from the Media page first.</p>
	{/if}
</dialog>

<style>
	.picker { display: grid; gap: .75rem; }
	.selection { display: flex; min-width: 0; gap: .75rem; align-items: center; padding: .65rem; border: 1px solid var(--line); border-radius: var(--r); background: var(--surface); }
	.selection img { width: 88px; height: 66px; flex: none; object-fit: cover; border-radius: 4px; background: var(--paper); }
	.selection div { display: grid; min-width: 0; gap: .15rem; }
	.selection strong, .selection span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.selection span, .status, .empty, .url-field span { color: var(--muted); font-size: .85rem; }
	.status { padding: .75rem; }
	.unavailable { color: var(--danger); }
	.empty { margin: 0; }
	.actions { display: flex; gap: .5rem; }
	.choose, .clear { width: auto; }
	.clear { color: var(--danger); background: transparent; }
	.url-field { display: grid; gap: .35rem; }
	dialog { width: min(820px, calc(100vw - 2rem)); max-height: min(720px, calc(100vh - 2rem)); padding: 0; border: 0; border-radius: var(--r-lg); box-shadow: 0 24px 80px rgb(0 0 0 / .28); color: var(--text); background: var(--surface); }
	dialog::backdrop { background: rgb(10 20 17 / .55); }
	dialog header { display: flex; justify-content: space-between; align-items: start; gap: 1rem; padding: 1.25rem; border-bottom: 1px solid var(--line); }
	dialog h2, dialog p { margin: 0; }
	dialog header p { margin-top: .2rem; color: var(--muted); font-size: .9rem; }
	.close { width: 2.25rem; height: 2.25rem; padding: 0; font-size: 1.5rem; line-height: 1; }
	.library { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: .75rem; padding: 1.25rem; overflow: auto; }
	.library button { display: grid; min-width: 0; gap: .35rem; padding: .5rem; text-align: left; background: var(--paper); border: 2px solid transparent; }
	.library button.selected { border-color: var(--brand); }
	.library img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; border-radius: 4px; background: var(--line); }
	.library strong, .library span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.library span { color: var(--muted); font-size: .8rem; }
	.dialog-status { padding: 2rem; color: var(--muted); }
	.dialog-status.error { color: var(--danger); }
</style>
