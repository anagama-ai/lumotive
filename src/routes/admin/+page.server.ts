import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [pages, posts] = await Promise.all([
		locals.pb.collection('pages').getList(1, 8, { sort: '-updated' }),
		locals.pb.collection('posts').getList(1, 5, { sort: '-updated' })
	]);

	return {
		counts: { pages: pages.totalItems, posts: posts.totalItems },
		recentPages: pages.items.map((p) => ({
			id: p.id,
			title: String(p.title ?? ''),
			slug: String(p.slug ?? ''),
			status: String(p.status ?? 'draft'),
			updated: String(p.updated ?? '')
		})),
		recentPosts: posts.items.map((p) => ({
			id: p.id,
			title: String(p.title ?? ''),
			status: String(p.status ?? 'draft'),
			updated: String(p.updated ?? '')
		}))
	};
};

export const actions: Actions = {
	logout: ({ cookies, locals, url }) => {
		locals.pb.authStore.clear();
		locals.editor = null;
		cookies.set('pb_auth', '', {
			httpOnly: true,
			secure: url.protocol === 'https:',
			sameSite: 'lax',
			path: '/',
			maxAge: 0
		});
		redirect(303, '/admin/login');
	}
};
