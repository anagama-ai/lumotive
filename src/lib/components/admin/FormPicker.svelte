<script lang="ts">
	type FormChoice = { id: string; name: string };

	let {
		value = $bindable(),
		forms = []
	}: {
		value?: string;
		forms?: FormChoice[];
	} = $props();
</script>

<select bind:value>
	<option value="">Select a form</option>
	{#each forms as form (form.id)}
		<option value={form.id}>{form.name}</option>
	{/each}
</select>
