// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type PocketBase from 'pocketbase';

declare global {
	namespace App {
		interface Locals {
			pb: PocketBase;
			editor: Record<string, unknown> | null;
		}
	}
}

export {};
