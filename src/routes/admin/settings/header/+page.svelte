<script lang="ts">
	import { enhance } from '$app/forms';
	import NavRows from '$lib/components/admin/NavRows.svelte';
	import { move } from '$lib/components/admin/fields';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Editable copies; the hidden inputs below carry them back on submit.
	// svelte-ignore state_referenced_locally
	let items = $state(structuredClone(data.header.items));
	// svelte-ignore state_referenced_locally
	let buttons = $state(structuredClone(data.header.buttons));
	// svelte-ignore state_referenced_locally
	let banner = $state(structuredClone(data.header.banner));
	let saving = $state(false);
</script>

{#snippet rowTools(rows: unknown[], i: number, name: string)}
	<span>
		<button
			type="button"
			class="ghost tiny"
			title="Move up"
			aria-label="Move {name} up"
			disabled={i === 0}
			onclick={() => move(rows, i, -1)}>↑</button
		>
		<button
			type="button"
			class="ghost tiny"
			title="Move down"
			aria-label="Move {name} down"
			disabled={i === rows.length - 1}
			onclick={() => move(rows, i, 1)}>↓</button
		>
		<button type="button" class="danger tiny" aria-label="Remove {name}" onclick={() => rows.splice(i, 1)}>
			Remove
		</button>
	</span>
{/snippet}

<svelte:head><title>Header — Site settings</title></svelte:head>

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
	<input type="hidden" name="headerId" value={data.header.id} />
	<input type="hidden" name="headerItems" value={JSON.stringify(items)} />
	<input type="hidden" name="headerButtons" value={JSON.stringify(buttons)} />
	<input type="hidden" name="headerBanner" value={JSON.stringify(banner)} />

	<section class="card">
		<div class="card-head"><h2>Header</h2></div>
		<div class="card-body">
			<div class="list-field">
				<header>
					<h3>Menu <span class="hint">({items.length})</span></h3>
					<button
						type="button"
						class="tiny"
						onclick={() => items.push({ kind: 'link', label: '', href: '', item: {}, children: [] })}
					>
						Add menu item
					</button>
				</header>
				{#if items.length === 0}
					<p class="hint" style="margin:0;font-size:13px">No menu items yet. Addresses look like /about.</p>
				{:else}
					<div class="list-rows">
						{#each items as entry, i (entry)}
							<div class="list-row">
								<header>
									<span>Menu item {i + 1}</span>
									{@render rowTools(items, i, `menu item ${i + 1}`)}
								</header>
								<div class="list-row-fields">
									<div class="row">
										<label class="field">
											<span>Type</span>
											<select bind:value={entry.kind}>
												<option value="link">Single link</option>
												<option value="sub">Dropdown</option>
											</select>
										</label>
										<label class="field">
											<span>Label</span>
											<input type="text" bind:value={entry.label} placeholder="Company" />
										</label>
										<label class="field">
											<span>Address</span>
											<input type="text" bind:value={entry.href} placeholder="/about" />
										</label>
									</div>

									{#if entry.kind === 'sub'}
										<div class="list-field">
											<header>
												<h3>Dropdown links <span class="hint">({entry.children.length})</span></h3>
												<button
													type="button"
													class="tiny"
													onclick={() =>
														entry.children.push({ label: '', href: '', item: {}, description: '', children: [] })}
												>
													Add link
												</button>
											</header>
											{#if entry.children.length === 0}
												<p class="hint" style="margin:0;font-size:13px">No dropdown links yet.</p>
											{:else}
												<div class="list-rows">
													{#each entry.children as sub, j (sub)}
														<div class="list-row">
															<header>
																<span>Link {j + 1}</span>
																{@render rowTools(entry.children, j, `link ${j + 1}`)}
															</header>
															<div class="list-row-fields">
																<div class="row">
																	<label class="field">
																		<span>Label</span>
																		<input type="text" bind:value={sub.label} placeholder="About" />
																	</label>
																	<label class="field">
																		<span>Address</span>
																		<input type="text" bind:value={sub.href} placeholder="/about" />
																	</label>
																</div>
																<label class="field">
																	<span>Description <span class="hint">(optional, shown under the label)</span></span>
																	<input type="text" bind:value={sub.description} />
																</label>
																<NavRows
																	title="Links under this one"
																	rows={sub.children}
																	empty="None. Optional third level."
																	sampleLabel="iToF dev kits"
																	sampleHref="/dev-kits/itof"
																/>
															</div>
														</div>
													{/each}
												</div>
											{/if}
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<NavRows
				title="Buttons"
				rows={buttons}
				empty="No header buttons yet."
				sampleLabel="Contact"
				sampleHref="/contact"
			/>

			<NavRows
				title="Home page banner"
				rows={banner}
				empty="No banner. Add a first row for the message (it links on its own) and a second row for a button beside it."
				sampleLabel="The Lumotive team is growing!"
				sampleHref="https://jobs.lever.co/lumotive"
			/>
		</div>
	</section>

	<div class="sticky-save">
		<button class="primary" disabled={saving}>{saving ? 'Saving…' : 'Save header'}</button>
	</div>
</form>
