import { randomBytes } from 'node:crypto';
import { loadEditorAccountOptions } from '$lib/editor-accounts.server';
import { error, fail } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import type { Actions, PageServerLoad } from './$types';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const adminOnly = (locals: App.Locals) => locals.editor?.role === 'admin';
const isRole = (value: string, roles: string[]) => roles.includes(value);

const pbFieldErrors = (cause: unknown): Record<string, string> => {
	if (!(cause instanceof ClientResponseError)) return {};
	const data = cause.response?.data;
	if (!data || typeof data !== 'object') return {};

	return Object.fromEntries(
		Object.entries(data).flatMap(([field, detail]) => {
			if (!detail || typeof detail !== 'object' || !('message' in detail)) return [];
			const message = String(detail.message ?? '');
			return message ? [[field, message]] : [];
		})
	);
};

const guard = (locals: App.Locals) =>
	adminOnly(locals) ? null : fail(403, { error: 'Only administrators can manage users.' });

export const load: PageServerLoad = async ({ locals }) => {
	if (!adminOnly(locals)) error(403, 'Only administrators can manage users.');

	const [{ roles }, editors] = await Promise.all([
		loadEditorAccountOptions(locals.pb),
		locals.pb.collection('editors').getFullList({
			sort: 'email',
			fields: 'id,email,name,role,created,verified'
		})
	]);

	return {
		currentEditorId: String(locals.editor?.id ?? ''),
		roles,
		editors: editors.map((editor) => ({
			id: editor.id,
			email: String(editor.email ?? ''),
			name: String(editor.name ?? ''),
			role: String(editor.role ?? ''),
			created: String(editor.created ?? ''),
			verified: Boolean(editor.verified)
		}))
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const denied = guard(locals);
		if (denied) return denied;

		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim().toLowerCase();
		const role = String(form.get('role') ?? '');
		const { roles, passwordMinimum, passwordMaximum } = await loadEditorAccountOptions(locals.pb);
		const fieldErrors: Record<string, string> = {};

		if (!EMAIL.test(email)) fieldErrors.email = 'Enter a valid email address.';
		if (!isRole(role, roles)) fieldErrors.role = 'Choose a valid role.';
		if (Object.keys(fieldErrors).length > 0) {
			return fail(400, {
				action: 'create',
				error: 'Check the highlighted fields.',
				fieldErrors,
				values: { email, role }
			});
		}

		const existing = await locals.pb.collection('editors').getList(1, 1, {
			filter: locals.pb.filter('email = {:email}', { email }),
			fields: 'id'
		});
		if (existing.totalItems > 0) {
			return fail(400, {
				action: 'create',
				error: 'Check the highlighted fields.',
				fieldErrors: { email: 'That email address is already in use.' },
				values: { email, role }
			});
		}

		const passwordLength = Math.min(passwordMaximum, Math.max(32, passwordMinimum));
		const password = randomBytes(passwordLength).toString('base64url').slice(0, passwordLength);
		try {
			await locals.pb.collection('editors').create({
				email,
				emailVisibility: true,
				role,
				password,
				passwordConfirm: password
			});
		} catch (cause) {
			const errors = pbFieldErrors(cause);
			return fail(400, {
				action: 'create',
				error: Object.keys(errors).length
					? 'Check the highlighted fields.'
					: 'That user could not be created.',
				fieldErrors: errors,
				values: { email, role }
			});
		}

		try {
			await locals.pb.collection('editors').requestPasswordReset(email);
		} catch {
			return {
				created: email,
				inviteFailed: true,
				error: `Created ${email}, but the set-password email could not be sent. Use Resend below to try again.`
			};
		}

		return {
			created: email,
			inviteSent: true,
			message: `Created ${email} and sent a set-password email.`
		};
	},

	changeRole: async ({ request, locals }) => {
		const denied = guard(locals);
		if (denied) return denied;

		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const role = String(form.get('role') ?? '');
		const { roles } = await loadEditorAccountOptions(locals.pb);
		if (!id || !isRole(role, roles)) return fail(400, { error: 'Choose a valid role.' });
		if (id === String(locals.editor?.id ?? '') && role !== 'admin') {
			return fail(400, { error: 'You cannot demote your own account.' });
		}

		try {
			const editor = await locals.pb.collection('editors').update(id, { role });
			const email = String(editor.email ?? 'User');
			return { roleChanged: email, message: `Updated ${email}.` };
		} catch (cause) {
			const errors = pbFieldErrors(cause);
			return fail(400, {
				error: Object.values(errors)[0] ?? 'That role could not be changed.'
			});
		}
	},

	resendInvite: async ({ request, locals }) => {
		const denied = guard(locals);
		if (denied) return denied;

		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'Choose a user.' });
		if (id === String(locals.editor?.id ?? '')) {
			return fail(400, { error: 'Another administrator must send your set-password email.' });
		}

		try {
			const editor = await locals.pb.collection('editors').getOne(id, { fields: 'id,email' });
			const email = String(editor.email ?? '');
			await locals.pb.collection('editors').requestPasswordReset(email);
			return { inviteSent: email, message: `Sent a set-password email to ${email}.` };
		} catch {
			return fail(400, { error: 'The set-password email could not be sent.' });
		}
	},

	delete: async ({ request, locals }) => {
		const denied = guard(locals);
		if (denied) return denied;

		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'Choose a user to delete.' });
		if (id === String(locals.editor?.id ?? '')) {
			return fail(400, { error: 'You cannot delete your own account.' });
		}

		try {
			const editor = await locals.pb.collection('editors').getOne(id, {
				fields: 'id,email,role'
			});
			if (editor.role === 'admin') {
				const admins = await locals.pb.collection('editors').getList(1, 1, {
					filter: 'role = "admin"',
					fields: 'id'
				});
				if (admins.totalItems <= 1) {
					return fail(400, { error: 'The last administrator cannot be deleted.' });
				}
			}
			await locals.pb.collection('editors').delete(id);
			const email = String(editor.email ?? 'User');
			return { deleted: email, message: `Deleted ${email}.` };
		} catch {
			return fail(400, { error: 'That user could not be deleted.' });
		}
	}
};
