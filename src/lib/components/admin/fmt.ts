/** PocketBase datetimes come back as "2026-08-20 12:00:00.000Z". */
export function when(value: string): string {
	if (!value) return '—';
	const d = new Date(value.replace(' ', 'T'));
	if (Number.isNaN(d.getTime())) return value;
	return d.toLocaleString(undefined, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

/** Public URL of a page: the `home` slug lives at the site root. */
export const pageHref = (slug: string) => (slug === 'home' ? '/' : `/${slug}`);
