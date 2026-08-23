import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const sorts: Record<string, true> = {
	title: true,
	'-title': true,
	status: true,
	'-status': true,
	updated: true,
	'-updated': true
};

export const load: PageServerLoad = async ({ locals, url }) => {
	const requestedSort = url.searchParams.get('sort') ?? '-updated';
	const sort = sorts[requestedSort] === true ? requestedSort : '-updated';
	const items = await locals.pb.collection('posts').getFullList({ sort });

	return {
		sort,
		posts: items.map((p) => ({
			id: p.id,
			title: String(p.title ?? ''),
			slug: String(p.slug ?? ''),
			status: String(p.status ?? 'draft'),
			publishedAt: String(p.publishedAt ?? ''),
			updated: String(p.updated ?? '')
		}))
	};
};

export const actions: Actions = {
	create: async ({ locals }) => {
		const record = await locals.pb.collection('posts').create({
			title: 'Untitled post',
			slug: `post-${crypto.randomUUID().slice(0, 5)}`,
			status: 'draft'
		});
		redirect(303, `/admin/posts/${record.id}`);
	},

	delete: async ({ request, locals }) => {
		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'Nothing to delete.' });

		try {
			await locals.pb.collection('posts').delete(id);
		} catch {
			return fail(400, { error: 'That post could not be deleted.' });
		}

		return { deleted: true };
	},

	bulk: async ({ request, locals }) => {
		const form = await request.formData();
		const ids = [...new Set(form.getAll('id').map(String).filter(Boolean))];
		const status = String(form.get('status') ?? '');

		if (ids.length === 0) {
			return fail(400, {
				bulk: true,
				error: 'No records were selected.',
				changed: 0,
				results: []
			});
		}

		if (status !== 'published' && status !== 'draft') {
			return fail(400, {
				bulk: true,
				error: 'Choose publish or unpublish.',
				changed: 0,
				results: ids.map((id) => ({
					id,
					ok: false,
					changed: false,
					message: 'Not attempted: invalid action.'
				}))
			});
		}

		if (String(locals.editor?.role ?? '') !== 'admin') {
			return fail(403, {
				bulk: true,
				error: `Your role cannot ${status === 'published' ? 'publish' : 'unpublish'} posts.`,
				changed: 0,
				results: ids.map((id) => ({
					id,
					ok: false,
					changed: false,
					message: 'Not attempted: insufficient permission.'
				}))
			});
		}

		const collection = locals.pb.collection('posts');
		const results: Array<{
			id: string;
			ok: boolean;
			changed: boolean;
			message: string;
		}> = [];
		let changed = 0;

		for (const id of ids) {
			try {
				const record = await collection.getOne(id);
				if (String(record.status ?? '') === status) {
					results.push({
						id,
						ok: true,
						changed: false,
						message: `Already ${status}.`
					});
					continue;
				}

				await collection.update(id, { status });
				changed += 1;
				results.push({
					id,
					ok: true,
					changed: true,
					message: status === 'published' ? 'Published.' : 'Unpublished.'
				});
			} catch {
				results.push({
					id,
					ok: false,
					changed: false,
					message: 'Could not update this post.'
				});
			}
		}

		if (results.some((result) => !result.ok)) {
			return fail(400, {
				bulk: true,
				error: `Changed ${changed} ${changed === 1 ? 'post' : 'posts'}; some records failed.`,
				changed,
				results
			});
		}

		return {
			bulk: true,
			changed,
			results
		};
	}
};
