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

			<ol class="mt-14 space-y-10" aria-label={section.heading ? String(section.heading) : 'Timeline'}>
				{#each stages as stage, stageIndex (stageIndex)}
					{@const stageImage = resolveMedia(stage.row.media, media, 320)}
					<li class="grid gap-4 lg:grid-cols-[8rem_minmax(0,1fr)] lg:gap-8">
						<Reveal>
							<header class="flex items-center gap-4 lg:block lg:pt-8">
								{#if stageImage}<img class="mb-3 size-10 object-contain" src={stageImage.src} srcset={stageImage.srcset} sizes="40px" alt={stageImage.alt} width={stageImage.width ?? 80} height={stageImage.height ?? 80} />{/if}
								<p class="text-3xl leading-none text-brand-blue">{String(stageIndex + 1).padStart(2, '0')}</p>
								<h3 class="text-eyebrow uppercase text-ink lg:mt-3">{String(stage.row.title ?? '')}</h3>
								{#if body(stage.row)}<div class="prose mt-3 text-sm">{@html body(stage.row)}</div>{/if}
							</header>
						</Reveal>

						<div>
							{#if stage.groups.length}
								<ol class="grid gap-6 lg:grid-cols-2" aria-label={`${String(stage.row.title ?? 'Stage')} groups`}>
									{#each stage.groups as group, groupIndex (groupIndex)}
										{@const groupImage = resolveMedia(group.row.media, media, 320)}
										<li class={`rounded-panel p-8 ${groupIndex % 2 === 0 ? 'bg-brand-blue/6' : 'bg-brand-green/6'}`}>
											<article>
												<header class="flex items-start gap-4">
													{#if groupImage}<img class="size-12 shrink-0 rounded-full bg-surface p-3 object-contain" src={groupImage.src} srcset={groupImage.srcset} sizes="48px" alt={groupImage.alt} width={groupImage.width ?? 96} height={groupImage.height ?? 96} />{/if}
													<div>
														<h4 class="text-subheading text-ink">{rowHeading(group.row)}</h4>
														{#if body(group.row)}<div class="prose mt-2 text-base">{@html body(group.row)}</div>{/if}
													</div>
												</header>
												{#if group.items.length}
													<ol class="mt-8 grid gap-6 sm:grid-cols-3" aria-label={`${String(group.row.title ?? 'Group')} items`}>
									{#each group.items as item, itemIndex (itemIndex)}
															{@const itemImage = resolveMedia(item.media, media, 640)}
															<li>
																{#if itemImage}<img class="mb-5 aspect-4/3 w-full rounded-panel bg-surface object-contain" src={itemImage.src} srcset={itemImage.srcset} sizes="(min-width: 640px) 30vw, 100vw" alt={itemImage.alt} width={itemImage.width ?? 640} height={itemImage.height ?? 480} />{/if}
																<h5 class="text-base text-ink">{rowHeading(item)}</h5>
																{#if body(item)}<div class="prose mt-2 text-sm">{@html body(item)}</div>{/if}
															</li>
														{/each}
													</ol>
												{/if}
											</article>
										</li>
									{/each}
								</ol>
							{:else if stage.items.length}
								<ol class:bg-panel={stageIndex % 3 === 1} class:text-white={stageIndex % 3 === 1} class:bg-surface={stageIndex % 3 !== 1} class="grid gap-8 rounded-panel p-8 md:grid-cols-2 md:gap-10" aria-label={`${String(stage.row.title ?? 'Stage')} items`}>
									{#each stage.items as item, itemIndex (itemIndex)}
										{@const itemImage = resolveMedia(item.media, media, 768)}
										<li class={`flex items-start gap-5 ${itemIndex > 0 ? 'border-l border-current/20 pl-10' : ''}`}>
											{#if itemImage}<img class="size-16 shrink-0 object-contain" src={itemImage.src} srcset={itemImage.srcset} sizes="64px" alt={itemImage.alt} width={itemImage.width ?? 128} height={itemImage.height ?? 128} />{/if}
											<div>
												<h4 class="text-subheading">{rowHeading(item)}</h4>
												{#if body(item)}<div class="prose mt-3 text-base">{@html body(item)}</div>{/if}
											</div>
										</li>
									{/each}
								</ol>
							{/if}
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</section>
{/if}
