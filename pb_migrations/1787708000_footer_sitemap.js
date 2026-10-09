// Site footer, approved content package rev. 2026-10-07. Every page in the
// package carries the same marker: "FOOTER FOLLOWS NEW SITE MAP; LINKEDIN ICON
// ADDED". This rebuilds the footer navigation to the page 01 site map.
//
// Changes:
//   Platform  gains "LCM chips" (/lcm-chips); "LCM platform" becomes the
//             package's label "LCM technology".
//   Sense     gains "Robotics" and "Automotive"; the "LM10 chip" entry is
//             removed, since /lm10 is retired and redirects to /lcm-chips;
//             "Dev kits & reference designs" shortens to the package's
//             "Dev kits".
//   Connect   "Overview" becomes "Optical circuit switching".
//   Company   "Culture" becomes "Culture & careers" and "News" becomes
//             "News & events"; the separate "Careers" entry is removed,
//             because careers now live on /culture.
//
// The copyright line and the Privacy Policy legal link are left untouched.
//
// The LinkedIn icon is NOT added here. The package shows the icon but never
// prints the URL, and no verified Lumotive company URL exists in this project:
// `globals.seo.socialChannels` is empty and nothing in the repo, the page
// content or the 112 news posts references linkedin.com. Footer.svelte reads an
// optional `socialLinks` array and renders the icon as soon as one is supplied,
// so adding the verified URL is a data-only change. Guessing it is not an
// option.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const sub = (label, url) => ({
	link: { label, newTab: false, type: 'custom', url },
	linkLabel: label,
	linkNewTab: false,
	linkUrl: url
})

const NEXT_NAV = [
	{
		title: 'Platform',
		subNavItems: [
			sub('LCM technology', '/platform'),
			sub('LCM chips', '/lcm-chips'),
			sub('Applications', '/applications')
		]
	},
	{
		title: 'Sense',
		subNavItems: [
			sub('Overview', '/sense'),
			sub('Robotics', '/sense/robotics'),
			sub('Automotive', '/sense/automotive'),
			sub('Dev kits', '/dev-kits')
		]
	},
	{
		title: 'Connect',
		subNavItems: [sub('Optical circuit switching', '/connect')]
	},
	{
		title: 'Company',
		subNavItems: [
			sub('About', '/about'),
			sub('Culture & careers', '/culture'),
			sub('Partners', '/partners'),
			sub('News & events', '/news'),
			sub('Contact', '/contact')
		]
	}
]

const PREV_NAV = [
	{
		title: 'Platform',
		subNavItems: [sub('LCM platform', '/platform'), sub('Applications', '/applications')]
	},
	{
		title: 'Sense',
		subNavItems: [
			sub('Overview', '/sense'),
			sub('LM10 chip', '/lm10'),
			sub('Dev kits & reference designs', '/dev-kits')
		]
	},
	{
		title: 'Connect',
		subNavItems: [sub('Overview', '/connect')]
	},
	{
		title: 'Company',
		subNavItems: [
			sub('About', '/about'),
			sub('Culture', '/culture'),
			sub('Partners', '/partners'),
			sub('News', '/news'),
			sub('Careers', 'https://jobs.lever.co/lumotive'),
			sub('Contact', '/contact')
		]
	}
]

const findFooter = (app) => {
	try {
		return app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'footer' })
	} catch {
		return null
	}
}

const apply = (app, navItems) => {
	const record = findFooter(app)
	if (!record) return

	let data
	try {
		data = JSON.parse(record.getString('data') || '{}')
	} catch {
		return
	}
	if (!data || typeof data !== 'object') return

	// Copyright and legalLinks are deliberately left as they are.
	data.navItems = JSON.parse(JSON.stringify(navItems))

	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, NEXT_NAV)
	},
	(app) => {
		apply(app, PREV_NAV)
	}
)
