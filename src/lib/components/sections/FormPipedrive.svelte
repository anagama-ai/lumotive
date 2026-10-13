<script lang="ts">
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
	// visitor came from, and any UTM campaign. The form itself lives inside
	// Pipedrive's iframe, so the parent page cannot inject fields into it; what
	// it can do is prefill them, which Pipedrive does from query parameters on
	// the form URL keyed by the field's own API key.
	//
	// Those three keys only exist once the hidden fields are added in Pipedrive,
	// and they are not ours to guess, so each is an editor field here. With none
	// set — which is the state until Lumotive supplies them — nothing is
	// appended and the embed is byte-identical to the one that ships today.
	const trackingKeys = (section: Section) => [
		{ key: String(section.inquiryField ?? '').trim(), kind: 'inquiry' as const },
		{ key: String(section.sourceField ?? '').trim(), kind: 'source' as const },
		{ key: String(section.campaignField ?? '').trim(), kind: 'campaign' as const }
	];

	const trackingValue = (kind: 'inquiry' | 'source' | 'campaign') => {
		const params = new URLSearchParams(window.location.search);
		if (kind === 'inquiry') return params.get('inquiry')?.trim() || 'general';
		if (kind === 'source') return document.referrer || '';
		return ['utm_source', 'utm_medium', 'utm_campaign']
			.map((name) => params.get(name)?.trim() || '')
			.filter(Boolean)
			.join(' · ');
	};

	let host = $state<HTMLDivElement | null>(null);

	// Pipedrive's loader reads the `data-pd-webforms` attribute of the element it
	// is mounted in and injects the form iframe there, sizing it over postMessage.
	// It has to be a real script element added after the container exists, so it
	// cannot be part of the markup or come through `{@html}`.
	$effect(() => {
		const container = host;
		const src = formUrl;
		if (!container || !src) return;

		const url = new URL(src);
		for (const { key, kind } of trackingKeys(section)) {
			if (!key) continue;
			const value = trackingValue(kind);
			if (value) url.searchParams.set(key, value);
		}
		container.dataset.pdWebforms = url.href;

		const script = document.createElement('script');
		script.src = LOADER;
		script.async = true;
		container.append(script);

		return () => {
			container.replaceChildren();
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
	/* Pipedrive's own embed caps its iframe at 768px and never fills a wider
	   host, so a full-shell column left the panel with a dead column of white
	   to the right of the fields. The cap sits on an inner column rather than
	   on `.lumo-inner`, so the section can still opt into the header container
	   and the heading and panel start on the same left edge as every other
	   section instead of floating in the middle of the page. */
	.form-column { max-width: var(--container-narrow); }

	/* Match the live embed's measured height so the section does not collapse
	   while Pipedrive loads and expands its iframe. */
	.form-frame { border-radius: var(--radius-panel); background: var(--color-surface); padding: clamp(1rem, 3vw, 2.5rem); }
	.pipedriveWebForms { min-height: 1226px; }
	.pipedriveWebForms :global(iframe) { display: block; width: 100%; border: 0; }

	@media (min-width: 768px) {
		.pipedriveWebForms { min-height: 1137px; }
	}
</style>
