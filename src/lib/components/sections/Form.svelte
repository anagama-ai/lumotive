<script lang="ts">
	import type { FormSubmissionResult, PublicForms } from '$lib/forms';
	import type { Section } from '$lib/sections';

	let {
		section,
		forms = {},
		result = null
	}: { section: Section; forms?: PublicForms; result?: FormSubmissionResult | null } = $props();

	let definition = $derived(forms[String(section.formId ?? '')]);
	let response = $derived(result?.sectionId === String(section.id) ? result : null);
	const value = (name: string) => response?.values?.[name];
</script>

{#if definition}
	<section class="section form-section">
		<div class="container narrow">
			{#if section.heading}<h2>{String(section.heading)}</h2>{/if}
			{#if section.body}<p class="intro">{String(section.body)}</p>{/if}

			{#if response?.success}
				<p class="confirmation" role="status">{response.confirmation}</p>
			{:else}
				{#if response?.error}
					<p class="form-error" role="alert">{response.error}</p>
				{/if}
				<form method="POST" action="?/submitForm">
					<input type="hidden" name="sectionId" value={section.id} />
					{#each definition.fields as field (field.name)}
						{#if field.type === 'checkbox'}
							<div class="checkbox-wrap">
								<label class="checkbox-field">
									<input
										type="checkbox"
										name="field:{field.name}"
										value="true"
										required={field.required}
										checked={value(field.name) === true}
										aria-invalid={response?.fieldErrors?.[field.name] ? 'true' : undefined}
										aria-describedby={response?.fieldErrors?.[field.name] ? `error-${section.id}-${field.name}` : undefined}
									/>
									<span>{field.label}{field.required ? ' *' : ''}</span>
								</label>
								{#if response?.fieldErrors?.[field.name]}
									<small class="field-error" id="error-{section.id}-{field.name}">{response.fieldErrors[field.name]}</small>
								{/if}
							</div>
						{:else}
							<label class="form-field">
								<span>{field.label}{field.required ? ' *' : ''}</span>
								{#if field.type === 'textarea'}
									<textarea
										name="field:{field.name}"
										rows="5"
										required={field.required}
										aria-invalid={response?.fieldErrors?.[field.name] ? 'true' : undefined}
										aria-describedby={response?.fieldErrors?.[field.name] ? `error-${section.id}-${field.name}` : undefined}
									>{value(field.name) ?? ''}</textarea>
								{:else if field.type === 'select'}
									<select
										name="field:{field.name}"
										required={field.required}
										aria-invalid={response?.fieldErrors?.[field.name] ? 'true' : undefined}
										aria-describedby={response?.fieldErrors?.[field.name] ? `error-${section.id}-${field.name}` : undefined}
									>
										<option value="">Choose an option</option>
										{#each field.options ?? [] as option (option)}
											<option value={option} selected={value(field.name) === option}>{option}</option>
										{/each}
									</select>
								{:else}
									<input
										type={field.type}
										name="field:{field.name}"
										required={field.required}
										value={value(field.name) ?? ''}
										aria-invalid={response?.fieldErrors?.[field.name] ? 'true' : undefined}
										aria-describedby={response?.fieldErrors?.[field.name] ? `error-${section.id}-${field.name}` : undefined}
									/>
								{/if}
								{#if response?.fieldErrors?.[field.name]}
									<small class="field-error" id="error-{section.id}-{field.name}">{response.fieldErrors[field.name]}</small>
								{/if}
							</label>
						{/if}
					{/each}
					<button class="button" type="submit">Submit</button>
				</form>
			{/if}
		</div>
	</section>
{/if}

<style>
	.form-section {
		background: #f7f8f4;
	}

	.intro {
		max-width: 60ch;
		margin: -1rem 0 2rem;
		color: var(--muted);
		font-size: 1.08rem;
		line-height: 1.65;
	}

	form {
		display: grid;
		gap: 1.25rem;
	}

	.form-field {
		display: grid;
		gap: 0.45rem;
		font-weight: 650;
	}

	input,
	textarea,
	select {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid #b8c3bd;
		border-radius: 8px;
		padding: 0.8rem 0.9rem;
		background: white;
		color: inherit;
		font: inherit;
	}

	textarea {
		resize: vertical;
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: 3px solid rgb(20 110 99 / 20%);
		border-color: var(--brand);
	}

	.checkbox-wrap {
		display: grid;
		gap: 0.45rem;
	}

	.checkbox-field {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		font-weight: 650;
	}

	.checkbox-field input {
		width: 1.1rem;
		height: 1.1rem;
		margin-top: 0.15rem;
	}

	.button {
		justify-self: start;
		border: 0;
		cursor: pointer;
	}

	.form-error,
	.field-error {
		color: #9d241e;
	}

	.form-error,
	.confirmation {
		border-radius: 8px;
		padding: 1rem;
	}

	.form-error {
		background: #fff0ee;
	}

	.confirmation {
		background: #e7f5ed;
		color: #175b38;
		font-weight: 650;
	}
</style>
