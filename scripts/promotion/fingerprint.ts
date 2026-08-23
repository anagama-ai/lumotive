import { createHash } from 'node:crypto';

export type RecordFingerprints = Record<string, string>;

const BOOKKEEPING_FIELDS: Record<string, true> = {
	created: true,
	updated: true,
	collectionId: true,
	collectionName: true,
	expand: true
};

function canonicalize(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(canonicalize);
	if (value instanceof Date) return value.toJSON();
	if (!value || typeof value !== 'object') return value;

	return Object.fromEntries(
		Object.entries(value)
			.sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
			.map(([key, child]) => [key, canonicalize(child)])
	);
}

export function fingerprintRecord(record: Record<string, unknown>): string {
	const content = Object.fromEntries(
		Object.entries(record).filter(([key]) => !Object.hasOwn(BOOKKEEPING_FIELDS, key))
	);
	return createHash('sha256').update(JSON.stringify(canonicalize(content))).digest('hex');
}

export function fingerprintRecords(records: readonly Record<string, unknown>[]): RecordFingerprints {
	return Object.fromEntries(
		records.map((record) => {
			if (typeof record.id !== 'string' || !record.id) {
				throw new Error('Cannot fingerprint a PocketBase record without an id.');
			}
			return [record.id, fingerprintRecord(record)];
		})
	);
}
