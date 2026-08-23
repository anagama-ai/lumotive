import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

/** @param {string} email */
const request = (email) => {
	const form = new FormData();
	form.set('email', email);
	return new Request('http://localhost/admin/forgot', { method: 'POST', body: form });
};

/** @param {(email: string) => Promise<void>} requestPasswordReset */
const locals = (requestPasswordReset) => ({
	pb: { collection: () => ({ requestPasswordReset }) }
});

test('forgot-password action', async (t) => {
	const server = await createServer({
		appType: 'custom',
		logLevel: 'silent',
		server: { middlewareMode: true }
	});
	t.after(() => server.close());
	const { actions } = await server.ssrLoadModule('/src/routes/admin/forgot/+page.server.ts');

	await t.test('returns the same response for known and unknown addresses', async () => {
		const known = await actions.default({
			locals: locals(async () => {}),
			request: request('known@example.com')
		});
		const unknown = await actions.default({
			locals: locals(async () => {
				throw new Error('unknown account');
			}),
			request: request('unknown@example.com')
		});

		assert.deepEqual(known, unknown);
		assert.deepEqual(known, { requested: true });
	});

	await t.test('rejects malformed addresses without contacting PocketBase', async () => {
		let contacted = false;
		const result = await actions.default({
			locals: locals(async () => {
				contacted = true;
			}),
			request: request('not-an-email')
		});

		assert.equal(result.status, 400);
		assert.equal(result.data.error, 'Enter a valid email address.');
		assert.equal(contacted, false);
	});
});
