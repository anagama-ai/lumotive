import { untrack } from 'svelte';

export type ToastKind = 'ok' | 'bad';

type Toast = { id: number; message: string; kind: ToastKind; leaving: boolean };

let seq = 0;

export const toasts = $state<Toast[]>([]);

export function dismissToast(id: number) {
	const toast = toasts.find((t) => t.id === id);
	if (!toast || toast.leaving) return;
	toast.leaving = true;
	setTimeout(() => {
		const i = toasts.findIndex((t) => t.id === id);
		if (i !== -1) toasts.splice(i, 1);
	}, 180);
}

export function showToast(message: string, kind: ToastKind = 'bad') {
	const id = ++seq;
	// Mutating from inside a caller's $effect would otherwise make that effect
	// depend on the array it just wrote to, and re-run forever.
	untrack(() => toasts.push({ id, message, kind, leaving: false }));
	setTimeout(() => dismissToast(id), 6000);
}
