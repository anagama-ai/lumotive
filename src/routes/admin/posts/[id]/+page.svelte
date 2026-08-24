<script lang="ts">
	import { enhance } from '$app/forms';
	import RichText from '$lib/components/admin/RichText.svelte';
	import MediaPicker from '$lib/components/admin/MediaPicker.svelte';
	import VersionHistory from '$lib/components/admin/VersionHistory.svelte';
	import type { MediaValue } from '$lib/sections';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();


	// Deliberate snapshot: the form owns these once loaded, so a reload must not
	// clobber unsaved edits.
	// svelte-ignore state_referenced_locally
	let coverImage = $state<MediaValue | string>(data.post.coverImage);
	// svelte-ignore state_referenced_locally
	let ogImage = $state<MediaValue | string>(data.post.ogImage);
	// svelte-ignore state_referenced_locally
	let body = $state(data.post.body);
	let coverImageInput: HTMLInputElement;
	let ogImageInput: HTMLInputElement;
	let bodyInput: HTMLInputElement;
	const coverImageValue = (): MediaValue | string => coverImage;
	const setCoverImage = (value: MediaValue | string) => {
		coverImage = value;
		const payload = coverImage ? JSON.stringify(coverImage) : '';
		coverImageInput.value = payload;
		coverImageInput.setAttribute('value', payload);
	};
	const ogImageValue = (): MediaValue | string => ogImage;
	const setOgImage = (value: MediaValue | string) => {
		ogImage = value;
		const payload = ogImage ? JSON.stringify(ogImage) : '';
		ogImageInput.value = payload;
		ogImageInput.setAttribute('value', payload);
	};
	const bodyValue = (): string => body;
	const setBody = (value: string) => {
		body = value;
		bodyInput.value = body;
		bodyInput.setAttribute('value', body);
	};
	let saving = $state(false);
	let isAdmin = $derived(data.editor?.role === 'admin');
	let canEdit = $derived(isAdmin || data.post.status !== 'published');
	$effect(() => {
		body = data.post.body;
	});
</script>


<svelte:head><title>{data.post.title || 'Untitled post'} — Content manager</title></svelte:head>

<div class="head">
	<div>
		<h1>{data.post.title || 'Untitled post'}</h1>
		<p class="sub">
			Live at <code>/blog/{data.post.slug}</code>
			· {data.post.status === 'published' ? 'visible to everyone' : 'only visible to you'}
		</p>
	</div>
	<div class="head-actions">
		<a class="btn" href="/admin/posts">All posts</a>
		<a class="btn" href="/blog/{data.post.slug}" target="_blank" rel="noreferrer">View post</a>
	</div>
</div>

{#if !canEdit}
	<p class="notice" role="status">Published posts are read-only for the editor role.</p>
{/if}


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
	<input bind:this={coverImageInput} type="hidden" name="coverImage" value={coverImage ? JSON.stringify(coverImage) : ''} />
	<input bind:this={ogImageInput} type="hidden" name="ogImage" value={ogImage ? JSON.stringify(ogImage) : ''} />
	<section class="card">
		<div class="card-head"><h2>Post details</h2></div>
		<div class="card-body">
			<div class="row">
				<label class="field">
					<span>Title</span>
					<input name="title" type="text" value={data.post.title} required />
				</label>
				<label class="field">
					<span>Web address <span class="hint">— lowercase, hyphens</span></span>
					<input name="slug" type="text" value={data.post.slug} required />
				</label>
			</div>

			<div class="row">
				<label class="field" style="flex:0 0 160px">
					<span>Status</span>
					{#if isAdmin}
						<select name="status">
							<option value="draft" selected={data.post.status !== 'published'}>Draft</option>
							<option value="published" selected={data.post.status === 'published'}>Published</option>
						</select>
					{:else}
						<input type="hidden" name="status" value={data.post.status} />
						<span class="badge {data.post.status}">{data.post.status}</span>
					{/if}
				</label>
				<label class="field" style="flex:0 0 200px">
					<span>Publish date</span>
					<input name="publishedAt" type="date" value={data.post.publishedAt} />
				</label>
			</div>

			<label class="field">
				<span>Summary <span class="hint">— shown in listings</span></span>
				<textarea name="excerpt" rows="2">{data.post.excerpt}</textarea>
			</label>

			<div class="field">
				<span>Cover image</span>
				<MediaPicker bind:value={coverImageValue, setCoverImage} />
			</div>
		</div>
	</section>

	<section class="card" style="margin-top:24px">
		<div class="card-head"><h2>Body</h2></div>
		<div class="card-body">
			<RichText bind:value={bodyValue, setBody} />
			<input bind:this={bodyInput} type="hidden" name="body" value={body} />
		</div>
	</section>

	<section class="card" style="margin-top:24px">
		<div class="card-head">
			<h2>Search and sharing</h2>
			<span class="hint" style="font-size:13px">Optional</span>
		</div>
		<div class="card-body">
			<label class="field">
				<span>Search title <span class="hint">— defaults to the post title</span></span>
				<input name="seoTitle" type="text" value={data.post.seoTitle} />
			</label>
			<label class="field">
				<span>Search description <span class="hint">— defaults to the excerpt</span></span>
				<textarea name="seoDescription" rows="2">{data.post.seoDescription}</textarea>
			</label>
			<div class="field">
				<span>Social sharing image</span>
				<MediaPicker bind:value={ogImageValue, setOgImage} />
			</div>
			<label class="field">
				<span>Canonical URL</span>
				<input
					name="canonical"
					type="url"
					value={data.post.canonical}
					placeholder="https://example.com/blog/post"
				/>
			</label>
			<label style="display:flex;align-items:center;gap:8px">
				<input name="noindex" type="checkbox" checked={data.post.noindex} style="width:auto" />
				<span>Exclude this post from search engines and the sitemap</span>
			</label>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary" disabled={saving || !canEdit}>
			{saving ? 'Saving…' : 'Save changes'}
		</button>
	</div>
	</fieldset>
</form>

<VersionHistory versions={data.versions} />

<style>
	.editor-fields {
		min-inline-size: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}
</style>
