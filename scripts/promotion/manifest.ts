import type PocketBase from 'pocketbase';
import type { RecordFingerprints } from './fingerprint.ts';

const COLLECTION = 'promotion_state';
const MANIFEST_KEY = 'manifest';

export type CollectionFingerprints = Record<string, RecordFingerprints>;

export interface Manifest {
	takenAt: string;
	collections: CollectionFingerprints;
}

export interface CollectionChanges {
	changed: string[];
	new: string[];
	gone: string[];
}

export type ManifestChanges = Record<string, CollectionChanges>;

interface PromotionStateRecord {
	id: string;
	data: unknown;
}

async function findManifestRecord(pb: PocketBase): Promise<PromotionStateRecord | null> {
	const result = await pb.collection(COLLECTION).getList<PromotionStateRecord>(1, 1, {
		filter: pb.filter('key = {:key}', { key: MANIFEST_KEY })
	});
	return result.items[0] ?? null;
}

function parseManifest(value: unknown): Manifest {
	if (!value || typeof value !== 'object') throw new Error('The stored promotion manifest is invalid.');

	const { takenAt, collections } = value as Record<string, unknown>;
	if (
		typeof takenAt !== 'string' ||
		!collections ||
		typeof collections !== 'object' ||
		Array.isArray(collections)
	) {
		throw new Error('The stored promotion manifest is invalid.');
	}

	for (const records of Object.values(collections)) {
		if (!records || typeof records !== 'object' || Array.isArray(records)) {
			throw new Error('The stored promotion manifest is invalid.');
		}
		if (Object.values(records).some((fingerprint) => typeof fingerprint !== 'string')) {
			throw new Error('The stored promotion manifest is invalid.');
		}
	}

	return { takenAt, collections: collections as CollectionFingerprints };
}

export async function writeManifest(
	pb: PocketBase,
	collections: CollectionFingerprints
): Promise<Manifest> {
	const manifest = { takenAt: new Date().toISOString(), collections };
	const existing = await findManifestRecord(pb);

	if (existing) {
		await pb.collection(COLLECTION).update(existing.id, { data: manifest });
	} else {
		await pb.collection(COLLECTION).create({ key: MANIFEST_KEY, data: manifest });
	}

	return manifest;
}

export async function readManifest(pb: PocketBase): Promise<Manifest | null> {
	const record = await findManifestRecord(pb);
	return record ? parseManifest(record.data) : null;
}

export function compareManifest(
	manifest: Manifest,
	live: CollectionFingerprints
): ManifestChanges {
	const changes: ManifestChanges = {};
	const collections = [...new Set([...Object.keys(manifest.collections), ...Object.keys(live)])].sort();

	for (const collection of collections) {
		const baseline = manifest.collections[collection] ?? {};
		const current = live[collection] ?? {};
		const baselineIds = Object.keys(baseline);
		const currentIds = Object.keys(current);
		const changed = currentIds
			.filter((id) => Object.hasOwn(baseline, id) && current[id] !== baseline[id])
			.sort();
		const added = currentIds.filter((id) => !Object.hasOwn(baseline, id)).sort();
		const gone = baselineIds.filter((id) => !Object.hasOwn(current, id)).sort();

		if (changed.length || added.length || gone.length) {
			changes[collection] = { changed, new: added, gone };
		}
	}

	return changes;
}
