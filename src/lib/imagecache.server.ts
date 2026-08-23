import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

/**
 * Variant cache. Derived data only: every entry can be rebuilt from the stored
 * image and its address, so this directory is disposable and is never migrated.
 *
 * It lives outside pb_data deliberately. PocketBase backups archive pb_data,
 * and archiving regenerable derivatives would bloat every backup and let a
 * restore resurrect a stale cache.
 *
 * Both operations live here so that pointing the cache at object storage later
 * is an edit to this file rather than a hunt through the route.
 */
const CACHE_DIR = join(process.cwd(), '.cache', 'media');

/** Rejects anything that could escape the cache directory. */
const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

export function cacheKey(
	recordId: string,
	filename: string,
	width: number,
	format: string
): string | null {
	if (![recordId, filename, format].every((part) => SAFE_SEGMENT.test(part))) return null;
	if (!Number.isInteger(width) || width <= 0) return null;
	return join(recordId, filename, `${width}.${format}`);
}

export async function readCached(key: string): Promise<Buffer | null> {
	try {
		return await readFile(join(CACHE_DIR, key));
	} catch {
		return null;
	}
}

/**
 * Writes to a temporary name and renames into place. A crash mid-write must not
 * leave a truncated image at a valid address, because variants are served with
 * immutable caching headers and would be wrong for as long as they are cached.
 */
export async function writeCached(key: string, bytes: Uint8Array): Promise<void> {
	const target = join(CACHE_DIR, key);
	const temporary = `${target}.${randomUUID()}.tmp`;
	await mkdir(dirname(target), { recursive: true });
	await writeFile(temporary, bytes);
	await rename(temporary, target);
}
