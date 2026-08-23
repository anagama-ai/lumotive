<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const message = $derived(
		page.status === 413
			? 'The upload or save was too large. Try a smaller file.'
			: page.error?.message && page.error.message !== 'Internal Error'
				? page.error.message
				: 'Something went wrong. Please try again.'
	);
</script>

<p class="notice bad" role="alert">{message}</p>
<a class="btn" href={resolve('/admin')}>Back to dashboard</a>
