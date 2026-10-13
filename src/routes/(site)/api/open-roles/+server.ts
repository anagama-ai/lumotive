import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Lever publishes Lumotive's board as an unauthenticated JSON feed. Fetching it
// here rather than from the browser keeps the request same-origin, so the
// section needs no CORS allowance and no key, and lets one short cache serve
// every visitor instead of each of them hitting Lever.
const FEED = 'https://api.lever.co/v0/postings/lumotive?mode=json';
const BOARD = 'https://jobs.lever.co/lumotive';
const LIMIT = 6;
const headers = {
	'cache-control': 'public, max-age=900, stale-while-revalidate=3600'
};

type Posting = {
	text?: unknown;
	hostedUrl?: unknown;
	applyUrl?: unknown;
	createdAt?: unknown;
	categories?: { team?: unknown; department?: unknown; location?: unknown };
};

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const response = await fetch(FEED);
		if (!response.ok) throw new Error(`lever ${response.status}`);

		const postings = (await response.json()) as Posting[];
		if (!Array.isArray(postings)) throw new Error('lever payload');

		const roles = postings
			.map((posting) => {
				const title = String(posting.text ?? '').trim();
				// `hostedUrl` is the public posting page; `applyUrl` jumps straight to
				// the form. Prefer the posting, so a visitor can read it before
				// applying, and fall back rather than dropping the role.
				const url = String(posting.hostedUrl || posting.applyUrl || '').trim();
				if (!title || !url) return null;

				const team = String(posting.categories?.team ?? posting.categories?.department ?? '').trim();
				const location = String(posting.categories?.location ?? '').trim();
				const createdAt = Number(posting.createdAt);

				return {
					title,
					// The package prints "[Team] · [Location]", so an entry missing one
					// of the two prints the other alone rather than a stray separator.
					meta: [team, location].filter(Boolean).join(' · '),
					url,
					createdAt: Number.isFinite(createdAt) ? createdAt : 0
				};
			})
			.filter((role): role is NonNullable<typeof role> => role !== null)
			.sort((a, b) => b.createdAt - a.createdAt)
			.slice(0, LIMIT)
			.map(({ createdAt: _createdAt, ...role }) => role);

		return json({ roles, board: BOARD }, { headers });
	} catch {
		// The dev note on package page 18: "If no feed is possible, keep only the
		// button." An empty list is how the section is told to do that.
		return json({ roles: [], board: BOARD }, { headers });
	}
};
