import { readFileSync } from 'node:fs';

export type PromotionOperation = 'promote' | 'refresh';
export type PromotionDisposition = 'promoted' | 'preserved' | 'scrubbed' | 'derived';
export type ScrubAction = 'delete' | { null: string[] };

export type PromotionConfig = {
	promote: {
		promoted: string[];
		preserved: string[];
		derived: string[];
	};
	refresh: {
		scrubbed: Record<string, ScrubAction>;
	};
};

function isStringArray(value: unknown): value is string[] {
	return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isScrubAction(value: unknown): value is ScrubAction {
	return (
		value === 'delete' ||
		(typeof value === 'object' &&
			value !== null &&
			!Array.isArray(value) &&
			Object.keys(value).length === 1 &&
			'null' in value &&
			isStringArray(value.null) &&
			value.null.length > 0)
	);
}

function assertConfig(value: unknown): asserts value is PromotionConfig {
	if (
		typeof value !== 'object' ||
		value === null ||
		!('promote' in value) ||
		!('refresh' in value) ||
		typeof value.promote !== 'object' ||
		value.promote === null ||
		typeof value.refresh !== 'object' ||
		value.refresh === null ||
		!('promoted' in value.promote) ||
		!('preserved' in value.promote) ||
		!('derived' in value.promote) ||
		!('scrubbed' in value.refresh)
	) {
		throw new Error('expected promote and refresh objects');
	}
	if (
		!isStringArray(value.promote.promoted) ||
		!isStringArray(value.promote.preserved) ||
		!isStringArray(value.promote.derived)
	) {
		throw new Error('promote.promoted, promote.preserved and promote.derived must be string arrays');
	}
	if (
		typeof value.refresh.scrubbed !== 'object' ||
		value.refresh.scrubbed === null ||
		Array.isArray(value.refresh.scrubbed)
	) {
		throw new Error('refresh.scrubbed must be an object');
	}
	for (const [collectionName, action] of Object.entries(value.refresh.scrubbed)) {
		if (!isScrubAction(action)) {
			throw new Error(`invalid scrub action for ${collectionName}`);
		}
	}
}

export function loadConfig(path = 'promotion.config.json'): PromotionConfig {
	let source: string;
	try {
		source = readFileSync(path, 'utf8');
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			throw new Error(`Promotion config not found: ${path}`, { cause: error });
		}
		throw new Error(`Unable to read promotion config at ${path}`, { cause: error });
	}

	try {
		const config: unknown = JSON.parse(source);
		assertConfig(config);
		return config;
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`Malformed promotion config at ${path}: ${detail}`, { cause: error });
	}
}

export function assertComplete(config: PromotionConfig, collectionNames: Iterable<string>): void {
	const buckets = {
		promoted: new Set(config.promote.promoted),
		preserved: new Set(config.promote.preserved),
		derived: new Set(config.promote.derived)
	};
	const names = [...new Set([...buckets.promoted, ...buckets.preserved, ...buckets.derived])];
	const conflicts = names
		.filter((name) => Object.values(buckets).filter((bucket) => bucket.has(name)).length > 1)
		.sort();
	const unclassified = [
		...new Set(
			[...collectionNames].filter(
				(name) =>
					!name.startsWith('_') &&
					!buckets.promoted.has(name) &&
					!buckets.preserved.has(name) &&
					!buckets.derived.has(name)
			)
		)
	].sort();
	const problems: string[] = [];

	if (conflicts.length) {
		problems.push(`classified more than once: ${conflicts.join(', ')}`);
	}
	if (unclassified.length) {
		problems.push(`unclassified collections: ${unclassified.join(', ')}`);
	}
	if (problems.length) {
		throw new Error(`Invalid promotion config; ${problems.join('; ')}`);
	}
}

export function dispositionFor(
	config: PromotionConfig,
	operation: PromotionOperation,
	collectionName: string
): PromotionDisposition {
	if (operation === 'refresh' && Object.hasOwn(config.refresh.scrubbed, collectionName)) {
		return 'scrubbed';
	}

	const matches = (
		[
			['promoted', config.promote.promoted],
			['preserved', config.promote.preserved],
			['derived', config.promote.derived]
		] as const
	).filter(([, names]) => names.includes(collectionName));
	if (matches.length > 1) {
		throw new Error(
			`Collection ${collectionName} is classified more than once: ${matches.map(([name]) => name).join(', ')}`
		);
	}
	if (matches.length === 1) {
		return matches[0][0];
	}
	throw new Error(`No ${operation} disposition configured for collection ${collectionName}`);
}
