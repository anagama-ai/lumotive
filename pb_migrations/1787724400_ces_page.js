// /ces: the CES 2026 invitation (lumotive.com/ces) rebuilt from site sections:
// a full-bleed hero with the invite and award badges, and the CES meeting form.
const PAGE_PATH = 'ces'

const LOGO = (file, name) => ({ media: { kind: 'url', value: `/lumotive/img/ces/${file}` }, name })

const SECTIONS = [
	{
		id: 'ce5a0001',
		type: 'heroBand',
		designVersion: 'band',
		align: 'container',
		background: 'none',
		width: 'contained',
		spacingTop: 'none',
		spacingBottom: 'none',
		mobileShade: 'strong',
		eyebrow: 'CES 2026 · Westgate Hotel, Las Vegas',
		heading: 'Welcome to the new era of programmable optics',
		body: '<p>We invite you to experience the LCM products and platforms that are enabling the next generation of 3D perception and networking for the AI era. January 6–9, 2026.</p>',
		media: { kind: 'url', value: '/lumotive/img/ces/ces-hero-collage.webp' },
		primaryLinkLabel: 'Book a meeting',
		primaryLinkUrl: '#meet',
		primaryLinkNewTab: false,
		logos: [
			LOGO('laser-focus-world-innovators-2024.png', 'Laser Focus World Innovators Awards 2024'),
			LOGO('ces-innovation-awards-2025-honoree.png', 'CES Innovation Awards 2025 Honoree'),
			LOGO('gsa-awards-2024.png', 'GSA Awards Celebration 2024')
		]
	},
	{
		id: 'ce5a0003',
		type: 'formPipedrive',
		designVersion: 'pipedrive',
		align: 'container',
		anchor: 'meet',
		background: 'none',
		layout: 'centered',
		formFrame: 'dark',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		eyebrow: 'Book a meeting',
		heading: 'Meet the Lumotive team at CES',
		intro: "Complete the form below and we'll reach out shortly to answer your questions or schedule a meeting at CES 2026.",
		formUrl: 'https://webforms.pipedrive.com/f/1C8AJsbAA2rhW8dyDhWf0bmODw5IEol1vjmDVD4jb9H0Jq8ByKSeOVCcz9Pws4RYT'
	}
]

const findPage = (app, path) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findPage(app, PAGE_PATH) ?? new Record(app.findCollectionByNameOrId('pages'))
		record.set('title', 'CES 2026')
		record.set('slug', 'ces')
		record.set('path', PAGE_PATH)
		record.set('status', 'published')
		record.set('seoTitle', 'CES 2026')
		record.set('seoDescription',
			'Meet Lumotive at CES 2026, January 6–9 at the Westgate Hotel, Las Vegas. Experience the LCM products enabling 3D perception and networking for the AI era.')
		record.set('sections', SECTIONS)
		app.save(record)
	},
	(app) => {
		const record = findPage(app, PAGE_PATH)
		if (record) app.delete(record)
	}
)
