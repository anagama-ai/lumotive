// /events/event-landing: the event handout page (lumotive.com/events/event-landing)
// rebuilt as one full-screen hero: the flyers in a Download flyers dropdown, and the contact
// and "Learn more about LCM" links in its body.
const PAGE_PATH = 'events/event-landing'

const SECTIONS = [
	{
		id: 'e7e10001',
		type: 'heroFullHeight',
		designVersion: 'fullHeight',
		align: 'container',
		background: 'none',
		width: 'contained',
		spacingTop: 'none',
		spacingBottom: 'none',
		mobileShade: 'strong',
		mediaAnchor: '100%',
		contentAlign: 'center',
		heading: 'Welcome to the new era of programmable optics',
		body: '<p>Speak with our team to discuss your application needs: <a href="/contact">contact us</a>, or <a href="/platform">learn more about LCM</a>.</p>',
		media: { kind: 'url', value: '/lumotive/img/lcm-chip-in-hand-hero.webp' },
		menuLabel: 'Download flyers',
		menuLinks: [
			{ label: 'LCM and development kits flyer', url: '/lumotive/docs/2026-Q4-Vision-Stuttgart.pdf' },
			{ label: 'NM120 flyer', url: '/lumotive/docs/Lumotive-NM120.pdf' }
		]
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
		record.set('title', 'Events')
		record.set('slug', 'event-landing')
		record.set('path', PAGE_PATH)
		record.set('status', 'published')
		record.set('seoTitle', 'Events')
		record.set('seoDescription', 'Welcome to the new era of programmable optics. Download the LCM, development kit and NM120 flyers, or speak with the Lumotive team.')
		record.set('sections', SECTIONS)
		app.save(record)
	},
	(app) => {
		const record = findPage(app, PAGE_PATH)
		if (record) app.delete(record)
	}
)
