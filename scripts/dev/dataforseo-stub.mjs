/**
 * Local stand-in for DataForSEO's business_data/google/reviews task endpoints.
 *
 * Exists so the two-phase import can be exercised end to end without a paid
 * account. It implements the shape the real provider returns, including the
 * not-ready state that the collection step must tolerate.
 *
 * Control it over HTTP:
 *   POST /_stub/reset                     clear all tasks and counters
 *   POST /_stub/config  {readyAfter, statusCode, malformed, reviews}
 *   GET  /_stub/calls                     what the client asked for
 */
import { createServer } from 'node:http';

const port = Number(process.argv[2] ?? 8099);
const tasks = new Map();
const calls = [];
let config = { readyAfter: 0, statusCode: 20000, malformed: false, reviews: [] };
let sequence = 0;

function review(index, overrides = {}) {
	return {
		review_id: `stub-review-${index}`,
		profile_name: `Reviewer ${index}`,
		rating: { value: 5, type: 'Rating', rating_max: 5 },
		review_text: `Review text ${index}`,
		timestamp: `2026-0${(index % 9) + 1}-01 10:00:00 +00:00`,
		time_ago: `${index} days ago`,
		profile_url: 'https://www.google.com/maps/contrib/stub',
		profile_image_url: 'https://lh3.googleusercontent.com/stub.png',
		reviews_count: 10 + index,
		photos_count: index,
		local_guide: index % 2 === 0,
		review_highlights: null,
		responses: null,
		original_review_text: null,
		language: 'en',
		url: `https://www.google.com/maps/reviews/stub-${index}`,
		...overrides
	};
}

function body(request) {
	return new Promise((resolve) => {
		let raw = '';
		request.on('data', (chunk) => (raw += chunk));
		request.on('end', () => {
			try {
				resolve(raw ? JSON.parse(raw) : null);
			} catch {
				resolve(null);
			}
		});
	});
}

function json(response, status, payload) {
	const text = JSON.stringify(payload);
	response.writeHead(status, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(text) });
	response.end(text);
}

const server = createServer(async (request, response) => {
	const url = new URL(request.url, `http://127.0.0.1:${port}`);
	const path = url.pathname;

	if (path === '/_stub/reset' && request.method === 'POST') {
		tasks.clear();
		calls.length = 0;
		sequence = 0;
		config = { readyAfter: 0, statusCode: 20000, malformed: false, reviews: [] };
		return json(response, 200, { ok: true });
	}

	if (path === '/_stub/config' && request.method === 'POST') {
		config = { ...config, ...((await body(request)) ?? {}) };
		return json(response, 200, { ok: true, config: { ...config, reviews: config.reviews.length } });
	}

	if (path === '/_stub/calls') {
		return json(response, 200, calls);
	}

	const authorized = (request.headers.authorization ?? '').startsWith('Basic ');
	if (!authorized) {
		return json(response, 401, { status_code: 40100, status_message: 'unauthorized' });
	}

	if (path.endsWith('/task_post') && request.method === 'POST') {
		const payload = await body(request);
		const first = Array.isArray(payload) ? payload[0] : null;
		sequence += 1;
		const id = `stub-task-${sequence}`;
		calls.push({ op: 'task_post', taskId: id, depth: first?.depth ?? null, request: first });
		tasks.set(id, { gets: 0, depth: first?.depth ?? 10 });
		return json(response, 200, {
			status_code: 20000,
			tasks: [{ id, status_code: 20100, status_message: 'Task Created' }]
		});
	}

	const get = path.match(/\/task_get\/(.+)$/);
	if (get && request.method === 'GET') {
		const id = get[1];
		const task = tasks.get(id);
		calls.push({ op: 'task_get', taskId: id });
		if (!task) {
			return json(response, 200, { status_code: 20000, tasks: [{ id, status_code: 40401, status_message: 'not found' }] });
		}
		task.gets += 1;

		if (config.malformed) {
			return json(response, 200, { unexpected: true });
		}
		if (config.statusCode >= 50000) {
			return json(response, 200, {
				status_code: 20000,
				tasks: [{ id, status_code: config.statusCode, status_message: 'stub failure' }]
			});
		}
		if (task.gets <= config.readyAfter) {
			return json(response, 200, {
				status_code: 20000,
				tasks: [{ id, status_code: 40602, status_message: 'Task In Queue', result: null }]
			});
		}

		const source = config.reviews.length
			? config.reviews
			: Array.from({ length: 3 }, (_, index) => review(index + 1));
		const items = source.slice(0, task.depth);
		return json(response, 200, {
			status_code: 20000,
			tasks: [
				{
					id,
					status_code: 20000,
					status_message: 'Ok.',
					result: [
						{
							title: 'Stub Business',
							reviews_count: source.length,
							rating: { value: 4.6, votes_count: source.length },
							items_count: items.length,
							items
						}
					]
				}
			]
		});
	}

	json(response, 404, { status_code: 40400, status_message: 'no stub route' });
});

server.listen(port, '127.0.0.1', () => console.log(`dataforseo stub listening on http://127.0.0.1:${port}`));
