<script lang="ts">
	import Seo from '$lib/components/site/Seo.svelte';
	import { resolveMedia } from '$lib/media';
	import { rewriteRichTextImages } from '$lib/richtextimages';
	let { data } = $props();
	let coverImage = $derived(resolveMedia(data.post.coverImage, data.media, 1024));
	let socialImage = $derived(
		resolveMedia(data.post.ogImage, data.media, 1024)?.src || data.seo.defaultOgImageUrl
	);
	const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });
</script>

<Seo
	title={data.post.seoTitle || data.post.title}
	description={data.post.seoDescription || data.post.excerpt}
	image={socialImage}
	canonical={data.post.canonical}
	noindex={data.post.noindex}
/>

<article>
	<header class="article-header">
		<div class="container narrow">
			<a class="back-link" href="/blog">← All stories</a>
			<h1>{data.post.title}</h1>
			{#if data.post.publishedAt}
				<time datetime={data.post.publishedAt}>{dateFormat.format(new Date(data.post.publishedAt.replace(' ', 'T')))}</time>
			{/if}
		</div>
	</header>
	{#if coverImage}
		<div class="container narrow cover">
			<img
				src={coverImage.src}
				srcset={coverImage.srcset}
				sizes="(max-width: 800px) 100vw, 800px"
				alt={coverImage.alt}
				width={coverImage.width ?? 1024}
				height={coverImage.height ?? 576}
			/>
		</div>
	{/if}
	<div class="section">
		<div class="container narrow prose">{@html rewriteRichTextImages(data.post.body)}</div>
	</div>
</article>

<style>
	.cover { padding-top: clamp(2rem, 5vw, 4rem); }
	.cover img { display: block; width: 100%; height: auto; border-radius: 10px; object-fit: cover; }
</style>
