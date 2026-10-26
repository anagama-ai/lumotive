<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type Role = { title: string; meta: string; url: string };

	let { section, media: _media }: { section: Section; media: MediaMap } = $props();
	let heading = $derived(titleCase(section.heading == null ? null : String(section.heading)));
	let linkLabel = $derived(String(section.linkLabel ?? 'See all open roles').trim());
	let linkUrl = $derived(String(section.linkUrl ?? '').trim());

	// The board link is the section's floor: it is server-rendered and works
	// without JavaScript, so a visitor can always reach the careers page. The
	// roles are an enhancement fetched from our own endpoint, which proxies the
	// Lever feed. When that returns nothing — Lever down, network blocked, no
	// script — the section keeps only the button, which is what the package's
	// dev note asks for.
	let roles = $state<Role[]>([]);

	$effect(() => {
		let cancelled = false;
		fetch('/api/open-roles')
			.then((response) => (response.ok ? response.json() : { roles: [] }))
			.then((data) => {
				if (cancelled) return;
				roles = Array.isArray(data?.roles) ? (data.roles as Role[]) : [];
			})
			.catch(() => undefined);
		return () => {
			cancelled = true;
		};
	});
</script>

<section
	class="lumo-section"
	id={section.anchor ? String(section.anchor) : undefined}
	data-background={String(section.background ?? 'none')}
	data-width={String(section.width ?? 'contained')}
	data-spacing-top={String(section.spacingTop ?? 'md')}
	data-spacing-bottom={String(section.spacingBottom ?? 'md')}
	data-align={section.align === 'container' ? 'container' : undefined}
>
	<div class="lumo-inner">
		{#if section.eyebrow || heading || section.intro}
			<Reveal><div class="mb-12 max-w-4xl">
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if heading}<h2 class="font-display text-statement text-ink">{heading}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
			</div></Reveal>
		{/if}

		{#if roles.length}
			<ul class="role-grid">
				{#each roles as role (role.url)}
					<li>
						<a class="role-card" href={role.url} target="_blank" rel="noopener noreferrer">
							<h3 class="font-display text-subheading text-ink">{role.title}</h3>
							{#if role.meta}<p class="role-meta">{role.meta}</p>{/if}
							<span class="role-action" aria-hidden="true">View role <span class="arrow">→</span></span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		{#if linkLabel && linkUrl}
			<div class:mt-10={roles.length}>
				<a class="role-button" href={linkUrl} target="_blank" rel="noopener noreferrer">{linkLabel}</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.role-grid { display: grid; gap: 1.5rem; margin: 0; padding: 0; list-style: none; }
	@media (min-width: 768px) { .role-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	@media (min-width: 1024px) { .role-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
	.role-card { display: flex; height: 100%; flex-direction: column; padding: 2rem; border-radius: var(--radius-card); background: var(--color-surface); text-decoration: none; transition: transform 300ms ease, box-shadow 300ms ease; }
	.role-card:hover { transform: translateY(-.25rem); box-shadow: var(--shadow-card); }
	.role-card h3 { margin: 0; }
	.role-meta { margin: .5rem 0 0; color: var(--color-text); font-size: var(--text-spec); line-height: 1.5; }
	/* The whole card is the link, so the action is decorative: it is hidden
	   from assistive technology and the accessible name stays the role title. */
	.role-action { margin-top: auto; padding-top: 1.5rem; color: var(--color-brand-blue-dark); font-weight: 650; }
	.role-card:hover .arrow { display: inline-block; transform: translateX(.25rem); }
	.arrow { transition: transform 200ms ease; }
	/* Matches the primary action elsewhere: a bare utility loses to the global
	   anchor colour, so the pill is styled in scoped CSS. */
	.role-button { display: inline-flex; min-height: 2.75rem; align-items: center; padding: .75rem 1.75rem; border-radius: 999px; background: var(--color-ink); color: #fff; font-weight: 650; text-decoration: none; transition: transform 200ms ease, background 200ms ease; }
	.role-button:hover { transform: translateY(-2px); background: rgb(10 18 38 / 88%); }
	@media (prefers-reduced-motion: reduce) {
		.role-card, .role-button, .arrow { transition: none; }
		.role-card:hover, .role-button:hover { transform: none; }
		.role-card:hover .arrow { transform: none; }
	}
</style>
