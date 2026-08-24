import { untrack } from 'svelte';

export type ToastKind = 'ok' | 'bad' | 'info';
export type Toast = { id: number; message: string; kind: ToastKind; leaving: boolean };

/**
 * Errors stay until dismissed. A blocked save the editor never saw is the whole
 * reason this layer exists, so it must not time out. Successes clear themselves.
 */
const LIFETIME: Record<ToastKind, number> = { ok: 5000, info: 6000, bad: 0 };
const EXIT_MS = 180;

let seq = 0;
const timers = new Map<number, number>();

export const toasts = $state<Toast[]>([]);

export function dismissToast(id: number) {
	const toast = toasts.find((t) => t.id === id);
	if (!toast || toast.leaving) return;

	clearTimeout(timers.get(id));
	timers.delete(id);
	toast.leaving = true;
	window.setTimeout(() => {
		const index = toasts.findIndex((t) => t.id === id);
		if (index !== -1) toasts.splice(index, 1);
	}, EXIT_MS);
}

/**
 * Callers include effects watching a form result. This reads and writes the same
 * reactive array, so without `untrack` a caller inside an `$effect` would depend
 * on the array it just wrote to and re-run forever.
 */
export function showToast(message: string, kind: ToastKind = 'bad') {
	const text = message.trim();
	if (!text) return;
	const lifetime = LIFETIME[kind];

	untrack(() => {
		// Repeating an action refreshes its toast rather than stacking copies.
		const existing = toasts.find((t) => t.message === text && t.kind === kind && !t.leaving);
		const id = existing ? existing.id : ++seq;
		if (!existing) toasts.push({ id, message: text, kind, leaving: false });

		clearTimeout(timers.get(id));
		timers.delete(id);
		if (lifetime) timers.set(id, window.setTimeout(() => dismissToast(id), lifetime));
	});
}
