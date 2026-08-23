import { createHash, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';
import type PocketBase from 'pocketbase';
import { collectImport, reclaimStaleJobs, startImport } from '$lib/server/reviews/import';
import { createPB } from '$lib/pb';
import type { RequestHandler } from './$types';

const DAY_MS = 24 * 60 * 60 * 1000;
const STALE_JOB_MS = 60 * 60 * 1000;
const NO_STORE = { 'cache-control': 'no-store' };
const FREQUENCY_MS: Record<string, number> = {
	'7d': 7 * DAY_MS,
	'14d': 14 * DAY_MS,
	'30d': 30 * DAY_MS
};

function hasSchedulerSecret(request: Request) {
	const expected = env.REVIEWS_SCHEDULER_SECRET;
	const supplied = request.headers.get('x-reviews-scheduler-secret');
	if (!expected || !supplied) return false;

	return timingSafeEqual(
		createHash('sha256').update(supplied).digest(),
		createHash('sha256').update(expected).digest()
	);
}

async function scheduledImportIsDue(pb: PocketBase) {
	const configs = await pb.collection('review_config').getList(1, 1, { fields: 'frequency' });
	const frequency = String(configs.items[0]?.frequency ?? 'manual');
	const interval = FREQUENCY_MS[frequency];
	if (!interval) return { due: false, reason: frequency === 'manual' ? 'manual' : 'invalid_frequency' };

	const jobs = await pb.collection('review_jobs').getList(1, 1, {
		filter: "state = 'succeeded' || state = 'failed'",
		sort: '-finishedAt,-id',
		fields: 'finishedAt'
	});
	const finishedAt = String(jobs.items[0]?.finishedAt ?? '').replace(' ', 'T');
	const finishedAtMs = Date.parse(finishedAt);

	return {
		due: !Number.isFinite(finishedAtMs) || Date.now() - finishedAtMs >= interval,
		reason: 'not_due'
	};
}

export const POST: RequestHandler = async ({ request }) => {
	if (!hasSchedulerSecret(request)) return new Response(null, { status: 404, headers: NO_STORE });

	if (!env.PB_SUPERUSER_EMAIL || !env.PB_SUPERUSER_PASSWORD) {
		return json({ error: 'Review collection is unavailable.' }, { status: 500, headers: NO_STORE });
	}

	try {
		const pb = createPB();
		await pb
			.collection('_superusers')
			.authWithPassword(env.PB_SUPERUSER_EMAIL, env.PB_SUPERUSER_PASSWORD);

		const reclaimed = await reclaimStaleJobs(pb, STALE_JOB_MS);
		const collected = await collectImport(pb);
		let scheduled = null;

		if (collected.status === 'idle') {
			const due = await scheduledImportIsDue(pb);
			scheduled = due.due
				? await startImport(pb, { mode: 'incremental' })
				: { started: false, reason: due.reason };
		}

		return json({ reclaimed, collected, scheduled }, { headers: NO_STORE });
	} catch {
		return json({ error: 'Review collection failed.' }, { status: 500, headers: NO_STORE });
	}
};
