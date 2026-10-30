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
		<div class="footer-legal-start">
			{#each socials as social (social.url)}
				<a class="footer-social" href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
						<path d={social.path} />
					</svg>
				</a>
			{/each}
			<p>© {new Date().getFullYear()} {data.copyright || 'Lumotive · Redmond, WA'}</p>
		</div>
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
	.footer-legal-start { display: flex; align-items: center; gap: .75rem; min-width: 0; }
 .footer-social { display: inline-flex; width: 2.25rem; height: 2.25rem; min-height: 2.25rem; flex-shrink: 0; align-items: center; justify-content: center; border: 1px solid var(--color-footer-border); border-radius: 50%; background: var(--color-footer-button); color: var(--color-footer-mark); transition: background 160ms ease, border-color 160ms ease; }
 .footer-social svg { width: 1rem; height: 1rem; }
 .footer-social:hover, .footer-social:focus-visible { background: var(--color-primary); border-color: var(--color-primary); }
 .footer-social:focus-visible { outline: 2px solid var(--color-footer-mark); outline-offset: 3px; }
 @media (prefers-reduced-motion: reduce) { .footer-social { transition: none; } }
</style>
