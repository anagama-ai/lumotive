import type PocketBase from 'pocketbase';
import {
	dataForSeoClient,
	isDataForSeoConfigured,
	type DataForSeoFailure,
	type GoogleReviewsLookupType
} from './dataforseo';
import { mapDataForSeoReview } from './sanitise';

const ACTIVE_KEY = 'google-reviews';
const DEPTH = { incremental: 10, full: 4490 } as const;

export type StartOutcome =
	| { started: true; jobId: string; taskId: string; mode: 'incremental' | 'full' }
	| { started: false; reason: string };

export type CollectOutcome =
	| { status: 'idle' }
	| { status: 'pending'; jobId: string }
	| { status: 'escalated'; jobId: string; taskId: string; depth: number }
	| { status: 'succeeded'; jobId: string; created: number; updated: number }
	| { status: 'failed'; jobId: string; reason: string };

type TerminalUpdate = {
	state: 'succeeded' | 'failed';
	finishedAt: string;
	created_count: number;
	updated_count: number;
	reason: string;
	activeKey: '';
};

function providerFailureReason(failure: DataForSeoFailure): string {
	switch (failure.kind) {
		case 'credentials_missing':
			return 'Google reviews importing is unavailable because provider credentials are not configured.';
		case 'provider_failure':
			return `The reviews provider rejected the task (status ${failure.statusCode}).`;
		case 'malformed_response':
			return 'The reviews provider returned an invalid response.';
		case 'transport_failure':
			return 'The reviews provider request could not be completed.';
	}
}

async function firstRecord(
	pb: PocketBase,
	collection: string,
	options: { filter?: string; sort?: string; fields?: string } = {}
) {
	return (await pb.collection(collection).getList(1, 1, options)).items[0] ?? null;
}

export async function startImport(
	pb: PocketBase,
	options: { mode: 'incremental' | 'full' }
): Promise<StartOutcome> {
	if (!isDataForSeoConfigured()) {
		return {
			started: false,
			reason: 'Google reviews importing is unavailable because provider credentials are not configured.'
		};
	}

	let config;
	try {
		config = await firstRecord(pb, 'review_config');
	} catch {
		return { started: false, reason: 'The review configuration could not be loaded.' };
	}
	if (!config) return { started: false, reason: 'Review importing has not been configured.' };

	const configuredLookupType = String(config.lookupType ?? '');
	if (
		configuredLookupType !== 'place_id' &&
		configuredLookupType !== 'cid' &&
		configuredLookupType !== 'keyword'
	) {
		return { started: false, reason: 'The selected review identifier is missing.' };
	}
	const lookupType: GoogleReviewsLookupType = configuredLookupType;
	const identifiers: Record<GoogleReviewsLookupType, string> = {
		place_id: String(config.placeId ?? '').trim(),
		cid: String(config.cid ?? '').trim(),
		keyword: String(config.keyword ?? '').trim()
	};
	const identifierCount =
		Number(Boolean(identifiers.place_id)) +
		Number(Boolean(identifiers.cid)) +
		Number(Boolean(identifiers.keyword));
	if (identifierCount > 1) {
		return { started: false, reason: 'Exactly one review identifier must be configured.' };
	}
	if (!identifiers[lookupType]) {
		return { started: false, reason: `The ${lookupType} review identifier is missing.` };
	}
	const locationCoordinate = String(config.locationCoordinate ?? '').trim();
	if (!locationCoordinate) {
		return { started: false, reason: 'The review location coordinate is missing.' };
	}

	const mode = options.mode;
	const requestedDepth = DEPTH[mode];
	const startedAt = new Date().toISOString();
	let job;
	try {
		job = await pb.collection('review_jobs').create({
			state: 'submitting',
			mode,
			taskId: '',
			activeKey: ACTIVE_KEY,
			startedAt,
			requestedDepth,
			created_count: 0,
			updated_count: 0,
			reason: ''
		});
	} catch {
		let active = null;
		try {
			active = await firstRecord(pb, 'review_jobs', {
				filter: pb.filter('activeKey = {:activeKey}', { activeKey: ACTIVE_KEY }),
				fields: 'id'
			});
		} catch {
			// The slot remains unacquired even when its holder cannot be read.
		}
		return active
			? { started: false, reason: `A review import is already under way (job ${active.id}).` }
			: { started: false, reason: 'The review import slot could not be acquired.' };
	}

	let taskId = '';
	let failureReason = '';
	try {
		const result = await dataForSeoClient.submitTask({
			lookupType,
			identifier: identifiers[lookupType],
			locationCoordinate,
			depth: requestedDepth
		});
		if (result.kind === 'submitted') {
			taskId = result.taskId;
			await pb.collection('review_jobs').update(job.id, {
				state: 'pending',
				taskId,
				reason: ''
			});
		} else {
			failureReason = providerFailureReason(result);
		}
	} catch {
		failureReason = 'The review import could not be started.';
	} finally {
		if (failureReason) {
			await pb.collection('review_jobs').update(job.id, {
				state: 'failed',
				finishedAt: new Date().toISOString(),
				reason: failureReason,
				activeKey: ''
			});
		}
	}

	return failureReason
		? { started: false, reason: failureReason }
		: { started: true, jobId: job.id, taskId, mode };
}

export async function collectImport(pb: PocketBase): Promise<CollectOutcome> {
	const job = await firstRecord(pb, 'review_jobs', {
		filter: pb.filter('activeKey = {:activeKey}', { activeKey: ACTIVE_KEY })
	});
	if (!job) return { status: 'idle' };

	const jobId = job.id;
	const taskId = String(job.taskId ?? '').trim();
	if (job.state === 'submitting' && !taskId) return { status: 'pending', jobId };

	let terminal: TerminalUpdate | null = null;
	let outcome: CollectOutcome = { status: 'pending', jobId };
	let created = Number(job.created_count) || 0;
	let updated = Number(job.updated_count) || 0;
	try {
		if (!taskId) throw new Error('missing task id');
		const result = await dataForSeoClient.getTask(taskId);
		if (result.kind === 'not_ready') return outcome;
		if (result.kind !== 'finished') {
			const reason = providerFailureReason(result);
			terminal = {
				state: 'failed',
				finishedAt: new Date().toISOString(),
				created_count: created,
				updated_count: updated,
				reason,
				activeKey: ''
			};
			outcome = { status: 'failed', jobId, reason };
		} else {
			const stored = await pb
				.collection('reviews')
				.getFullList({ fields: 'id,reviewId,importedAt' });
			const jobStartedAt = Date.parse(String(job.startedAt ?? ''));
			const storedBeforeJob = new Set(
				stored
					.filter((record) => {
						const importedAt = Date.parse(String(record.importedAt ?? ''));
						return (
							!Number.isFinite(jobStartedAt) ||
							!Number.isFinite(importedAt) ||
							importedAt < jobStartedAt
						);
					})
					.map((record) => String(record.reviewId))
			);
			const byReviewId = new Map(stored.map((record) => [String(record.reviewId), record.id]));
			let reachedKnownReview = false;
			const importedAt = new Date().toISOString();

			for (const item of result.reviews) {
				const review = mapDataForSeoReview(item, { importedAt, importTaskId: taskId });
				if (!review.reviewId) throw new Error('invalid review');
				const existedBeforeRung = storedBeforeJob.has(review.reviewId);
				if (existedBeforeRung) reachedKnownReview = true;
				if (existedBeforeRung && job.mode === 'incremental') break;
				const existingId = byReviewId.get(review.reviewId);
				if (existingId) {
					await pb.collection('reviews').update(existingId, review);
					updated += 1;
				} else {
					const record = await pb.collection('reviews').create(review);
					byReviewId.set(review.reviewId, record.id);
					created += 1;
				}
			}

			const requestedDepth = Number(job.requestedDepth);
			const nextDepth = requestedDepth === 10 ? 20 : requestedDepth === 20 ? 50 : null;
			if (
				job.mode === 'incremental' &&
				!reachedKnownReview &&
				result.reviews.length === requestedDepth &&
				nextDepth !== null
			) {
				let nextTaskId = '';
				let failureReason = '';
				try {
					const config = await firstRecord(pb, 'review_config');
					if (!config) throw new Error('missing review configuration');
					const configuredLookupType = String(config.lookupType ?? '');
					if (
						configuredLookupType !== 'place_id' &&
						configuredLookupType !== 'cid' &&
						configuredLookupType !== 'keyword'
					) {
						throw new Error('invalid review configuration');
					}
					const lookupType: GoogleReviewsLookupType = configuredLookupType;
					const identifiers: Record<GoogleReviewsLookupType, string> = {
						place_id: String(config.placeId ?? '').trim(),
						cid: String(config.cid ?? '').trim(),
						keyword: String(config.keyword ?? '').trim()
					};
					const locationCoordinate = String(config.locationCoordinate ?? '').trim();
					const identifierCount =
						Number(Boolean(identifiers.place_id)) +
						Number(Boolean(identifiers.cid)) +
						Number(Boolean(identifiers.keyword));
					if (identifierCount > 1) {
						failureReason = 'Exactly one review identifier must be configured.';
					} else if (!identifiers[lookupType] || !locationCoordinate) {
						throw new Error('incomplete review configuration');
					} else {
						const submission = await dataForSeoClient.submitTask({
							lookupType,
							identifier: identifiers[lookupType],
							locationCoordinate,
							depth: nextDepth
						});
						if (submission.kind === 'submitted') nextTaskId = submission.taskId;
						else failureReason = providerFailureReason(submission);
					}
				} catch {
					failureReason = 'The review import could not be continued.';
				}

				if (failureReason) {
					terminal = {
						state: 'failed',
						finishedAt: new Date().toISOString(),
						created_count: created,
						updated_count: updated,
						reason: failureReason,
						activeKey: ''
					};
					outcome = { status: 'failed', jobId, reason: failureReason };
				} else {
					await pb.collection('review_jobs').update(jobId, {
						state: 'pending',
						taskId: nextTaskId,
						requestedDepth: nextDepth,
						created_count: created,
						updated_count: updated,
						reason: ''
					});
					outcome = {
						status: 'escalated',
						jobId,
						taskId: nextTaskId,
						depth: nextDepth
					};
				}
			} else {
				terminal = {
					state: 'succeeded',
					finishedAt: new Date().toISOString(),
					created_count: created,
					updated_count: updated,
					reason: '',
					activeKey: ''
				};
				outcome = { status: 'succeeded', jobId, created, updated };
			}
		}
	} catch {
		const reason = 'The review import could not be collected.';
		terminal = {
			state: 'failed',
			finishedAt: new Date().toISOString(),
			created_count: created,
			updated_count: updated,
			reason,
			activeKey: ''
		};
		outcome = { status: 'failed', jobId, reason };
	} finally {
		if (terminal) await pb.collection('review_jobs').update(jobId, terminal);
	}

	return outcome;
}

export async function reclaimStaleJobs(pb: PocketBase, maxAgeMs: number): Promise<number> {
	const cutoff = Date.now() - maxAgeMs;
	const active = await pb.collection('review_jobs').getFullList({
		filter: pb.filter('activeKey = {:activeKey}', { activeKey: ACTIVE_KEY })
	});
	const stale = active.filter((job) => {
		const startedAt = Date.parse(String(job.startedAt ?? ''));
		return !Number.isFinite(startedAt) || startedAt <= cutoff;
	});

	for (const job of stale) {
		await pb.collection('review_jobs').update(job.id, {
			state: 'failed',
			finishedAt: new Date().toISOString(),
			created_count: Number(job.created_count) || 0,
			updated_count: Number(job.updated_count) || 0,
			reason: 'This review import was abandoned before it could finish.',
			activeKey: ''
		});
	}
	return stale.length;
}

export async function importState(pb: PocketBase): Promise<{
	configured: boolean;
	active: null | { jobId: string; state: string; mode: string; startedAt: string };
	last: null | {
		state: 'succeeded' | 'failed';
		finishedAt: string;
		created: number;
		updated: number;
		reason: string;
	};
}> {
	const [active, last] = await Promise.all([
		firstRecord(pb, 'review_jobs', {
			filter: pb.filter('activeKey = {:activeKey}', { activeKey: ACTIVE_KEY })
		}),
		firstRecord(pb, 'review_jobs', {
			filter: 'state = "succeeded" || state = "failed"',
			sort: '-finishedAt'
		})
	]);

	return {
		configured: isDataForSeoConfigured(),
		active: active
			? {
					jobId: active.id,
					state: String(active.state),
					mode: String(active.mode),
					startedAt: String(active.startedAt ?? '')
				}
			: null,
		last: last
			? {
					state: last.state === 'succeeded' ? 'succeeded' : 'failed',
					finishedAt: String(last.finishedAt ?? ''),
					created: Number(last.created_count) || 0,
					updated: Number(last.updated_count) || 0,
					reason: String(last.reason ?? '')
				}
			: null
	};
}
