// Sense › Dev Kits › Transmit Modules (/dev-kits/transmit-modules), approved
// content package rev. 2026-10-07, page 13 of 21. "CHANGE · TRANSMIT MODULE
// TEMPLATE".
//
// This is a move and a rewrite, not an addition. The existing /tx10 record is
// renamed to /dev-kits/transmit-modules, parented to the Dev Kits hub, and its
// sections are swapped for the page-13 set, so the page keeps its id and its
// version history. /tx10 then has no page, which is what lets the redirect in
// 1787710500_tx10_to_transmit_modules_redirect.js resolve it, as the package's
// page-02 redirect list requires.
//
// Sections, in the package's order:
//   1 heroBand           "TRANSMIT MODULES · TX10", the approved headline,
//                        subline and body, and the single datasheet action.
//                        Keeps the existing tx10-hero.jpg, which the package
//                        names as the existing asset for this slot.
//   2 statsLightTraits   "CHANGE · KEY NUMBERS": the four approved figures on
//                        the specTiles design version, label above, value in
//                        the display face, qualifier under it. The package
//                        prints no heading over this row, so none is invented.
//   3 cardsTextCards     "What TX10 Lets You Do", the four capabilities, with
//                        the approved clarifying line under the grid.
//   4 cardsTextCards     "Programmable Illumination for a Dynamic World" and
//                        the five approved benefits.
//   5 cardsTextCards     "Kits Built on TX10", ON140 and LI140, both linking
//                        to the iToF category page.
//   6 ctaSplitLinks      The approved closing CTA, its two inquiry actions and
//                        the reference design caveat.
//
// REMOVE · THREE SECTIONS. The package deletes "What Is TX10?" (Webvizio
// #150), "TX10 Reference Design Advantages" and the "TX10-DK" section, whose
// useful content it merges into the sections above. They are gone from the new
// set; the down path restores the previous ten sections verbatim.
//
// NAMING. One product name, TX10. No "TX10-DK" and no "two paths" wording
// anywhere on the page, per the page-13 dev note and the page-01 removals.
//
// The two actions carry the page-02 inquiry parameters (tx10-datasheet,
// tx10-integration). The contact form's hidden fields are page-02 work; until
// they land the parameters are inert and /contact answers them normally.
//
// NAVIGATION. The Sense dropdown gains "Transmit modules" as a child of Dev
// kits, which is entry 2.4.1 of the approved site map. iToF Dev Kits and dToF
// Dev Kits are 2.4.2 and 2.4.3 and stay out until pages 14 and 15 supply their
// routes, so the menu never points at a 404. Each is a one-entry addition to
// NEXT_DEV_KIT_CHILDREN when its page lands.
//
// PENDING IMAGERY, nothing invented in its place:
//   - Webvizio #129 replaces the static hero image with an animation and
//     labels the Tx optics. The approved asset has not been supplied, so the
//     page keeps tx10-hero.jpg, which the package itself names here as the
//     existing image. Swapping `media` on the hero is a one-field change.
//   - The two illumination animations in section 4 (flood illumination beside
//     non-sequential ROI pulses). Neither has been supplied, and a single
//     panel beside an empty one reads worse than the pair of them omitted, so
//     the section ships as its heading, intro and five benefits.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const NEXT_PATH = 'dev-kits/transmit-modules'
const PREV_PATH = 'tx10'
const PARENT_PATH = 'dev-kits'

const NEXT_PAGE = {
	title: 'Transmit Modules',
	slug: 'transmit-modules',
	path: NEXT_PATH,
	status: 'published',
	seoTitle: 'Transmit Modules',
	seoDescription:
		'Software-defined beam steering for the longest-range iToF sensors.'
}

const PREV_PAGE = {
	title: 'TX10 Reference Design',
	slug: PREV_PATH,
	path: PREV_PATH,
	status: 'published',
	seoTitle: '',
	seoDescription: ''
}

const NEXT_SECTIONS = [
	 {
	  "id": "b41d7c05",
	  "type": "heroBand",
	  "designVersion": "band",
	  "eyebrow": "Transmit modules · TX10",
	  "heading": "LCM-based iToF transmit module",
	  "body": "<p>Software-defined beam steering for the longest-range iToF sensors.</p><p>TX10 is a fully developed transmit module built around our LM10 chip, so 3D sensor developers build longer-range, highly configurable iToF sensors without designing custom beam steering hardware.</p>",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/tx10-hero.jpg"
	  },
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=tx10-datasheet",
	   "label": "Request the TX10 datasheet",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Request the TX10 datasheet",
	  "primaryLinkUrl": "/contact?inquiry=tx10-datasheet",
	  "primaryLinkNewTab": false,
	  "anchor": "",
	  "align": "container",
	  "background": "none",
	  "width": "contained",
	  "spacingTop": "none",
	  "spacingBottom": "none"
	 },
	 {
	  "id": "d25f8a16",
	  "type": "statsLightTraits",
	  "designVersion": "specTiles",
	  "anchor": "key-numbers",
	  "stats": [
	   {
	    "label": "Peak optical power",
	    "value": "Up to 35 W",
	    "description": ""
	   },
	   {
	    "label": "Wavelength",
	    "value": "910 nm",
	    "description": ""
	   },
	   {
	    "label": "Steering range",
	    "value": "Up to 105°",
	    "description": "~0.5° steps"
	   },
	   {
	    "label": "Software",
	    "value": "Python reference",
	    "description": ""
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "c3e07b94",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "capabilities",
	  "eyebrow": "Capabilities",
	  "heading": "What TX10 lets you do",
	  "columns": "4",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Steer",
	    "body": "<p>Up to 105° steering range, ~0.5° steps, in any order.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Shape",
	    "body": "<p>Steering-direction divergence from ~2.5° to 10°. Non-steering field set by optics: 140° default, ~20° to 190°.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Prioritize",
	    "body": "<p>Set dwell time and frame rate per region.</p>",
	    "accent": "accent3"
	   },
	   {
	    "title": "Integrate",
	    "body": "<p>Pairs with iToF receivers from onsemi, Sony, Gpixel, and others.</p>",
	    "accent": "accent1"
	   }
	  ],
	  "note": "Module steering is set by TX10 optics; the LM10 chip supports up to 160° native.",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "a7b91de3",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "programmable-illumination",
	  "eyebrow": "Why programmable transmit",
	  "heading": "Programmable illumination for a dynamic world",
	  "intro": "Conventional emitters light the whole scene the same way. TX10 puts light where it is needed, when it is needed.",
	  "columns": "5",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Longer range",
	    "body": "<p>Concentrate laser power on regions of interest.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Cleaner point clouds",
	    "body": "<p>Significantly reduced multipath and saturation.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Interference mitigation",
	    "body": "<p>Multiple sensors share a space with reduced crosstalk.</p>",
	    "accent": "accent3"
	   },
	   {
	    "title": "Ultra-high dynamic range",
	    "body": "<p>Dark and bright targets in the same frame.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Beam width control",
	    "body": "<p>Scan narrow lines or wide ROIs on demand.</p>",
	    "accent": "accent2"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "e6482fc1",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "kits-built-on-tx10",
	  "heading": "Kits built on TX10",
	  "columns": "2",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "ON140",
	    "body": "<p>TX10 with the onsemi AF0130 on a Windows PC.</p>",
	    "accent": "accent1",
	    "link": {
	     "type": "custom",
	     "url": "/dev-kits/itof",
	     "label": "Explore iToF dev kits",
	     "newTab": false
	    },
	    "linkLabel": "Explore iToF dev kits",
	    "linkUrl": "/dev-kits/itof",
	    "linkNewTab": false
	   },
	   {
	    "title": "LI140",
	    "body": "<p>TX10 with AF0130 depth and RGB, ready on Jetson.</p>",
	    "accent": "accent2",
	    "link": {
	     "type": "custom",
	     "url": "/dev-kits/itof",
	     "label": "Explore iToF dev kits",
	     "newTab": false
	    },
	    "linkLabel": "Explore iToF dev kits",
	    "linkUrl": "/dev-kits/itof",
	    "linkNewTab": false
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "f0d3a5b8",
	  "type": "ctaSplitLinks",
	  "designVersion": "splitLinks",
	  "mode": "stacked",
	  "anchor": "",
	  "heading": "Pair TX10 with your iToF sensor",
	  "headingSize": "statement",
	  "body": "<p>Tell us which iToF receiver you are designing with. We will share the TX10 datasheet and show you how to integrate it.</p>",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=tx10-datasheet",
	   "label": "Request the TX10 datasheet",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Request the TX10 datasheet",
	  "primaryLinkUrl": "/contact?inquiry=tx10-datasheet",
	  "primaryLinkNewTab": false,
	  "secondaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=tx10-integration",
	   "label": "Explore integration with your sensor",
	   "newTab": false
	  },
	  "secondaryLinkLabel": "Explore integration with your sensor",
	  "secondaryLinkUrl": "/contact?inquiry=tx10-integration",
	  "secondaryLinkNewTab": false,
	  "caveat": "Reference designs show what LCM enables. They are not optimized for size, cost, or qualification.",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "lg",
	  "spacingBottom": "lg"
	 }
	]

const PREV_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Software-Defined Beam Steering for the Longest-Range iToF Sensors</p>",
	  "designVersion": "band",
	  "eyebrow": "TX10 Reference Design",
	  "heading": "LM10 LCM-Based iToF Transmit Module",
	  "id": "b41d7c05",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/tx10-hero.jpg"
	  },
	  "primaryLink": {
	   "label": "Contact Us",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "primaryLinkLabel": "Contact Us",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact",
	  "spacingBottom": "none",
	  "spacingTop": "none",
	  "type": "heroBand",
	  "width": "contained"
	 },
	 {
	  "anchor": "key-features",
	  "background": "none",
	  "body": "<p>The <strong>TX10</strong> is a fully developed <strong>LCM-based iToF transmit module reference design</strong> built around Lumotive’s LM10 programmable optical semiconductor. It enables 3D sensor developers to build longer-range, highly configurable iToF sensors without developing custom beam steering hardware.</p><p>TX10 is <strong>a core component enabling high performance 3D iToF sensors</strong>. It provides a validated transmitter architecture that can be integrated with a wide range of iToF receivers to accelerate development of next-generation 3D sensing systems.</p><p>Two engagement paths are available:</p><ul><li><strong>Transmit Reference Design</strong> – architecture, performance envelope, and design framework for building your own iToF sensor.</li><li><strong>TX10-DK Development Kit</strong> – a ready-to-evaluate implementation of the TX10 reference design for proof-of-concept and system integration.</li></ul>",
	  "designVersion": "default",
	  "heading": "TX10 Key Features",
	  "id": "e8f2a934",
	  "link": {
	   "label": "Learn more",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "linkLabel": "Learn more",
	  "linkNewTab": false,
	  "linkUrl": "/contact",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/tx10-module-receiver.jpg"
	  },
	  "mediaPosition": "right",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained"
	 },
	 {
	  "anchor": "what-is-tx10",
	  "background": "subtle",
	  "body": "<p>TX10 is a <strong>solid-state programmable transmit architecture</strong> designed specifically for <strong>indirect time-of-flight (iToF) sensors</strong>.</p><p>Built on Lumotive’s Light Control Metasurface (LCM) technology, TX10 replaces traditional flash illumination with software-defined beam steering. The result is a compact transmitter capable of dynamically controlling steering range, beam divergence, dwell time, and scan patterns — all through software.</p>",
	  "designVersion": "default",
	  "heading": "What is TX10?",
	  "id": "c05b6e71",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/tx10-module-closeup.jpg"
	  },
	  "mediaPosition": "left",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained"
	 },
	 {
	  "anchor": "capabilities",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>TX10 provides up to <strong>105° steering range</strong> from a single solid-state module, enabling wide coverage without moving parts.</p><p>Average steering resolution is approximately <strong>0.5°</strong> across the full range, allowing precise spatial control and non-sequential scan patterns.</p>",
	    "title": "Software-Defined Beam Steering"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>Unlike fixed illumination transmitters, TX10 enables dynamic beam shaping:</p><ul><li>Steering direction divergence programmable from approximately <strong>2.5° to 10°</strong> (application dependent)</li><li>Non-steering direction divergence defined by optics, with a default configuration of <strong>140°</strong>, and customizable from <strong>~20° to 190°</strong> using a single optical element</li></ul><p>This flexibility allows system designers to trade range, resolution, and frame rate through software rather than hardware redesign.</p>",
	    "title": "Programmable Beam Divergence"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>TX10 integrates with a wide range of iToF receivers, including devices from leading vendors such as <strong>Onsemi</strong>, <strong>Sony</strong>, <strong>Gpixel</strong>, and others. This allows developers to maintain receiver choice while adopting programmable transmit capabilities.</p>",
	    "title": "Designed for iToF Receiver Flexibility"
	   }
	  ],
	  "designVersion": "iconCards",
	  "heading": "Key Capabilities of the TX10 Reference Design",
	  "id": "3ac9d5f8",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsIconCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "optical-efficiency",
	  "background": "subtle",
	  "body": "<p>The LM10 LCM platform enables efficient optical power utilization by directing energy only where sensing is required.</p><p>Benefits include:</p><ul><li>Higher optical-to-electrical efficiency compared to flash illumination approaches</li><li>Reduced system power requirements</li><li>Longer effective range for iToF receivers</li></ul>",
	  "designVersion": "default",
	  "heading": "High Optical Efficiency",
	  "id": "7d1e40ba",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/tx10-performance-vs-cost.png"
	  },
	  "mediaPosition": "right",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained"
	 },
	 {
	  "anchor": "why-programmable-transmit",
	  "background": "none",
	  "body": "<p>Traditional iToF architectures are often limited by fixed illumination patterns and inefficient power distribution. TX10 demonstrates how programmable beam steering fundamentally changes iToF system performance.</p><p>Key advantages enabled by the reference design include:</p><ul><li><strong>Longest-range iToF sensing</strong> through concentrated illumination</li><li><strong>Configurable regions of interest</strong> for faster updates where needed</li><li><strong>Improved performance in high-dynamic-range scenes</strong>, including retroreflective materials</li><li><strong>Reduced multipath artifacts</strong> through controlled beam placement</li><li><strong>Minimal interference</strong> in multi-sensor environments</li></ul>",
	  "designVersion": "default",
	  "heading": "Why Programmable Transmit Matters for iToF",
	  "id": "9b6c2f47",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/tx10-module-laser.jpg"
	  },
	  "mediaPosition": "left",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained"
	 },
	 {
	  "anchor": "advantages",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>A fully developed transmitter architecture eliminates the need to design custom beam steering optics or semiconductor transmitters.</p>",
	    "title": "Accelerated Development"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>Programmable steering, beam shaping, and scan sequencing allow developers to adapt sensor performance to different applications and environments.</p>",
	    "title": "Software-Defined Sensing"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>Designed to meet the needs of modern robots where space is a premium and reliability is critical.</p>",
	    "title": "Compact Solid-State Form Factor"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>The reference design supports a wide range of implementations depending on optical configuration, laser choice, and system goals.</p>",
	    "title": "Scalable Performance Envelope"
	   }
	  ],
	  "designVersion": "iconCards",
	  "heading": "TX10 Reference Design Advantages",
	  "id": "5e37a8dc",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsIconCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "tx10-dk",
	  "background": "none",
	  "body": "<p>For teams looking to evaluate LCM transmit performance quickly, Lumotive offers the <strong>TX10-DK</strong>, a development kit representing one specific implementation of the TX10 reference design.</p><p>The TX10 enables:</p><ul><li>Rapid proof-of-concept development</li><li>Integration testing with iToF receivers</li><li>Evaluation of programmable steering and beam shaping</li></ul><p>Typical implementation parameters include:</p><ul><li>Peak optical power up to 35 W</li><li>910 nm operating wavelength</li><li>Programmable steering and divergence control</li><li>Python-based reference software for configuration</li></ul>",
	  "designVersion": "stackedCard",
	  "eyebrow": "TX10-DK Development Kit",
	  "heading": "A Ready-to-Evaluate Implementation of the TX10 Reference Design",
	  "id": "1c8b93e6",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitStackedCard",
	  "width": "contained"
	 },
	 {
	  "anchor": "contact-topics",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "title": "TX10 Reference Design adoption"
	   },
	   {
	    "accent": "accent2",
	    "title": "TX10-DK evaluation kits"
	   },
	   {
	    "accent": "accent3",
	    "title": "Custom transmitter configurations"
	   }
	  ],
	  "designVersion": "textCards",
	  "id": "d6094ae2",
	  "intro": "Speak with our team to discuss:",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsTextCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "designVersion": "default",
	  "heading": "Contact Lumotive",
	  "id": "4f2a61cb",
	  "primaryLink": {
	   "label": "Contact Us",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "primaryLinkLabel": "Contact Us",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact",
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaDefault",
	  "width": "contained"
	 }
	]

const GROUP_LABEL = 'Sense'
const DEV_KITS_LABEL = 'Dev kits'

const NEXT_DEV_KIT_CHILDREN = [
	{
		link: { label: 'Transmit modules', newTab: false, type: 'custom', url: '/dev-kits/transmit-modules' },
		linkLabel: 'Transmit modules',
		linkNewTab: false,
		linkUrl: '/dev-kits/transmit-modules'
	}
]

const findPage = (app, path) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path })
	} catch {
		return null
	}
}

const applyPage = (app, { from, to, page, sections, parent }) => {
	const record = findPage(app, from) ?? findPage(app, to)
	if (!record) return

	for (const key of Object.keys(page)) record.set(key, page[key])
	record.set('parent', parent)
	record.set('sections', sections)
	app.save(record)
}

const findHeader = (app) => {
	try {
		return app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'header' })
	} catch {
		return null
	}
}

const applyMenu = (app, children) => {
	const record = findHeader(app)
	if (!record) return

	let data
	try {
		data = JSON.parse(record.getString('data') || '{}')
	} catch {
		return
	}
	if (!data || !Array.isArray(data.items)) return

	const group = data.items.find((entry) => entry && entry.label === GROUP_LABEL)
	if (!group || !Array.isArray(group.subitems)) return

	const devKits = group.subitems.find((entry) => entry && entry.linkLabel === DEV_KITS_LABEL)
	if (!devKits) return

	if (children) devKits.subitems = JSON.parse(JSON.stringify(children))
	else delete devKits.subitems

	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => {
		const parent = findPage(app, PARENT_PATH)
		applyPage(app, {
			from: PREV_PATH,
			to: NEXT_PATH,
			page: NEXT_PAGE,
			sections: NEXT_SECTIONS,
			parent: parent ? parent.id : ''
		})
		applyMenu(app, NEXT_DEV_KIT_CHILDREN)
	},
	(app) => {
		applyPage(app, {
			from: NEXT_PATH,
			to: PREV_PATH,
			page: PREV_PAGE,
			sections: PREV_SECTIONS,
			parent: ''
		})
		applyMenu(app, null)
	}
)
