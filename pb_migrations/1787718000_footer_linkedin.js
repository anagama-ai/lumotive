// Site footer: the LinkedIn company URL (S1) is now supplied, so the footer's
// approved LinkedIn icon is switched on. `Footer.svelte` renders one icon per
// `globals.footer.socialLinks` entry whose platform has a mark (only
// LinkedIn), and editors manage the same rows under Admin → Site settings →
// Footer → Social links. `1787708000_footer_sitemap.js` held this back until
// the URL was confirmed.
//
// Forward appends the entry unless a LinkedIn row already exists; rollback
// removes only the row this migration adds (same platform and URL), so a row
// an editor added or changed is left alone. Nothing else in the footer, and no
// other global, changes: `globals.seo.socialChannels` and the site-meta
// "Social accounts" stay as they are, since no public component reads them.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const LINKEDIN = {
	platform: 'LinkedIn',
	url: 'https://www.linkedin.com/company/lumotive/home/',
	label: 'Lumotive on LinkedIn'
}

const isLinkedIn = (entry) => String(entry?.platform ?? '').trim().toLowerCase() === 'linkedin'

const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'footer' })
	} catch {
		return
	}
	let data
	try {
		data = JSON.parse(record.getString('data') || '{}')
	} catch {
		return
	}
	if (!data || typeof data !== 'object') return
	const socials = Array.isArray(data.socialLinks) ? data.socialLinks : []

	if (forward) {
		if (socials.some(isLinkedIn)) return
		data.socialLinks = [...socials, { ...LINKEDIN }]
	} else {
		const next = socials.filter((entry) => !(isLinkedIn(entry) && entry.url === LINKEDIN.url))
		if (next.length === socials.length) return
		// The seeded footer had no `socialLinks` key; leave it absent again.
		if (next.length) data.socialLinks = next
		else delete data.socialLinks
	}
	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
