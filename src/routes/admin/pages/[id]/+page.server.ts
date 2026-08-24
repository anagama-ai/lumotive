import { mediaValue, sectionSpecs, type FieldSpec } from '$lib/sections';
import { collectDescendants, computePath, wouldCycle, type PageNode } from '$lib/pages';
import { sanitizeRichText } from '$lib/richtext.server';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const restoreFields = [
	'title',
	'slug',
	'status',
	'seoTitle',
	'seoDescription',
	'sections',
	'parent',
	'path',
	'ogImage',
	'canonical',
	'noindex'
] as const;

const readSnapshot = (raw: unknown): Record<string, unknown> | null => {
	try {
		const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
		return value && typeof value === 'object' && !Array.isArray(value)
			? (value as Record<string, unknown>)
			: null;
	} catch {
		return null;
	}
};

const sanitizeFields = (record: Record<string, unknown>, fields: FieldSpec[]) => {
	for (const field of fields) {
		if (field.type === 'richtext') {
			record[field.name] = sanitizeRichText(String(record[field.name] ?? ''));
		} else if (field.type === 'list') {
			const rows = record[field.name];
			if (!Array.isArray(rows)) continue;
			for (const row of rows) {
				if (row && typeof row === 'object' && !Array.isArray(row)) {
					sanitizeFields(row as Record<string, unknown>, field.fields);
				}
			}
		}
	}
};

const sanitizeSections = (sections: unknown[]) => {
	for (const section of sections) {
		if (!section || typeof section !== 'object' || Array.isArray(section)) continue;
		const record = section as Record<string, unknown>;
		const spec = sectionSpecs[String(record.type ?? '')];
		if (spec) sanitizeFields(record, spec.fields);
	}
	return sections;
};

export const load: PageServerLoad = async ({ params, locals }) => {
	let record;
	try {
		record = await locals.pb.collection('pages').getOne(params.id);
	} catch {
		error(404, 'That page no longer exists.');
	}

	const [versions, records, forms] = await Promise.all([
		locals.pb.collection('content_versions').getFullList({
			filter: locals.pb.filter('collection = {:collection} && record = {:record}', {
				collection: 'pages',
				record: params.id
			}),
			sort: '-created',
			expand: 'editor'
		}),
		locals.pb.collection('pages').getFullList({ sort: 'title' }),
		locals.pb.collection('forms').getFullList({ sort: 'name', fields: 'id,name' })
	]);
	const byId = new Map<string, PageNode>(
		records.map((page) => [
			page.id,
			{ id: page.id, slug: String(page.slug ?? ''), parent: String(page.parent ?? '') }
		])
	);
	const isAdmin = locals.editor?.role === 'admin';

	return {
		page: {
			id: record.id,
			title: String(record.title ?? ''),
			slug: String(record.slug ?? ''),
			parent: String(record.parent ?? ''),
			path: String(record.path ?? record.slug ?? ''),
			status: String(record.status ?? 'draft'),
			seoTitle: String(record.seoTitle ?? ''),
			seoDescription: String(record.seoDescription ?? ''),
			ogImage: mediaValue(record.ogImage) ?? '',
			canonical: String(record.canonical ?? ''),
			noindex: Boolean(record.noindex),
			sections: Array.isArray(record.sections) ? record.sections : []
		},
		versions: versions.map((version) => {
			const snapshot = readSnapshot(version.snapshot);
			const expanded = Array.isArray(version.expand?.editor)
				? version.expand.editor[0]
				: version.expand?.editor;

			return {
				id: version.id,
				created: String(version.created ?? ''),
				editor: String(expanded?.name || expanded?.email || 'System'),
				canRestore:
					Boolean(snapshot) &&
					(isAdmin ||
						(record.status !== 'published' && snapshot?.status !== 'published'))
			};
		}),
		parents: records
			.filter((page) => page.id !== record.id && !wouldCycle(record.id, page.id, byId))
			.map((page) => ({
				id: page.id,
				title: String(page.title ?? '') || 'Untitled page',
				path: String(page.path ?? page.slug ?? '')
			})),
		forms: forms.map((form) => ({ id: form.id, name: String(form.name ?? '') }))
	};
};

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		const form = await request.formData();
		const slug = String(form.get('slug') ?? '')
			.trim()
			.replace(/^\/+/, '');

		if (!slug) return fail(400, { error: 'A page needs a web address.' });
		if (!/^[a-z0-9-]+$/.test(slug)) {
			return fail(400, {
				error: 'Web addresses can only use lowercase letters, numbers and hyphens.'
			});
		}

		const parent = String(form.get('parent') ?? '');
		const records = await locals.pb.collection('pages').getFullList();
		const byId = new Map<string, PageNode>(
			records.map((page) => [
				page.id,
				{ id: page.id, slug: String(page.slug ?? ''), parent: String(page.parent ?? '') }
			])
		);
		const current = byId.get(params.id);
		if (!current) return fail(404, { error: 'That page no longer exists.' });
		if (parent === params.id) {
			return fail(400, {
				error: 'A page cannot be its own ancestor because that would create a cycle.'
			});
		}
		if (parent && !byId.has(parent)) {
			return fail(400, { error: 'That parent page no longer exists.' });
		}
		if (wouldCycle(params.id, parent, byId)) {
			return fail(400, {
				error: 'That parent change would create a cycle. Choose a page outside this page’s descendants.'
			});
		}
		const collision = records.find(
			(page) =>
				page.id !== params.id &&
				String(page.parent ?? '') === parent &&
				String(page.slug ?? '') === slug
		);
		if (collision) {
			return fail(400, {
				error: `A sibling page already uses the web address “${slug}”. Choose a unique slug.`
			});
		}

		let sections: unknown;
		try {
			sections = JSON.parse(String(form.get('sections') ?? '[]'));
		} catch {
			return fail(400, { error: 'The sections could not be read. Reload the page and try again.' });
		}
		if (!Array.isArray(sections)) return fail(400, { error: 'The sections could not be read.' });
		sanitizeSections(sections);
		let ogImage;
		try {
			ogImage = mediaValue(JSON.parse(String(form.get('ogImage') ?? '""'))) ?? '';
		} catch {
			return fail(400, { error: 'The social sharing image could not be read.' });
		}

		const changed = current.slug !== slug || (current.parent || '') !== parent;
		const updated: PageNode = { ...current, slug, parent };
		byId.set(params.id, updated);

		let descendants: PageNode[] = [];
		let path: string;
		try {
			path = computePath(updated, byId);
			if (changed) descendants = collectDescendants(params.id, byId);
		} catch (cause) {
			return fail(400, {
				error: cause instanceof Error ? cause.message : 'The page hierarchy could not be read.'
			});
		}

		try {
			await locals.pb.collection('pages').update(params.id, {
				title: String(form.get('title') ?? '').trim() || 'Untitled page',
				slug,
				parent,
				path,
				status: form.get('status') === 'published' ? 'published' : 'draft',
				seoTitle: String(form.get('seoTitle') ?? '').trim(),
				seoDescription: String(form.get('seoDescription') ?? '').trim(),
				ogImage,
				canonical: String(form.get('canonical') ?? '').trim(),
				noindex: form.has('noindex'),
				sections
			});
			for (const descendant of descendants) {
				await locals.pb.collection('pages').update(descendant.id, {
					path: computePath(descendant, byId)
				});
			}
		} catch {
			return fail(400, {
				error: `Could not save. A sibling page may already use the web address “${slug}”.`
			});
		}

		return {
			saved: true,
			message:
				form.get('status') === 'published'
					? 'Saved. Your changes are live.'
					: locals.editor?.role === 'admin'
						? 'Saved. This page is still a draft — set it to Published when you are ready.'
						: 'Saved. This page remains a draft.'
		};
	},

	restore: async ({ request, params, locals }) => {
		const versionId = String((await request.formData()).get('version') ?? '');
		if (!versionId) return fail(400, { error: 'Choose a version to restore.' });

		let current;
		let version;
		try {
			[current, version] = await Promise.all([
				locals.pb.collection('pages').getOne(params.id),
				locals.pb.collection('content_versions').getOne(versionId)
			]);
		} catch {
			return fail(404, { error: 'That saved version is no longer available.' });
		}

		if (version.collection !== 'pages' || version.record !== params.id) {
			return fail(404, { error: 'That saved version does not belong to this page.' });
		}

		const snapshot = readSnapshot(version.snapshot);
		if (!snapshot) return fail(400, { error: 'That saved version cannot be restored.' });

		if (
			locals.editor?.role !== 'admin' &&
			(current.status === 'published' || snapshot.status === 'published')
		) {
			return fail(403, {
				error: 'Editors cannot restore published content or restore a version that publishes a draft.'
			});
		}

		const update: Record<string, unknown> = {};
		for (const field of restoreFields) {
			if (Object.prototype.hasOwnProperty.call(snapshot, field)) update[field] = snapshot[field];
		}
		if (Array.isArray(update.sections)) update.sections = sanitizeSections(update.sections);
		if (!Object.keys(update).length) {
			return fail(400, { error: 'That saved version has no page content to restore.' });
		}

		try {
			await locals.pb.collection('pages').update(params.id, update);
		} catch {
			return fail(400, { error: 'Could not restore that version.' });
		}

		return {
			restored: true,
			message: 'Version restored. The content replaced by it is now in history.'
		};
	}
};
