<script lang="ts">
	import Reveal from '$lib/components/lumotive/Reveal.svelte';
	import { resolveMedia, type MediaMap } from '$lib/media';
	import type { Section } from '$lib/sections';
	import { titleCase } from '$lib/titlecase';

	type Row = { level?: unknown; title?: unknown; body?: unknown; media?: unknown };
	type Group = { row: Row; items: Row[] };
	type Stage = { row: Row; items: Row[]; groups: Group[] };

	let { section, media }: { section: Section; media: MediaMap } = $props();
	let rows = $derived((Array.isArray(section.rows) ? section.rows : []) as Row[]);
	let heading = $derived(titleCase(typeof section.heading === 'string' ? section.heading : null));
	let stages = $derived.by(() => {
		const result: Stage[] = [];
		for (const row of rows) {
			if (row.level === 'stage') {
				result.push({ row, items: [], groups: [] });
				continue;
			}
			const stage = result.at(-1);
			if (!stage) continue;
			if (row.level === 'group') stage.groups.push({ row, items: [] });
			else (stage.groups.at(-1)?.items ?? stage.items).push(row);
		}
		return result;
	});

	const body = (row: Row) => (typeof row.body === 'string' ? row.body : '');
	const rowHeading = (row: Row) => titleCase(typeof row.title === 'string' ? row.title : null);
	const panels = ['bg-primary text-white', 'bg-panel text-white/75', 'bg-surface'];
	const enumValue = (value: unknown, values: string[], fallback: string) => {
		const candidate = String(value ?? '');
		return values.includes(candidate) ? candidate : fallback;
	};
</script>

{#if stages.length}
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
			<Reveal>
				<div class="max-w-4xl">
					<span aria-hidden="true" class="mb-8 block h-1 w-10 rounded-full bg-brand-blue"></span>
					{#if heading}<h2 class="text-statement text-ink">{heading}</h2>{/if}
					{#if section.intro}<p class="text-lead mt-6 max-w-2xl">{String(section.intro)}</p>{/if}
				</div>
			</Reveal>

			<div class="mt-14 grid gap-4 lg:grid-cols-[8rem_minmax(0,1fr)] lg:gap-8">
				{#each stages as stage, stageIndex (stageIndex)}
					<Reveal class="flex items-baseline gap-4 lg:block lg:pt-8">
						<p class="text-3xl leading-none text-brand-blue">{String(stageIndex + 1).padStart(2, '0')}</p>
						<p class="text-eyebrow uppercase text-ink lg:mt-3">{String(stage.row.title ?? '')}</p>
					</Reveal>

					<Reveal class="pb-4 lg:pb-8">
						{#if stage.groups.length}
							<ol class="grid gap-6 lg:grid-cols-2" aria-label={`${String(stage.row.title ?? 'Stage')} groups`}>
								{#each stage.groups as group, groupIndex (groupIndex)}
									{@const groupImage = resolveMedia(group.row.media, media, 320)}
									<li class={`rounded-panel p-8 ${groupIndex % 2 === 0 ? 'bg-brand-blue/6' : 'bg-brand-green/6'}`}>
										<article>
											<header class="flex items-start gap-4">
												{#if groupImage}<img class="size-12 shrink-0 rounded-full bg-surface p-3 object-contain" src={groupImage.src} srcset={groupImage.srcset} sizes="48px" alt={groupImage.alt} width={groupImage.width ?? 96} height={groupImage.height ?? 96} />{/if}
												<div>
													<h3 class="text-subheading text-ink">{rowHeading(group.row)}</h3>
													{#if body(group.row)}<div class="prose mt-2 text-base">{@html body(group.row)}</div>{/if}
												</div>
											</header>
											{#if group.items.length}
												<ol class={`mt-8 grid gap-6 ${group.items.length > 1 ? 'sm:grid-cols-3 sm:text-center' : ''}`} aria-label={`${String(group.row.title ?? 'Group')} items`}>
													{#each group.items as item, itemIndex (itemIndex)}
														{@const itemImage = resolveMedia(item.media, media, 640)}
														<li>
															{#if itemImage}<img class="mb-5 aspect-4/3 w-full rounded-panel bg-surface object-contain" src={itemImage.src} srcset={itemImage.srcset} sizes="(min-width: 640px) 30vw, 100vw" alt={itemImage.alt} width={itemImage.width ?? 640} height={itemImage.height ?? 480} />{/if}
															<h4 class="text-base text-ink">{rowHeading(item)}</h4>
															{#if body(item)}<div class="prose mt-2 text-sm">{@html body(item)}</div>{/if}
														</li>
													{/each}
												</ol>
											{/if}
										</article>
									</li>
								{/each}
							</ol>
						{:else if stage.items.length === 1}
							{@const item = stage.items[0]}
							{@const itemImage = resolveMedia(item.media, media, 768)}
							<article class={`rounded-panel grid items-center gap-8 p-8 md:grid-cols-2 md:gap-10 ${panels[stageIndex % panels.length]}`}>
								{#if itemImage}
									<div class="rounded-panel relative block aspect-4/3 overflow-hidden">
										<img class="absolute inset-0 size-full object-cover" src={itemImage.src} srcset={itemImage.srcset} sizes="(min-width: 768px) 50vw, 100vw" alt={itemImage.alt} width={itemImage.width ?? 768} height={itemImage.height ?? 576} />
									</div>
								{/if}
								<div>
									<h3 class="text-subheading">{rowHeading(item)}</h3>
									{#if body(item)}<div class="prose mt-3 text-base">{@html body(item)}</div>{/if}
								</div>
							</article>
						{:else if stage.items.length}
							<ol class={`rounded-panel grid gap-8 p-8 md:grid-cols-2 md:gap-10 ${panels[stageIndex % panels.length]}`} aria-label={`${String(stage.row.title ?? 'Stage')} items`}>
								{#each stage.items as item, itemIndex (itemIndex)}
									{@const itemImage = resolveMedia(item.media, media, 320)}
									<li class={`flex items-start gap-5 ${itemIndex > 0 ? 'md:border-l md:border-current/20 md:pl-10' : ''}`}>
										{#if itemImage}<img class="size-10 shrink-0 object-contain" src={itemImage.src} srcset={itemImage.srcset} sizes="40px" alt={itemImage.alt} width={itemImage.width ?? 80} height={itemImage.height ?? 80} />{/if}
										<div>
											<h3 class="text-subheading">{rowHeading(item)}</h3>
											{#if body(item)}<div class="prose mt-3 text-base">{@html body(item)}</div>{/if}
										</div>
									</li>
								{/each}
							</ol>
						{/if}

						{#if stageIndex < stages.length - 1}
							<svg width="20" height="30" viewBox="0 0 20 30" fill="none" aria-hidden="true" class="text-muted mx-auto mt-4 -mb-4 lg:mt-8 lg:-mb-8">
								<path d="M10 3v22m0 0-6-6m6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						{/if}
					</Reveal>
				{/each}
			</div>
		</div>
	</section>
{/if}
