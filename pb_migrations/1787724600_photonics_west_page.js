// /photonics-west: the SPIE Photonics West 2025 page (lumotive.com/photonics-west)
// rebuilt from site sections. The live page's Pipedrive form no longer exists,
// so the closing contact CTA takes its place.
const PAGE_PATH = 'photonics-west'
const IMG = '/lumotive/img/photonics-west'

const link = (prefix, label, url, newTab) => ({
	[`${prefix}Link`]: { label, newTab, type: 'custom', url },
	[`${prefix}LinkLabel`]: label,
	[`${prefix}LinkNewTab`]: newTab,
	[`${prefix}LinkUrl`]: url
})

const SECTIONS = [
	{
		id: 'b0e40001',
		type: 'heroBand',
		designVersion: 'band',
		align: 'container',
		background: 'none',
		width: 'contained',
		spacingTop: 'none',
		spacingBottom: 'none',
		mobileShade: 'strong',
		eyebrow: 'Moscone Center booth #4102 · January 28–30, 2025',
		heading: 'See our award-winning LCM™ products in action at SPIE Photonics West',
		body: '<p>Lumotive, nominee for GSA’s 2024 Start-up to Watch Award, Laser Focus World’s Innovators Awards and CES Innovation Award 2025, will be showing all our latest advancements at booth #4102 at the Moscone Center in San Francisco, CA.</p>',
		media: { kind: 'url', value: `${IMG}/photonics-west-hero-poster.webp` },
		videoUrl: 'https://www.youtube.com/watch?v=rLC15b1luWc',
		logos: [
			{ media: { kind: 'url', value: `${IMG}/spie-photonics-west.png` }, name: 'SPIE Photonics West' },
			{ media: { kind: 'url', value: '/lumotive/img/ces/laser-focus-world-innovators-2024.png' }, name: 'Laser Focus World Innovators Awards 2024' },
			{ media: { kind: 'url', value: '/lumotive/img/ces/ces-innovation-awards-2025-honoree.png' }, name: 'CES Innovation Awards 2025 Honoree' }
		]
	},
	{
		id: 'b0e40002',
		type: 'splitDefault',
		designVersion: 'default',
		align: 'container',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		mediaPosition: 'left',
		eyebrow: 'LM10 digital beam steering module',
		heading: 'Unlock the full potential of the LM10',
		body: '<p>Join us to see how to unlock the full potential of the CES Innovation Award winning <strong>LM10 Digital Beam Steering Module</strong> with new solutions, development kits and reference designs across a wide range of 3D sensing, automotive, industrial and commercial markets.</p>',
		media: { kind: 'url', value: `${IMG}/lm10-lab-bench.webp` },
		mediaAlt: 'LM10 beam steering module on an optical bench',
		linkLabel: 'Explore the LM10',
		linkUrl: '/lcm-chips',
		linkNewTab: false
	},
	{
		id: 'b0e40003',
		type: 'ctaDefault',
		designVersion: 'default',
		align: 'container',
		background: 'none',
		width: 'contained',
		spacingTop: 'lg',
		spacingBottom: 'lg',
		textAlign: 'left',
		compactMobile: true,
		heading: 'Meet us at booth #4102',
		body: '<p>Book time with our team to see LCM in action or discuss your application.</p>',
		...link('primary', 'Talk to our team', '/contact', false)
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
		record.set('title', 'Photonics West')
		record.set('slug', 'photonics-west')
		record.set('path', PAGE_PATH)
		record.set('status', 'published')
		record.set('seoTitle', 'SPIE Photonics West')
		record.set('seoDescription', 'See Lumotive’s award-winning Light Control Metasurface (LCM™) products in action at SPIE Photonics West, Moscone Center booth #4102, January 28–30, 2025.')
		record.set('sections', SECTIONS)
		app.save(record)
	},
	(app) => {
		const record = findPage(app, PAGE_PATH)
		if (record) app.delete(record)
	}
)
