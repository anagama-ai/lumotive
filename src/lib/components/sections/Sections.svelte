<script lang="ts">
	import type { FormSubmissionResult, PublicForms } from '$lib/forms';
	import type { MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import Cards from './Cards.svelte';
	import Cta from './Cta.svelte';
	import Form from './Form.svelte';
	import Hero from './Hero.svelte';
	import Prose from './Prose.svelte';

	let {
		sections = [],
		media = {},
		forms = {},
		result = null
	}: {
		sections?: Section[];
		media?: MediaMap;
		forms?: PublicForms;
		result?: FormSubmissionResult | null;
	} = $props();
</script>

{#each sections as section (section.id)}
	{#if section.type === 'hero'}
		<Hero {section} {media} />
	{:else if section.type === 'prose'}
		<Prose {section} />
	{:else if section.type === 'cards'}
		<Cards {section} />
	{:else if section.type === 'cta'}
		<Cta {section} />
	{:else if section.type === 'form'}
		<Form {section} {forms} {result} />
	{/if}
{/each}
