<script lang="ts">
	import { page } from '$app/state';
	import fallbackLogo from '$lib/assets/favicon.svg';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Forgot password — Content manager</title></svelte:head>

<div class="login-wrap">
	<div class="login">
		<header>
			<h1><img src={page.data.brandLogo || fallbackLogo} alt="Content manager" /></h1>
			<h2>Forgot password</h2>
			<p>Enter your editor email address.</p>
		</header>

		<form method="POST" class="card">
			<div class="card-body">
				{#if form?.requested}
					<p class="notice ok" role="status">If an account exists for that email, a set-password link has been sent.</p>
				{:else}
					{#if form?.error}
						<p class="notice bad" role="alert">{form.error}</p>
					{/if}

					<label class="field">
						<span>Email</span>
						<input name="email" type="email" autocomplete="email" required value={form?.email ?? ''} />
					</label>

					<button class="primary">Send set-password link</button>
				{/if}
				<a href="/admin/login">Back to sign in</a>
			</div>
		</form>
	</div>
</div>
