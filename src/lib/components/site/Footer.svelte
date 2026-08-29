<script lang="ts">
	type Link = { label?: string; url?: string; newTab?: boolean };
	type LinkedItem = { id?: string; link?: Link };
	type FooterData = {
		copyright?: string;
		navItems?: Array<{ id?: string; title?: string; subNavItems?: LinkedItem[] }>;
		legalLinks?: LinkedItem[];
	};

	let { data = {}, injectedHtml = '' }: { data?: FooterData; injectedHtml?: string } = $props();

	const href = (link?: Link) => link?.url || '#';
</script>

<footer class="site-footer">
	<div class="container footer-inner">
		<div class="footer-brand">
			<a class="site-logo" href="/" aria-label="Lumotive home">
				<img
					src="/lumotive/logos/lumotive-wordmark-light.png"
					alt="Lumotive"
					width="1080"
					height="176"
				/>
			</a>
		</div>

		{#each data.navItems || [] as group, index (index)}
			<section class="footer-group">
				{#if group.title}<h2>{group.title}</h2>{/if}
				<nav aria-label={group.title || 'Footer'}>
					{#each group.subNavItems || [] as item, index (index)}
						{#if item.link?.label}
							<a
								href={href(item.link)}
								target={item.link.newTab ? '_blank' : undefined}
								rel={item.link.newTab ? 'noreferrer' : undefined}>{item.link.label}</a
							>
						{/if}
					{/each}
				</nav>
			</section>
		{/each}
	</div>

	<div class="container footer-legal">
		<p>© {new Date().getFullYear()} {data.copyright || 'Lumotive · Redmond, WA'}</p>
		{#if data.legalLinks?.length}
			<nav aria-label="Legal">
				{#each data.legalLinks as item, index (index)}
					{#if item.link?.label}
						<a
							href={href(item.link)}
							target={item.link.newTab ? '_blank' : undefined}
							rel={item.link.newTab ? 'noreferrer' : undefined}>{item.link.label}</a
						>
					{/if}
				{/each}
			</nav>
		{/if}
	</div>
	{@html injectedHtml}
</footer>
