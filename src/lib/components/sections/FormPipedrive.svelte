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
	// Optional office list under the heading (/contact): eyebrow, city, and an
	// address in rich text, as the offices cards carried them.
	type Office = { eyebrow?: string; title?: string; body?: string };
	let offices = $derived(Array.isArray(section.offices) ? (section.offices as Office[]).filter((office) => office && (office.title || office.body)) : []);
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
			<div class="form-column" class:split={section.layout === 'split'}>
				{#if section.eyebrow || heading || section.intro}
					<Reveal class={section.layout === 'split' ? 'lg:sticky lg:top-28' : ''}>
						<div class="form-head mb-10">
							<!-- Deep Laser Blue: at the eyebrow's 12px the lighter blue
							     measures 4.15:1 on the page field, under the 4.5:1 floor. -->
							{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
							{#if heading}<h2 class="font-display text-statement text-ink">{heading}</h2>{/if}
							{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
						</div>
						{#if offices.length}
							<!-- Office list beside the form (/contact): label, city, and
							     address per office, in the same column as the heading. -->
							<ul class="offices">
								{#each offices as office, index (index)}
									<li>
										{#if office.eyebrow}<p class="text-eyebrow text-brand-blue-dark m-0 uppercase">{office.eyebrow}</p>{/if}
										{#if office.title}<p class="font-display text-subheading text-ink mt-1 mb-0">{office.title}</p>{/if}
										{#if office.body}<div class="office-address">{@html office.body}</div>{/if}
									</li>
								{/each}
							</ul>
						{/if}
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
	/* `layout: "split"` (/contact): from 1024px the heading block sits in the
	   left column, held in view while the long form scrolls, and the form
	   panel takes the right column. Phones and tablets keep the stack. */
	@media (min-width: 1024px) {
		.form-column.split { display: grid; max-width: none; grid-template-columns: minmax(0, 1fr) minmax(0, 42rem); align-items: start; gap: clamp(2.5rem, 6vw, 5rem); }
		.split .form-head { margin-bottom: 0; }
	}
	.offices { display: grid; gap: 1.5rem; margin: 0 0 2.5rem; padding: 0; list-style: none; }
	@media (min-width: 640px) { .offices { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	.offices li { padding-top: 1.25rem; border-top: 1px solid var(--color-border); }
	.office-address { margin-top: .35rem; color: var(--color-text); font-size: var(--text-spec); line-height: 1.5; }
	.office-address :global(p) { margin: 0; }
	@media (min-width: 1024px) {
		.split .form-head + .offices { margin: 2.5rem 0 0; }
	}

	/* Panel widened to 42rem per annotation request. Pipedrive still renders
	   its fields at most 480px wide and centres them inside its iframe, so
	   the extra panel width is breathing room around the form. Side padding
	   is the gutter: 20px on phones, 36px from 768px.
	   The min-height matches the live embed's measured height so the section
	   does not collapse while Pipedrive loads and expands its iframe. */
	.form-frame {
		--form-gutter: 1.25rem;
		max-width: 42rem;
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
