<script lang="ts">
	import { page } from '$app/state';
	import { dismissToast, showToast, toasts } from '$lib/toast.svelte';

	/**
	 * Every form action result is announced from here, so no screen can fail
	 * quietly and a new screen is covered before it is written. Enhanced forms
	 * never scroll, and a save button sits at the foot of a long editor, so a
	 * banner painted at the top of the page was invisible exactly when it
	 * mattered.
	 *
	 * An action reports failure as `error` and success as `message`. A screen may
	 * still call `showToast` directly for anything an action cannot know.
	 */
	let announced: unknown = null;
	$effect(() => {
		const result = page.form as { error?: unknown; message?: unknown } | null;
		if (result === announced) return;
		announced = result;
		if (!result) return;

		if (typeof result.error === 'string') showToast(result.error, 'bad');
		else if (typeof result.message === 'string') showToast(result.message, 'ok');
	});
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
		display: flex;
		width: min(380px, calc(100vw - 32px));
		flex-direction: column;
		gap: 8px;
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		padding: 12px 12px 12px 14px;
		border: 1px solid var(--line-strong, #c9c5bf);
		border-left-width: 4px;
		border-radius: var(--r, 8px);
		background: var(--surface, #fff);
		box-shadow: 0 8px 24px rgb(16 24 40 / 18%);
		font-size: 14px;
		line-height: 1.45;
		pointer-events: auto;
		animation: toast-in 180ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.toast.leaving {
		animation: toast-out 180ms cubic-bezier(0.64, 0, 0.78, 0) forwards;
	}

	.toast.ok {
		border-left-color: var(--brand, #042248);
	}

	.toast.bad {
		border-left-color: var(--danger, #b42318);
		color: var(--danger, #b42318);
	}

	.toast.info {
		border-left-color: var(--accent, #fbc51e);
	}

	.toast p {
		flex: 1;
		min-width: 0;
		margin: 0;
	}

	.toast button {
		flex: none;
		width: 24px;
		height: 24px;
		padding: 0;
		border: 0;
		border-radius: 4px;
		background: transparent;
		color: inherit;
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
		opacity: 0.6;
	}

	.toast button:hover {
		background: rgb(22 33 30 / 7%);
		opacity: 1;
	}

	/* Clear of the sticky save bar, and never wider than the screen. */
	@media (max-width: 767px) {
		.toasts {
			inset: auto 12px calc(12px + env(safe-area-inset-bottom)) 12px;
			width: auto;
		}
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

	@media (prefers-reduced-motion: reduce) {
		.toast,
		.toast.leaving {
			animation: none;
		}
	}
</style>
