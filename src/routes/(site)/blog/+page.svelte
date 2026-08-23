<script lang="ts">
	let { data } = $props();
	const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });
</script>

<svelte:head>
	<title>Blog</title>
	<meta name="description" content="News, ideas, and updates." />
</svelte:head>

<section class="page-heading">
	<div class="container narrow">
		<h1>Latest stories</h1>
		<p>News, ideas, and useful perspectives from our team.</p>
	</div>
</section>

<section class="section">
	<div class="container narrow post-list">
		{#each data.posts as post}
			<article class="post-summary">
				{#if post.publishedAt}<time datetime={post.publishedAt}>{dateFormat.format(new Date(post.publishedAt.replace(' ', 'T')))}</time>{/if}
				<h2><a href={`/blog/${post.slug}`}>{post.title}</a></h2>
				{#if post.excerpt}<p>{post.excerpt}</p>{/if}
				<a class="text-link" href={`/blog/${post.slug}`}>Read article <span aria-hidden="true">→</span></a>
			</article>
		{:else}
			<p class="empty-state">No posts have been published yet.</p>
		{/each}
	</div>
</section>
