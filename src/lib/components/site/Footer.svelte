<script lang="ts">
	type Link = { label?: string; url?: string; newTab?: boolean };
	type LinkedItem = { id?: string; link?: Link };
	type SocialLink = { id?: string; platform?: string; url?: string; label?: string };
	type FooterData = {
		copyright?: string;
		navItems?: Array<{ id?: string; title?: string; subNavItems?: LinkedItem[] }>;
		legalLinks?: LinkedItem[];
		socialLinks?: SocialLink[];
	};

	let { data = {}, injectedHtml = '' }: { data?: FooterData; injectedHtml?: string } = $props();

	const href = (link?: Link) => link?.url || '#';

	// Only LinkedIn has an approved mark today. An entry with an unknown
	// platform is skipped rather than rendered without an icon. Entries come
	// from `globals.footer.socialLinks` (Admin → Site settings → Footer).
	const MARKS: Record<string, string> = {
		linkedin:
			'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05A4.17 4.17 0 0 1 17.6 8.7c3.2 0 4.4 2.02 4.4 5.06V21h-4v-6.41c0-1.53-.03-3.5-2.13-3.5-2.14 0-2.47 1.67-2.47 3.39V21h-3.4V9Z'
	};
	let socials = $derived(
		(data.socialLinks ?? []).flatMap((entry) => {
			const platform = String(entry?.platform ?? '').trim().toLowerCase();
			const url = String(entry?.url ?? '').trim();
			const path = MARKS[platform];
			if (!path || !url) return [];
			return [{ url, path, label: String(entry?.label ?? '').trim() || 'Lumotive on LinkedIn' }];
		})
	);
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
			{#if socials.length}
				<nav class="footer-social" aria-label="Lumotive on social media">
					{#each socials as social (social.url)}
						<a href={social.url} target="_blank" rel="noreferrer noopener">
							<span class="sr-only">{social.label} (opens in a new tab)</span>
							<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
								<path d={social.path} />
							</svg>
						</a>
					{/each}
				</nav>
			{/if}
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

<style>
	/* Matches the footer link colour and the 44px target the rest of the footer
	   uses on small screens. */
	.footer-social { display: flex; gap: .5rem; margin-top: 1.5rem; }
	.footer-social a {
		display: inline-flex;
		min-width: 2.75rem;
		min-height: 2.75rem;
		align-items: center;
		justify-content: center;
		margin-left: -.75rem;
		border-radius: 999px;
		color: rgb(255 255 255 / 62%);
		text-decoration: none;
		transition: color 160ms ease;
	}
	.footer-social a:hover { color: #fff; }
	/* The icon is pulled 0.75rem left to align its glyph with the logo, so the
	   site's 4px focus offset would push the ring past a phone's left edge. The
	   ring sits on the 44px target's own edge instead. */
	.footer-social a:focus-visible { outline-offset: 0; }
	@media (prefers-reduced-motion: reduce) {
		.footer-social a { transition: none; }
	}
</style>
