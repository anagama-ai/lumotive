import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'vite';

/** @param {Record<string, string>} values */
const request = (values) => {
	const form = new FormData();
	for (const [key, value] of Object.entries(values)) form.set(key, value);
	return new Request('http://localhost/admin/users', { method: 'POST', body: form });
};

/**
 * @param {Record<string, unknown>} editor
 * @param {any} [collection]
 * @param {{ roles?: string[], passwordMinimum?: number, passwordMaximum?: number }} [options]
 */
const locals = (editor, collection = {}, options = {}) => ({
	editor,
	pb: {
		collection: () => collection,
		filter: () => 'filtered',
		send: async () => ({
			roles: options.roles ?? ['admin', 'editor'],
			passwordMinimum: options.passwordMinimum ?? 8,
			passwordMaximum: options.passwordMaximum ?? 71
		})
	}
});

test('user management actions', async (t) => {
	const server = await createServer({
		appType: 'custom',
		logLevel: 'silent',
		server: { middlewareMode: true }
	});
	t.after(() => server.close());
	const { actions, load } = await server.ssrLoadModule('/src/routes/admin/users/+page.server.ts');

	await t.test('refuses a non-admin load and every action', async () => {
		const editorLocals = locals({ id: 'editor-id', role: 'editor' });
		await assert.rejects(
			load({ locals: editorLocals }),
			(error) => /** @type {{ status?: number }} */ (error).status === 403
		);

		for (const [name, action] of Object.entries(actions)) {
			const result = await action({ locals: editorLocals, request: request({}) });
			assert.equal(result.status, 403, name);
		}
	});

	await t.test('loads role choices from the editors collection options', async () => {
		const result = await load({
			locals: locals({ id: 'admin-id', role: 'admin' }, { getFullList: async () => [] })
		});
		assert.deepEqual(result.roles, ['admin', 'editor']);
	});

	await t.test('refuses self-demotion', async () => {
		const result = await actions.changeRole({
			locals: locals({ id: 'admin-id', role: 'admin' }),
			request: request({ id: 'admin-id', role: 'editor' })
		});
		assert.equal(result.status, 400);
		assert.equal(result.data.error, 'You cannot demote your own account.');
	});

	await t.test('refuses self-deletion', async () => {
		const result = await actions.delete({
			locals: locals({ id: 'admin-id', role: 'admin' }),
			request: request({ id: 'admin-id' })
		});
		assert.equal(result.status, 400);
		assert.equal(result.data.error, 'You cannot delete your own account.');
	});

	await t.test('refuses deletion of the last admin', async () => {
		let deleted = false;
		const collection = {
			getOne: async () => ({ id: 'last-admin', email: 'last@example.com', role: 'admin' }),
			getList: async () => ({ totalItems: 1 }),
			delete: async () => {
				deleted = true;
			}
		};
		const result = await actions.delete({
			locals: locals({ id: 'signed-in-admin', role: 'admin' }, collection),
			request: request({ id: 'last-admin' })
		});
		assert.equal(result.status, 400);
		assert.equal(result.data.error, 'The last administrator cannot be deleted.');
		assert.equal(deleted, false);
	});

	await t.test('creates with a generated schema-compliant password and requests an invitation', async () => {
		/** @type {Record<string, string>} */
		let created = {};
		let invited = '';
		const collection = {
			getList: async () => ({ totalItems: 0 }),
			create: async (/** @type {Record<string, string>} */ body) => {
				created = body;
			},
			requestPasswordReset: async (/** @type {string} */ email) => {
				invited = email;
			}
		};
		const result = await actions.create({
			locals: locals({ id: 'admin-id', role: 'admin' }, collection, {
				passwordMinimum: 60,
				passwordMaximum: 71
			}),
			request: request({
				email: 'new@example.com',
				role: 'editor',
				password: 'admin-chosen-password'
			})
		});

		assert.equal(result.created, 'new@example.com');
		assert.equal(result.inviteSent, true);
		assert.equal(invited, 'new@example.com');
		assert.equal(created.email, 'new@example.com');
		assert.equal(created.role, 'editor');
		assert.equal(created.password, created.passwordConfirm);
		assert.equal(created.password.length, 60);
		assert.notEqual(created.password, 'admin-chosen-password');
		assert.equal(JSON.stringify(result).includes(created.password), false);
	});

	await t.test('reports invitation failure without failing the completed create', async () => {
		let created = false;
		const collection = {
			getList: async () => ({ totalItems: 0 }),
			create: async () => {
				created = true;
			},
			requestPasswordReset: async () => {
				throw new Error('mail unavailable');
			}
		};
		const result = await actions.create({
			locals: locals({ id: 'admin-id', role: 'admin' }, collection),
			request: request({ email: 'new@example.com', role: 'editor' })
		});

		assert.equal(created, true);
		assert.equal(result.created, 'new@example.com');
		assert.equal(result.inviteFailed, true);
		assert.equal(result.status, undefined);
	});

	await t.test('refuses to resend an invitation to the acting admin', async () => {
		let contacted = false;
		const collection = {
			getOne: async () => {
				contacted = true;
			}
		};
		const result = await actions.resendInvite({
			locals: locals({ id: 'admin-id', role: 'admin' }, collection),
			request: request({ id: 'admin-id' })
		});

		assert.equal(result.status, 400);
		assert.equal(result.data.error, 'Another administrator must send your set-password email.');
		assert.equal(contacted, false);
	});
});
