<script lang="ts">
	import Seo from '$lib/components/site/Seo.svelte';

	let { data } = $props();
	const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

	function newsHref(page = 1, category = String(data.category), query = String(data.query)) {
		const params = new URLSearchParams();
		if (query) params.set('q', query);
		if (category) params.set('category', category);
		if (page > 1) params.set('page', String(page));
		const suffix = params.toString();
		return suffix ? `/news?${suffix}` : '/news';
	}
</script>

<Seo title="News | Lumotive" description="News, announcements and insights from Lumotive." />

<article>
	<section class="bg-panel relative isolate overflow-hidden">
		<div aria-hidden="true" class="bg-metasurface mask-hero-dots absolute inset-0"></div>
		<div aria-hidden="true" class="from-panel via-panel/90 to-brand-blue/35 absolute inset-0 bg-linear-75"></div>
		<div class="max-w-shell relative mx-auto px-4 py-14 md:px-7 md:py-16">
			<p class="text-eyebrow text-brand-amber mb-5 uppercase">Lumotive newsroom</p>
			<h1 class="font-display text-statement max-w-4xl text-white">News and Insights</h1>
			<p class="text-lead mt-5 max-w-2xl text-white/75">
				Company announcements, technology milestones and perspectives on programmable optics.
			</p>
		</div>
	</section>

	<section class="max-w-shell mx-auto px-4 py-16 md:px-7 md:py-24">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<nav aria-label="Filter by category" class="flex flex-wrap gap-3">
				<a
					class={[
						'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
						!data.category
							? 'border-brand-blue bg-brand-blue text-white'
							: 'border-border bg-surface text-text hover:border-brand-blue hover:text-brand-blue'
					]}
					aria-current={!data.category ? 'page' : undefined}
					href={newsHref(1, '')}
				>
					All
				</a>
				{#each data.categories as category (category)}
					<a
						class={[
							'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
							category === data.category
								? 'border-brand-blue bg-brand-blue text-white'
								: 'border-border bg-surface text-text hover:border-brand-blue hover:text-brand-blue'
						]}
						aria-current={category === data.category ? 'page' : undefined}
						href={newsHref(1, category)}
					>
						{category}
					</a>
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
						placeholder="Search announcements and coverage"
					/>
					{#if data.category}<input name="category" type="hidden" value={data.category} />{/if}
					<button type="submit">Search</button>
					{#if data.query}<a href={newsHref(1, data.category, '')}>Clear</a>{/if}
				</div>
			</form>
		</div>

		<div class="news-heading">
			<div>
				<p class="text-eyebrow text-brand-blue uppercase">{data.category || 'All news'}</p>
				<h2 class="font-display text-heading text-ink mt-2">
					{data.query ? `Results for “${data.query}”` : 'Latest From Lumotive'}
				</h2>
			</div>
			<p aria-live="polite" class="text-text-muted text-sm">
				{data.totalItems} {data.totalItems === 1 ? 'post' : 'posts'}
			</p>
		</div>

		{#if data.posts.length}
			<div class="news-grid">
				{#each data.posts as post (post.slug)}
					<a class="news-card" href={`/posts/${post.slug}`}>
						<div class="flex flex-1 flex-col p-7">
							<div class="flex flex-wrap items-center gap-x-3 gap-y-2">
								{#if post.publishedAt}
									<time class="text-spec text-text-muted" datetime={post.publishedAt}>
										{dateFormat.format(new Date(post.publishedAt.replace(' ', 'T')))}
									</time>
								{/if}
								{#if post.category}<span class="text-spec text-brand-blue">{post.category}</span>{/if}
							</div>
							<h3 class="font-display text-subheading text-ink mt-4">{post.title}</h3>
							{#if post.excerpt}<p class="text-text mt-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>{/if}
							<span class="text-brand-blue mt-auto pt-7 text-base font-medium">Read article →</span>
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
				<h2>No Matching News</h2>
				<p>Try another search or clear the category filter.</p>
				<a class="text-brand-blue font-medium" href="/news">View all news</a>
			</div>
		{/if}
	</section>
</article>

<style>
	.news-search { display: grid; gap: .6rem; max-width: 42rem; }
	.news-search label { font-weight: 700; }
	.news-search div { display: flex; align-items: center; gap: .75rem; }
	.news-search input { min-width: 0; flex: 1; border: 1px solid var(--color-border); border-radius: 999px; padding: .85rem 1.1rem; background: var(--color-surface); }
	.news-search button { border: 0; border-radius: 999px; padding: .85rem 1.25rem; color: white; background: var(--color-brand-blue); font: inherit; font-weight: 700; cursor: pointer; }
	.news-search a { color: var(--color-brand-blue); font-weight: 700; }
	.news-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-top: 3rem; }
	.news-heading h2 { margin-bottom: 0; }
	.news-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; margin-top: 2.5rem; }
	.news-card { display: flex; min-height: 22rem; overflow: hidden; border-radius: var(--radius-card); background: var(--color-surface); text-decoration: none; transition: transform 180ms ease, box-shadow 180ms ease; }
	.news-card:hover { transform: translateY(-.25rem); box-shadow: var(--shadow-card); }
	.news-card h3 { text-wrap: balance; }
	.news-card p { color: var(--color-text); }
	.pagination { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 1rem; margin-top: 3rem; }
	.pagination a { color: var(--color-brand-blue); font-weight: 700; }
	.pagination a:last-child { justify-self: end; }
	.pagination span { color: var(--color-muted); }
	.empty-state { margin-top: 2.5rem; border-radius: var(--radius-card); padding: 4rem 1.5rem; text-align: center; background: var(--color-surface); }
	@media (max-width: 900px) { .news-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (max-width: 620px) {
		.news-grid { grid-template-columns: 1fr; }
		.news-heading { align-items: start; flex-direction: column; }
		.news-search div { align-items: stretch; flex-direction: column; }
		.news-search button { align-self: start; }
	}
	@media (prefers-reduced-motion: reduce) { .news-card { transition: none; } .news-card:hover { transform: none; } }
</style>
