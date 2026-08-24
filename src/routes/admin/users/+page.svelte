<script lang="ts">
	import { when } from '$lib/components/admin/fmt';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const fieldError = (field: string) => {
		if (!form || !('fieldErrors' in form) || !form.fieldErrors) return '';
		if (!('action' in form) || form.action !== 'create') return '';
		return (form.fieldErrors as Record<string, string>)[field] ?? '';
	};

	const createValue = (field: 'email' | 'role') => {
		if (!form || !('action' in form) || form.action !== 'create' || !('values' in form)) return '';
		return (form.values as Record<string, string> | undefined)?.[field] ?? '';
	};
</script>

<div class="head">
	<div>
		<h1>Users</h1>
		<p class="sub">Create editor accounts and manage their access.</p>
	</div>
</div>

<section class="card create-card">
	<div class="card-head"><h2>New user</h2></div>
	<form class="card-body create-form" method="POST" action="?/create">
		<label class="field">
			<span>Email</span>
			<input
				name="email"
				type="email"
				autocomplete="off"
				required
				value={createValue('email')}
				aria-invalid={fieldError('email') ? 'true' : undefined}
			/>
			{#if fieldError('email')}<small class="field-error">{fieldError('email')}</small>{/if}
		</label>
		<label class="field">
			<span>Role</span>
			<select name="role" required aria-invalid={fieldError('role') ? 'true' : undefined}>
				{#each data.roles as role (role)}
					<option value={role} selected={createValue('role') ? createValue('role') === role : role === 'editor'}>{role}</option>
				{/each}
			</select>
			{#if fieldError('role')}<small class="field-error">{fieldError('role')}</small>{/if}
		</label>
		<button class="primary">Create user</button>
	</form>
</section>

<section class="card">
	<div class="card-head">
		<h2>Editor accounts</h2>
		<span class="hint">{data.editors.length}</span>
	</div>
	{#if data.editors.length === 0}
		<div class="empty">
			<h3>No users found</h3>
		</div>
	{:else}
		<div class="table-wrap">
			<table>
				<thead>
					<tr>
						<th>User</th>
						<th>Status</th>
						<th>Created</th>
						<th>Role</th>
						<th>Set password</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each data.editors as editor (editor.id)}
						<tr>
							<td>
								<strong>{editor.name || editor.email}</strong>
								{#if editor.name}<small>{editor.email}</small>{/if}
								{#if editor.id === data.currentEditorId}<small class="hint">You</small>{/if}
							</td>
							<td><span class="badge {editor.verified ? 'published' : 'draft'}">{editor.verified ? 'Verified' : 'Unverified'}</span></td>
							<td class="when">{when(editor.created)}</td>
							<td>
								<form class="inline-form" method="POST" action="?/changeRole">
									<input type="hidden" name="id" value={editor.id} />
									<label class="field">
										<span class="sr-only">Role for {editor.email}</span>
										<select name="role" aria-label="Role for {editor.email}">
											{#each data.roles as role (role)}
												<option value={role} selected={editor.role === role}>{role}</option>
											{/each}
										</select>
									</label>
									<button class="tiny">Save</button>
								</form>
							</td>
							<td>
								{#if editor.id === data.currentEditorId}
									<span class="hint">Another admin must send this</span>
								{:else}
									<form class="inline-form" method="POST" action="?/resendInvite">
										<input type="hidden" name="id" value={editor.id} />
										<button class="tiny">Resend email</button>
									</form>
								{/if}
							</td>
							<td class="actions">
								{#if editor.id !== data.currentEditorId}
									<form method="POST" action="?/delete" onsubmit={(event) => !confirm(`Delete ${editor.email}?`) && event.preventDefault()}>
										<input type="hidden" name="id" value={editor.id} />
										<button class="danger tiny">Delete</button>
									</form>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</section>

<style>
	.create-card {
		margin-bottom: 20px;
	}

	h2 {
		font-size: 16px;
	}

	.create-form {
		display: grid;
		grid-template-columns: minmax(180px, 1.2fr) auto auto;
		gap: 16px;
		align-items: end;
	}

	.table-wrap {
		overflow-x: auto;
	}

	td > small {
		display: block;
		margin-top: 3px;
	}

	.inline-form {
		display: flex;
		align-items: end;
		gap: 6px;
	}

	.field-error {
		display: block;
		margin-top: 4px;
		color: var(--danger);
		font-size: 12px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 900px) {
		.create-form {
			grid-template-columns: 1fr;
			align-items: stretch;
		}
	}
</style>
