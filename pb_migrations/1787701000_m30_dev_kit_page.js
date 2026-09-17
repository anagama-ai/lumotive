// Webvizio #80 (M30 step): adds the M30 Development Kit product page at /m30,
// rebuilt from https://lumotive.com/products/m30-dev/ using this site's own
// blocks — heroBand, splitDefault, cardsIconCards, mediaVideoEmbed,
// statsLightTraits, cardsTextCards and ctaDefault — the same vocabulary the
// /lm10 product page uses. Product copy, specifications and figures are carried
// over verbatim; only the layout differs. Imagery lives in static/lumotive/img
// (fetched by scripts/dev/fetch-m30-assets.mjs) so it ships through GitHub.
//
// Source items that could not be carried over: the two point-cloud comparison
// clips ("Outdoor Performance Comparison", "Retroreflector and Multipath
// Comparison") are 404 on the origin CDN, and the source's only download-style
// link, /lm10#flyers, resolves to the LM10 product page with no flyers anchor
// and no PDFs — so "Learn more" points at this site's /lm10 page.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'm30'
const PAGE_URL = '/m30'
const DEV_KITS_SECTION_ID = '4bf76360'
const M30_CARD_TITLE = 'M30 Development Kit'

const CARD_LINK_AFTER = { label: 'Explore the M30 Development Kit', url: PAGE_URL }
const CARD_LINK_BEFORE = { label: 'Request M30 information', url: '/contact' }

const SPECS = [
	{ label: 'Availability', value: 'Now' },
	{ label: 'Featured LCM', value: 'LM10' },
	{ label: 'Absolute Maximum Range', value: '25 m' },
	{ label: 'Minimum Range', value: '0.1 m' },
	{ label: 'Range Performance†', value: '25 m', description: '85% target, 10 klux ambient' },
	{ label: 'Range Performance†', value: '10 m', description: '10% target, 100 klux ambient' },
	{ label: 'Field of View†', value: '120° (non-steering) x 90° (steering, programmable)' },
	{ label: 'Frame Rate†', value: '10 Hz full-frame' },
	{ label: 'Readout Rate†', value: '910 regions/second' },
	{ label: 'Supported Resolutions†', value: 'VGA (640×480)', description: 'QVGA†† (320×240)' },
	{ label: 'Power Consumption†', value: '8 W' },
	{ label: 'Dimensions', value: '55mm x 35mm x 25mm' },
	{ label: 'Operating Temperature', value: '−20°C to +70°C' },
	{ label: 'Eye Safety', value: 'Class 1' },
	{ label: 'Data Interface', value: 'MIPI' }
]

const PAGE_SECTIONS = [
	{
		id: '5a1c9f20',
		type: 'heroBand',
		eyebrow: 'M30 Development Kit',
		heading: 'iToF Development Kit powered by LM10 Programmable Optics',
		body: '<p>A New Era For 3D Sensing</p>',
		media: { kind: 'url', value: '/lumotive/img/m30-dev-hero.jpg' },
		primaryLink: { type: 'custom', url: '/contact', label: 'Talk to an expert', newTab: false },
		primaryLinkLabel: 'Talk to an expert',
		primaryLinkUrl: '/contact',
		primaryLinkNewTab: false,
		secondaryLink: { type: 'custom', url: '/lm10', label: 'Learn more', newTab: false },
		secondaryLinkLabel: 'Learn more',
		secondaryLinkUrl: '/lm10',
		secondaryLinkNewTab: false,
		designVersion: 'band',
		background: 'none',
		width: 'full',
		spacingTop: 'none',
		spacingBottom: 'none',
		anchor: ''
	},
	{
		id: '7b3e4c18',
		type: 'splitDefault',
		heading: 'M30 Key Features',
		body: '<p>The M30 Lidar Module Reference Design unveils exciting opportunities in 3D sensing. Utilizing Light Control Metasurface (LCM™) solid-state beamforming technology, the M30 achieves a range of over 25 meters, demonstrating reliable performance both outdoors and in environments with reflectors or multipath interference, all while being compact—smaller than a credit card. This Reference Design exemplifies how solid-state LCM beamforming modules can revolutionize the development of affordable, high-performance lidar systems featuring remarkable software programmability.</p>',
		media: { kind: 'url', value: '/lumotive/img/m30-dev-golf-ball.jpg' },
		mediaPosition: 'right',
		link: { type: 'custom', url: '/lm10', label: 'Learn more', newTab: false },
		linkLabel: 'Learn more',
		linkUrl: '/lm10',
		linkNewTab: false,
		designVersion: 'default',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'key-features'
	},
	{
		id: '2d9a71c4',
		type: 'cardsIconCards',
		cards: [
			{
				title: 'Out-of-the-Box',
				body: '<p>Developers want to quickly set up the tools and hardware to evaluate and learn about the new M30. The Development Kit includes software, cables, and power supply to simplify this process, allowing developers to focus on their applications.</p>',
				media: { kind: 'url', value: '/lumotive/img/icon-m30-out-of-the-box.png' },
				accent: 'accent1'
			},
			{
				title: 'Evaluation',
				body: '<p>For key performance indicators (KPIs) such as resolution, point cloud quality, multipath performance, and ROI capabilities.</p>',
				media: { kind: 'url', value: '/lumotive/img/icon-m30-evaluation.png' },
				accent: 'accent2'
			},
			{
				title: 'Prototyping',
				body: '<p>A LiDAR system user or developer should next look to incorporate the M30 into a possible application or use case, creating a proof of concept to confirm the system’s functionality and offer an initial validation demo.</p>',
				media: { kind: 'url', value: '/lumotive/img/icon-m30-prototyping.png' },
				accent: 'accent3'
			},
			{
				title: 'Demonstration',
				body: '<p>Finally, to demonstrate applications utilizing the ROS framework or an internal framework via integration with APIs.</p>',
				media: { kind: 'url', value: '/lumotive/img/icon-m30-demonstration.png' },
				accent: 'accent1'
			}
		],
		designVersion: 'iconCards',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'development-path'
	},
	{
		id: '4e8b05f3',
		type: 'mediaVideoEmbed',
		heading: 'Next Generation Hardware, Defined By Software',
		mode: 'image',
		items: [{ media: { kind: 'url', value: '/lumotive/img/m30-dev-hardware-software.png' } }],
		designVersion: 'videoEmbed',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'hardware-software'
	},
	{
		id: '9c27de6a',
		type: 'splitDefault',
		heading: 'Changing the Game For 3D Sensing',
		body: '<p>M30 marks the beginning of a new era of optical 3D sensing, delivering the performance of a scanning lidar sensor with all the benefits of a purely solid-state solution.</p><ul><li>Scalable in cost, size, and performance</li><li>Highly integrated, modular construction</li><li>Adaptive, software-defined functionality</li></ul>',
		media: { kind: 'url', value: '/lumotive/img/m30-dev-kit-contents.jpg' },
		mediaPosition: 'left',
		designVersion: 'default',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'changing-the-game'
	},
	{
		id: '1f5d84ab',
		type: 'statsLightTraits',
		eyebrow: 'Specifications',
		heading: 'M30 Lidar Module',
		intro: 'Specifications subject to change. † Lidar performance is software-defined through Lumotive’s Open Lidar API and can vary based on configuration. †† All other specifications are measured at the default resolution of QVGA.',
		stats: SPECS,
		designVersion: 'lightTraits',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'specifications'
	},
	{
		id: '6a04b9d7',
		type: 'cardsTextCards',
		heading: 'Ideal industries for M30 Development Kit',
		intro: 'Lumotive products scale across multiple industries and offer a wide range of applications',
		cards: [
			{ title: 'Automotive', accent: 'accent1' },
			{ title: 'Industrial', accent: 'accent2' },
			{ title: 'Commercial', accent: 'accent3' }
		],
		designVersion: 'textCards',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'industries'
	},
	{
		id: '8f21c5be',
		type: 'ctaDefault',
		heading: 'Talk to an expert',
		primaryLink: { type: 'custom', url: '/contact', label: 'Talk to an expert', newTab: false },
		primaryLinkLabel: 'Talk to an expert',
		primaryLinkUrl: '/contact',
		primaryLinkNewTab: false,
		designVersion: 'default',
		background: 'none',
		width: 'full',
		spacingTop: 'lg',
		spacingBottom: 'lg',
		anchor: ''
	}
]

const PAGE_DATA = {
	title: 'M30 Development Kit',
	slug: PAGE_PATH,
	path: PAGE_PATH,
	status: 'published',
	seoTitle: '',
	seoDescription: '',
	sections: PAGE_SECTIONS
}

const readSections = (record) => {
	try {
		const raw = record.getString('sections')
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const findPage = (app, path) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path })
	} catch {
		return null
	}
}

const setDevKitsCardLink = (app, link) => {
	const record = findPage(app, 'dev-kits')
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === DEV_KITS_SECTION_ID)
	if (!section || !Array.isArray(section.cards)) return

	const card = section.cards.find((entry) => entry && entry.title === M30_CARD_TITLE)
	if (!card) return

	card.linkLabel = link.label
	card.linkUrl = link.url
	card.linkNewTab = false
	card.link = { type: 'custom', url: link.url, label: link.label, newTab: false }

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		let record = findPage(app, PAGE_PATH)
		if (!record) record = new Record(app.findCollectionByNameOrId('pages'))

		for (const key of Object.keys(PAGE_DATA)) record.set(key, PAGE_DATA[key])
		app.save(record)

		setDevKitsCardLink(app, CARD_LINK_AFTER)
	},
	(app) => {
		setDevKitsCardLink(app, CARD_LINK_BEFORE)

		const record = findPage(app, PAGE_PATH)
		if (record) app.delete(record)
	}
)
