<script lang="ts">
	import { enhance } from '$app/forms';
	import SectionField from '$lib/components/admin/SectionField.svelte';
	import MediaPicker from '$lib/components/admin/MediaPicker.svelte';
	import VersionHistory from '$lib/components/admin/VersionHistory.svelte';
	import { fill, move } from '$lib/components/admin/fields';
	import { pageHref } from '$lib/components/admin/fmt';
	import { blankSection, sectionSpecs, type MediaValue, type Section } from '$lib/sections';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const types = Object.keys(sectionSpecs);

	/** Reshape stored sections to the current specs so new spec fields show up. */
	const normalise = (raw: unknown[]): Section[] =>
		raw.map((s) => {
			const sec = (s ?? {}) as Section;
			const spec = sectionSpecs[sec.type];
			if (!spec) return sec;
			return {
				id: sec.id || crypto.randomUUID().slice(0, 8),
				type: sec.type,
				...fill(spec.fields, sec as Record<string, unknown>)
			};
		});

	// Seeded once, then resynced by the effect below when the route param changes.
	// svelte-ignore state_referenced_locally
	let sections = $state<Section[]>(normalise(data.page.sections));
	let sectionsInput: HTMLInputElement;
	const setSection = (i: number, section: Record<string, any>) => {
		const next = [...sections];
		next[i] = section as Section;
		sections = next;
		const nextPayload = JSON.stringify(next);
		sectionsInput.value = nextPayload;
		sectionsInput.setAttribute('value', nextPayload);
		postPreview(next);
	};
	// svelte-ignore state_referenced_locally
	let loadedId = $state(data.page.id);
	// svelte-ignore state_referenced_locally
	let title = $state(data.page.title);
	// svelte-ignore state_referenced_locally
	let slug = $state(data.page.slug);
	// svelte-ignore state_referenced_locally
	let parent = $state(data.page.parent);
	// svelte-ignore state_referenced_locally
	let status = $state(data.page.status);
	// svelte-ignore state_referenced_locally
	let seoTitle = $state(data.page.seoTitle);
	// svelte-ignore state_referenced_locally
	let seoDescription = $state(data.page.seoDescription);
	// svelte-ignore state_referenced_locally
	let ogImage = $state<MediaValue | string>(data.page.ogImage);
	// svelte-ignore state_referenced_locally
	let canonical = $state(data.page.canonical);
	// svelte-ignore state_referenced_locally
	let noindex = $state(data.page.noindex);
	let newType = $state(types[0]);

	// Editing a different page reuses this component — resync when the id changes.
	$effect(() => {
		if (data.page.id !== loadedId) {
			loadedId = data.page.id;
			sections = normalise(data.page.sections);
			title = data.page.title;
			slug = data.page.slug;
			parent = data.page.parent;
			status = data.page.status;
			seoTitle = data.page.seoTitle;
			seoDescription = data.page.seoDescription;
			ogImage = data.page.ogImage;
			canonical = data.page.canonical;
			noindex = data.page.noindex;
		}
	});

	let payload = $derived(JSON.stringify(sections));
	let saving = $state(false);
	let isAdmin = $derived(data.editor?.role === 'admin');
	let canEdit = $derived(isAdmin || data.page.status !== 'published');
	const previewSizes = {
		mobile: { label: 'Mobile', width: 375, height: 667 },
		tablet: { label: 'Tablet', width: 768, height: 1024 },
		desktop: { label: 'Desktop', width: 1440, height: 900 }
	} as const;
	let previewWidth = $state<keyof typeof previewSizes>('desktop');
	let previewFrame = $state<HTMLIFrameElement>();
	let previewPath = $derived(
		pageHref((data.page as typeof data.page & { path?: string }).path || data.page.slug)
	);

	const postPreview = (previewSections?: Section[]) => {
		if (!previewFrame?.contentWindow) return;
		try {
			const message = JSON.parse(
				JSON.stringify({
					type: 'page-preview',
					path: previewPath,
					page: {
						title,
						seoTitle,
						seoDescription,
						ogImage,
						canonical,
						noindex,
						sections: previewSections ?? JSON.parse(payload)
					}
				})
			);
			previewFrame.contentWindow.postMessage(message, window.location.origin);
		} catch (error) {
			console.warn('Could not update live preview.', error);
		}
	};
	$effect(() => postPreview());

</script>


<svelte:head><title>{title || 'Untitled page'} — Content manager</title></svelte:head>

<div class="head">
	<div>
		<h1>{title || 'Untitled page'}</h1>
		<p class="sub">
			Live at <code>{previewPath}</code>
			· {status === 'published' ? 'visible to everyone' : 'only visible to you'}
		</p>
	</div>
	<div class="head-actions">
		<a class="btn" href="/admin/pages">All pages</a>
		<a class="btn" href={previewPath} target="_blank" rel="noreferrer">View page</a>
	</div>
</div>
{#if !canEdit}
	<p class="notice" role="status">Published pages are read-only for the editor role.</p>
{/if}

<div class="editor-layout">
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
	<fieldset class="editor-fields" disabled={!canEdit} inert={!canEdit}>
		<input bind:this={sectionsInput} type="hidden" name="sections" value={payload} />
		<input type="hidden" name="ogImage" value={JSON.stringify(ogImage)} />

	<section class="card">
		<div class="card-head"><h2>Page details</h2></div>
		<div class="card-body">
			<div class="row">
				<label class="field">
					<span>Title</span>
					<input name="title" type="text" bind:value={title} required />
				</label>
				<label class="field">
					<span>Web address <span class="hint">— lowercase, hyphens</span></span>
					<input name="slug" type="text" bind:value={slug} required />
				</label>
				<label class="field">
					<span>Parent page</span>
					<select name="parent" bind:value={parent}>
						<option value="">No parent (root page)</option>
						{#each data.parents as candidate (candidate.id)}
							<option value={candidate.id}>
								{candidate.title} — {pageHref(candidate.path)}
							</option>
						{/each}
					</select>
				</label>
				<label class="field" style="flex:0 0 160px">
					<span>Status</span>
					{#if isAdmin}
						<select name="status" bind:value={status}>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
						</select>
					{:else}
						<input type="hidden" name="status" value={status} />
						<span class="badge {status}">{status}</span>
					{/if}
				</label>
			</div>
		</div>
	</section>

	<section class="card" style="margin-top:24px">
		<div class="card-head">
			<h2>Sections</h2>
			<span class="hint" style="font-size:13px">{sections.length} on this page</span>
		</div>
		<div class="card-body">
			{#if sections.length === 0}
				<div class="empty" style="padding:32px 8px">
					<h3>This page is empty</h3>
					<p>Pick a section type below and add it to start building this page.</p>
				</div>
			{:else}
				<div class="sections">
					{#each sections as section, i (section.id)}
						<article class="section-card">
							<div class="section-bar">
								<span class="ord">{i + 1}</span>
								<span class="kind">{sectionSpecs[section.type]?.label ?? section.type}</span>
								<span class="spacer"></span>
								<button
									type="button"
									class="ghost tiny"
									title="Move up"
									aria-label="Move section {i + 1} up"
									disabled={i === 0}
									onclick={() => move(sections, i, -1)}>↑</button
								>
								<button
									type="button"
									class="ghost tiny"
									title="Move down"
									aria-label="Move section {i + 1} down"
									disabled={i === sections.length - 1}
									onclick={() => move(sections, i, 1)}>↓</button
								>
								<button
									type="button"
									class="danger tiny"
									aria-label="Remove section {i + 1}"
									onclick={() => sections.splice(i, 1)}
								>
									Remove
								</button>
							</div>

							{#if sectionSpecs[section.type]}
								<div class="section-fields">
									{#each sectionSpecs[section.type].fields as spec (spec.name)}
										<SectionField {spec} record={section} onRecordChange={(record) => setSection(i, record)} forms={data.forms} />
									{/each}
								</div>
							{:else}
								<div class="section-fields">
									<p class="notice bad" style="margin:0">
										This section’s type (<code>{section.type}</code>) is no longer available. Remove
										it, or ask your developer to restore it.
									</p>
								</div>
							{/if}
						</article>
					{/each}
				</div>
			{/if}

			<div class="row" style="align-items:flex-end;margin-top:20px">
				<label class="field" style="flex:0 0 220px">
					<span>Add a section</span>
					<select bind:value={newType}>
						{#each types as type (type)}
							<option value={type}>{sectionSpecs[type].label}</option>
						{/each}
					</select>
				</label>
				<div style="flex:0 0 auto">
					<button type="button" onclick={() => sections.push(blankSection(newType))}>
						Add section
					</button>
				</div>
			</div>
		</div>
	</section>

	<section class="card" style="margin-top:24px">
		<div class="card-head">
			<h2>Search engine listing</h2>
			<span class="hint" style="font-size:13px">Optional</span>
		</div>
		<div class="card-body">
			<label class="field">
				<span>Search title <span class="hint">— defaults to the page title</span></span>
				<input name="seoTitle" type="text" bind:value={seoTitle} />
			</label>
			<label class="field">
				<span>Search description</span>
				<textarea name="seoDescription" rows="2" bind:value={seoDescription}></textarea>
			</label>
			<div class="field">
				<span>Social sharing image</span>
				<MediaPicker bind:value={ogImage} />
			</div>
			<label class="field">
				<span>Canonical URL</span>
				<input
					name="canonical"
					type="url"
					bind:value={canonical}
					placeholder="https://example.com/page"
				/>
			</label>
			<label style="display:flex;align-items:center;gap:8px">
				<input name="noindex" type="checkbox" bind:checked={noindex} style="width:auto" />
				<span>Exclude this page from search engines and the sitemap</span>
			</label>
		</div>
	</section>

		<div class="sticky-save">
			<button class="primary" disabled={saving || !canEdit}>
				{saving ? 'Saving…' : 'Save changes'}
			</button>
			<span class="hint" style="font-size:13px">
				{sections.length} section{sections.length === 1 ? '' : 's'} · everything on this screen saves
				together
			</span>
		</div>
	</fieldset>
</form>
	<aside class="preview-panel card" aria-label="Live page preview">
		<div class="card-head preview-head">
			<div>
				<h2>Live preview</h2>
				<span class="hint">{previewSizes[previewWidth].width}×{previewSizes[previewWidth].height}</span>
			</div>
			<div class="preview-widths" aria-label="Preview width">
				{#each Object.entries(previewSizes) as [name, size] (name)}
					<button
						type="button"
						class:active={previewWidth === name}
						aria-pressed={previewWidth === name}
						onclick={() => (previewWidth = name as keyof typeof previewSizes)}
					>
						{size.label}
					</button>
				{/each}
			</div>
		</div>
		<div class="preview-viewport">
			<iframe
				bind:this={previewFrame}
				src={previewPath}
				title="Live preview of {title || 'untitled page'}"
				width={previewSizes[previewWidth].width}
				height={previewSizes[previewWidth].height}
				onload={() => postPreview()}
			></iframe>
		</div>
	</aside>
</div>

<VersionHistory versions={data.versions} />

<style>
	.editor-fields {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.editor-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(420px, 1fr);
		gap: 24px;
		align-items: start;
	}

	.editor-layout > form {
		min-width: 0;
	}

	.preview-panel {
		position: sticky;
		top: 24px;
		min-width: 0;
		overflow: hidden;
	}

	.preview-head > div:first-child {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.preview-widths {
		display: flex;
		gap: 4px;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.preview-widths button {
		padding: 6px 8px;
		font-size: 12px;
	}

	.preview-widths button.active {
		border-color: var(--brand);
		background: var(--brand-soft);
		color: var(--brand);
	}

	.preview-viewport {
		max-height: calc(100vh - 180px);
		overflow: auto;
		padding: 12px;
		background: #e4e8e6;
	}

	.preview-viewport iframe {
		display: block;
		max-width: none;
		border: 0;
		background: white;
		box-shadow: 0 2px 12px rgb(23 35 31 / 18%);
	}

	@media (max-width: 1200px) {
		.editor-layout {
			grid-template-columns: 1fr;
		}

		.preview-panel {
			position: static;
		}
	}
</style>
