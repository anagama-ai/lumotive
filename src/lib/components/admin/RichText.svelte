<script lang="ts">
	import { onMount } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Underline from '@tiptap/extension-underline';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import { OrderedList } from '@tiptap/extension-list';
	import { RICH_TEXT_SCHEMES } from '$lib/richtext';
	import { mediaValue, type MediaValue } from '$lib/sections';
	import { mediaSrc, type MediaRecord } from '$lib/media';
	import { showToast } from '$lib/toast.svelte';
	import MediaPicker from './MediaPicker.svelte';

	let { value = $bindable() }: { value: string } = $props();

	let element: HTMLDivElement;
	let editor = $state<Editor | null>(null);
	// Plain, not reactive: it records what the editor already holds, and must not
	// itself retrigger the sync effect below.
	let lastHtml = '';
	let revision = $state(0);
	let showMedia = $state(false);
	let selectedMedia = $state<MediaValue | string>('');
	let insertingImage = $state(false);
	let imageError = $state('');

	const allowedHref = (href: string) => {
		const target = href.trim();
		if (/^(?:\/(?!\/)|#|\?|\.\.?\/)/.test(target)) return true;
		const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(target)?.[1].toLowerCase();
		return !!scheme && RICH_TEXT_SCHEMES.some((allowed) => allowed === scheme);
	};

	const SafeLink = Link.extend({
		addAttributes() {
			return {
				href: {
					default: null,
					parseHTML: (node) => node.getAttribute('href')
				}
			};
		}
	}).configure({
		openOnClick: false,
		autolink: false,
		linkOnPaste: false,
		HTMLAttributes: {},
		isAllowedUri: allowedHref,
		validate: allowedHref
	});

	const SafeImage = Image.extend({
		addAttributes() {
			return {
				src: { default: null },
				alt: { default: null }
			};
		}
	}).configure({ inline: true, allowBase64: false });

	const SafeOrderedList = OrderedList.extend({
		addAttributes() {
			return {};
		}
	});

	onMount(() => {
		lastHtml = value || '';
		editor = new Editor({
			element,
			content: lastHtml,
			extensions: [
				StarterKit.configure({
					code: false,
					codeBlock: false,
					strike: false,
					trailingNode: false,
					link: false,
					underline: false,
					orderedList: false,
					heading: { levels: [1, 2, 3, 4] }
				}),
				SafeOrderedList,
				Underline,
				SafeLink,
				SafeImage
			],
			editorProps: {
				attributes: {
					role: 'textbox',
					'aria-label': 'Rich text content',
					'aria-multiline': 'true',
					spellcheck: 'true'
				}
			},
			onUpdate: ({ editor: current }) => {
				lastHtml = current.isEmpty ? '' : current.getHTML();
				value = lastHtml;
			},
			onTransaction: () => {
				revision += 1;
			}
		});

		return () => editor?.destroy();
	});

	/**
	 * Tiptap reformats what it is given, so its own getHTML() never matches the
	 * stored string byte for byte. Comparing against it made this effect set the
	 * content on every run, and each set raises a transaction that re-renders the
	 * toolbar, which is the loop that killed hydration. Track what the editor was
	 * last given instead, so an external change applies exactly once.
	 */
	$effect(() => {
		const html = value || '';
		if (!editor || html === lastHtml) return;
		lastHtml = html;
		editor.commands.setContent(html, { emitUpdate: false });
	});

	const active = (name: string, attributes?: Record<string, unknown>) => {
		revision;
		return editor?.isActive(name, attributes) ?? false;
	};

	const setLink = () => {
		if (!editor) return;
		const current = String(editor.getAttributes('link').href ?? '');
		const href = window.prompt('Link destination', current);
		if (href === null) return;
		const target = href.trim();
		if (!target) {
			editor.chain().focus().extendMarkRange('link').unsetLink().run();
			return;
		}
		if (!allowedHref(target)) {
			window.alert('Use a site-relative path or an http, https, or mailto address.');
			return;
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: target }).run();
	};

	const insertImage = async () => {
		const selected = mediaValue(selectedMedia);
		if (!editor || !selected) return;
		insertingImage = true;
		imageError = '';
		try {
			let src = selected.value;
			let alt = '';
			if (selected.kind === 'media') {
				const response = await fetch('/admin/api/media');
				if (!response.ok) throw new Error('Could not insert that image.');
				const records = (await response.json()) as MediaRecord[];
				const record = records.find((item) => item.id === selected.value);
				if (!record?.file) throw new Error('That media item has no image file.');
				src = mediaSrc({ id: record.id, file: record.file }, 1024);
				alt = record.alt;
			}
			editor.chain().focus().setImage({ src, alt }).run();
			selectedMedia = '';
			showMedia = false;
		} catch (cause) {
			imageError = cause instanceof Error ? cause.message : 'Could not insert that image.';
			showToast(imageError);
		} finally {
			insertingImage = false;
		}
	};
</script>

<div class="rich-text">
	<div class="toolbar" role="toolbar" aria-label="Rich text formatting">
		<button type="button" class:active={active('paragraph')} onclick={() => editor?.chain().focus().setParagraph().run()}>P</button>
		{#each [1, 2, 3, 4] as level}
			<button
				type="button"
				class:active={active('heading', { level })}
				onclick={() => editor?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run()}
				aria-label="Heading {level}"
			>H{level}</button>
		{/each}
		<button type="button" class:active={active('bold')} onclick={() => editor?.chain().focus().toggleBold().run()} aria-label="Bold"><strong>B</strong></button>
		<button type="button" class:active={active('italic')} onclick={() => editor?.chain().focus().toggleItalic().run()} aria-label="Italic"><em>I</em></button>
		<button type="button" class:active={active('underline')} onclick={() => editor?.chain().focus().toggleUnderline().run()} aria-label="Underline"><u>U</u></button>
		<button type="button" class:active={active('link')} onclick={setLink}>Link</button>
		<button type="button" class:active={active('bulletList')} onclick={() => editor?.chain().focus().toggleBulletList().run()} aria-label="Unordered list">• List</button>
		<button type="button" class:active={active('orderedList')} onclick={() => editor?.chain().focus().toggleOrderedList().run()} aria-label="Ordered list">1. List</button>
		<button type="button" class:active={active('blockquote')} onclick={() => editor?.chain().focus().toggleBlockquote().run()}>Quote</button>
		<button type="button" onclick={() => editor?.chain().focus().setHorizontalRule().run()}>Rule</button>
		<button type="button" class:active={showMedia} onclick={() => (showMedia = !showMedia)}>Image</button>
		<button type="button" onclick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}>Remove formatting</button>
	</div>

	{#if showMedia}
		<div class="media-insert">
			<MediaPicker bind:value={selectedMedia} />
			<div class="media-actions">
				<button type="button" onclick={insertImage} disabled={!selectedMedia || insertingImage}>
					{insertingImage ? 'Inserting…' : 'Insert image'}
				</button>
				<button type="button" class="cancel" onclick={() => (showMedia = false)}>Cancel</button>
			</div>
			{#if imageError}<p class="error" role="alert">{imageError}</p>{/if}
		</div>
	{/if}

	<div class="surface" bind:this={element}></div>
</div>

<style>
	.rich-text {
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		background: white;
		overflow: hidden;
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 8px;
		border-bottom: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.toolbar button,
	.media-actions button {
		min-height: 32px;
		padding: 5px 9px;
		border: 1px solid #cbd5e1;
		border-radius: 5px;
		background: white;
		color: #334155;
		font: inherit;
		font-size: 13px;
		cursor: pointer;
	}

	.toolbar button:hover,
	.media-actions button:hover,
	.toolbar button.active {
		border-color: #64748b;
		background: #e2e8f0;
		color: #0f172a;
	}

	.toolbar button:focus-visible,
	.media-actions button:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 1px;
	}

	.media-insert {
		padding: 12px;
		border-bottom: 1px solid #e2e8f0;
		background: #f8fafc;
	}

	.media-actions {
		display: flex;
		gap: 8px;
		margin-top: 10px;
	}

	.media-actions button:not(.cancel) {
		border-color: #2563eb;
		background: #2563eb;
		color: white;
	}

	.media-actions button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error {
		margin: 8px 0 0;
		color: #b91c1c;
		font-size: 13px;
	}

	.surface :global(.ProseMirror) {
		min-height: 220px;
		padding: 16px;
		outline: none;
		line-height: 1.65;
	}

	.surface :global(.ProseMirror > :first-child) {
		margin-top: 0;
	}

	.surface :global(.ProseMirror > :last-child) {
		margin-bottom: 0;
	}

	.surface :global(img) {
		max-width: 100%;
		height: auto;
	}

	.surface :global(blockquote) {
		margin-left: 0;
		padding-left: 16px;
		border-left: 3px solid #cbd5e1;
		color: #475569;
	}
</style>
