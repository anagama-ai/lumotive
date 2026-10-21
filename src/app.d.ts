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
	// Pipedrive web forms read hidden fields with a "JavaScript variable"
	// source from this object on the embedding page (see FormPipedrive).
	interface Window {
		pd_webform?: Record<string, string | number | boolean>;
	}
}

export {};
