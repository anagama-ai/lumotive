import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface RedirectInput {
	from: string;
	to: string;
	active: boolean;
}

const adminOnly = (locals: App.Locals) => locals.editor?.role === 'admin';

const values = (form: FormData): RedirectInput => {
	const from = String(form.get('from') ?? '').trim();
	return {
		from: from ? `/${from.replace(/^\/+|\/+$/g, '')}` : '',
		to: String(form.get('to') ?? '').trim(),
		active: form.has('active')
	};
};

const bare = (path: string) => path.replace(/^\/+|\/+$/g, '');

const validate = (redirect: RedirectInput) => {
	if (!redirect.from) return 'A source path is required.';
	if (!redirect.to) return 'A destination is required.';
	// Lowercased to match the resolver, which excludes admin paths case-insensitively.
	// Without this a row like /Admin/login saves cleanly and then never resolves.
	const guarded = redirect.from.toLowerCase();
	if (guarded === '/admin' || guarded.startsWith('/admin/')) {
		return 'Admin pages cannot be redirected.';
	}
	if (bare(redirect.to) === bare(redirect.from)) {
		return 'A redirect cannot point at its own source path.';
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!adminOnly(locals)) error(403, 'Only administrators can manage redirects.');

	const records = await locals.pb.collection('redirects').getFullList({ sort: 'from' });
	return {
		redirects: records.map((record) => ({
			id: record.id,
			from: String(record.from ?? ''),
			to: String(record.to ?? ''),
			active: Boolean(record.active)
		}))
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (!adminOnly(locals)) return fail(403, { error: 'Only administrators can manage redirects.' });

		const redirect = values(await request.formData());
		const error = validate(redirect);
		if (error) return fail(400, { error });

		try {
			await locals.pb.collection('redirects').create(redirect);
		} catch {
			return fail(400, { error: 'That source path is already in use.' });
		}

		return { created: true };
	},

	save: async ({ request, locals }) => {
		if (!adminOnly(locals)) return fail(403, { error: 'Only administrators can manage redirects.' });

		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const redirect = values(form);
		const error = validate(redirect);
		if (!id) return fail(400, { error: 'Nothing to save.' });
		if (error) return fail(400, { error });

		try {
			await locals.pb.collection('redirects').update(id, redirect);
		} catch {
			return fail(400, { error: 'That redirect could not be saved. Its source path may already be in use.' });
		}

		return { saved: true };
	},

	delete: async ({ request, locals }) => {
		if (!adminOnly(locals)) return fail(403, { error: 'Only administrators can manage redirects.' });

		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'Nothing to delete.' });

		try {
			await locals.pb.collection('redirects').delete(id);
		} catch {
			return fail(400, { error: 'That redirect could not be deleted.' });
		}

		return { deleted: true };
	}
};
