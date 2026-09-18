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

	let host = $state<HTMLDivElement | null>(null);

	// Pipedrive's loader reads the `data-pd-webforms` attribute of the element it
	// is mounted in and injects the form iframe there, sizing it over postMessage.
	// It has to be a real script element added after the container exists, so it
	// cannot be part of the markup or come through `{@html}`.
	$effect(() => {
		const container = host;
		const src = formUrl;
		if (!container || !src) return;

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
	>
		<div class="lumo-inner">
			{#if section.eyebrow || heading || section.intro}
				<Reveal>
					<div class="mb-10 max-w-3xl">
						{#if section.eyebrow}<p class="text-eyebrow text-brand-blue mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
						{#if heading}<h2 class="font-display text-statement text-ink">{heading}</h2>{/if}
						{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
					</div>
				</Reveal>
			{/if}
			<div class="form-frame">
				<div bind:this={host} class="pipedriveWebForms" data-pd-webforms={formUrl}></div>
			</div>
		</div>
	</section>
{/if}

<style>
	/* The embed reports its own height to the loader, so the frame only supplies
	   the surface it sits on and never a fixed height of its own. */
	.form-frame { border-radius: var(--radius-panel); background: var(--color-surface); padding: clamp(1rem, 3vw, 2.5rem); }
	.pipedriveWebForms :global(iframe) { display: block; width: 100%; border: 0; }
</style>
