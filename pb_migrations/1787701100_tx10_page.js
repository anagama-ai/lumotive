// Webvizio #80 (TX10 step): adds the TX10 product page at /tx10, rebuilt from
// https://lumotive.com/products/tx10-reference-design/ with this site's own
// blocks — the same pattern as /m30 (heroBand, splitDefault, cardsIconCards,
// mediaVideoEmbed, splitStackedCard, ctaDefault). Copy, figures and the two
// engagement paths (TX10 Reference Design and the TX10-DK Development Kit) are
// carried over verbatim; only the layout differs. Imagery lives in
// static/lumotive/img (fetched by scripts/dev/fetch-tx10-assets.mjs).
//
// Source notes: lumotive.com has no standalone "TX10 Development Kit" page
// (/products/tx10-development-kit/ and /products/tx10-dev/ both 404). The
// TX10-DK is documented inside the TX10 Reference Design page, so that page is
// the source and its DK section is carried over as its own block. The source
// page offers no downloads — no PDFs anywhere on it — and both of its links
// ("Learn more", "Contact Us") point at /contact, which is what this page does.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'tx10'
const PAGE_URL = '/tx10'
const DEV_KITS_SECTION_ID = '4bf76360'
const TX10_CARD_TITLE = 'TX10 Development Kit'

const CARD_LINK_AFTER = { label: 'Explore TX10', url: PAGE_URL }
const CARD_LINK_BEFORE = { label: 'Request TX10 information', url: '/contact' }

const PAGE_SECTIONS = [
	{
		id: 'b41d7c05',
		type: 'heroBand',
		eyebrow: 'TX10 Reference Design',
		heading: 'LM10 LCM-Based iToF Transmit Module',
		body: '<p>Software-Defined Beam Steering for the Longest-Range iToF Sensors</p>',
		media: { kind: 'url', value: '/lumotive/img/tx10-hero.jpg' },
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
		id: 'e8f2a934',
		type: 'splitDefault',
		heading: 'TX10 Key Features',
		body: '<p>The <strong>TX10</strong> is a fully developed <strong>LCM-based iToF transmit module reference design</strong> built around Lumotive’s LM10 programmable optical semiconductor. It enables 3D sensor developers to build longer-range, highly configurable iToF sensors without developing custom beam steering hardware.</p><p>TX10 is <strong>a core component enabling high performance 3D iToF sensors</strong>. It provides a validated transmitter architecture that can be integrated with a wide range of iToF receivers to accelerate development of next-generation 3D sensing systems.</p><p>Two engagement paths are available:</p><ul><li><strong>Transmit Reference Design</strong> – architecture, performance envelope, and design framework for building your own iToF sensor.</li><li><strong>TX10-DK Development Kit</strong> – a ready-to-evaluate implementation of the TX10 reference design for proof-of-concept and system integration.</li></ul>',
		media: { kind: 'url', value: '/lumotive/img/tx10-module-receiver.jpg' },
		mediaPosition: 'right',
		link: { type: 'custom', url: '/contact', label: 'Learn more', newTab: false },
		linkLabel: 'Learn more',
		linkUrl: '/contact',
		linkNewTab: false,
		designVersion: 'default',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'key-features'
	},
	{
		id: 'c05b6e71',
		type: 'splitDefault',
		heading: 'What is TX10?',
		body: '<p>TX10 is a <strong>solid-state programmable transmit architecture</strong> designed specifically for <strong>indirect time-of-flight (iToF) sensors</strong>.</p><p>Built on Lumotive’s Light Control Metasurface (LCM) technology, TX10 replaces traditional flash illumination with software-defined beam steering. The result is a compact transmitter capable of dynamically controlling steering range, beam divergence, dwell time, and scan patterns — all through software.</p>',
		media: { kind: 'url', value: '/lumotive/img/tx10-module-closeup.jpg' },
		mediaPosition: 'left',
		designVersion: 'default',
		background: 'subtle',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'what-is-tx10'
	},
	{
		id: '3ac9d5f8',
		type: 'cardsIconCards',
		heading: 'Key Capabilities of the TX10 Reference Design',
		cards: [
			{
				title: 'Software-Defined Beam Steering',
				body: '<p>TX10 provides up to <strong>105° steering range</strong> from a single solid-state module, enabling wide coverage without moving parts.</p><p>Average steering resolution is approximately <strong>0.5°</strong> across the full range, allowing precise spatial control and non-sequential scan patterns.</p>',
				accent: 'accent1'
			},
			{
				title: 'Programmable Beam Divergence',
				body: '<p>Unlike fixed illumination transmitters, TX10 enables dynamic beam shaping:</p><ul><li>Steering direction divergence programmable from approximately <strong>2.5° to 10°</strong> (application dependent)</li><li>Non-steering direction divergence defined by optics, with a default configuration of <strong>140°</strong>, and customizable from <strong>~20° to 190°</strong> using a single optical element</li></ul><p>This flexibility allows system designers to trade range, resolution, and frame rate through software rather than hardware redesign.</p>',
				accent: 'accent2'
			},
			{
				title: 'Designed for iToF Receiver Flexibility',
				body: '<p>TX10 integrates with a wide range of iToF receivers, including devices from leading vendors such as <strong>Onsemi</strong>, <strong>Sony</strong>, <strong>Gpixel</strong>, and others. This allows developers to maintain receiver choice while adopting programmable transmit capabilities.</p>',
				accent: 'accent3'
			}
		],
		designVersion: 'iconCards',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'capabilities'
	},
	{
		id: '7d1e40ba',
		type: 'splitDefault',
		heading: 'High Optical Efficiency',
		body: '<p>The LM10 LCM platform enables efficient optical power utilization by directing energy only where sensing is required.</p><p>Benefits include:</p><ul><li>Higher optical-to-electrical efficiency compared to flash illumination approaches</li><li>Reduced system power requirements</li><li>Longer effective range for iToF receivers</li></ul>',
		media: { kind: 'url', value: '/lumotive/img/tx10-performance-vs-cost.png' },
		mediaPosition: 'right',
		designVersion: 'default',
		background: 'subtle',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'optical-efficiency'
	},
	{
		id: '9b6c2f47',
		type: 'splitDefault',
		heading: 'Why Programmable Transmit Matters for iToF',
		body: '<p>Traditional iToF architectures are often limited by fixed illumination patterns and inefficient power distribution. TX10 demonstrates how programmable beam steering fundamentally changes iToF system performance.</p><p>Key advantages enabled by the reference design include:</p><ul><li><strong>Longest-range iToF sensing</strong> through concentrated illumination</li><li><strong>Configurable regions of interest</strong> for faster updates where needed</li><li><strong>Improved performance in high-dynamic-range scenes</strong>, including retroreflective materials</li><li><strong>Reduced multipath artifacts</strong> through controlled beam placement</li><li><strong>Minimal interference</strong> in multi-sensor environments</li></ul>',
		media: { kind: 'url', value: '/lumotive/img/tx10-module-laser.jpg' },
		mediaPosition: 'left',
		designVersion: 'default',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'why-programmable-transmit'
	},
	{
		id: '5e37a8dc',
		type: 'cardsIconCards',
		heading: 'TX10 Reference Design Advantages',
		cards: [
			{
				title: 'Accelerated Development',
				body: '<p>A fully developed transmitter architecture eliminates the need to design custom beam steering optics or semiconductor transmitters.</p>',
				accent: 'accent1'
			},
			{
				title: 'Software-Defined Sensing',
				body: '<p>Programmable steering, beam shaping, and scan sequencing allow developers to adapt sensor performance to different applications and environments.</p>',
				accent: 'accent2'
			},
			{
				title: 'Compact Solid-State Form Factor',
				body: '<p>Designed to meet the needs of modern robots where space is a premium and reliability is critical.</p>',
				accent: 'accent3'
			},
			{
				title: 'Scalable Performance Envelope',
				body: '<p>The reference design supports a wide range of implementations depending on optical configuration, laser choice, and system goals.</p>',
				accent: 'accent1'
			}
		],
		designVersion: 'iconCards',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'advantages'
	},
	{
		id: '1c8b93e6',
		type: 'splitStackedCard',
		eyebrow: 'TX10-DK Development Kit',
		heading: 'A Ready-to-Evaluate Implementation of the TX10 Reference Design',
		body: '<p>For teams looking to evaluate LCM transmit performance quickly, Lumotive offers the <strong>TX10-DK</strong>, a development kit representing one specific implementation of the TX10 reference design.</p><p>The TX10 enables:</p><ul><li>Rapid proof-of-concept development</li><li>Integration testing with iToF receivers</li><li>Evaluation of programmable steering and beam shaping</li></ul><p>Typical implementation parameters include:</p><ul><li>Peak optical power up to 35 W</li><li>910 nm operating wavelength</li><li>Programmable steering and divergence control</li><li>Python-based reference software for configuration</li></ul>',
		designVersion: 'stackedCard',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'tx10-dk'
	},
	{
		id: 'd6094ae2',
		type: 'cardsTextCards',
		intro: 'Speak with our team to discuss:',
		cards: [
			{ title: 'TX10 Reference Design adoption', accent: 'accent1' },
			{ title: 'TX10-DK evaluation kits', accent: 'accent2' },
			{ title: 'Custom transmitter configurations', accent: 'accent3' }
		],
		designVersion: 'textCards',
		background: 'none',
		width: 'contained',
		spacingTop: 'md',
		spacingBottom: 'md',
		anchor: 'contact-topics'
	},
	{
		id: '4f2a61cb',
		type: 'ctaDefault',
		heading: 'Contact Lumotive',
		primaryLink: { type: 'custom', url: '/contact', label: 'Contact Us', newTab: false },
		primaryLinkLabel: 'Contact Us',
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
	title: 'TX10 Reference Design',
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

	const card = section.cards.find((entry) => entry && entry.title === TX10_CARD_TITLE)
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
