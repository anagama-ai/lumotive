import { error, fail } from '@sveltejs/kit';
import { mediaValue } from '$lib/sections';
import { sanitizeRichText } from '$lib/richtext.server';
import type { Actions, PageServerLoad } from './$types';

const restoreFields = [
	'title',
	'slug',
	'status',
	'excerpt',
	'body',
	'coverImage',
	'publishedAt',
	'ogImage',
	'seoTitle',
	'seoDescription',
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

export const load: PageServerLoad = async ({ params, locals }) => {
	let record;
	try {
		record = await locals.pb.collection('posts').getOne(params.id);
	} catch {
		error(404, 'That post no longer exists.');
	}

	const versions = await locals.pb.collection('content_versions').getFullList({
		filter: locals.pb.filter('collection = {:collection} && record = {:record}', {
			collection: 'posts',
			record: params.id
		}),
		sort: '-created',
		expand: 'editor'
	});
	const isAdmin = locals.editor?.role === 'admin';

	return {
		post: {
			id: record.id,
			title: String(record.title ?? ''),
			slug: String(record.slug ?? ''),
			status: String(record.status ?? 'draft'),
			excerpt: String(record.excerpt ?? ''),
			body: String(record.body ?? ''),
			coverImage: record.coverImage ?? '',
			ogImage: mediaValue(record.ogImage) ?? '',
			seoTitle: String(record.seoTitle ?? ''),
			seoDescription: String(record.seoDescription ?? ''),
			canonical: String(record.canonical ?? ''),
			noindex: Boolean(record.noindex),
			// <input type="date"> wants YYYY-MM-DD.
			publishedAt: String(record.publishedAt ?? '').slice(0, 10)
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
		})
	};
};

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		const form = await request.formData();
		const slug = String(form.get('slug') ?? '')
			.trim()
			.replace(/^\/+/, '');

		if (!slug) return fail(400, { error: 'A post needs a web address.' });
		if (!/^[a-z0-9-]+$/.test(slug)) {
			return fail(400, {
				error: 'Web addresses can only use lowercase letters, numbers and hyphens.'
			});
		}

		let coverImage: unknown = '';
		const rawCoverImage = String(form.get('coverImage') ?? '');
		if (rawCoverImage) {
			try {
				coverImage = JSON.parse(rawCoverImage);
			} catch {
				return fail(400, { error: 'The selected cover image is invalid.' });
			}
			if (!mediaValue(coverImage)) {
				return fail(400, { error: 'The selected cover image is invalid.' });
			}
		}
		let ogImage: ReturnType<typeof mediaValue> | '' = '';
		const rawOgImage = String(form.get('ogImage') ?? '');
		if (rawOgImage) {
			try {
				ogImage = mediaValue(JSON.parse(rawOgImage)) ?? '';
			} catch {
				return fail(400, { error: 'The social sharing image could not be read.' });
			}
			if (!ogImage) return fail(400, { error: 'The social sharing image is invalid.' });
		}

		const date = String(form.get('publishedAt') ?? '').trim();

		let publishedAt: string;

		try {
			const current = await locals.pb.collection('posts').getOne(params.id);
			const currentPublishedAt = String(current.publishedAt ?? '');
			publishedAt =
				date === currentPublishedAt.slice(0, 10)
					? currentPublishedAt
					: date
						? `${date}${currentPublishedAt.slice(10) || ' 00:00:00.000Z'}`
						: '';
			await locals.pb.collection('posts').update(params.id, {
				title: String(form.get('title') ?? '').trim() || 'Untitled post',
				slug,
				status: form.get('status') === 'published' ? 'published' : 'draft',
				excerpt: String(form.get('excerpt') ?? ''),
				coverImage,
				body: sanitizeRichText(String(form.get('body') ?? '')),
				ogImage,
				seoTitle: String(form.get('seoTitle') ?? '').trim(),
				seoDescription: String(form.get('seoDescription') ?? '').trim(),
				canonical: String(form.get('canonical') ?? '').trim(),
				noindex: form.has('noindex'),
				publishedAt
			});
		} catch {
			return fail(400, {
				error: `Could not save. The web address “${slug}” may already be used by another post.`
			});
		}

		return { saved: true };
	},

	restore: async ({ request, params, locals }) => {
		const versionId = String((await request.formData()).get('version') ?? '');
		if (!versionId) return fail(400, { error: 'Choose a version to restore.' });

		let current;
		let version;
		try {
			[current, version] = await Promise.all([
				locals.pb.collection('posts').getOne(params.id),
				locals.pb.collection('content_versions').getOne(versionId)
			]);
		} catch {
			return fail(404, { error: 'That saved version is no longer available.' });
		}

		if (version.collection !== 'posts' || version.record !== params.id) {
			return fail(404, { error: 'That saved version does not belong to this post.' });
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
		if (Object.prototype.hasOwnProperty.call(update, 'body')) {
			update.body = sanitizeRichText(String(update.body ?? ''));
		}
		if (!Object.keys(update).length) {
			return fail(400, { error: 'That saved version has no post content to restore.' });
		}

		try {
			await locals.pb.collection('posts').update(params.id, update);
		} catch {
			return fail(400, { error: 'Could not restore that version.' });
		}

		return { restored: true };
	}
};
