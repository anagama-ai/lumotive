<script lang="ts">
	import { mediaValue, type FieldSpec, type MediaValue } from '$lib/sections';
	import { fill, move } from './fields';
	import FormPicker from './FormPicker.svelte';
	import MediaPicker from './MediaPicker.svelte';
	import RichText from './RichText.svelte';
	import SectionField from './SectionField.svelte';

	let {
		spec,
		record,
		onRecordChange,
		forms = []
	}: {
		spec: FieldSpec;
		record: Record<string, any>;
		onRecordChange: (record: Record<string, any>) => void;
		forms?: { id: string; name: string }[];
	} = $props();

	// Narrow in the script so the template can reach `.fields` safely.
	let listSpec = $derived(spec.type === 'list' ? spec : null);
	let rows = $derived<Record<string, any>[]>(
		Array.isArray(record[spec.name]) ? record[spec.name] : []
	);
	const stringValue = (): string =>
		typeof record[spec.name] === 'string' ? record[spec.name] : '';
	const mediaFieldValue = (): MediaValue | string => mediaValue(record[spec.name]) ?? '';
	const formValue = (): string | undefined =>
		typeof record[spec.name] === 'string' ? record[spec.name] : undefined;
	const setValue = (nextValue: unknown) => {
		const nextRecord = { ...record, [spec.name]: nextValue };
		record[spec.name] = nextValue;
		onRecordChange(nextRecord);
	};
	const setRow = (i: number, row: Record<string, any>) => {
		const next = [...rows];
		next[i] = row;
		setValue(next);
	};
	const moveRow = (i: number, dir: -1 | 1) => {
		const next = [...rows];
		move(next, i, dir);
		setValue(next);
	};

	const singular = (label: string) =>
		label.toLowerCase().replace(/ies$/, 'y').replace(/s$/, '') || 'item';
</script>

{#if listSpec}
	<div class="list-field">
		<header>
			<h3>{listSpec.label} <span class="hint">({rows.length})</span></h3>
			<button type="button" class="tiny" onclick={() => setValue([...rows, fill(listSpec.fields)])}>
				Add {singular(listSpec.label)}
			</button>
		</header>

		{#if rows.length === 0}
			<p class="hint" style="margin:0;font-size:13px">
				Nothing here yet — use “Add {singular(listSpec.label)}”.
			</p>
		{:else}
			<div class="list-rows">
				{#each rows as row, i}
					<div class="list-row">
						<header>
							<span>{singular(listSpec.label)} {i + 1}</span>
							<span>
								<button
									type="button"
									class="ghost tiny"
									title="Move up"
									aria-label="Move {singular(listSpec.label)} {i + 1} up"
									disabled={i === 0}
									onclick={() => moveRow(i, -1)}>↑</button
								>
								<button
									type="button"
									class="ghost tiny"
									title="Move down"
									aria-label="Move {singular(listSpec.label)} {i + 1} down"
									disabled={i === rows.length - 1}
									onclick={() => moveRow(i, 1)}>↓</button
								>
								<button
									type="button"
									class="danger tiny"
									aria-label="Remove {singular(listSpec.label)} {i + 1}"
									onclick={() =>
										setValue(
											rows.filter(
												(_row: Record<string, any>, index: number) => index !== i
											)
										)}
								>
									Remove
								</button>
							</span>
						</header>

						<div class="list-row-fields">
							{#each listSpec.fields as sub (sub.name)}
								<SectionField spec={sub} record={row} onRecordChange={(row) => setRow(i, row)} {forms} />
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{:else if spec.type === 'textarea'}
	<label class="field">
		<span>{spec.label}</span>
		<textarea bind:value={stringValue, setValue} rows="3"></textarea>
	</label>
{:else if spec.type === 'richtext'}
	<div class="field">
		<span>{spec.label}</span>
		<RichText bind:value={stringValue, setValue} />
	</div>
{:else if spec.type === 'url'}
	<label class="field">
		<span>{spec.label}</span>
		<input type="text" inputmode="url" bind:value={stringValue, setValue} placeholder="/about or https://example.com/page" />
	</label>
{:else if spec.type === 'media'}
	<div class="field">
		<span>{spec.label}</span>
		<MediaPicker bind:value={mediaFieldValue, setValue} />
	</div>
{:else if spec.type === 'form'}
	<div class="field">
		<span>{spec.label}</span>
		<FormPicker bind:value={formValue, setValue} {forms} />
	</div>
{:else}
	<label class="field">
		<span>{spec.label}</span>
		<input type="text" bind:value={stringValue, setValue} />
	</label>
{/if}
