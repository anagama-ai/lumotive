import type PocketBase from 'pocketbase';

const COLLECTION = 'promotion_state';
const LOCK_KEY = 'lock';

interface PromotionStateRecord {
	id: string;
	data: unknown;
}

export interface LockInfo {
	holder: string;
	acquiredAt: string;
	ageMs: number;
}

export type AcquireResult = { acquired: true } | { acquired: false; lock: LockInfo | null };

const statusOf = (error: unknown) => {
	if (!error || typeof error !== 'object' || !('status' in error)) return null;
	return typeof error.status === 'number' ? error.status : null;
};

async function findLockRecord(pb: PocketBase): Promise<PromotionStateRecord | null> {
	const result = await pb.collection(COLLECTION).getList<PromotionStateRecord>(1, 1, {
		filter: pb.filter('key = {:key}', { key: LOCK_KEY })
	});
	return result.items[0] ?? null;
}

function lockInfo(record: PromotionStateRecord): LockInfo {
	if (!record.data || typeof record.data !== 'object') {
		throw new Error('The promotion lock contains invalid data. Remove it before retrying.');
	}

	const { holder, acquiredAt } = record.data as Record<string, unknown>;
	const acquiredAtMs = typeof acquiredAt === 'string' ? Date.parse(acquiredAt) : Number.NaN;
	if (typeof holder !== 'string' || Number.isNaN(acquiredAtMs)) {
		throw new Error('The promotion lock contains invalid data. Remove it before retrying.');
	}

	return {
		holder,
		acquiredAt: acquiredAt as string,
		ageMs: Math.max(0, Date.now() - acquiredAtMs)
	};
}

export async function acquire(pb: PocketBase, holder: string): Promise<AcquireResult> {
	if (!holder.trim()) throw new Error('A non-empty promotion lock holder is required.');

	try {
		await pb.collection(COLLECTION).create({
			key: LOCK_KEY,
			data: { holder, acquiredAt: new Date().toISOString() }
		});
		return { acquired: true };
	} catch (error) {
		if (statusOf(error) === 400 || statusOf(error) === 409) {
			let lock: LockInfo | null = null;
			try {
				lock = await readLock(pb);
			} catch {
				// The failed unique insert is the refusal; diagnostics are best effort.
			}
			return { acquired: false, lock };
		}
		throw new Error('Could not acquire the promotion lock. Check PocketBase connectivity and permissions.');
	}
}

export async function release(pb: PocketBase): Promise<void> {
	let record: PromotionStateRecord | null;
	try {
		record = await findLockRecord(pb);
	} catch {
		throw new Error('Could not read the promotion lock for release.');
	}
	if (!record) return;

	try {
		await pb.collection(COLLECTION).delete(record.id);
	} catch (error) {
		if (statusOf(error) !== 404) throw new Error('Could not release the promotion lock.');
	}
}

export async function readLock(pb: PocketBase): Promise<LockInfo | null> {
	let record: PromotionStateRecord | null;
	try {
		record = await findLockRecord(pb);
	} catch {
		throw new Error('Could not read the promotion lock.');
	}
	return record ? lockInfo(record) : null;
}
