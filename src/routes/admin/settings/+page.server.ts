import { redirect } from '@sveltejs/kit';

/** Settings is a group of sections; open the first one. */
export const load = () => redirect(307, '/admin/settings/site-meta');
