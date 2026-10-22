<script lang="ts">
	import { enhance } from '$app/forms';
	import NavRows from '$lib/components/admin/NavRows.svelte';
	import { move } from '$lib/components/admin/fields';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Editable copies; the hidden inputs below carry them back on submit.
	// svelte-ignore state_referenced_locally
	let groups = $state(structuredClone(data.footer.groups));
	// svelte-ignore state_referenced_locally
	let legal = $state(structuredClone(data.footer.legal));
	// svelte-ignore state_referenced_locally
	let social = $state(structuredClone(data.footer.social));
	let saving = $state(false);
</script>

<svelte:head><title>Footer — Site settings</title></svelte:head>

<form
	method="POST"
	action="?/save"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			await update({ reset: false });
			saving = false;
		};
	}}
>
	<input type="hidden" name="footerId" value={data.footer.id} />
	<input type="hidden" name="footerGroups" value={JSON.stringify(groups)} />
	<input type="hidden" name="footerLegal" value={JSON.stringify(legal)} />
	<input type="hidden" name="footerSocial" value={JSON.stringify(social)} />

	<section class="card">
		<div class="card-head"><h2>Footer</h2></div>
		<div class="card-body">
			<label class="field">
				<span>Copyright line</span>
				<span class="hint">Shown after “© {new Date().getFullYear()}”.</span>
				<input name="copyright" type="text" value={data.footer.copyright} />
			</label>

			<div class="list-field">
				<header>
					<h3>Link columns <span class="hint">({groups.length})</span></h3>
					<button
						type="button"
						class="tiny"
						onclick={() => groups.push({ title: '', links: [], item: {} })}
					>
						Add column
					</button>
				</header>
				{#if groups.length === 0}
					<p class="hint" style="margin:0;font-size:13px">No link columns yet.</p>
				{:else}
					<div class="list-rows">
						{#each groups as group, i (group)}
							<div class="list-row">
								<header>
									<span>Column {i + 1}</span>
									<span>
										<button
											type="button"
											class="ghost tiny"
											title="Move up"
											aria-label="Move column {i + 1} up"
											disabled={i === 0}
											onclick={() => move(groups, i, -1)}>↑</button
										>
										<button
											type="button"
											class="ghost tiny"
											title="Move down"
											aria-label="Move column {i + 1} down"
											disabled={i === groups.length - 1}
											onclick={() => move(groups, i, 1)}>↓</button
										>
										<button
											type="button"
											class="danger tiny"
											aria-label="Remove column {i + 1}"
											onclick={() => groups.splice(i, 1)}
										>
											Remove
										</button>
									</span>
								</header>
								<div class="list-row-fields">
									<label class="field">
										<span>Column title</span>
										<input type="text" bind:value={group.title} placeholder="Company" />
									</label>
									<NavRows
										title="Links"
										rows={group.links}
										empty="No links in this column yet."
										sampleLabel="About"
										sampleHref="/about"
									/>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<NavRows
				title="Legal links"
				rows={legal}
				empty="No legal links yet."
				sampleLabel="Privacy Policy"
				sampleHref="/privacy-policy"
			/>

			<NavRows
				title="Social links"
				rows={social}
				empty="No social links yet. Only LinkedIn has an icon; other platforms are not shown."
				labelName="Platform"
				sampleLabel="LinkedIn"
				sampleHref="https://www.linkedin.com/company/…"
			/>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary" disabled={saving}>{saving ? 'Saving…' : 'Save footer'}</button>
	</div>
</form>
