<script lang="ts">
	import { page } from '$app/state';
	import fallbackLogo from '$lib/assets/favicon.svg';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const fieldError = (field: string) => {
		if (!form || !('fieldErrors' in form)) return '';
		return (form.fieldErrors as Record<string, string>)[field] ?? '';
	};
</script>

<svelte:head><title>Set password — Content manager</title></svelte:head>

<div class="login-wrap">
	<div class="login">
		<header>
			<h1><img src={page.data.brandLogo || fallbackLogo} alt="Content manager" /></h1>
			<h2>Set password</h2>
			<p>Choose a password for your editor account.</p>
		</header>

		<form method="POST" class="card">
			<div class="card-body">
				{#if form?.error}
					<p class="notice bad" role="alert">{form.error}</p>
				{/if}

				<label class="field">
					<span>New password <span class="hint">— at least {data.passwordMinimum} characters</span></span>
					<input
						name="password"
						type="password"
						autocomplete="new-password"
						minlength={data.passwordMinimum}
						maxlength={data.passwordMaximum}
						required
						aria-invalid={fieldError('password') ? 'true' : undefined}
					/>
					{#if fieldError('password')}<small class="field-error">{fieldError('password')}</small>{/if}
				</label>

				<label class="field">
					<span>Confirm new password</span>
					<input
						name="passwordConfirm"
						type="password"
						autocomplete="new-password"
						minlength={data.passwordMinimum}
						maxlength={data.passwordMaximum}
						required
						aria-invalid={fieldError('passwordConfirm') ? 'true' : undefined}
					/>
					{#if fieldError('passwordConfirm')}<small class="field-error">{fieldError('passwordConfirm')}</small>{/if}
				</label>

				<button class="primary">Set password</button>
				<a href="/admin/forgot">Request a new link</a>
			</div>
		</form>
	</div>
</div>
