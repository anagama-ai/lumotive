<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import '../app.css';

	const message = $derived(
		page.status === 404
			? 'The page you were looking for could not be found.'
			: 'Something went wrong. Please try again.'
	);
</script>

<main class="page-heading">
	<div class="container narrow">
		<p>{page.status}</p>
		<h1>{message}</h1>
		<a class="button" href={resolve('/')}>Back home</a>
	</div>
</main>
