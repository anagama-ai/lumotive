// /vision: the VISION Stuttgart 2026 invitation (lumotive.com/vision) rebuilt from
// site sections, like /ces: a full-bleed hero with the invite and show logo, and
// the VISION meeting form.
const PAGE_PATH = 'vision'
const IMG = '/lumotive/img/vision'

const SECTIONS = [
	{
		id: 'f1510001',
		type: 'heroBand',
		designVersion: 'band',
		align: 'container',
		background: 'none',
		width: 'contained',
		spacingTop: 'none',
		spacingBottom: 'none',
		mobileShade: 'strong',
		eyebrow: 'October 6–8, 2026 · Booth 10A85 · Messe Stuttgart, Germany',
		heading: 'Lumotive at VISION Stuttgart 2026',
		body: '<p>Join us at VISION Stuttgart, where Lumotive’s LCM™ platform takes center stage. Experience live demos of the programmable optics technology redefining 3D perception for the AI era, including a new collaboration with onsemi that pushes the boundaries of intelligent sensing even further.</p>',
		media: { kind: 'url', value: `${IMG}/vision-hero-robot-arms.webp` },
		primaryLinkLabel: 'Book a meeting',
		primaryLinkUrl: '#meet',
		primaryLinkNewTab: false,
		logos: [{ media: { kind: 'url', value: `${IMG}/vision-stuttgart-logo.png` }, name: 'VISION Stuttgart' }]
	},
	{
		id: 'f1510002',
		type: 'formPipedrive',
		designVersion: 'pipedrive',
		align: 'container',
		anchor: 'meet',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		layout: 'centered',
		formFrame: 'dark',
		eyebrow: 'Book a meeting',
		heading: 'Meet the Lumotive team at VISION',
		intro: "Complete the form below and we'll reach out shortly to answer your questions or schedule a meeting at VISION 2026.",
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
		record.set('title', 'VISION Stuttgart 2026')
		record.set('slug', 'vision')
		record.set('path', PAGE_PATH)
		record.set('status', 'published')
		record.set('seoTitle', 'VISION Stuttgart 2026')
		record.set('seoDescription', 'Meet Lumotive at VISION Stuttgart, October 6–8, 2026, booth 10A85, Messe Stuttgart. Live demos of programmable optics for 3D perception.')
		record.set('sections', SECTIONS)
		app.save(record)
	},
	(app) => {
		const record = findPage(app, PAGE_PATH)
		if (record) app.delete(record)
	}
)
