// /technology/light-control-metasurface-demonstration rebuilt from site sections
// (lumotive.com, same path): the demo-kit photo hero, the demonstration video
// with the LCM introduction, and the LM10 chip on a dark panel.
// /optical-circuit-switching-communications carries the same content as /connect,
// so it redirects there rather than duplicating the page.
const PAGE_PATH = 'technology/light-control-metasurface-demonstration'
const IMG = '/lumotive/img/lcm-demo'
const OCS_REDIRECT = { from: '/optical-circuit-switching-communications', to: '/connect' }

const SECTIONS = [
	{
		id: 'd3e00001',
		type: 'heroBand',
		designVersion: 'band',
		align: 'container',
		background: 'none',
		width: 'contained',
		spacingTop: 'none',
		spacingBottom: 'none',
		mobileShade: 'strong',
		eyebrow: 'Light Control Metasurface',
		heading: 'Light Control Metasurface demonstration kit',
		media: { kind: 'url', value: `${IMG}/lcm-demo-kit-hero.webp` },
		primaryLinkLabel: 'Watch the demonstration',
		primaryLinkUrl: '#demo',
		primaryLinkNewTab: false
	},
	{
		id: 'd3e00002',
		type: 'splitDefault',
		designVersion: 'default',
		align: 'container',
		anchor: 'demo',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		mediaPosition: 'right',
		mediaSpan: 'wide',
		heading: 'See LCM in action',
		body: '<p>Light Control Metasurface (LCM™) chips guide photons using the light-bending properties of metamaterial surfaces. Nanostructures smaller than the wavelength of light work together to both shape and steer optical energy in any direction within the field of view. LCMs are manufactured using conventional silicon fabrication processes available at semiconductor foundries worldwide. This results in products that are scalable into the billions of units, yet can be optimized for cost or performance to suit the application.</p>',
		videoUrl: 'https://www.youtube.com/watch?v=eflsovFnUuk'
	},
	{
		id: 'd3e00003',
		type: 'splitDarkPanel',
		designVersion: 'darkPanel',
		align: 'container',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		mediaPosition: 'left',
		heading: 'Light Control Metasurface',
		body: '<p>The groundbreaking Light Control Metasurface (LCM™) technology empowers precise manipulation of light at a sub-micron level by dynamically shaping and steering light on the surface of a chip without relying on any moving parts. From 3D sensing to high-speed communications and switching, the LCM beamforming chip is revolutionizing the global approach to programmable optics.</p><p>Best of all, <strong>it’s available today</strong>. <a href="/lcm-chips">Learn more about the LM10</a>.</p>',
		media: { kind: 'url', value: `${IMG}/lm10-chip.png` },
		mediaAlt: 'LM10 Light Control Metasurface chip',
		linkLabel: 'Learn more about LCM',
		linkUrl: '/platform',
		linkNewTab: false
	}
]

const find = (app, collection, filter, params) => {
	try {
		return app.findFirstRecordByFilter(collection, filter, params)
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const page = find(app, 'pages', 'path = {:path}', { path: PAGE_PATH }) ?? new Record(app.findCollectionByNameOrId('pages'))
		page.set('title', 'LCM Demonstration Kit')
		page.set('slug', 'light-control-metasurface-demonstration')
		page.set('path', PAGE_PATH)
		page.set('status', 'published')
		page.set('seoTitle', 'Light Control Metasurface Demonstration Kit')
		page.set('seoDescription', 'Watch the Light Control Metasurface (LCM™) demonstration kit shape and steer light on the surface of a chip, with no moving parts.')
		page.set('sections', SECTIONS)
		app.save(page)

		const redirect = find(app, 'redirects', 'from = {:from}', { from: OCS_REDIRECT.from }) ?? new Record(app.findCollectionByNameOrId('redirects'))
		redirect.set('from', OCS_REDIRECT.from)
		redirect.set('to', OCS_REDIRECT.to)
		redirect.set('active', true)
		app.save(redirect)
	},
	(app) => {
		const redirect = find(app, 'redirects', 'from = {:from}', { from: OCS_REDIRECT.from })
		if (redirect) app.delete(redirect)
		const page = find(app, 'pages', 'path = {:path}', { path: PAGE_PATH })
		if (page) app.delete(page)
	}
)
