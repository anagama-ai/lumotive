import { fail, redirect } from '@sveltejs/kit';
import { computePath, slugify, type PageNode } from '$lib/pages';
import type { Actions, PageServerLoad } from './$types';

const BULK_CONCURRENCY = 4;
const PAGE_SIZE = 25;

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
	const requestedPage = Number(url.searchParams.get('page'));
	const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
	const result = await locals.pb.collection('pages').getList(page, PAGE_SIZE, {
		sort,
		fields: 'id,title,slug,path,status,updated,sections'
	});

	return {
		sort,
		pages: result.items.map((p) => ({
			id: p.id,
			title: String(p.title ?? ''),
			slug: String(p.slug ?? ''),
			path: String(p.path ?? p.slug ?? ''),
			status: String(p.status ?? 'draft'),
			updated: String(p.updated ?? ''),
			sectionCount: Array.isArray(p.sections) ? p.sections.length : 0
		})),
		pagination: {
			page: result.page,
			perPage: result.perPage,
			totalItems: result.totalItems,
			totalPages: result.totalPages
		}
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const form = await request.formData();
		const submittedTitle = form.get('title');
		const title = submittedTitle === null ? 'Untitled page' : String(submittedTitle).trim();
		const parent = String(form.get('parent') ?? '');
		const pages = await locals.pb.collection('pages').getFullList();
		const byId = new Map<string, PageNode>(
			pages.map((page) => [
				page.id,
				{ id: page.id, slug: String(page.slug ?? ''), parent: String(page.parent ?? '') }
			])
		);

		if (parent && !byId.has(parent)) return fail(400, { error: 'That parent page no longer exists.' });

		const siblingSlugs = new Set(
			pages
				.filter((page) => String(page.parent ?? '') === parent)
				.map((page) => String(page.slug ?? ''))
		);
		const base = slugify(title) || 'page';
		let slug = base;
		for (let suffix = 2; siblingSlugs.has(slug); suffix += 1) slug = `${base}-${suffix}`;

		let recordId: string;
		try {
			recordId = (
				await locals.pb.collection('pages').create({
					title: title || 'Untitled page',
					slug,
					parent,
					path: computePath({ id: '', slug, parent }, byId),
					status: 'draft',
					sections: []
				})
			).id;
		} catch {
			return fail(400, {
				error: `A sibling page already uses the web address “${slug}”. Choose a unique slug.`
			});
		}
		redirect(303, `/admin/pages/${recordId}`);
	},

	delete: async ({ request, locals }) => {
		const id = String((await request.formData()).get('id') ?? '');
		if (!id) return fail(400, { error: 'Nothing to delete.' });

		const children = await locals.pb.collection('pages').getList(1, 1, {
			filter: locals.pb.filter('parent = {:id}', { id })
		});
		if (children.totalItems > 0) {
			return fail(400, {
				error: 'This page has child pages. Reassign or delete its children first.'
			});
		}

		try {
			await locals.pb.collection('pages').delete(id);
		} catch {
			return fail(400, { error: 'That page could not be deleted.' });
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
				error: `Your role cannot ${status === 'published' ? 'publish' : 'unpublish'} pages.`,
				changed: 0,
				results: ids.map((id) => ({
					id,
					ok: false,
					changed: false,
					message: 'Not attempted: insufficient permission.'
				}))
			});
		}

		const collection = locals.pb.collection('pages');
		const results: Array<{
			id: string;
			ok: boolean;
			changed: boolean;
			message: string;
		}> = new Array(ids.length);
		let next = 0;

		await Promise.all(
			Array.from({ length: Math.min(BULK_CONCURRENCY, ids.length) }, async () => {
				while (next < ids.length) {
					const index = next++;
					const id = ids[index];
					try {
						const record = await collection.getOne(id, {
							fields: 'id,status',
							requestKey: null
						});
						if (String(record.status ?? '') === status) {
							results[index] = {
								id,
								ok: true,
								changed: false,
								message: `Already ${status}.`
							};
							continue;
						}

						// Concurrent writes share an SDK cancellation key unless it is disabled.
						await collection.update(id, { status }, { requestKey: null });
						results[index] = {
							id,
							ok: true,
							changed: true,
							message: status === 'published' ? 'Published.' : 'Unpublished.'
						};
					} catch {
						results[index] = {
							id,
							ok: false,
							changed: false,
							message: 'Could not update this page.'
						};
					}
				}
			})
		);
		const changed = results.filter((result) => result.changed).length;

		if (results.some((result) => !result.ok)) {
			return fail(400, {
				bulk: true,
				error: `Changed ${changed} ${changed === 1 ? 'page' : 'pages'}; some records failed.`,
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
