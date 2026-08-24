<script lang="ts">
	import { enhance } from '$app/forms';
	import { showToast } from '$lib/toast.svelte';
	import { MAX_BATCH_SIZE, MAX_FILE_SIZE } from '$lib/uploads';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let uploadForm: HTMLFormElement;
	let fileInput: HTMLInputElement;
	let dragging = $state(false);
	let uploading = $state(false);
	let selected = $state<string[]>([]);
	let allSelected = $derived(
		data.items.length > 0 && data.items.every((record) => selected.includes(record.id))
	);

	function uploadSizeError(input: HTMLInputElement) {
		const files = Array.from(input.files ?? []);
		const oversized = files.find((file) => file.size > MAX_FILE_SIZE);
		if (oversized) {
			return `${oversized.name} is ${(oversized.size / 1024 / 1024).toFixed(1)} MiB. The maximum is ${MAX_FILE_SIZE / 1024 / 1024} MiB per file.`;
		}
		const total = files.reduce((size, file) => size + file.size, 0);
		return total > MAX_BATCH_SIZE
			? `This ${(total / 1024 / 1024).toFixed(1)} MiB batch is too large. Upload fewer images at a time (${MAX_BATCH_SIZE / 1024 / 1024} MiB maximum).`
			: '';
	}

	function toggleAll(event: Event) {
		selected = (event.currentTarget as HTMLInputElement).checked
			? data.items.map((record) => record.id)
			: [];
	}
</script>

<svelte:head><title>Media — Content manager</title></svelte:head>

<div class="head">
	<div>
		<h1>Media</h1>
		<p class="sub">Upload images once, then reuse them across your content.</p>
	</div>
</div>

{#if form && 'bulk' in form && 'results' in form && form.results?.some((result) => !result.ok)}
	<ul class="bulk-results" aria-label="Bulk action results">
		{#each form.results as result (result.id)}
			<li class:failed={!result.ok}><code>{result.id}</code> — {result.message}</li>
		{/each}
	</ul>
{/if}
{#if form && 'outcomes' in form && form.outcomes}
	<div class="upload-outcomes" aria-label="Upload results">
		{#each form.outcomes as outcome}
			<p
				class="notice"
				class:ok={outcome.stored}
				class:bad={!outcome.stored}
				role={outcome.stored ? 'status' : 'alert'}
			>
				<strong>{outcome.filename}:</strong>
				{outcome.stored ? 'Stored.' : outcome.error}
			</p>
		{/each}
	</div>
{/if}

<section
	class="card upload-card"
	class:drop-hover={dragging}
	aria-label="Upload images by dropping files here or choosing them"
	ondragenter={(event) => {
		event.preventDefault();
		dragging = true;
	}}
	ondragover={(event) => {
		event.preventDefault();
		dragging = true;
	}}
	ondragleave={() => (dragging = false)}
	ondrop={(event) => {
		event.preventDefault();
		dragging = false;
		if (!event.dataTransfer?.files.length) return;
		const transfer = new DataTransfer();
		for (const file of event.dataTransfer.files) transfer.items.add(file);
		fileInput.files = transfer.files;
		const error = uploadSizeError(fileInput);
		if (error) {
			showToast(error);
			fileInput.value = '';
			return;
		}
		uploadForm.requestSubmit();
	}}
>
	<div class="card-head">
		<h2>Upload images</h2>
		<p class="drop-hint">
			{dragging ? 'Drop to upload' : 'Drop images anywhere on this card, or choose files below.'}
		</p>
	</div>
	<form
		bind:this={uploadForm}
		class="card-body upload"
		method="POST"
		action="?/upload"
		enctype="multipart/form-data"
		aria-busy={uploading}
		use:enhance={({ cancel }) => {
			const error = uploadSizeError(fileInput);
			if (error) {
				showToast(error);
				cancel();
				fileInput.value = '';
				return;
			}
			uploading = true;
			return async ({ update }) => {
				try {
					await update();
				} finally {
					uploading = false;
				}
			};
		}}
	>
		<label class="field">
			<span>Images <span class="hint">— JPEG, PNG, WebP or GIF; 10 MiB maximum each</span></span>
			<input
				bind:this={fileInput}
				name="file"
				type="file"
				accept="image/jpeg,image/png,image/webp,image/gif"
				multiple
				required
				onchange={(event) => {
					const error = uploadSizeError(event.currentTarget);
					if (error) {
						showToast(error);
						event.currentTarget.value = '';
					}
				}}
			/>
		</label>
		<button class="primary" disabled={uploading}>
			{uploading ? 'Uploading…' : 'Upload images'}
		</button>
		{#if uploading}
			<p class="notice" role="status">Uploading images…</p>
		{/if}
	</form>
</section>

<section class="library-section">
	<div class="library-head">
		<h2>Library</h2>
		<span class="hint">{data.items.length} {data.items.length === 1 ? 'image' : 'images'}</span>
	</div>

	{#if data.missingAlt > 0}
		<p class="notice" role="status">
			{data.missingAlt} {data.missingAlt === 1 ? 'image has' : 'images have'} no alt text
		</p>
	{/if}

	{#if data.items.length}
		<div class="bulk-bar">
			<form
				id="bulk-media"
				class="bulk-form"
				method="POST"
				action="?/bulk"
				onsubmit={(event) =>
					!confirm(
						`Delete ${selected.length} selected ${selected.length === 1 ? 'image' : 'images'}? Pages using them will stop showing the ${selected.length === 1 ? 'image' : 'images'}.`
					) && event.preventDefault()}
			>
				<label class="select-all">
					<input
						type="checkbox"
						checked={allSelected}
						onchange={toggleAll}
						aria-label="Select all images shown"
					/>
					Select all
				</label>
				<strong>{selected.length} selected</strong>
				<button type="button" class="tiny" disabled={selected.length === 0} onclick={() => (selected = [])}>
					Clear selection
				</button>
				<button class="danger">Delete selected</button>
			</form>
		</div>
		<div class="library" id="library">
			{#each data.items as item (item.id)}
				<article class="media-card">
					<a class="media-open" href="#m-{item.id}" aria-label={`Settings for ${item.file}`}>
						<img
							src={item.src}
							srcset={item.srcset}
							sizes="(max-width: 700px) 50vw, 240px"
							alt={item.alt}
							width={item.width ?? 400}
							height={item.height ?? 300}
							class:needs-alt={!item.alt.trim()}
						/>
					</a>
					<label class="media-select">
						<input
							type="checkbox"
							name="id"
							value={item.id}
							form="bulk-media"
							bind:group={selected}
							aria-label={`Select ${item.file}`}
						/>
						Select
					</label>
					<a class="media-name" href="#m-{item.id}" title={item.file}>
						<strong>{item.file}</strong>
						{#if item.alt.trim()}
							<span class="alt-text">{item.alt}</span>
						{:else}
							<span class="alt-flag">Needs alt text</span>
						{/if}
					</a>
				</article>
				<div class="sheet" id="m-{item.id}">
					<a class="sheet-back" href="#library" aria-label="Close image settings"></a>
					<div class="sheet-panel">
						<div class="sheet-head">
							<h2>Image settings</h2>
							<a class="sheet-close" href="#library">Close</a>
						</div>
						<div class="sheet-body">
							<img
								class="sheet-preview"
								src={item.src}
								srcset={item.srcset}
								sizes="320px"
								alt={item.alt}
							/>
							<form method="POST" action="?/rename">
								<input type="hidden" name="id" value={item.id} />
								<label class="field">
									<span>Filename</span>
									<input name="name" type="text" value={item.file.replace(/\.[^.]+$/, '')} />
								</label>
								<span class="hint">
									Renaming changes this image's public address. Previously shared links to this
									image will stop working.
								</span>
								<button>Rename</button>
							</form>
							<form method="POST" action="?/alt">
								<input type="hidden" name="id" value={item.id} />
								<label class="field">
									<span>Alt text</span>
									<input
										name="alt"
										type="text"
										value={item.alt}
										aria-label={`Alt text for ${item.file}`}
									/>
								</label>
								<button>Save alt text</button>
							</form>
							<form
								method="POST"
								action="?/remove"
								onsubmit={(event) =>
									!confirm(
										`Delete ${item.file}? Pages using it will stop showing the image.`
									) && event.preventDefault()}
							>
								<input type="hidden" name="id" value={item.id} />
								<button class="danger">Delete</button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="card empty">
			<h3>No images yet</h3>
			<p>Upload your first image above.</p>
		</div>
	{/if}
</section>

<style>
	.upload-card { border: 1px dashed var(--line-strong); transition: border-color .12s; }
	.upload { align-items: start; }
	.upload .primary { width: auto; }
	.drop-hint { margin: .3rem 0 0; font-size: .85rem; color: var(--muted); }
	.upload-card.drop-hover { border-color: var(--brand); }
	.upload-card.drop-hover .drop-hint { color: var(--brand-ink); font-weight: 600; }
	.upload-outcomes { margin-top: 1rem; }
	.bulk-bar { margin-bottom: 1rem; padding: 10px 20px; border: 1px solid var(--line); border-radius: var(--r); }
	.bulk-form { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
	.bulk-form strong, .select-all { font-size: 13px; }
	.select-all { display: flex; align-items: center; gap: 6px; }
	.select-all input, .media-select input { width: auto; padding: 0; }
	.bulk-results { margin: -14px 0 0; padding: 12px 16px 12px 36px; border: 1px solid var(--line); border-radius: var(--r); font-size: 13px; }
	.bulk-results .failed { color: var(--danger); }
	.library-section { margin-top: 2rem; }
	.library-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: .8rem; }
	.library-head h2 { margin: 0; }
	.library { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
	.media-card { position: relative; overflow: hidden; border: 1px solid var(--line); border-radius: var(--r-lg); background: var(--surface); box-shadow: var(--shadow); }
	.media-open { display: block; }
	.media-open img { display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; background: var(--line); }
	.media-open img.needs-alt { outline: 3px solid var(--danger); outline-offset: -3px; }
	.media-select { position: absolute; top: .5rem; left: .5rem; display: flex; align-items: center; gap: 6px; padding: 2px 8px 2px 6px; border-radius: 999px; background: var(--surface); box-shadow: var(--shadow); font-size: 12px; }
	.media-name { display: grid; gap: .3rem; padding: .7rem .85rem; color: inherit; text-decoration: none; }
	.media-name strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.alt-flag { justify-self: start; padding: 1px 7px; border-radius: 999px; background: var(--warn-wash); color: var(--warn); font-size: 12px; font-weight: 600; }
	.alt-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--muted); font-size: 12px; }
	.sheet { display: none; }
	.sheet:target { position: fixed; inset: 0; z-index: 40; display: grid; place-items: center; padding: 1rem; }
	.sheet-back { position: absolute; inset: 0; background: rgba(12, 22, 32, .55); }
	.sheet-panel { position: relative; width: min(420px, 100%); max-height: 90vh; overflow-y: auto; border-radius: var(--r-lg); background: var(--surface); box-shadow: 0 18px 50px rgba(12, 22, 32, .3); }
	.sheet-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; padding: 1rem 1.1rem; border-bottom: 1px solid var(--line); }
	.sheet-head h2 { margin: 0; font-size: 16px; }
	.sheet-close { font-size: 13px; }
	.sheet-body { display: grid; gap: 1rem; padding: 1.1rem; }
	.sheet-preview { display: block; width: 100%; height: auto; max-height: 180px; object-fit: contain; border-radius: var(--r-lg); background: var(--line); }
	.sheet-body form { display: grid; gap: .55rem; }
	.sheet-body button { width: 100%; }
	.empty { padding: 2rem; text-align: center; color: var(--muted); }
	.empty h3 { margin: 0; color: var(--text); }
	.empty p { margin: .35rem 0 0; }
</style>
