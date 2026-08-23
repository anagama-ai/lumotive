<script lang="ts">
	let { form }: { form: { email?: string; error?: string } | null } = $props();
</script>

<svelte:head><title>Sign in — Content manager</title></svelte:head>

<div class="login-wrap">
	<div class="login">
		<header>
			<span class="dot"></span>
			<h1>Content manager</h1>
			<p>Sign in to edit your website.</p>
		</header>

		<form method="POST" class="card">
			<div class="card-body">
				{#if form?.error}
					<p class="notice bad" role="alert">{form.error}</p>
				{/if}

				<label class="field">
					<span>Email</span>
					<input
						name="email"
						type="email"
						autocomplete="username"
						required
						value={form?.email ?? ''}
					/>
				</label>

				<label class="field">
					<span>Password</span>
					<input name="password" type="password" autocomplete="current-password" required />
				</label>

				<button class="primary">Sign in</button>
			</div>
		</form>
	</div>
</div>
