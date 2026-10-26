<script lang="ts">
	import { move } from './fields';

	let {
		title,
		rows,
		empty,
		sampleLabel,
		sampleHref,
		labelName = 'Label',
		hrefName = 'Address'
	}: {
		title: string;
		rows: { label: string; href: string }[];
		empty: string;
		sampleLabel: string;
		sampleHref: string;
		labelName?: string;
		hrefName?: string;
	} = $props();
</script>

<div class="list-field">
	<header>
		<h3>{title} <span class="hint">({rows.length})</span></h3>
		<button type="button" class="tiny" onclick={() => rows.push({ label: '', href: '' })}>
			Add link
		</button>
	</header>

	{#if rows.length === 0}
		<p class="hint" style="margin:0;font-size:13px">{empty}</p>
	{:else}
		<div class="list-rows">
			{#each rows as item, i}
				<div class="list-row">
					<header>
						<span>Link {i + 1}</span>
						<span>
							<button
								type="button"
								class="ghost tiny"
								title="Move up"
								aria-label="Move link {i + 1} up"
								disabled={i === 0}
								onclick={() => move(rows, i, -1)}>↑</button
							>
							<button
								type="button"
								class="ghost tiny"
								title="Move down"
								aria-label="Move link {i + 1} down"
								disabled={i === rows.length - 1}
								onclick={() => move(rows, i, 1)}>↓</button
							>
							<button
								type="button"
								class="danger tiny"
								aria-label="Remove link {i + 1}"
								onclick={() => rows.splice(i, 1)}
							>
								Remove
							</button>
						</span>
					</header>

					<div class="row">
						<label class="field">
							<span>{labelName}</span>
							<input type="text" bind:value={item.label} placeholder={sampleLabel} />
						</label>
						<label class="field">
							<span>{hrefName}</span>
							<input type="text" bind:value={item.href} placeholder={sampleHref} />
						</label>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
