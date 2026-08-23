<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import '../../app.css';
	import 'lenis/dist/lenis.css';
	import Footer from '$lib/components/site/Footer.svelte';
	import Header from '$lib/components/site/Header.svelte';
	import { initSmoothScroll } from '$lib/motion';
	import type { Section } from '$lib/sections';

	type PreviewState = {
		path: string;
		page: Record<string, unknown> & { sections: Section[] };
	};

	let { data, children } = $props();
	let preview = $state<PreviewState | null>(null);

	setContext('page-preview', {
		get value() {
			return preview;
		}
	});

	$effect(() => {
		const teardown = initSmoothScroll();
		return teardown;
	});

	onMount(() => {
		if (!data.editor || window.parent === window) return;

		const receive = (event: MessageEvent) => {
			const message = event.data;
			if (
				event.origin !== window.location.origin ||
				event.source !== window.parent ||
				message?.type !== 'page-preview' ||
				message.path !== window.location.pathname ||
				!message.page ||
				!Array.isArray(message.page.sections)
			) {
				return;
			}
			preview = { path: message.path, page: message.page };
		};

		window.addEventListener('message', receive);
		return () => window.removeEventListener('message', receive);
	});
</script>

<svelte:head>
	{@html data.codeInjection.head ?? ''}
</svelte:head>

{@html data.codeInjection.bodyStart ?? ''}

<Header data={data.header} />
<main>{@render children()}</main>
<Footer data={data.footer} injectedHtml={data.codeInjection.footer ?? ''} />
{@html data.codeInjection.bodyEnd ?? ''}
