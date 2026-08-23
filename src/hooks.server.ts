import type { Handle } from '@sveltejs/kit';
import { ClientResponseError } from 'pocketbase';
import { createPB } from '$lib/pb';

const COOKIE = 'pb_auth';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.request.headers.get('cookie') ?? '';

	const pb = createPB();
	pb.authStore.loadFromCookie(cookies, COOKIE);

	let editor = null;
	if (!pb.authStore.isValid) {
		pb.authStore.clear();
	} else {
		try {
			await pb.collection('editors').authRefresh();
			editor = pb.authStore.record ? { ...pb.authStore.record } : null;
		} catch (error) {
			if (error instanceof ClientResponseError && (error.status === 401 || error.status === 403)) {
				pb.authStore.clear();
			}
		}
	}

	event.locals.pb = pb;
	event.locals.editor = editor;

	let response = await resolve(event);

	if (
		response.status === 404 &&
		(event.request.method === 'GET' || event.request.method === 'HEAD')
	) {
		const path = `/${event.url.pathname.replace(/^\/+|\/+$/g, '')}`;

		// Compared lowercased: the exclusion is a privilege boundary, and a case variant
		// such as /Admin/login must not become a redirect an editor can point anywhere.
		const guarded = path.toLowerCase();
		if (guarded !== '/admin' && !guarded.startsWith('/admin/')) {
			const bare = path.slice(1);
			const trailing = path === '/' ? path : `${path}/`;

			try {
				const match = await pb.collection('redirects').getFirstListItem(
					pb.filter(
						'active = true && (from = {:path} || from = {:bare} || from = {:trailing} || from = {:bareTrailing})',
						{ path, bare, trailing, bareTrailing: trailing.slice(1) }
					)
				);
				const destination = String(match.to ?? '').trim();
				if (destination) {
					response = new Response(null, { status: 308, headers: { location: destination } });
				}
			} catch {
				// No matching active redirect: keep the original 404 response.
			}
		}
	}

	// Write the (possibly refreshed, possibly cleared) token back out. Anonymous
	// visitors with no pb_auth cookie get no Set-Cookie header, so public pages
	// stay cacheable.
	if (pb.authStore.isValid || cookies.includes(`${COOKIE}=`)) {
		response.headers.append(
			'set-cookie',
			pb.authStore.exportToCookie(
				{
					httpOnly: true,
					secure: event.url.protocol === 'https:',
					sameSite: 'Lax',
					path: '/'
				},
				COOKIE
			)
		);
	}

	return response;
};
