import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

/**
 * @param {string} password
 * @param {string} passwordConfirm
 */
const request = (password, passwordConfirm) => {
	const form = new FormData();
	form.set('password', password);
	form.set('passwordConfirm', passwordConfirm);
	return new Request('http://localhost/admin/reset/token', { method: 'POST', body: form });
};

/**
 * @param {(token: string, password: string, passwordConfirm: string) => Promise<void>} confirmPasswordReset
 * @param {number} [passwordMinimum]
 * @param {number} [passwordMaximum]
 */
const locals = (confirmPasswordReset, passwordMinimum = 8, passwordMaximum = 71) => ({
	pb: {
		collection: () => ({ confirmPasswordReset }),
		send: async () => ({ roles: ['admin', 'editor'], passwordMinimum, passwordMaximum })
	}
});

test('password-reset action', async (t) => {
	const server = await createServer({
		appType: 'custom',
		logLevel: 'silent',
		server: { middlewareMode: true }
	});
	t.after(() => server.close());
	const { actions, load } = await server.ssrLoadModule(
		'/src/routes/admin/reset/[token]/+page.server.ts'
	);
	const local = locals(async () => {}, 12, 40);
	const { passwordMinimum, passwordMaximum } = await load({ locals: local });

	await t.test('loads the limits from the editors collection options', () => {
		assert.equal(passwordMinimum, 12);
		assert.equal(passwordMaximum, 40);
	});

	await t.test('rejects mismatched entries before confirming with PocketBase', async () => {
		let contacted = false;
		const password = 'long-enough-first';
		const result = await actions.default({
			locals: locals(async () => {
				contacted = true;
			}, passwordMinimum),
			params: { token: 'token' },
			request: request(password, 'long-enough-second')
		});

		assert.equal(result.status, 400);
		assert.equal(result.data.fieldErrors.passwordConfirm, 'Passwords do not match.');
		assert.equal(contacted, false);
		assert.equal(JSON.stringify(result).includes(password), false);
	});

	await t.test('rejects passwords below the editors collection minimum', async () => {
		let contacted = false;
		const password = 'x'.repeat(passwordMinimum - 1);
		const result = await actions.default({
			locals: locals(async () => {
				contacted = true;
			}, passwordMinimum),
			params: { token: 'token' },
			request: request(password, password)
		});

		assert.equal(result.status, 400);
		assert.equal(
			result.data.fieldErrors.password,
			`Password must be at least ${passwordMinimum} characters.`
		);
		assert.equal(contacted, false);
		assert.equal(JSON.stringify(result).includes(password), false);
	});

	await t.test('rejects passwords above PocketBase maximum before confirming', async () => {
		let contacted = false;
		const password = 'x'.repeat(passwordMaximum + 1);
		const result = await actions.default({
			locals: locals(
				async () => {
					contacted = true;
				},
				passwordMinimum,
				passwordMaximum
			),
			params: { token: 'token' },
			request: request(password, password)
		});

		assert.equal(result.status, 400);
		assert.equal(
			result.data.fieldErrors.password,
			`Password must be no more than ${passwordMaximum} characters.`
		);
		assert.equal(contacted, false);
		assert.equal(JSON.stringify(result).includes(password), false);
	});

	await t.test('refuses invalid and used tokens without echoing the password', async () => {
		const password = 'new-secret-password';
		const confirmPasswordReset = async () => {
			throw new Error('invalid token');
		};
		const invalid = await actions.default({
			locals: locals(confirmPasswordReset, passwordMinimum),
			params: { token: 'altered' },
			request: request(password, password)
		});
		const used = await actions.default({
			locals: locals(confirmPasswordReset, passwordMinimum),
			params: { token: 'already-used' },
			request: request(password, password)
		});

		assert.equal(invalid.status, 400);
		assert.deepEqual(invalid.data, used.data);
		assert.match(invalid.data.error, /request a new link/i);
		assert.equal(JSON.stringify(invalid).includes(password), false);
	});

	await t.test('redirects to sign in after a successful reset', async () => {
		await assert.rejects(
			actions.default({
				locals: locals(async () => {}, passwordMinimum),
				params: { token: 'valid' },
				request: request('new-secret-password', 'new-secret-password')
			}),
			(error) =>
				/** @type {{ status?: number, location?: string }} */ (error).status === 303 &&
				/** @type {{ status?: number, location?: string }} */ (error).location ===
					'/admin/login?reset=1'
		);
	});
});
