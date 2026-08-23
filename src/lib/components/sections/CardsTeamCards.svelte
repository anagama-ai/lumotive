<script lang="ts">
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';
	import Reveal from '$lib/components/lumotive/Reveal.svelte';

	type Member = { name?: string; title?: string; headshot?: unknown; headshotAlt?: string; biography?: string };
	let { section, media }: { section: Section; media: MediaMap } = $props();
	let cards = $derived(Array.isArray(section.cards) ? (section.cards as Member[]) : []);

	function unlock() {
		document.documentElement.style.overflow = '';
	}

	function openBio(event: MouseEvent) {
		const trigger = event.currentTarget as HTMLButtonElement;
		const dialog = trigger.closest('article')?.querySelector('dialog');
		if (!dialog) return;
		dialog.showModal();
		document.documentElement.style.overflow = 'hidden';
		dialog.querySelector<HTMLButtonElement>('[data-close]')?.focus();
	}

	function closeBio(event: MouseEvent) {
		const dialog = (event.currentTarget as Element).closest('dialog');
		if (!dialog) return;
		dialog.close();
		unlock();
		dialog.closest('article')?.querySelector<HTMLButtonElement>('[data-bio-trigger]')?.focus();
	}

	function dismissBackdrop(event: MouseEvent) {
		if (event.target === event.currentTarget) closeBio(event);
	}
</script>

<section class="lumo-section" id={section.anchor ? String(section.anchor) : undefined} data-background={String(section.background ?? 'none')} data-width={String(section.width ?? 'contained')} data-spacing-top={String(section.spacingTop ?? 'md')} data-spacing-bottom={String(section.spacingBottom ?? 'md')}>
	<div class="lumo-inner">
		{#if section.eyebrow || section.heading || section.intro}
			<Reveal><div class="mb-12 max-w-4xl">
				{#if section.eyebrow}<p class="text-eyebrow text-brand-blue mb-4 uppercase">{String(section.eyebrow)}</p>{/if}
				{#if section.heading}<h2 class="font-display text-statement text-ink">{titleCase(String(section.heading))}</h2>{/if}
				{#if section.intro}<p class="text-lead mt-4">{String(section.intro)}</p>{/if}
			</div></Reveal>
		{/if}

		<Reveal><div class={`grid gap-6 sm:grid-cols-2 ${String(section.anchor ?? '') === 'board' ? 'md:grid-cols-3 lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
			{#each cards as member, index (member.name || index)}
				{@const image = resolveMedia(member.headshot, media, 768)}
				<article class="flex flex-col">
					{#if image}<div class="rounded-card bg-surface relative aspect-4/5 overflow-hidden"><img class="absolute inset-0 size-full object-cover" src={image.src} srcset={image.srcset} alt={member.headshotAlt || image.alt} width={image.width} height={image.height} loading="lazy" /></div>{/if}
					<h3 class="font-display text-subheading text-ink mt-6">{member.name ?? ''}</h3>
					<p class="text-eyebrow text-brand-blue mt-2 uppercase">{member.title ?? ''}</p>
					{#if member.biography}
						<button data-bio-trigger type="button" onclick={openBio} class="group text-brand-blue hover:text-brand-blue-dark mt-4 inline-flex items-center gap-2 self-start font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none">Learn more<span class="sr-only"> about {member.name ?? 'this team member'}</span><svg aria-hidden="true" viewBox="0 0 16 16" class="size-4" fill="none"><path d="m6 3 5 5-5 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" /></svg></button>
						<dialog aria-label={`${member.name ?? 'Team member'} biography`} aria-modal="true" data-lenis-prevent onclick={dismissBackdrop} oncancel={unlock} onclose={unlock} class="bg-ink/70 fixed inset-0 m-0 hidden h-full max-h-none w-full max-w-none items-center justify-center p-4 backdrop:bg-transparent open:flex sm:p-6">
							<div class="rounded-card bg-surface shadow-card max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6 text-left sm:p-10">
								<div class="flex items-start justify-between gap-6"><div class="min-w-0"><h2 class="font-display text-heading text-ink">{member.name ?? ''}</h2>{#if member.title}<p class="text-eyebrow text-brand-blue mt-2 uppercase">{member.title}</p>{/if}</div><button data-close type="button" onclick={closeBio} class="text-muted hover:text-ink rounded-button -mt-2 -mr-2 shrink-0 p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"><svg aria-hidden="true" viewBox="0 0 24 24" class="size-5" fill="none"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" /></svg><span class="sr-only">Close</span></button></div>
								<div class="mt-6">{@html member.biography}</div>
							</div>
						</dialog>
					{/if}
				</article>
			{/each}
		</div></Reveal>
	</div>
</section>
