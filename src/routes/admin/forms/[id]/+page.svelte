<script lang="ts">
	import { enhance } from '$app/forms';
	import { move } from '$lib/components/admin/fields';
	import { showToast } from '$lib/toast.svelte';
	import type { FormField, FormFieldType } from '$lib/forms';
	import type { ActionData, PageData } from './$types';

	type EditableField = Omit<FormField, 'options'> & { options: string[] };

	let { data, form }: { data: PageData; form: ActionData } = $props();

	$effect(() => {
		if (!form) return;
		if ('saved' in form) showToast('Form saved.', 'ok');
		else if ('error' in form) showToast(form.error);
	});
	const fieldTypes: { value: FormFieldType; label: string }[] = [
		{ value: 'text', label: 'Single-line text' },
		{ value: 'email', label: 'Email' },
		{ value: 'textarea', label: 'Multi-line text' },
		{ value: 'number', label: 'Number' },
		{ value: 'select', label: 'Single-select' },
		{ value: 'checkbox', label: 'Checkbox' }
	];
	const editable = (fields: FormField[]): EditableField[] =>
		fields.map((field) => ({ ...field, options: field.options ?? [] }));

	// svelte-ignore state_referenced_locally
	let fields = $state<EditableField[]>(editable(data.form.fields));
	// svelte-ignore state_referenced_locally
	let loadedId = $state(data.form.id);
	let saving = $state(false);
	let payload = $derived(JSON.stringify(fields));

	$effect(() => {
		if (data.form.id !== loadedId) {
			loadedId = data.form.id;
			fields = editable(data.form.fields);
		}
	});

	function addField() {
		fields.push({
			name: `field-${crypto.randomUUID()}`,
			label: '',
			type: 'text',
			required: false,
			options: []
		});
	}
</script>

<svelte:head><title>{data.form.name} — Content manager</title></svelte:head>

<div class="head">
	<div>
		<h1>{data.form.name}</h1>
		<p class="sub">Define what visitors complete and where notifications go.</p>
	</div>
	<div class="head-actions">
		<a class="btn" href="/admin/forms">All forms</a>
		<a class="btn" href="/admin/forms/{data.form.id}/submissions">View submissions</a>
	</div>
</div>


<form
	method="POST"
	action="?/save"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			await update();
			saving = false;
		};
	}}
>
	<input type="hidden" name="fields" value={payload} />

	<section class="card">
		<div class="card-head"><h2>Form details</h2></div>
		<div class="card-body">
			<label class="field">
				<span>Name</span>
				<input name="name" required value={data.form.name} />
			</label>
		</div>
	</section>

	<section class="card" style="margin-top:24px">
		<div class="card-head">
			<h2>Fields</h2>
			<button type="button" class="tiny" onclick={addField}>Add field</button>
		</div>
		<div class="card-body">
			{#if fields.length === 0}
				<div class="empty" style="padding:24px 8px">
					<h3>No fields yet</h3>
					<p>Add a field to start collecting visitor responses.</p>
				</div>
			{:else}
				<div class="list-rows">
					{#each fields as field, index (field.name)}
						<div class="list-row">
							<header>
								<strong>Field {index + 1}</strong>
								<span>
									<button type="button" class="ghost tiny" aria-label="Move field {index + 1} up" disabled={index === 0} onclick={() => move(fields, index, -1)}>↑</button>
									<button type="button" class="ghost tiny" aria-label="Move field {index + 1} down" disabled={index === fields.length - 1} onclick={() => move(fields, index, 1)}>↓</button>
									<button type="button" class="danger tiny" aria-label="Remove field {index + 1}" onclick={() => fields.splice(index, 1)}>Remove</button>
								</span>
							</header>
							<div class="list-row-fields">
								<label class="field">
									<span>Label</span>
									<input bind:value={field.label} required placeholder="Email address" />
								</label>
								<label class="field">
									<span>Type</span>
									<select bind:value={field.type}>
										{#each fieldTypes as type (type.value)}
											<option value={type.value}>{type.label}</option>
										{/each}
									</select>
								</label>
								<label class="check-field">
									<input type="checkbox" bind:checked={field.required} />
									<span>Required</span>
								</label>
								{#if field.type === 'select'}
									<label class="field" style="flex-basis:100%">
										<span>Options <span class="hint">— one per line</span></span>
										<textarea
											rows="4"
											value={field.options.join('\n')}
											oninput={(event) => {
												field.options = event.currentTarget.value.split('\n');
											}}
										></textarea>
									</label>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</section>

	<section class="card" style="margin-top:24px">
		<div class="card-head"><h2>Response settings</h2></div>
		<div class="card-body">
			<label class="field">
				<span>Default confirmation message</span>
				<textarea name="confirmation" rows="3">{data.form.confirmation}</textarea>
				<small class="hint">A page’s form section can override this message.</small>
			</label>
			<label class="field">
				<span>Notification recipients</span>
				<textarea name="recipients" rows="3" placeholder="editor@example.com">{data.recipients}</textarea>
				<small class="hint">Separate multiple email addresses with commas or new lines.</small>
			</label>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary" disabled={saving}>{saving ? 'Saving…' : 'Save form'}</button>
		<span class="hint">{fields.length} field{fields.length === 1 ? '' : 's'}</span>
	</div>
</form>

<style>
	.check-field {
		display: flex;
		align-items: center;
		gap: 8px;
		align-self: end;
		min-height: 42px;
	}

	.check-field input {
		width: auto;
	}
</style>
