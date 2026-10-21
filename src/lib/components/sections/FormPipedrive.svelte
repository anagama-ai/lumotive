<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	const LOADER = 'https://webforms.pipedrive.com/f/loader';

	let { section }: { section: Section } = $props();
	let heading = $derived(titleCase(typeof section.heading === 'string' ? section.heading : null));

	/**
	 * Only Pipedrive's own web-form URLs are accepted. Editors can change this
	 * field, and the value ends up next to a third-party loader script, so an
	 * arbitrary host must never reach the page.
	 */
	let formUrl = $derived.by(() => {
		const raw = String(section.formUrl ?? '').trim();
		if (!raw) return null;
		try {
			const url = new URL(raw);
			const ok = url.protocol === 'https:' && url.hostname.toLowerCase() === 'webforms.pipedrive.com';
			return ok && url.pathname.startsWith('/f/') ? url.href : null;
		} catch {
			return null;
		}
	});

	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};

	// Page 02 of the approved package asks every submission to carry three
	// values: the inquiry type a CTA set through `?inquiry=`, the page the
	// visitor came from, and any UTM campaign. The form lives inside
	// Pipedrive's iframe, so the page cannot write into it. Pipedrive's own
	// mechanism is a hidden field whose value source is "JavaScript variable":
	// the form asks the loader for the named variables and the loader answers
	// from `window.pd_webform` on this page (REQUEST_JS_VARIABLES /
	// JS_VARIABLES_RESPONSE in webforms.pipedrive.com/f/loader). So the three
	// values are published there under fixed names, and the Pipedrive admin
	// adds three hidden fields reading `inquiry`, `source_page` and
	// `campaign`. Query parameters on the form URL are not an option: the
	// loader appends its own `?embeded=1&uuid=…`, which an existing query
	// string corrupts.
	//
	// The source page is the page the visitor clicked from. Internal links are
	// client-side navigations, which leave `document.referrer` at whatever
	// brought the visitor to the site (often empty), so the previous in-app
	// URL comes from the router; only a first, full page load falls back to
	// the referrer. Every navigation republishes, so a new `?inquiry=` on
	// /contact itself is picked up without reloading the form.
	afterNavigate(({ from, to }) => {
		const params = to?.url.searchParams ?? new URLSearchParams(window.location.search);
		window.pd_webform = {
			...window.pd_webform,
			inquiry: params.get('inquiry')?.trim() || 'general',
			source_page: from?.url.href ?? document.referrer ?? '',
			campaign: ['utm_source', 'utm_medium', 'utm_campaign']
				.map((name) => params.get(name)?.trim() || '')
				.filter(Boolean)
				.join(' · ')
		};
	});

	let host = $state<HTMLDivElement | null>(null);

	// Pipedrive's loader reads the `data-pd-webforms` attribute of the element it
	// is mounted in and injects the form iframe there, sizing it over postMessage.
	// It has to be a real script element added after the container exists, so it
	// cannot be part of the markup or come through `{@html}`.
	$effect(() => {
		const container = host;
		const src = formUrl;
		if (!container || !src) return;

		container.dataset.pdWebforms = src;
		const script = document.createElement('script');
		script.src = LOADER;
		script.async = true;
		container.append(script);

		return () => {
			// The loader tags the host with an `id` and skips tagged hosts, so
			// both go, or a new form URL set in the editor would leave no form.
			container.replaceChildren();
			container.removeAttribute('id');
			if (window.pd_webform) {
				delete window.pd_webform.inquiry;
				delete window.pd_webform.source_page;
				delete window.pd_webform.campaign;
			}
		};
	});
</script>

{#if formUrl}
	<section
		class="lumo-section"
		id={section.anchor ? String(section.anchor) : undefined}
		data-design-version={section.designVersion ? String(section.designVersion) : undefined}
		data-background={enumValue(section.background, ['none', 'subtle', 'strong', 'inverse'], 'none')}
		data-width={enumValue(section.width, ['contained', 'wide', 'full'], 'contained')}
		data-spacing-top={enumValue(section.spacingTop, ['none', 'sm', 'md', 'lg'], 'md')}
		data-spacing-bottom={enumValue(section.spacingBottom, ['none', 'sm', 'md', 'lg'], 'md')}
		data-align={section.align === 'container' ? 'container' : undefined}
	>
		<div class="lumo-inner">
			<div class="form-column">
				{#if section.eyebrow || heading || section.intro}
					<Reveal>
						<div class="mb-10">
							<!-- Deep Laser Blue: at the eyebrow's 12px the lighter blue
							     measures 4.15:1 on the page field, under the 4.5:1 floor. -->
							{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
							{#if heading}<h2 class="font-display text-statement text-ink">{heading}</h2>{/if}
							{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
						</div>
					</Reveal>
				{/if}
				<div class="form-frame">
					<div bind:this={host} class="pipedriveWebForms" data-pd-webforms={formUrl}></div>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	/* The heading block keeps the narrow reading column; the panel below is
	   sized to the form itself (see `.form-frame`). The cap sits on an inner
	   column rather than on `.lumo-inner`, so the section can still opt into
	   the header container and the heading and panel start on the same left
	   edge as every other section instead of floating in the middle of the
	   page. */
	.form-column { max-width: var(--container-narrow); }

	/* Pipedrive renders the form itself at most 480px wide and centres it
	   inside its iframe (`max-width: 480px; margin: 0 auto` in its own CSS,
	   for every style option), so a wider panel only adds empty space inside
	   the frame: 140px a side at 1440. The panel therefore hugs that width,
	   and its own side padding is the whole gutter: 20px on phones, 36px from
	   768px. On phones the iframe is narrower than 480px and the fields fill
	   it. The panel keeps the section's left edge; vertical padding is
	   unchanged.
	   The min-height matches the live embed's measured height so the section
	   does not collapse while Pipedrive loads and expands its iframe. */
	.form-frame {
		--form-gutter: 1.25rem;
		max-width: calc(480px + 2 * var(--form-gutter));
		border-radius: var(--radius-panel);
		background: var(--color-surface);
		padding: clamp(1rem, 3vw, 2.5rem) var(--form-gutter);
	}
	.pipedriveWebForms { min-height: 1226px; }
	.pipedriveWebForms :global(iframe) { display: block; width: 100%; border: 0; }

	@media (min-width: 768px) {
		.form-frame { --form-gutter: 2.25rem; }
		.pipedriveWebForms { min-height: 1137px; }
	}
</style>
