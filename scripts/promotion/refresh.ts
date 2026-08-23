import { randomUUID } from 'node:crypto';
import { createWriteStream, openAsBlob } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { hostname, tmpdir } from 'node:os';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { setTimeout as delay } from 'node:timers/promises';
import type PocketBase from 'pocketbase';
import { assertComplete, loadConfig, type ScrubAction } from './config.ts';
import { createEnvironmentClient } from './env.ts';
import { fingerprintRecords } from './fingerprint.ts';
import { acquire, release } from './lock.ts';
import { writeManifest, type CollectionFingerprints } from './manifest.ts';

type ScrubSummary = Record<string, number>;
type ManifestSummary = Record<string, number>;

const dryRun = process.argv.slice(2).includes('--dry-run');
const unknownArguments = process.argv.slice(2).filter((argument) => argument !== '--dry-run');

function duration(milliseconds: number): string {
	return `${(milliseconds / 1000).toFixed(3)}s`;
}

async function safely<T>(message: string, action: () => Promise<T>): Promise<T> {
	try {
		return await action();
	} catch {
		throw new Error(message);
	}
}

async function records(pb: PocketBase, collection: string) {
	return safely(`Could not read collection ${collection}.`, () =>
		pb.collection(collection).getFullList({ sort: 'id' })
	);
}

async function collectionCounts(
	pb: PocketBase,
	collectionNames: readonly string[]
): Promise<ManifestSummary> {
	const entries = await Promise.all(
		collectionNames.map(async (collection) => {
			const result = await safely(`Could not count ${collection}.`, () =>
				pb.collection(collection).getList(1, 1)
			);
			return [collection, result.totalItems] as const;
		})
	);
	return Object.fromEntries(entries);
}

async function scrubCollection(
	staging: PocketBase,
	collection: string,
	action: ScrubAction
): Promise<number> {
	if (action === 'delete') {
		const before = await safely(`Could not count ${collection} before scrubbing.`, () =>
			staging.collection(collection).getList(1, 1)
		);
		if (before.totalItems) {
			await safely(`Could not delete scrubbed collection ${collection}.`, () =>
				staging.collections.truncate(collection)
			);
		}
		const after = await safely(`Could not verify scrubbed collection ${collection}.`, () =>
			staging.collection(collection).getList(1, 1)
		);
		if (after.totalItems !== 0) {
			throw new Error(`Scrub verification failed for ${collection}: records remain.`);
		}
		return before.totalItems;
	}

	const before = await records(staging, collection);
	const blank = Object.fromEntries(action.null.map((field) => [field, null]));
	await safely(`Could not blank scrubbed fields in ${collection}.`, () =>
		Promise.all(before.map((record) => staging.collection(collection).update(record.id, blank)))
	);
	const after = await records(staging, collection);
	if (after.some((record) => action.null.some((field) => record[field] !== null))) {
		throw new Error(`Scrub verification failed for ${collection}: customer values remain.`);
	}
	return before.length;
}

async function fingerprints(
	pb: PocketBase,
	collectionNames: readonly string[]
): Promise<{ collections: CollectionFingerprints; counts: ManifestSummary }> {
	const entries = await Promise.all(
		collectionNames.map(async (collection) => {
			const collectionRecords = await records(pb, collection);
			return [collection, collectionRecords] as const;
		})
	);
	return {
		collections: Object.fromEntries(
			entries.map(([collection, collectionRecords]) => [
				collection,
				fingerprintRecords(collectionRecords)
			])
		),
		counts: Object.fromEntries(
			entries.map(([collection, collectionRecords]) => [collection, collectionRecords.length])
		)
	};
}

function statusOf(error: unknown): number | null {
	if (!error || typeof error !== 'object' || !('status' in error)) return null;
	return typeof error.status === 'number' ? error.status : null;
}

async function waitForRestore(baseURL: string, backupKey: string): Promise<void> {
	const healthURL = `${baseURL.replace(/\/+$/, '')}/api/health`;
	const deadline = performance.now() + 30_000;
	let restartObserved = false;

	while (performance.now() < deadline) {
		try {
			const response = await fetch(healthURL, { signal: AbortSignal.timeout(1_000) });
			if (response.ok && restartObserved) return;
			if (!response.ok) restartObserved = true;
		} catch {
			restartObserved = true;
		}
		await delay(100);
	}

	throw new Error(
		`The restore did not take effect: staging did not complete its restart within 30 seconds. Staging backup ${backupKey} was left on staging.`
	);
}

async function deleteBackup(pb: PocketBase, key: string, environment: string): Promise<void> {
	try {
		await pb.backups.delete(key);
	} catch (error) {
		if (statusOf(error) !== 404) {
			throw new Error(`Could not delete the refresh backup from ${environment}.`);
		}
	}
}

function printRows(label: string, rows: Record<string, number>): void {
	console.log(label);
	for (const [collection, count] of Object.entries(rows).sort(([left], [right]) =>
		left.localeCompare(right)
	)) {
		console.log(`  ${collection}: ${count}`);
	}
}

async function printDryRun(
	production: PocketBase,
	promoted: readonly string[],
	scrubbed: Readonly<Record<string, ScrubAction>>
): Promise<void> {
	const [scrubEntries, manifest] = await Promise.all([
		Promise.all(
			Object.entries(scrubbed).map(async ([collection]) => [
				collection,
				(await records(production, collection)).length
			] as const)
		),
		fingerprints(production, promoted)
	]);

	console.log('DRY RUN: no lock acquired, no backup created, and neither environment was changed.');
	console.log('Would acquire the staging promotion lock.');
	console.log('Would create and download a disposable production backup.');
	console.log('Would upload and restore that backup into staging, replacing staging as a whole.');
	printRows('Rows that would be scrubbed:', Object.fromEntries(scrubEntries));
	for (const [collection, action] of Object.entries(scrubbed).sort(([left], [right]) =>
		left.localeCompare(right)
	)) {
		console.log(
			`  ${collection} action: ${action === 'delete' ? 'delete every row' : `blank ${action.null.join(', ')}`}`
		);
	}
	printRows('Manifest record counts that would be written:', manifest.counts);
	console.log('Would delete the temporary backup artifacts and release the staging lock.');
	console.log(
		'Customer data would be present on staging between restore completion and scrub verification; a dry run cannot measure that duration.'
	);
}

async function main(): Promise<void> {
	if (unknownArguments.length) {
		throw new Error('Unknown command-line argument.');
	}

	const config = loadConfig();
	const [production, initialStaging] = await Promise.all([
		createEnvironmentClient('prod'),
		createEnvironmentClient('staging')
	]);
	let staging = initialStaging;

	const [productionCollections, stagingCollections] = await Promise.all([
		safely('Could not fetch the production collection list.', () =>
			production.collections.getFullList({ sort: 'name' })
		),
		safely('Could not fetch the staging collection list.', () =>
			staging.collections.getFullList({ sort: 'name' })
		)
	]);
	assertComplete(
		config,
		new Set([...productionCollections, ...stagingCollections].map((collection) => collection.name))
	);
	if (production.baseURL.replace(/\/+$/, '') === staging.baseURL.replace(/\/+$/, '')) {
		throw new Error('Production and staging must be different PocketBase instances.');
	}

	if (dryRun) {
		await printDryRun(production, config.promote.promoted, config.refresh.scrubbed);
		return;
	}

	const holder = `refresh:${hostname()}:${process.pid}`;
	const lock = await acquire(staging, holder);
	if (!lock.acquired) {
		throw new Error(
			`Promotion lock held by ${lock.lock?.holder ?? 'unknown holder'}; age ${
				lock.lock ? duration(lock.lock.ageMs) : 'unknown'
			}.`
		);
	}

	let backupKey: string | null = null;
	let temporaryDirectory: string | null = null;
	let stagingBackupUploaded = false;
	let stagingRestoreConfirmed = false;
	let operationError: unknown;
	let scrubSummary: ScrubSummary = {};
	let manifestSummary: ManifestSummary = {};
	let exposureMilliseconds = 0;
	const cleanupErrors: string[] = [];

	try {
		// PocketBase rejects uppercase characters in a backup name, so lowercase the ISO timestamp.
		backupKey = `refresh-${new Date().toISOString().replace(/[:.]/g, '-').toLowerCase()}-${randomUUID()}.zip`;

		// Production supplies a disposable read snapshot only; every record mutation below targets staging.
		await safely(`Could not create production backup ${backupKey}.`, () =>
			production.backups.create(backupKey as string)
		);
		const productionCounts = await collectionCounts(production, config.promote.promoted);
		const token = await safely('Could not authorize the production backup download.', () =>
			production.files.getToken()
		);
		const response = await safely('Could not download the production backup.', () =>
			fetch(production.backups.getDownloadURL(token, backupKey as string))
		);
		if (!response.ok || !response.body) {
			throw new Error('Could not download the production backup.');
		}

		temporaryDirectory = await safely('Could not create temporary backup storage.', () =>
			mkdtemp(join(tmpdir(), 'pocketbase-refresh-'))
		);
		const artifactPath = join(temporaryDirectory, backupKey);
		await safely('Could not save the downloaded production backup.', () =>
			pipeline(Readable.fromWeb(response.body), createWriteStream(artifactPath))
		);
		const form = new FormData();
		form.append('file', await openAsBlob(artifactPath, { type: 'application/zip' }), backupKey);
		await safely('Could not upload the production backup to staging.', () =>
			staging.backups.upload(form)
		);
		stagingBackupUploaded = true;

		await safely('Could not restore the production backup into staging.', () =>
			staging.backups.restore(backupKey as string)
		);
		const restoredAt = performance.now();
		await waitForRestore(staging.baseURL, backupKey);
		staging = await createEnvironmentClient('staging');
		const stagingCounts = await collectionCounts(staging, config.promote.promoted);
		const mismatchedCollections = config.promote.promoted.filter(
			(collection) => stagingCounts[collection] !== productionCounts[collection]
		);
		if (mismatchedCollections.length) {
			throw new Error(
				`The restore did not take effect: staging row counts differ from production for ${mismatchedCollections.join(', ')}. Staging backup ${backupKey} was left on staging.`
			);
		}
		stagingRestoreConfirmed = true;

		const scrubEntries = await Promise.all(
			Object.entries(config.refresh.scrubbed).map(async ([collection, action]) => [
				collection,
				await scrubCollection(staging, collection, action)
			] as const)
		);
		exposureMilliseconds = performance.now() - restoredAt;
		scrubSummary = Object.fromEntries(scrubEntries);

		const manifest = await fingerprints(staging, config.promote.promoted);
		await safely('Could not write the staging refresh manifest.', () =>
			writeManifest(staging, manifest.collections)
		);
		manifestSummary = manifest.counts;
	} catch (error) {
		operationError = error;
	} finally {
		if (stagingBackupUploaded && stagingRestoreConfirmed && backupKey) {
			try {
				await deleteBackup(staging, backupKey, 'staging');
			} catch (error) {
				cleanupErrors.push((error as Error).message);
			}
		}
		if (backupKey) {
			try {
				await deleteBackup(production, backupKey, 'production');
			} catch (error) {
				cleanupErrors.push((error as Error).message);
			}
		}
		if (temporaryDirectory) {
			try {
				await rm(temporaryDirectory, { recursive: true, force: true });
			} catch {
				cleanupErrors.push('Could not remove the local temporary backup.');
			}
		}
		try {
			await release(staging);
		} catch {
			cleanupErrors.push('Could not release the staging promotion lock.');
		}
	}

	if (operationError) throw operationError;
	if (cleanupErrors.length) throw new Error(cleanupErrors.join(' '));

	console.log('Refresh complete.');
	console.log(`Backup key used and deleted: ${backupKey}`);
	printRows('Rows scrubbed:', scrubSummary);
	printRows('Manifest record counts:', manifestSummary);
	console.log(
		`Customer data was present on staging between restore completion and scrub verification for ${duration(exposureMilliseconds)}.`
	);
}

main().catch((error: unknown) => {
	let message = error instanceof Error ? error.message : 'Unknown error.';
	for (const variable of [
		'PROMOTE_PROD_URL',
		'PROMOTE_PROD_EMAIL',
		'PROMOTE_PROD_PASSWORD',
		'PROMOTE_STAGING_URL',
		'PROMOTE_STAGING_EMAIL',
		'PROMOTE_STAGING_PASSWORD'
	]) {
		const credential = process.env[variable];
		if (credential) message = message.replaceAll(credential, '[REDACTED]');
	}
	console.error(`Refresh failed: ${message}`);
	process.exitCode = 1;
});
