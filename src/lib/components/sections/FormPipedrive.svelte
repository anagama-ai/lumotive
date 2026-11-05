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
			<div class="form-column" class:split={section.layout === 'split'} class:centered={section.layout === 'centered'}>
				{#if section.eyebrow || heading || section.intro}
					<Reveal>
						<div class="form-head mb-10">
							<!-- Deep Laser Blue: at the eyebrow's 12px the lighter blue
							     measures 4.15:1 on the page field, under the 4.5:1 floor. -->
							{#if section.eyebrow}<p class="text-eyebrow text-brand-blue-dark mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
							{#if heading}<h2 class="font-display text-statement text-ink mt-0">{heading}</h2>{/if}
							{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
						</div>

					</Reveal>
				{/if}
				<div class="form-frame" class:dark={section.formFrame === 'dark'}>
					<div bind:this={host} class="pipedriveWebForms" data-pd-webforms={formUrl}></div>
				</div>
						{#if offices.length}
							<!-- Phones: addresses follow the form. Split from 1024px: they sit
							     under the heading in the left column, the form on the right. -->
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
			</div>
		</div>
	</section>
{/if}

<style>
	/* Keep the heading readable while the form fills the section container. */
	.form-column { width: 100%; min-width: 0; }
	.form-head { max-width: var(--container-narrow); }
	.centered .form-head { margin-inline: auto; text-align: center; }
	.centered .form-frame { margin-inline: auto; }

	.offices { display: grid; gap: 1.5rem; margin: 2.5rem 0 0; padding: 0; list-style: none; }
	@media (min-width: 640px) { .offices { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
	.offices li { padding-top: 1.25rem; border-top: 1px solid var(--color-border); }
	.office-address { margin-top: .35rem; color: var(--color-text); font-size: var(--text-lead); line-height: 1.65; }
	.office-address :global(p) { margin: 0; }
	@media (min-width: 1024px) {
		.split {
			display: grid;
			grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
			grid-template-rows: auto 1fr;
			grid-template-areas: 'head form' 'offices form';
			column-gap: clamp(3rem, 5vw, 5rem);
			align-items: start;
		}
		.split > :global(:first-child) { grid-area: head; }
		.split .offices { grid-area: offices; grid-template-columns: minmax(0, 1fr); margin-top: 0; }
		.split .form-frame { grid-area: form; max-width: none; --form-zoom: 1.15; }
	}


	.form-frame {
		--form-gutter: 1.25rem;
		--form-zoom: 1;
		width: 100%;
		max-width: 760px;
		border-radius: var(--radius-panel);
		background: var(--color-surface);
		padding: clamp(1rem, 3vw, 2.5rem) var(--form-gutter);
	}
	/* `formFrame: dark`: a Lab Navy card for a Pipedrive form styled
	   light-on-dark (the CES meeting form), on an otherwise light section. */
	.form-frame.dark { background: var(--color-panel); }
	/* Zoom participates in layout, preserving the loader's inline auto-height. */
	.pipedriveWebForms { min-height: calc(1100px * var(--form-zoom)); }
	.pipedriveWebForms :global(iframe) {
		display: block;
		zoom: var(--form-zoom);
		width: 100%;
		max-width: none;
		border: 0;
	}

	@media (min-width: 768px) {
		.form-frame { --form-gutter: 2.25rem; --form-zoom: 1.15; }
	}
	@media (min-width: 1024px) {
		.form-frame { --form-zoom: 1.4; }
	}
</style>
