<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/components/site/Seo.svelte';

	let { data } = $props();
	const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

	// The package prints a card's type in the singular ("PRESS RELEASE") where
	// the tab above it is plural, and renames "Media Coverage" to "In the news".
	// Anything the map does not cover prints as the CMS stores it.
	const TYPE_LABELS: Record<string, string> = {
		'Press Releases': 'Press release',
		'Media Coverage': 'In the news',
		Events: 'Event'
	};
	const typeLabel = (category: string) => TYPE_LABELS[category] ?? category;
	const published = (value: string) => dateFormat.format(new Date(value.replace(' ', 'T')));

	function newsHref(page = 1, category = String(data.category), query = String(data.query)) {
		const params = new URLSearchParams();
		if (query) params.set('q', query);
		if (category) params.set('category', category);
		if (page > 1) params.set('page', String(page));
		const suffix = params.toString();
		return suffix ? `/news?${suffix}` : '/news';
	}
</script>

<Seo
	title="News and Events | Lumotive"
	description="Company announcements, media coverage and events from Lumotive."
	canonical={`${page.url.origin}${page.url.pathname}`}
/>

<article>
	<section class="bg-panel relative isolate overflow-hidden">
		<div aria-hidden="true" class="bg-metasurface mask-hero-dots absolute inset-0"></div>
		<div aria-hidden="true" class="from-panel via-panel/90 to-brand-blue/35 absolute inset-0 bg-linear-75"></div>
		<!-- `container` is the header's own geometry, so the newsroom lines up
		     with the logo at every width, as the CMS pages do. -->
		<div class="container relative py-14 md:py-16">
			<p class="text-eyebrow text-brand-amber mb-5 uppercase">Lumotive newsroom</p>
			<h1 class="font-display text-statement max-w-4xl text-white">News and Events</h1>
		</div>
	</section>

	<section class="container py-16 md:py-24">
		{#if data.featured}
			{@const post = data.featured}
			<a class="featured" href={`/posts/${post.slug}`}>
				{#if post.image}
					<div class="featured-media">
						<img src={post.image} alt="" width="1200" height="675" loading="eager" />
					</div>
				{/if}
				<div class="featured-copy">
					<div class="meta">
						{#if post.category}<span class="type">{typeLabel(post.category)}</span>{/if}
						{#if post.publishedAt}
							<time datetime={post.publishedAt}>{published(post.publishedAt)}</time>
						{/if}
					</div>
					<h2 class="font-display text-heading text-ink mt-4">{post.title}</h2>
					{#if post.excerpt}<p class="mt-4 leading-relaxed">{post.excerpt}</p>{/if}
					<span class="featured-action">Read more</span>
				</div>
			</a>
		{/if}

		<div class="controls">
			<nav aria-label="Filter news by type" class="tabs">
				{#each data.tabs as tab (tab.label)}
					{@const active = tab.category === data.category}
					<a
						class="tab"
						class:active
						aria-current={active ? 'page' : undefined}
						href={newsHref(1, tab.category)}
					>{tab.label}</a>
				{/each}
			</nav>
			<form class="news-search" action="/news" method="get" role="search">
				<label for="news-query">Search news</label>
				<div>
					<input
						id="news-query"
						name="q"
						type="search"
						maxlength="100"
						value={data.query}
						placeholder="Search news…"
					/>
					{#if data.category}<input name="category" type="hidden" value={data.category} />{/if}
					<button type="submit">Search</button>
					{#if data.query}<a href={newsHref(1, data.category, '')}>Clear</a>{/if}
				</div>
			</form>
		</div>

		<p aria-live="polite" class="count">
			{data.totalItems} {data.totalItems === 1 ? 'post' : 'posts'}
		</p>

		{#if data.posts.length}
			<div class="news-grid">
				{#each data.posts as post (post.slug)}
					<a class="news-card" href={`/posts/${post.slug}`}>
						{#if post.image}
							<div class="card-media">
								<img src={post.image} alt="" width="800" height="450" loading="lazy" />
							</div>
						{/if}
						<div class="card-copy">
							<div class="meta">
								{#if post.category}<span class="type">{typeLabel(post.category)}</span>{/if}
								{#if post.publishedAt}
									<time datetime={post.publishedAt}>{published(post.publishedAt)}</time>
								{/if}
							</div>
							<h3 class="font-display text-subheading text-ink mt-3">{post.title}</h3>
							{#if post.excerpt}<p class="mt-3 line-clamp-3 leading-relaxed">{post.excerpt}</p>{/if}
							<span class="card-action">Read more →</span>
						</div>
					</a>
				{/each}
			</div>

			{#if data.totalPages > 1}
				<nav class="pagination" aria-label="News pages">
					{#if data.currentPage > 1}
						<a href={newsHref(data.currentPage - 1)}>← Previous</a>
					{/if}
					<span>Page {data.currentPage} of {data.totalPages}</span>
					{#if data.currentPage < data.totalPages}
						<a href={newsHref(data.currentPage + 1)}>Next →</a>
					{/if}
				</nav>
			{/if}
		{:else}
			<div class="empty-state">
				<h2 class="font-display text-heading text-ink">No Matching News</h2>
				<p class="mt-3">Try another search or choose a different type.</p>
				<a class="empty-link" href="/news">View all news</a>
			</div>
		{/if}
	</section>
</article>

<style>
	/* Shared by the featured story and the grid cards: the type in Deep Laser
	   Blue, the date in Slate Text, both at the spec size, which is the "Type ·
	   date" line the package prints. */
	.meta { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem .75rem; font-size: var(--text-spec); }
	.meta .type { color: var(--color-brand-blue-dark); font-weight: 650; text-transform: uppercase; letter-spacing: .06em; }
	.meta time { color: var(--color-text); }

	.featured { display: grid; align-items: center; gap: 2rem; margin-bottom: 4rem; border-radius: var(--radius-card); padding: 1.5rem; background: var(--color-surface); text-decoration: none; transition: transform 180ms ease, box-shadow 180ms ease; }
	.featured:hover { transform: translateY(-.25rem); box-shadow: var(--shadow-card); }
	@media (min-width: 768px) { .featured { grid-template-columns: 1.15fr 1fr; gap: 2.5rem; padding: 2rem; } }
	.featured-media { overflow: hidden; border-radius: var(--radius-card); aspect-ratio: 16 / 9; background: var(--color-background); }
	.featured-media img, .card-media img { display: block; width: 100%; height: 100%; object-fit: cover; }
	.featured-copy p { color: var(--color-text); }
	/* Matches the primary action elsewhere: a bare utility loses to the global
	   anchor colour, so the pill is styled in scoped CSS. */
	.featured-action { display: inline-flex; min-height: 2.75rem; align-items: center; margin-top: 1.75rem; padding: .75rem 1.75rem; border-radius: 999px; background: var(--color-ink); color: #fff; font-weight: 650; }

	.controls { display: flex; flex-direction: column; gap: 1.5rem; }
	@media (min-width: 900px) { .controls { align-items: center; flex-direction: row; justify-content: space-between; } }
	.tabs { display: flex; flex-wrap: wrap; gap: .75rem; }
	.tab { display: inline-flex; min-height: 2.75rem; align-items: center; justify-content: center; border: 1px solid var(--color-border); border-radius: 999px; padding: .5rem 1.1rem; background: var(--color-surface); color: var(--color-text); font-size: .875rem; font-weight: 650; text-decoration: none; transition: border-color 180ms ease, color 180ms ease; }
	.tab:hover { border-color: var(--color-brand-blue-dark); color: var(--color-brand-blue-dark); }
	.tab.active { border-color: var(--color-ink); background: var(--color-ink); color: #fff; }

	.count { margin-top: 2rem; color: var(--color-text); font-size: var(--text-spec); }

	.news-search { display: grid; gap: .6rem; max-width: 42rem; }
	.news-search label { font-weight: 700; }
	.news-search div { display: flex; align-items: center; gap: .75rem; }
	.news-search input { min-width: 0; flex: 1; border: 1px solid var(--color-border); border-radius: 999px; padding: .85rem 1.1rem; background: var(--color-surface); }
	.news-search button { border: 0; border-radius: 999px; padding: .85rem 1.25rem; color: white; background: var(--color-ink); font: inherit; font-weight: 700; cursor: pointer; }
	.news-search a { display: inline-flex; min-height: 2.75rem; align-items: center; justify-content: center; color: var(--color-brand-blue-dark); font-weight: 700; }

	.news-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
	.news-card { display: flex; flex-direction: column; overflow: hidden; border-radius: var(--radius-card); background: var(--color-surface); text-decoration: none; transition: transform 180ms ease, box-shadow 180ms ease; }
	.news-card:hover { transform: translateY(-.25rem); box-shadow: var(--shadow-card); }
	.card-media { aspect-ratio: 16 / 9; background: var(--color-background); }
	.card-copy { display: flex; flex: 1; flex-direction: column; padding: 1.75rem; }
	.news-card h3 { text-wrap: balance; }
	.news-card p { color: var(--color-text); }
	.card-action { margin-top: auto; padding-top: 1.75rem; color: var(--color-brand-blue-dark); font-weight: 650; }

	.pagination { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; margin-top: 3rem; }
	.pagination a { display: inline-flex; min-height: 2.75rem; align-items: center; color: var(--color-brand-blue-dark); font-weight: 700; }
	.pagination a:last-child { justify-self: end; }
	.pagination span { color: var(--color-text); }

	.empty-state { margin-top: 2.5rem; border-radius: var(--radius-card); padding: 4rem 1.5rem; text-align: center; background: var(--color-surface); }
	.empty-link { display: inline-flex; min-height: 2.75rem; align-items: center; margin-top: 1rem; color: var(--color-brand-blue-dark); font-weight: 650; }

	@media (max-width: 900px) { .news-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 620px) {
		.news-grid { grid-template-columns: 1fr; }
		.news-search div { align-items: stretch; flex-direction: column; }
		.news-search button { align-self: start; }
	}
	@media (prefers-reduced-motion: reduce) {
		.news-card, .featured { transition: none; }
		.news-card:hover, .featured:hover { transform: none; }
	}
</style>
