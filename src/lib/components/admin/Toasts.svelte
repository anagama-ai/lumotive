<script lang="ts">
	import { dismissToast, toasts } from '$lib/toast.svelte';
</script>

<div class="toasts" aria-live="polite" aria-atomic="false">
	{#each toasts as toast (toast.id)}
		<div
			class="toast {toast.kind}"
			class:leaving={toast.leaving}
			role={toast.kind === 'bad' ? 'alert' : 'status'}
		>
			<p>{toast.message}</p>
			<button type="button" aria-label="Dismiss notification" onclick={() => dismissToast(toast.id)}>
				&times;
			</button>
		</div>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		inset: auto 16px 16px auto;
		z-index: 200;
		width: min(360px, calc(100vw - 32px));
		display: flex;
		flex-direction: column;
		gap: 8px;
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 10px 10px 10px 14px;
		border: 1px solid var(--line);
		border-radius: var(--r);
		background: var(--surface);
		box-shadow: var(--shadow);
		font-size: 14px;
		pointer-events: auto;
		animation: toast-in 180ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.toast.leaving {
		animation: toast-out 180ms cubic-bezier(0.64, 0, 0.78, 0) forwards;
	}

	.toast.ok {
		background: var(--brand-wash);
		border-color: var(--brand-soft);
		color: var(--brand-ink);
	}

	.toast.bad {
		background: var(--danger-wash);
		border-color: var(--danger-soft);
		color: var(--danger);
	}

	.toast p {
		margin: 0;
		flex: 1;
		padding-top: 2px;
	}

	.toast button {
		flex: none;
		width: 24px;
		height: 24px;
		padding: 0;
		border: 0;
		border-radius: var(--r);
		background: none;
		color: inherit;
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
	}

	.toast button:hover {
		background: rgb(22 33 30 / 0.07);
	}

	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	@keyframes toast-out {
		to {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	@media (max-width: 900px) {
		.toasts {
			inset: auto 0 0 0;
			width: auto;
			padding: 8px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.toast,
		.toast.leaving {
			animation: none;
		}
	}
</style>
