import { randomUUID } from 'node:crypto';
import { hostname } from 'node:os';
import type PocketBase from 'pocketbase';
import type { CollectionField, CollectionModel, RecordModel } from 'pocketbase';
import { assertComplete, loadConfig } from './config.ts';
import { createEnvironmentClient } from './env.ts';
import { fingerprintRecord, fingerprintRecords } from './fingerprint.ts';
import { acquire, release } from './lock.ts';
import {
	compareManifest,
	readManifest,
	type CollectionFingerprints,
	type Manifest
} from './manifest.ts';

const BACKUP_PREFIX = 'promote-';
const BACKUP_KEEP = 5;
// Must match VERSION_LIMIT in pb_hooks/versions_lib.js.
const DERIVED_HISTORY_LIMIT = 50;

type RecordsByCollection = Record<string, RecordModel[]>;
type CollectionSnapshot = Record<
	string,
	{
		count: number;
		fingerprints: Record<string, string>;
		parents: Record<string, string>;
	}
>;
type DerivedResult = {
	untouchedDifferences: string[];
	capViolations: string[];
	added: number;
	removed: number;
};
type Action = {
	collection: CollectionModel;
	source: RecordModel;
	destination: RecordModel | null;
	kind: 'create' | 'update';
};

const credentialValues = () =>
	[
		'PROMOTE_PROD_URL',
		'PROMOTE_PROD_EMAIL',
		'PROMOTE_PROD_PASSWORD',
		'PROMOTE_STAGING_URL',
		'PROMOTE_STAGING_EMAIL',
		'PROMOTE_STAGING_PASSWORD'
	]
		.map((name) => process.env[name])
		.filter((value): value is string => Boolean(value))
		.sort((left, right) => right.length - left.length);

function redact(value: string): string {
	return credentialValues().reduce(
		(result, credential) => result.replaceAll(credential, '[REDACTED]'),
		value
	);
}

function report(value: string): void {
	console.log(redact(value));
}

function errorMessage(error: unknown): string {
	return redact(error instanceof Error ? error.message : String(error));
}

function canonicalize(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(canonicalize);
	if (!value || typeof value !== 'object') return value;
	return Object.fromEntries(
		Object.entries(value)
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([key, child]) => [key, canonicalize(child)])
	);
}

function schemaOf(collection: CollectionModel, collectionNames: Map<string, string>): string {
	const fields = collection.fields.map((field) => {
		const { id: _id, ...schema } = field;
		if (typeof schema.collectionId === 'string') {
			schema.collectionId = collectionNames.get(schema.collectionId) ?? schema.collectionId;
		}
		return schema;
	});
	return JSON.stringify(
		canonicalize({ type: collection.type, fields, indexes: [...collection.indexes].sort() })
	);
}

function assertMatchingSchemas(
	promoted: readonly string[],
	productionCollections: CollectionModel[],
	stagingCollections: CollectionModel[]
): void {
	const productionByName = new Map(productionCollections.map((collection) => [collection.name, collection]));
	const stagingByName = new Map(stagingCollections.map((collection) => [collection.name, collection]));
	const productionNames = new Map(productionCollections.map((collection) => [collection.id, collection.name]));
	const stagingNames = new Map(stagingCollections.map((collection) => [collection.id, collection.name]));
	const mismatches: string[] = [];

	for (const name of promoted) {
		const production = productionByName.get(name);
		const staging = stagingByName.get(name);
		if (!production || !staging) {
			mismatches.push(`${name} (${production ? 'missing from staging' : 'missing from production'})`);
			continue;
		}
		if (schemaOf(production, productionNames) !== schemaOf(staging, stagingNames)) {
			mismatches.push(name);
		}
	}

	if (mismatches.length) {
		throw new Error(`Promoted collection schema mismatch: ${mismatches.join(', ')}`);
	}
}

async function readRecords(pb: PocketBase, collectionNames: readonly string[]): Promise<RecordsByCollection> {
	return Object.fromEntries(
		await Promise.all(
			collectionNames.map(
				async (name) =>
					[
						name,
						await pb.collection(name).getFullList<RecordModel>({ sort: 'id' })
					] as const
			)
		)
	);
}

function fingerprints(records: RecordsByCollection): CollectionFingerprints {
	return Object.fromEntries(
		Object.entries(records).map(
			([name, collectionRecords]) =>
				[name, fingerprintRecords(collectionRecords)] as const
		)
	);
}

async function captureCollections(
	production: PocketBase,
	collectionNames: readonly string[]
): Promise<CollectionSnapshot> {
	const snapshot: CollectionSnapshot = {};
	for (const name of [...collectionNames].sort()) {
		const records = await production.collection(name).getFullList<RecordModel>({ sort: 'id' });
		snapshot[name] = {
			count: records.length,
			fingerprints: fingerprintRecords(records),
			parents: Object.fromEntries(
				records.map(
					(record) =>
						[
							record.id,
							typeof record.collection === 'string' && typeof record.record === 'string'
								? `${record.collection}/${record.record}`
								: `${name}/${record.id}`
						] as const
				)
			)
		};
	}
	return snapshot;
}

function preservedDifferences(before: CollectionSnapshot, after: CollectionSnapshot): string[] {
	return Object.keys(before).filter(
		(name) =>
			before[name].count !== after[name]?.count ||
			JSON.stringify(before[name].fingerprints) !== JSON.stringify(after[name]?.fingerprints)
	);
}

function checkDerived(
	before: CollectionSnapshot,
	after: CollectionSnapshot,
	touchedParents: Set<string>
): DerivedResult {
	const beforeRows = new Map<string, { parent: string; fingerprint: string }>();
	const afterRows = new Map<string, { parent: string; fingerprint: string }>();
	const beforeByParent = new Map<string, Array<[string, string]>>();
	const afterByParent = new Map<string, Array<[string, string]>>();

	for (const [name, snapshot] of Object.entries(before)) {
		for (const [id, fingerprint] of Object.entries(snapshot.fingerprints)) {
			const key = `${name}/${id}`;
			const parent = snapshot.parents[id];
			beforeRows.set(key, { parent, fingerprint });
			beforeByParent.set(parent, [...(beforeByParent.get(parent) ?? []), [key, fingerprint]]);
		}
	}
	for (const [name, snapshot] of Object.entries(after)) {
		for (const [id, fingerprint] of Object.entries(snapshot.fingerprints)) {
			const key = `${name}/${id}`;
			const parent = snapshot.parents[id];
			afterRows.set(key, { parent, fingerprint });
			afterByParent.set(parent, [...(afterByParent.get(parent) ?? []), [key, fingerprint]]);
		}
	}

	const untouchedDifferences: string[] = [];
	const capViolations: string[] = [];
	const parents = new Set([...beforeByParent.keys(), ...afterByParent.keys()]);
	for (const parent of parents) {
		const current = (afterByParent.get(parent) ?? []).sort(([left], [right]) =>
			left.localeCompare(right)
		);
		if (touchedParents.has(parent)) {
			if (current.length > DERIVED_HISTORY_LIMIT) {
				capViolations.push(`${parent} has ${current.length} rows`);
			}
			continue;
		}
		const prior = (beforeByParent.get(parent) ?? []).sort(([left], [right]) =>
			left.localeCompare(right)
		);
		if (JSON.stringify(prior) !== JSON.stringify(current)) untouchedDifferences.push(parent);
	}

	const added = [...afterRows.entries()].filter(
		([key, row]) => touchedParents.has(row.parent) && !beforeRows.has(key)
	).length;
	const removed = [...beforeRows.entries()].filter(
		([key, row]) => touchedParents.has(row.parent) && !afterRows.has(key)
	).length;
	return { untouchedDifferences, capViolations, added, removed };
}

function fileFields(collection: CollectionModel): CollectionField[] {
	return collection.fields.filter((field) => !field.system && field.type === 'file');
}

function fileNames(record: RecordModel, field: CollectionField): string[] {
	const value = record[field.name];
	if (value === '' || value === null || value === undefined) return [];
	if (typeof value === 'string') return [value];
	if (Array.isArray(value) && value.every((name) => typeof name === 'string')) return value;
	throw new Error(`Invalid file value on ${record.collectionName}/${record.id}.${field.name}`);
}

function recordPayload(record: RecordModel, collection: CollectionModel): Record<string, unknown> {
	return Object.fromEntries(
		collection.fields
			.filter((field) => !field.system && field.type !== 'autodate' && field.type !== 'file')
			.map((field) => [field.name, record[field.name]])
	);
}

async function fetchFile(
	client: PocketBase,
	record: RecordModel,
	field: CollectionField,
	filename: string,
	token: string
): Promise<File> {
	try {
		const response = await fetch(client.files.getURL(record, filename, { token }));
		if (!response.ok) throw new Error('not available');
		const blob = await response.blob();
		return new File([blob], filename, { type: blob.type });
	} catch {
		throw new Error(
			`Could not read ${record.collectionName}/${record.id}.${field.name} file ${filename}`
		);
	}
}

async function filePayload(
	staging: PocketBase,
	record: RecordModel,
	collection: CollectionModel,
	token: string
): Promise<Record<string, unknown>> {
	const payload: Record<string, unknown> = {};
	for (const field of fileFields(collection)) {
		const names = fileNames(record, field);
		if (!names.length) {
			payload[field.name] = null;
			continue;
		}
		const files = await Promise.all(
			names.map((filename) => fetchFile(staging, record, field, filename, token))
		);
		payload[field.name] = files.length === 1 ? files[0] : files;
	}
	return payload;
}

function plans(
	promoted: readonly string[],
	collections: Map<string, CollectionModel>,
	stagingRecords: RecordsByCollection,
	productionRecords: RecordsByCollection
): { actions: Action[]; leftInPlace: Array<{ collection: string; id: string }> } {
	const actions: Action[] = [];
	const leftInPlace: Array<{ collection: string; id: string }> = [];

	for (const name of promoted) {
		const collection = collections.get(name);
		if (!collection) throw new Error(`Promoted collection ${name} is unavailable after preflight.`);
		const productionById = new Map(productionRecords[name].map((record) => [record.id, record]));
		const stagingIds = new Set(stagingRecords[name].map((record) => record.id));
		const storedFileFields = fileFields(collection);

		for (const source of stagingRecords[name]) {
			const destination = productionById.get(source.id) ?? null;
			if (
				!destination ||
				fingerprintRecord(source) !== fingerprintRecord(destination) ||
				storedFileFields.some((field) => fileNames(source, field).length)
			) {
				actions.push({ collection, source, destination, kind: destination ? 'update' : 'create' });
			}
		}
		for (const destination of productionRecords[name]) {
			if (!stagingIds.has(destination.id)) leftInPlace.push({ collection: name, id: destination.id });
		}
	}

	return { actions, leftInPlace };
}

function orderByRelations(actions: Action[], collections: CollectionModel[]): Action[] {
	const collectionNameById = new Map(collections.map((collection) => [collection.id, collection.name]));
	const pending = new Map(
		actions.map((action) => [`${action.collection.name}/${action.source.id}`, action])
	);
	const creates = new Set(
		actions
			.filter((action) => action.kind === 'create')
			.map((action) => `${action.collection.name}/${action.source.id}`)
	);
	const ordered: Action[] = [];

	while (pending.size) {
		let advanced = false;
		for (const [key, action] of pending) {
			const dependencies = action.collection.fields
				.filter((field) => field.type === 'relation' && typeof field.collectionId === 'string')
				.flatMap((field) => {
					const target = collectionNameById.get(field.collectionId) ?? field.collectionId;
					const value = action.source[field.name];
					const ids = Array.isArray(value) ? value : typeof value === 'string' && value ? [value] : [];
					return ids.map((id) => `${target}/${id}`);
				})
				.filter((dependency) => creates.has(dependency) && dependency !== key);
			if (dependencies.some((dependency) => pending.has(dependency))) continue;
			ordered.push(action);
			pending.delete(key);
			advanced = true;
		}
		if (!advanced) {
			throw new Error(
				`New promoted records contain a relation cycle: ${[...pending.keys()].join(', ')}`
			);
		}
	}

	return ordered;
}

function reportDivergence(
	manifest: Manifest,
	stagingRecords: RecordsByCollection,
	productionRecords: RecordsByCollection
): Set<string> {
	const stagingFingerprints = fingerprints(stagingRecords);
	const productionFingerprints = fingerprints(productionRecords);
	const changes = compareManifest(manifest, productionFingerprints);
	const divergent = new Set<string>();

	for (const [collection, collectionChanges] of Object.entries(changes)) {
		for (const id of [...collectionChanges.changed, ...collectionChanges.new]) {
			const production = productionFingerprints[collection]?.[id];
			const staging = stagingFingerprints[collection]?.[id];
			if (!production || !staging || production === staging) continue;
			const key = `${collection}/${id}`;
			divergent.add(key);
			report(
				`DIVERGENCE ${key} baseline=${manifest.collections[collection]?.[id] ?? 'missing'} production=${production} staging=${staging}`
			);
		}
	}

	return divergent;
}

function backupKey(): string {
	// PocketBase rejects uppercase characters in a backup name, so lowercase the ISO timestamp.
	const timestamp = new Date().toISOString().replaceAll(':', '-').replace('.', '-').toLowerCase();
	return `${BACKUP_PREFIX}${timestamp}-${randomUUID().slice(0, 8)}.zip`;
}

async function createBackup(production: PocketBase, key: string): Promise<void> {
	try {
		const created = await production.backups.create(key);
		const backup = (await production.backups.getFullList()).find((candidate) => candidate.key === key);
		if (!created || !backup || backup.size <= 0) throw new Error('incomplete');
	} catch {
		throw new Error(`Production backup ${key} did not complete; no production content was written.`);
	}
	report(`BACKUP ${key}`);
}

async function backupsToPrune(production: PocketBase, keep: number): Promise<string[]> {
	const backups = (await production.backups.getFullList())
		.filter((backup) => backup.key.startsWith(BACKUP_PREFIX))
		.sort((left, right) => Date.parse(right.modified) - Date.parse(left.modified));
	return backups.slice(keep).map((backup) => backup.key);
}

async function pruneBackups(production: PocketBase): Promise<void> {
	for (const key of await backupsToPrune(production, BACKUP_KEEP)) {
		try {
			await production.backups.delete(key);
		} catch {
			throw new Error(`Could not prune promote-created backup ${key}.`);
		}
		report(`PRUNED BACKUP ${key}`);
	}
}

async function verifyMediaFiles(
	production: PocketBase,
	records: Map<string, RecordModel>,
	collection: CollectionModel,
	token: string
): Promise<void> {
	for (const record of records.values()) {
		for (const field of fileFields(collection)) {
			for (const filename of fileNames(record, field)) {
				try {
					const response = await fetch(production.files.getURL(record, filename, { token }));
					if (!response.ok) throw new Error('not available');
					await response.body?.cancel();
				} catch {
					throw new Error(
						`Promoted media file is not served: ${record.collectionName}/${record.id}.${field.name} ${filename}`
					);
				}
			}
		}
	}
}

function reportAction(action: Action, prefix = ''): void {
	report(`${prefix}${action.kind.toUpperCase()} ${action.collection.name}/${action.source.id}`);
}

function reportSummary(
	created: number,
	updated: number,
	leftInPlace: number,
	divergent: number,
	preserved: 'passed' | 'failed',
	untouchedDerived: 'passed' | 'failed',
	derivedCap: 'passed' | 'failed',
	derivedAdded: number,
	derivedRemoved: number,
	backup: string
): void {
	report('SUMMARY');
	report(`  created: ${created}`);
	report(`  updated: ${updated}`);
	report(`  left-in-place: ${leftInPlace}`);
	report(`  overwritten-after-divergence: ${divergent}`);
	report(`  preserved-assertion: ${preserved}`);
	report(`  untouched-derived-assertion: ${untouchedDerived}`);
	report(`  derived-retention-cap-assertion: ${derivedCap}`);
	report(`  derived-rows-added: ${derivedAdded}`);
	report(`  derived-rows-removed-by-retention: ${derivedRemoved}`);
	report(`  backup-key: ${backup}`);
}

async function run(): Promise<void> {
	const args = process.argv.slice(2);
	if (args.some((argument) => argument !== '--dry-run') || args.filter((arg) => arg === '--dry-run').length > 1) {
		throw new Error('Usage: node --experimental-strip-types scripts/promotion/promote.ts [--dry-run]');
	}
	const dryRun = args.includes('--dry-run');
	const config = loadConfig();
	const [production, staging] = await Promise.all([
		createEnvironmentClient('prod'),
		createEnvironmentClient('staging')
	]);
	const [productionCollections, stagingCollections] = await Promise.all([
		production.collections.getFullList({ sort: 'name' }),
		staging.collections.getFullList({ sort: 'name' })
	]);
	assertComplete(
		config,
		new Set([
			...productionCollections.map((collection) => collection.name),
			...stagingCollections.map((collection) => collection.name)
		])
	);
	assertMatchingSchemas(config.promote.promoted, productionCollections, stagingCollections);
	report('PREFLIGHT PASSED');

	const preservedNames = productionCollections
		.map((collection) => collection.name)
		.filter((name) => name.startsWith('_') || config.promote.preserved.includes(name));
	const derivedNames = productionCollections
		.map((collection) => collection.name)
		.filter((name) => config.promote.derived.includes(name));
	let lockAcquired = false;
	let operationFailed = false;
	let backup = 'none (dry run)';
	let pruneAttempted = false;

	try {
		if (!dryRun) {
			const holder = `promote:${hostname()}:${process.pid}`;
			const result = await acquire(production, holder);
			if (!result.acquired) {
				const owner = result.lock?.holder ?? 'unknown holder';
				const age = result.lock ? `${Math.floor(result.lock.ageMs / 1000)}s` : 'unknown';
				throw new Error(`Production promotion lock held by ${owner}; age ${age}.`);
			}
			lockAcquired = true;
		}

		const preservedBefore = await captureCollections(production, preservedNames);
		const derivedBefore = await captureCollections(production, derivedNames);
		const plannedBackup = backupKey();
		if (dryRun) {
			report(`DRY RUN BACKUP ${plannedBackup}`);
		} else {
			await createBackup(production, plannedBackup);
			backup = plannedBackup;
		}

		const manifest = await readManifest(staging);
		if (!manifest) throw new Error('Staging has no promotion manifest. Refresh staging before promoting.');
		const [stagingRecords, productionRecords] = await Promise.all([
			readRecords(staging, config.promote.promoted),
			readRecords(production, config.promote.promoted)
		]);
		const productionByName = new Map(
			productionCollections.map((collection) => [collection.name, collection])
		);
		const { actions, leftInPlace } = plans(
			config.promote.promoted,
			productionByName,
			stagingRecords,
			productionRecords
		);
		const divergent = reportDivergence(manifest, stagingRecords, productionRecords);
		for (const record of leftInPlace) report(`LEFT IN PLACE ${record.collection}/${record.id}`);

		const mediaActions = actions.filter((action) => action.collection.name === 'media');
		const otherActions = orderByRelations(
			actions.filter((action) => action.collection.name !== 'media'),
			productionCollections
		);
		const overwritten = actions.filter((action) =>
			divergent.has(`${action.collection.name}/${action.source.id}`)
		).length;
		const created = actions.filter((action) => action.kind === 'create').length;
		const updated = actions.filter((action) => action.kind === 'update').length;

		if (dryRun) {
			for (const action of mediaActions) {
				for (const field of fileFields(action.collection)) {
					for (const filename of fileNames(action.source, field)) {
						report(
							`DRY RUN UPLOAD ${action.collection.name}/${action.source.id}.${field.name} ${filename}`
						);
					}
				}
				reportAction(action, 'DRY RUN ');
			}
			for (const action of otherActions) {
				for (const field of fileFields(action.collection)) {
					for (const filename of fileNames(action.source, field)) {
						report(
							`DRY RUN UPLOAD ${action.collection.name}/${action.source.id}.${field.name} ${filename}`
						);
					}
				}
				reportAction(action, 'DRY RUN ');
			}
			const dryRunPrunes = await backupsToPrune(production, BACKUP_KEEP - 1);
			for (const key of dryRunPrunes) report(`DRY RUN PRUNE BACKUP ${key}`);
			const preservedAfter = await captureCollections(production, preservedNames);
			const derivedAfter = await captureCollections(production, derivedNames);
			const preservedChanges = preservedDifferences(preservedBefore, preservedAfter);
			const derivedResult = checkDerived(derivedBefore, derivedAfter, new Set());
			const preservedResult = preservedChanges.length ? 'failed' : 'passed';
			const untouchedDerivedStatus = derivedResult.untouchedDifferences.length
				? 'failed'
				: 'passed';
			const derivedCapStatus = derivedResult.capViolations.length ? 'failed' : 'passed';
			report(
				preservedChanges.length
					? `PRESERVED ASSERTION FAILED ${preservedChanges.join(', ')}`
					: 'PRESERVED ASSERTION PASSED'
			);
			report(
				derivedResult.untouchedDifferences.length
					? `UNTOUCHED DERIVED ASSERTION FAILED ${derivedResult.untouchedDifferences.join(', ')}`
					: 'UNTOUCHED DERIVED ASSERTION PASSED'
			);
			report(
				derivedResult.capViolations.length
					? `DERIVED RETENTION CAP ASSERTION FAILED ${derivedResult.capViolations.join(', ')}`
					: 'DERIVED RETENTION CAP ASSERTION PASSED'
			);
			reportSummary(
				created,
				updated,
				leftInPlace.length,
				overwritten,
				preservedResult,
				untouchedDerivedStatus,
				derivedCapStatus,
				derivedResult.added,
				derivedResult.removed,
				backup
			);
			if (
				preservedChanges.length ||
				derivedResult.untouchedDifferences.length ||
				derivedResult.capViolations.length
			) {
				throw new Error('Protected collections changed incompatibly during the dry run.');
			}
			return;
		}

		const stagingFileToken = await staging.files.getToken();
		const promotedMedia = new Map<string, RecordModel>();
		for (const action of mediaActions) {
			const files = await filePayload(staging, action.source, action.collection, stagingFileToken);
			const initial = action.destination
				? files
				: { id: action.source.id, ...recordPayload(action.source, action.collection), ...files };
			let result: RecordModel;
			try {
				result = action.destination
					? await production.collection('media').update<RecordModel>(action.source.id, initial)
					: await production.collection('media').create<RecordModel>(initial);
			} catch {
				throw new Error(`Could not upload media files for media/${action.source.id}.`);
			}
			promotedMedia.set(action.source.id, result);
			reportAction(action);
		}
		for (const action of mediaActions) {
			try {
				await production
					.collection('media')
					.update(action.source.id, recordPayload(action.source, action.collection));
			} catch {
				throw new Error(`Could not upsert media metadata for media/${action.source.id}.`);
			}
		}
		if (mediaActions.length) {
			await verifyMediaFiles(
				production,
				promotedMedia,
				mediaActions[0].collection,
				await production.files.getToken()
			);
		}

		for (const action of otherActions) {
			const payload = {
				...recordPayload(action.source, action.collection),
				...(await filePayload(staging, action.source, action.collection, stagingFileToken))
			};
			if (action.kind === 'create') payload.id = action.source.id;
			try {
				if (action.kind === 'create') {
					await production.collection(action.collection.name).create(payload);
				} else {
					await production.collection(action.collection.name).update(action.source.id, payload);
				}
			} catch {
				throw new Error(
					`Could not ${action.kind} ${action.collection.name}/${action.source.id}.`
				);
			}
			reportAction(action);
		}

		const preservedAfter = await captureCollections(production, preservedNames);
		const derivedAfter = await captureCollections(production, derivedNames);
		const preservedChanges = preservedDifferences(preservedBefore, preservedAfter);
		const touchedParents = new Set(
			actions.map((action) => `${action.collection.name}/${action.source.id}`)
		);
		const derivedResult = checkDerived(derivedBefore, derivedAfter, touchedParents);
		const preservedResult = preservedChanges.length ? 'failed' : 'passed';
		const untouchedDerivedStatus = derivedResult.untouchedDifferences.length ? 'failed' : 'passed';
		const derivedCapStatus = derivedResult.capViolations.length ? 'failed' : 'passed';
		report(
			preservedChanges.length
				? `PRESERVED ASSERTION FAILED ${preservedChanges.join(', ')}`
				: 'PRESERVED ASSERTION PASSED'
		);
		report(
			derivedResult.untouchedDifferences.length
				? `UNTOUCHED DERIVED ASSERTION FAILED ${derivedResult.untouchedDifferences.join(', ')}`
				: 'UNTOUCHED DERIVED ASSERTION PASSED'
		);
		report(
			derivedResult.capViolations.length
				? `DERIVED RETENTION CAP ASSERTION FAILED ${derivedResult.capViolations.join(', ')}`
				: 'DERIVED RETENTION CAP ASSERTION PASSED'
		);
		if (
			preservedChanges.length ||
			derivedResult.untouchedDifferences.length ||
			derivedResult.capViolations.length
		) {
			reportSummary(
				created,
				updated,
				leftInPlace.length,
				overwritten,
				preservedResult,
				untouchedDerivedStatus,
				derivedCapStatus,
				derivedResult.added,
				derivedResult.removed,
				backup
			);
			throw new Error('Promote failed because protected production data changed incompatibly.');
		}
		pruneAttempted = true;
		await pruneBackups(production);
		reportSummary(
			created,
			updated,
			leftInPlace.length,
			overwritten,
			preservedResult,
			untouchedDerivedStatus,
			derivedCapStatus,
			derivedResult.added,
			derivedResult.removed,
			backup
		);
	} catch (error) {
		operationFailed = true;
		throw error;
	} finally {
		if (backup !== 'none (dry run)' && !pruneAttempted) {
			try {
				pruneAttempted = true;
				await pruneBackups(production);
			} catch (error) {
				console.error(redact(`Backup pruning also failed: ${errorMessage(error)}`));
			}
		}
		if (lockAcquired) {
			try {
				await release(production);
			} catch (error) {
				if (!operationFailed) throw error;
				console.error(redact(`Lock release also failed: ${errorMessage(error)}`));
			}
		}
	}
}

run().catch((error) => {
	console.error(redact(`PROMOTION FAILED: ${errorMessage(error)}`));
	process.exitCode = 1;
});
