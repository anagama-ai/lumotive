// Sense › Dev Kits › dToF Dev Kits (/dev-kits/dtof), approved content package
// rev. 2026-10-07, page 15 of 21. "NEW · CATEGORY PAGE, REPLACES NM120 PAGE".
//
// The third and last of the Dev Kits category pages, built the same way as
// pages 13 and 14: the existing /nm120 record is renamed to /dev-kits/dtof,
// parented to the Dev Kits hub, and its sections are swapped for the page-15
// set, so the page keeps its id and its version history. /nm120 then has no
// page, which is what lets the redirect in 1787711300_nm120_to_dtof_redirect.js
// answer it with the approved deep link to the NM120 section. The down path
// restores all seven previous sections verbatim.
//
// Sections, in the package's order: hero; the "Three Design Choices,
// Decoupled" category feature; the NM120 section at #nm120 as an opener, its
// spec tiles, its four signature features, the HDR block, the tracking video
// and the outdoor application row, closed by its own action pair; the short
// MD180 section at #md180 with its four tiles and single action; and the
// closing CTA with the reference design caveat.
//
// REUSED, NOT RE-ADDED. The tracking video is the existing staging embed,
// vimeo.com/1102359216, which the package marks "Existing video"; it moves from
// its own full-width section into the split that carries the approved heading
// and copy beside it. The hero banner is the existing NM120 photograph, which
// is what Webvizio #161 asks for: the banner shows NM120, not MD42. The NM120
// section takes the second existing NM120 photograph, so the two are distinct.
//
// HELD BACK — PENDING INPUT FROM LUMOTIVE. Package page 15 prints an orange
// pending box over the NM120 section covering two items, and page 04 lists
// both: the Stella-120 sensor head power figure, and confirmation that "NM120
// sensor head outputs MIPI" can be stated publicly. Accordingly:
//   - The POWER tile is omitted. Its value is "[X] W", a bracketed placeholder,
//     which page 01 says never to publish.
//   - The INTERFACE tile is omitted. Its value and qualifier, "MIPI / sensor
//     head; GigE with compute", are exactly the claim awaiting confirmation.
//   - "Modular by Design" is omitted in full. Its heading, its introduction
//     ("The sensor head outputs MIPI, so you can pair it with your own
//     compute") and its "Your compute" card all rest on the same claim, and
//     the approved copy cannot be reworded around it. Its photograph, the
//     NM120 internals without the enclosure, has not been supplied either.
//     One confirmation plus one photograph restores the whole section; the
//     copy is recorded in handoff/page-15-dtof-dev-kits.md.
// The NM120 spec block therefore ships four tiles rather than six, which sets
// as one even row.
//
// INQUIRY VALUES. nm120-datasheet, nm120-embed, md180 and dtof-evaluation,
// which is the page-03 list for this page in full. No datasheet download
// anywhere: the datasheet is a contact request, per the page-15 dev note.
//
// TERMINOLOGY. Per Claudia's updated instruction the page says "beamforming"
// rather than "beam steering". Page 15's approved copy happens to use neither,
// so no wording changes; "beam width" and "scan angles" are standalone terms
// and stay as the package prints them. The site-wide audit of the thirteen
// remaining "beam steering" occurrences is still owed and is not done here.
//
// NAVIGATION. The Sense dropdown gains "dToF dev kits" under Dev kits, entry
// 2.4.3 of the site map, completing the three children. Every destination the
// menu offers now answers 200.
//
// PENDING IMAGERY, nothing invented in its place: the HDR demo visual (main
// pulse against low-power pulse, coloured by intensity), which package page 04
// lists as a new asset shared with /sense, so the HDR block ships as its
// approved heading and copy; the NM120 internals photograph described above;
// and the outdoor application icons of Webvizio #160, so the application row
// uses the same accent-ruled cards pages 13 and 14 use.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const NEXT_PATH = 'dev-kits/dtof'
const PREV_PATH = 'nm120'
const PARENT_PATH = 'dev-kits'

const NEXT_PAGE = {
	title: 'dToF Dev Kits',
	slug: 'dtof',
	path: NEXT_PATH,
	status: 'published',
	seoTitle: 'dToF Dev Kits',
	seoDescription: 'LCM-based dToF lidar for outdoor robots, vehicles, and infrastructure.'
}

const PREV_PAGE = {
	title: 'NM120 Development Kit',
	slug: PREV_PATH,
	path: PREV_PATH,
	status: 'published',
	seoTitle: '',
	seoDescription: ''
}

const NEXT_SECTIONS = [
	 {
	  "id": "a7c0d613",
	  "type": "heroBand",
	  "designVersion": "band",
	  "anchor": "",
	  "eyebrow": "dToF dev kits",
	  "heading": "Solid-state dToF lidar development kits",
	  "body": "<p>LCM-based dToF lidar for outdoor robots, vehicles, and infrastructure.</p>",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/nm120-hero.jpg"
	  },
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=dtof-evaluation",
	   "label": "Set up an evaluation",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Set up an evaluation",
	  "primaryLinkUrl": "/contact?inquiry=dtof-evaluation",
	  "primaryLinkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "none",
	  "spacingBottom": "none"
	 },
	 {
	  "id": "c15a7e90",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "design-choices",
	  "heading": "Three design choices, decoupled",
	  "intro": "Segmented VCSEL lidar fixes peak power, scan angles, and beam width together. LCM sets each on its own.",
	  "columns": "3",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Peak power",
	    "body": "<p>Set by the laser.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Scan angles",
	    "body": "<p>Set by LCM step size, in software.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Beam width",
	    "body": "<p>Controlled by LCM, per scan.</p>",
	    "accent": "accent3"
	   }
	  ],
	  "linkLabel": "How LCM fits in your lidar",
	  "linkUrl": "/platform",
	  "linkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "d903b4f2",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "nm120",
	  "eyebrow": "NM120",
	  "heading": "Solid-state dToF lidar module",
	  "body": "<p>Solid-state dToF lidar for outdoor robots, vehicles, and infrastructure.</p>",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/nm120-sensor.jpg"
	  },
	  "mediaPosition": "right",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "lg",
	  "spacingBottom": "none"
	 },
	 {
	  "id": "6b28ce41",
	  "type": "statsLightTraits",
	  "designVersion": "specTiles",
	  "anchor": "nm120-specs",
	  "stats": [
	   {
	    "label": "Range",
	    "value": "72 m",
	    "description": "32 m at 10%"
	   },
	   {
	    "label": "Field of view",
	    "value": "120° × 90°",
	    "description": ""
	   },
	   {
	    "label": "Pixels",
	    "value": "256 × 192",
	    "description": ""
	   },
	   {
	    "label": "Frame rate",
	    "value": "30 Hz full frame",
	    "description": "900 Hz in ROIs"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "2f74a0db",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "",
	  "columns": "4",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Outdoor range",
	    "body": "<p>72 m, with 32 m to a 10% target.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Fast where it matters",
	    "body": "<p>ROIs at up to 900 Hz.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "HDR without losing frame rate",
	    "body": "<p>Bright and dark targets in one scan.</p>",
	    "accent": "accent3"
	   },
	   {
	    "title": "Software keeps improving it",
	    "body": "<p>New capabilities, such as HDR, near-range accuracy, and interference reduction, arrive as software updates.</p>",
	    "accent": "accent1"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "91e6c3a8",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "hdr",
	  "heading": "HDR without losing frame rate",
	  "body": "<p>A low-power pulse runs in the same scan as the main pulse. Retroreflectors no longer blind the sensor, and people nearby keep sharp outlines.</p>",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "5f0ab728",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "tracking",
	  "heading": "Track fast-moving objects",
	  "body": "<p>NM120 tracks a basketball dribble at 80 fps, narrowing its field of view from 90° to 10° in software.</p>",
	  "videoUrl": "https://player.vimeo.com/video/1102359216",
	  "mediaPosition": "right",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "7ac0952e",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "outdoor-applications",
	  "intro": "Integrates with your stack: API with ROS and custom frameworks; dynamic ROIs, virtual lidar, and line-scan modes.",
	  "columns": "5",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Last-mile delivery robots",
	    "body": "<p>Curb, sidewalk, and crossing navigation around people.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Robovans and autonomous platforms",
	    "body": "<p>Near-field coverage around the vehicle.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Heavy equipment safety",
	    "body": "<p>People and obstacle detection around working machines.</p>",
	    "accent": "accent3"
	   },
	   {
	    "title": "Smart infrastructure",
	    "body": "<p>Traffic, intersection, and parking monitoring.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Security",
	    "body": "<p>Perimeter and area monitoring, day and night.</p>",
	    "accent": "accent2"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "e4b170cd",
	  "type": "ctaSplitLinks",
	  "designVersion": "splitLinks",
	  "mode": "stacked",
	  "tone": "light",
	  "anchor": "",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=nm120-datasheet",
	   "label": "Request the NM120 datasheet",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Request the NM120 datasheet",
	  "primaryLinkUrl": "/contact?inquiry=nm120-datasheet",
	  "primaryLinkNewTab": false,
	  "secondaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=nm120-embed",
	   "label": "Talk to us about embedding NM120",
	   "newTab": false
	  },
	  "secondaryLinkLabel": "Talk to us about embedding NM120",
	  "secondaryLinkUrl": "/contact?inquiry=nm120-embed",
	  "secondaryLinkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "3d85f21b",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "md180",
	  "eyebrow": "MD180",
	  "heading": "180° solid-state dToF lidar",
	  "body": "<p>Built on our next-generation LS20 system-on-chip.</p>",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "lg",
	  "spacingBottom": "none"
	 },
	 {
	  "id": "8c0416ae",
	  "type": "statsLightTraits",
	  "designVersion": "specTiles",
	  "anchor": "md180-specs",
	  "stats": [
	   {
	    "label": "Field of view",
	    "value": "185° × 110°",
	    "description": ""
	   },
	   {
	    "label": "Range",
	    "value": "50 m",
	    "description": ""
	   },
	   {
	    "label": "Frame rate",
	    "value": "30 Hz",
	    "description": ""
	   },
	   {
	    "label": "Interface",
	    "value": "GigE",
	    "description": "integrated compute"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "f512d7b0",
	  "type": "ctaSplitLinks",
	  "designVersion": "splitLinks",
	  "mode": "stacked",
	  "tone": "light",
	  "anchor": "",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=md180",
	   "label": "Talk to us about MD180",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Talk to us about MD180",
	  "primaryLinkUrl": "/contact?inquiry=md180",
	  "primaryLinkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "a0cd6e37",
	  "type": "ctaSplitLinks",
	  "designVersion": "splitLinks",
	  "mode": "stacked",
	  "anchor": "",
	  "heading": "Take solid-state dToF outdoors",
	  "headingSize": "statement",
	  "body": "<p>Tell us your environment, target range, and coverage needs. We will send the right datasheets and set up your evaluation.</p>",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=dtof-evaluation",
	   "label": "Set up an evaluation",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Set up an evaluation",
	  "primaryLinkUrl": "/contact?inquiry=dtof-evaluation",
	  "primaryLinkNewTab": false,
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
	  "body": "<p>A New Era For 3D Sensing</p>",
	  "designVersion": "band",
	  "eyebrow": "NM120 Development Kit",
	  "heading": "Powered by LM10 Beamforming",
	  "id": "a7c0d613",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/nm120-hero.jpg"
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
	  "body": "<p>The NM120 Development Kit gives developers a fast, straightforward way to explore the capabilities of Lumotive’s LCM beam‑steering technology integrated into a solid-state dToF lidar. It arrives ready to use with software, cables, and power accessories included, allowing you to get up and running to begin evaluating solid‑state scanning performance right out of the box.</p><p>Once deployed, the NM120 enables assessment of key performance metrics such as range, accuracy, resolution, detection reliability in varied environments, and power efficiency. It can be quickly integrated into prototypes to validate system behavior and support early demonstrations through API access and compatibility with ROS or custom frameworks. Developers can also use advanced features like dynamic Regions of Interest, Virtual Lidar, HCM, HDR, and Line Scan modes to bring real‑time applications to life.</p>",
	  "designVersion": "stackedCard",
	  "heading": "NM120 Key Features",
	  "id": "f3b81e5a",
	  "link": {
	   "label": "Learn More",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "linkLabel": "Learn More",
	  "linkNewTab": false,
	  "linkUrl": "/contact",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitStackedCard",
	  "width": "contained"
	 },
	 {
	  "anchor": "specifications",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>Truly Solid-State AI-Enabled 3D Sensing Platform</p>",
	    "title": "Simple to Build, Like a Camera"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p><strong>72 m</strong></p><p>32 m for 10% target reflectivity @ 100 klux ambient*</p>",
	    "title": "Range Class"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p><strong>120° x 90° *</strong></p>",
	    "title": "Wide Field of View"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p><strong>256 x 192</strong></p><p>Powered by <a href=\"https://www.adapsphotonics.com/en/product-55669-218658.html\" target=\"_blank\" rel=\"noopener noreferrer\">ADAPS ADS6311</a></p>",
	    "title": "Pixels"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p><strong>30Hz</strong></p><p>900Hz in Regions of Interest</p>",
	    "title": "Full Frame"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>Multiple returns and High Dynamic Range capabilities</p>",
	    "title": "Optimized for Indoor and Outdoor Applications"
	   }
	  ],
	  "designVersion": "textCards",
	  "eyebrow": "",
	  "heading": "Specifications",
	  "id": "6d24f9b7",
	  "intro": "* Software configurable, region-of-interest (ROI) capability",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsTextCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "advantages",
	  "background": "subtle",
	  "body": "<p><strong>Software-Defined Sensing</strong>: One sensor, many roles—adaptive scanning customizes field-of-view, range, and frame rates.</p><p><strong>Compact and Power-Efficient</strong>: Small form factor, integrated compute with ethernet interface, and &lt;17W power consumption for easy integration.</p><p><strong>All-in-One Perception</strong>: Replaces multiple sensors with a single hardware unit configurable for cliff detection, obstacle avoidance, SLAM, and more.</p><p><strong>Indoor and Outdoor Ready</strong>: Up to 72m max range, 120° x 90° field-of-view, and HDR mode for reliable navigation in varied environments.</p><p>The NM120 is a solid-state dToF lidar designed for a wide range of applications. Its high-performance features, compact design, and exceptional reliability due to an all-chip solid-state design make these sensors highly suitable for robotics, surveillance, forklifts, and automation.</p>",
	  "designVersion": "default",
	  "heading": "Key Advantages of the NM120 Development Kit",
	  "id": "2e95c4f1",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/nm120-sensor.jpg"
	  },
	  "mediaPosition": "right",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained"
	 },
	 {
	  "anchor": "precision",
	  "background": "none",
	  "body": "<p>With software-defined scanning, you can use the NM120 to track fast-moving objects at high frame rates in regions of interest.</p><p>No hardware changes. No motion blur. Just sharp, dynamic perception — programmable by design.</p><p>Watch as the NM120 hits 80 fps while tracking a basketball dribble, stepping down from 90° to 10° FOV — all in software.</p>",
	  "designVersion": "stackedCard",
	  "heading": "Precision Where It Matters Most",
	  "id": "b8e176c3",
	  "spacingBottom": "none",
	  "spacingTop": "md",
	  "type": "splitStackedCard",
	  "width": "contained"
	 },
	 {
	  "anchor": "demo",
	  "background": "none",
	  "designVersion": "videoEmbed",
	  "id": "5f0ab728",
	  "mode": "video",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "mediaVideoEmbed",
	  "videoUrl": "https://player.vimeo.com/video/1102359216",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Speak with our team to discuss:</p><p>NM120 Development Kit adoption</p>",
	  "designVersion": "default",
	  "heading": "Contact Lumotive",
	  "id": "9d5e3c80",
	  "primaryLink": {
	   "label": "Contact Us",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "primaryLinkLabel": "Contact Us",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact",
	  "secondaryLink": {
	   "label": "Request More Details",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "secondaryLinkLabel": "Request More Details",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "/contact",
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaDefault",
	  "width": "contained"
	 }
	]

const GROUP_LABEL = 'Sense'
const DEV_KITS_LABEL = 'Dev kits'

const child = (label, url) => ({
	link: { label, newTab: false, type: 'custom', url },
	linkLabel: label,
	linkNewTab: false,
	linkUrl: url
})

const NEXT_DEV_KIT_CHILDREN = [
	child('Transmit modules', '/dev-kits/transmit-modules'),
	child('iToF dev kits', '/dev-kits/itof'),
	child('dToF dev kits', '/dev-kits/dtof')
]

const PREV_DEV_KIT_CHILDREN = [
	child('Transmit modules', '/dev-kits/transmit-modules'),
	child('iToF dev kits', '/dev-kits/itof')
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

const applyMenu = (app, children) => {
	let record
	try {
		record = app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'header' })
	} catch {
		return
	}
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

	devKits.subitems = JSON.parse(JSON.stringify(children))
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
		applyMenu(app, PREV_DEV_KIT_CHILDREN)
	}
)
