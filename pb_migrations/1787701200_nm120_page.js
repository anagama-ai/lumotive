// Webvizio #80 (NM120 step): adds the NM120 Development Kit page at /nm120,
// rebuilt from https://lumotive.com/products/nm120-development-kit/ with this
// site's own blocks, following the /m30 and /tx10 pattern. Copy, the six
// specification tiles with their footnote, the ADAPS ADS6311 link, the Vimeo
// demo and both photographs are carried over verbatim; only the layout differs.
// Imagery lives in static/lumotive/img (scripts/dev/fetch-nm120-assets.mjs).
//
// Source notes: the official product name is "NM120 Development Kit" — a
// development kit, not a reference design, so it matches the existing /dev-kits
// card wording. The source page has no downloadable files (no PDFs); its only
// outbound link is the ADAPS ADS6311 product page, preserved here as a new-tab
// link inside the pixel-count spec tile. Its internal links ("Learn More",
// "Request More Details", "Contact Us") all point at /contact.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'nm120'
const PAGE_URL = '/nm120'
const DEV_KITS_SECTION_ID = '4bf76360'
const NM120_CARD_TITLE = 'NM120 Development Kit'

const CARD_LINK_AFTER = { label: 'Explore the NM120 Development Kit', url: PAGE_URL }
const CARD_LINK_BEFORE = { label: 'Request NM120 information', url: '/contact' }

const PAGE_SECTIONS = [
	{
		id: 'a7c0d613',
		type: 'heroBand',
		eyebrow: 'NM120 Development Kit',
		heading: 'Powered by LM10 Beamforming',
		body: '<p>A New Era For 3D Sensing</p>',
		media: { kind: 'url', value: '/lumotive/img/nm120-hero.jpg' },
		primaryLink: { type: 'custom', url: '/contact', label: 'Contact Us', newTab: false },
		primaryLinkLabel: 'Contact Us',
		primaryLinkUrl: '/contact',
		primaryLinkNewTab: false,
		designVersion: 'band',
		background: 'none',
		width: 'full',
		spacingTop: 'none',
		spacingBottom: 'none',
		anchor: ''
	},
	{
		id: 'f3b81e5a',
		type: 'splitStackedCard',
		heading: 'NM120 Key Features',
		body: '<p>The NM120 Development Kit gives developers a fast, straightforward way to explore the capabilities of Lumotive’s LCM beam‑steering technology integrated into a solid-state dToF lidar. It arrives ready to use with software, cables, and power accessories included, allowing you to get up and running to begin evaluating solid‑state scanning performance right out of the box.</p><p>Once deployed, the NM120 enables assessment of key performance metrics such as range, accuracy, resolution, detection reliability in varied environments, and power efficiency. It can be quickly integrated into prototypes to validate system behavior and support early demonstrations through API access and compatibility with ROS or custom frameworks. Developers can also use advanced features like dynamic Regions of Interest, Virtual Lidar, HCM, HDR, and Line Scan modes to bring real‑time applications to life.</p>',
		link: { type: 'custom', url: '/contact', label: 'Learn More', newTab: false },
		linkLabel: 'Learn More',
		linkUrl: '/contact',
		linkNewTab: false,
		designVersion: 'stackedCard',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'key-features'
	},
	{
		id: '6d24f9b7',
		type: 'cardsTextCards',
		eyebrow: '',
		heading: 'Specifications',
		intro: '* Software configurable, region-of-interest (ROI) capability',
		// Card titles pass through the shared titleCase helper, which would
		// capitalise units ("72 m" -> "72 M", "256 x 192" -> "256 X 192"), so every
		// figure lives in the card body, which renders raw. No source wording is
		// dropped; it is only split between title and body.
		cards: [
			{
				title: 'Simple to Build, Like a Camera',
				body: '<p>Truly Solid-State AI-Enabled 3D Sensing Platform</p>',
				accent: 'accent1'
			},
			{
				title: 'Range Class',
				body: '<p><strong>72 m</strong></p><p>32 m for 10% target reflectivity @ 100 klux ambient*</p>',
				accent: 'accent2'
			},
			{
				title: 'Wide Field of View',
				body: '<p><strong>120° x 90° *</strong></p>',
				accent: 'accent3'
			},
			{
				title: 'Pixels',
				body: '<p><strong>256 x 192</strong></p><p>Powered by <a href="https://www.adapsphotonics.com/en/product-55669-218658.html" target="_blank" rel="noopener noreferrer">ADAPS ADS6311</a></p>',
				accent: 'accent1'
			},
			{
				title: 'Full Frame',
				body: '<p><strong>30Hz</strong></p><p>900Hz in Regions of Interest</p>',
				accent: 'accent2'
			},
			{
				title: 'Optimized for Indoor and Outdoor Applications',
				body: '<p>Multiple returns and High Dynamic Range capabilities</p>',
				accent: 'accent3'
			}
		],
		designVersion: 'textCards',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'specifications'
	},
	{
		id: '2e95c4f1',
		type: 'splitDefault',
		heading: 'Key Advantages of the NM120 Development Kit',
		body: '<p><strong>Software-Defined Sensing</strong>: One sensor, many roles—adaptive scanning customizes field-of-view, range, and frame rates.</p><p><strong>Compact and Power-Efficient</strong>: Small form factor, integrated compute with ethernet interface, and &lt;17W power consumption for easy integration.</p><p><strong>All-in-One Perception</strong>: Replaces multiple sensors with a single hardware unit configurable for cliff detection, obstacle avoidance, SLAM, and more.</p><p><strong>Indoor and Outdoor Ready</strong>: Up to 72m max range, 120° x 90° field-of-view, and HDR mode for reliable navigation in varied environments.</p><p>The NM120 is a solid-state dToF lidar designed for a wide range of applications. Its high-performance features, compact design, and exceptional reliability due to an all-chip solid-state design make these sensors highly suitable for robotics, surveillance, forklifts, and automation.</p>',
		media: { kind: 'url', value: '/lumotive/img/nm120-sensor.jpg' },
		mediaPosition: 'right',
		designVersion: 'default',
		background: 'subtle',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'advantages'
	},
	{
		id: 'b8e176c3',
		type: 'splitStackedCard',
		heading: 'Precision Where It Matters Most',
		body: '<p>With software-defined scanning, you can use the NM120 to track fast-moving objects at high frame rates in regions of interest.</p><p>No hardware changes. No motion blur. Just sharp, dynamic perception — programmable by design.</p><p>Watch as the NM120 hits 80 fps while tracking a basketball dribble, stepping down from 90° to 10° FOV — all in software.</p>',
		designVersion: 'stackedCard',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'none',
		anchor: 'precision'
	},
	{
		id: '5f0ab728',
		type: 'mediaVideoEmbed',
		mode: 'video',
		videoUrl: 'https://player.vimeo.com/video/1102359216',
		designVersion: 'videoEmbed',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'demo'
	},
	{
		id: '9d5e3c80',
		type: 'ctaDefault',
		heading: 'Contact Lumotive',
		body: '<p>Speak with our team to discuss:</p><p>NM120 Development Kit adoption</p>',
		primaryLink: { type: 'custom', url: '/contact', label: 'Contact Us', newTab: false },
		primaryLinkLabel: 'Contact Us',
		primaryLinkUrl: '/contact',
		primaryLinkNewTab: false,
		secondaryLink: { type: 'custom', url: '/contact', label: 'Request More Details', newTab: false },
		secondaryLinkLabel: 'Request More Details',
		secondaryLinkUrl: '/contact',
		secondaryLinkNewTab: false,
		designVersion: 'default',
		background: 'none',
		width: 'full',
		spacingTop: 'lg',
		spacingBottom: 'lg',
		anchor: ''
	}
]

const PAGE_DATA = {
	title: 'NM120 Development Kit',
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

	const card = section.cards.find((entry) => entry && entry.title === NM120_CARD_TITLE)
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
