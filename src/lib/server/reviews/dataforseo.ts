import { Buffer } from 'node:buffer';
import { env } from '$env/dynamic/private';

const DEFAULT_BASE_URL = 'https://api.dataforseo.com';
const REQUEST_TIMEOUT_MS = 15_000;
const FAILURE_STATUS_CODE = 50_000;

export type GoogleReviewsLookupType = 'place_id' | 'cid' | 'keyword';

export type GoogleReviewsTaskInput = {
	lookupType: GoogleReviewsLookupType;
	identifier: string;
	locationCoordinate: string;
	depth: number;
};

type CredentialsMissing = {
	kind: 'credentials_missing';
	message: string;
};

type TransportFailure = {
	kind: 'transport_failure';
	message: string;
};

type ProviderFailure = {
	kind: 'provider_failure';
	message: string;
	statusCode: number;
};

type MalformedResponse = {
	kind: 'malformed_response';
	message: string;
};

export type DataForSeoFailure =
	| CredentialsMissing
	| TransportFailure
	| ProviderFailure
	| MalformedResponse;

export type SubmitGoogleReviewsTaskResult =
	| DataForSeoFailure
	| { kind: 'submitted'; taskId: string };

export type GetGoogleReviewsTaskResult =
	| DataForSeoFailure
	| { kind: 'not_ready' }
	| { kind: 'finished'; reviews: unknown[] };

type ProviderResponse = {
	kind: 'response';
	body: unknown;
	ok: boolean;
};

const CREDENTIALS_MISSING: CredentialsMissing = {
	kind: 'credentials_missing',
	message: 'Google reviews importing is unavailable because provider credentials are not configured.'
};
const TRANSPORT_FAILURE: TransportFailure = {
	kind: 'transport_failure',
	message: 'The reviews provider request could not be completed.'
};
const MALFORMED_RESPONSE: MalformedResponse = {
	kind: 'malformed_response',
	message: 'The reviews provider returned an invalid response.'
};

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function providerFailure(body: unknown): ProviderFailure | null {
	if (!isObject(body)) return null;

	const rootStatus =
		typeof body.status_code === 'number' && Number.isFinite(body.status_code)
			? body.status_code
			: null;
	const tasks = Array.isArray(body.tasks) ? body.tasks : [];
	const task = isObject(tasks[0]) ? tasks[0] : null;
	const taskStatus =
		typeof task?.status_code === 'number' && Number.isFinite(task.status_code)
			? task.status_code
			: null;
	const failedStatus = taskStatus && taskStatus >= FAILURE_STATUS_CODE ? taskStatus : rootStatus;
	if (failedStatus === null || failedStatus < FAILURE_STATUS_CODE) return null;

	return {
		kind: 'provider_failure',
		message: `The reviews provider rejected the task (status ${failedStatus}).`,
		statusCode: failedStatus
	};
}

function firstTask(body: unknown): Record<string, unknown> | null {
	if (!isObject(body) || !Array.isArray(body.tasks) || !isObject(body.tasks[0])) return null;
	return body.tasks[0];
}

export function isDataForSeoConfigured(): boolean {
	return Boolean(env.DATAFORSEO_LOGIN && env.DATAFORSEO_PASSWORD);
}

async function request(path: string, init: RequestInit = {}): Promise<ProviderResponse | DataForSeoFailure> {
	const login = env.DATAFORSEO_LOGIN;
	const password = env.DATAFORSEO_PASSWORD;
	if (!login || !password) return CREDENTIALS_MISSING;

	const baseUrl = (env.DATAFORSEO_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
	const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
	let response: Response;

	try {
		response = await fetch(`${baseUrl}${path}`, {
			...init,
			signal,
			headers: {
				Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`,
				'Content-Type': 'application/json',
				...init.headers
			}
		});
	} catch {
		return TRANSPORT_FAILURE;
	}

	try {
		return { kind: 'response', body: await response.json(), ok: response.ok };
	} catch {
		return response.ok && !signal.aborted ? MALFORMED_RESPONSE : TRANSPORT_FAILURE;
	}
}

async function submitTask(input: GoogleReviewsTaskInput): Promise<SubmitGoogleReviewsTaskResult> {
	const requestedDepth = Number.isFinite(input.depth) ? Math.trunc(input.depth) : 1;
	const depth = Math.min(4490, Math.max(1, requestedDepth));
	const response = await request('/v3/business_data/google/reviews/task_post', {
		method: 'POST',
		body: JSON.stringify([
			{
				[input.lookupType]: input.identifier,
				location_coordinate: input.locationCoordinate,
				language_code: 'en',
				sort_by: 'newest',
				priority: 1,
				depth
			}
		])
	});
	if (response.kind !== 'response') return response;

	const failure = providerFailure(response.body);
	if (failure) return failure;
	if (!response.ok) return TRANSPORT_FAILURE;

	const task = firstTask(response.body);
	if (!task || typeof task.id !== 'string' || !task.id.trim()) return MALFORMED_RESPONSE;
	return { kind: 'submitted', taskId: task.id };
}

async function getTask(taskId: string): Promise<GetGoogleReviewsTaskResult> {
	const response = await request(
		`/v3/business_data/google/reviews/task_get/${encodeURIComponent(taskId)}`
	);
	if (response.kind !== 'response') return response;

	const failure = providerFailure(response.body);
	if (failure) return failure;
	if (!response.ok) return TRANSPORT_FAILURE;

	const task = firstTask(response.body);
	if (!task) return MALFORMED_RESPONSE;
	if (task.result === null || task.result === undefined) return { kind: 'not_ready' };
	if (!Array.isArray(task.result) || !isObject(task.result[0])) return MALFORMED_RESPONSE;

	const items = task.result[0].items;
	if (!Array.isArray(items)) return MALFORMED_RESPONSE;
	return { kind: 'finished', reviews: items };
}

export const dataForSeoClient = { submitTask, getTask };
