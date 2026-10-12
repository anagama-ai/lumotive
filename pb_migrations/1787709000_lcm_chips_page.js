// Platform › LCM Chips (/lcm-chips), approved content package rev. 2026-10-07,
// page 07 of 21. "CHANGE · REPLACES THE LM10 PAGE".
//
// This is a replacement, not an addition: the existing /lm10 record is renamed
// to /lcm-chips and its sections are swapped for the page-07 set, so the page
// keeps its id, its version history and its place in the tree. /lm10 then has
// no page, which is what lets the redirect in
// 1787709100_lm10_to_lcm_chips_redirect.js resolve it.
//
// Sections, in the package's order:
//   1 heroBand           "LCM Beam Steering Chips" + the two approved actions.
//   2 statsLightTraits   "Product Overview" and the four spec tiles, on the new
//                        "specTiles" design version (label above, value in the
//                        display face, qualifier under it).
//   3 cardsSpecComparison "LM10 and LS20 at a Glance", the eleven approved rows.
//   4 cardsIconQuad      The four-step transmit path, numbered as the package
//                        numbers it; the step values are spec values and keep
//                        the package's own lower-case wording.
//   5 cardsTextCards     The five software-defined capabilities.
//   6 cardsSpecComparison "Three Design Choices, Decoupled" plus its closing line.
//   7 cardsTextCards     "Works With Your Architecture" plus the note and link.
//   8 cardsTextCards     The shared Start Building blocks plus the reference
//                        design caveat.
//
// Gen 1 / Gen 2 labels appear here and only here, which is what the naming
// conventions on page 01 allow. No availability, no dates, no temperature rows,
// no 1550 nm / FMCW / Tx/Rx, no downloads: the flyer is a contact request.
//
// Omitted because Lumotive has not supplied the asset, per the package's
// "leave it out rather than publish a placeholder" rule:
//   - the matching LM10 and LS20 column photos (LS20 supplied to the client,
//     LM10 pending; a single-photo pair would be worse than none). Adding
//     `media` to either card in section 3 restores the photo header with no
//     further change.
//   - the "How LCM fits in your lidar" looping system animation (deck GIF) and
//     the SVG scan timeline, so section 4 ships as the numbered path alone.
//
// The hero actions carry the page-02 inquiry parameters (lcm-chips,
// chips-flyer). The contact form's hidden fields are page-02 work; until they
// land the parameters are inert and /contact answers them normally.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const NEXT_PATH = 'lcm-chips'
const PREV_PATH = 'lm10'

const NEXT_PAGE = {
	title: 'LCM Chips',
	slug: NEXT_PATH,
	path: NEXT_PATH,
	status: 'published',
	seoTitle: 'LCM Chips',
	seoDescription:
		'Solid-state beam steering on a semiconductor. Software-defined scanning with no moving parts.'
}

const PREV_PAGE = {
	title: 'LM10',
	slug: PREV_PATH,
	path: PREV_PATH,
	status: 'published',
	seoTitle: '',
	seoDescription: ''
}

const NEXT_SECTIONS = [
		{
			"id": "b7c41d08",
			"type": "heroBand",
			"designVersion": "band",
			"eyebrow": "LCM chips",
			"heading": "LCM beam steering chips",
			"body": "<p>Solid-state beam steering on a semiconductor. Software-defined scanning with no moving parts.</p>",
			"media": {
				"kind": "url",
				"value": "/lumotive/img/hero-lm10.jpg"
			},
			"primaryLink": {
				"type": "custom",
				"url": "/contact?inquiry=lcm-chips",
				"label": "Talk to our team",
				"newTab": false
			},
			"primaryLinkLabel": "Talk to our team",
			"primaryLinkUrl": "/contact?inquiry=lcm-chips",
			"primaryLinkNewTab": false,
			"secondaryLink": {
				"type": "custom",
				"url": "/contact?inquiry=chips-flyer",
				"label": "Request the LM10 and LS20 flyer",
				"newTab": false
			},
			"secondaryLinkLabel": "Request the LM10 and LS20 flyer",
			"secondaryLinkUrl": "/contact?inquiry=chips-flyer",
			"secondaryLinkNewTab": false,
			"anchor": "",
			"align": "container",
			"background": "none",
			"width": "contained",
			"spacingTop": "none",
			"spacingBottom": "none"
		},
		{
			"id": "3e9a06f5",
			"type": "statsLightTraits",
			"designVersion": "specTiles",
			"heading": "Product overview",
			"body": "<p>LM10 is the world’s first commercially available optical beamforming semiconductor. LS20, our next-generation system-on-chip, integrates the driver and scan controller into a custom ASIC for lower system cost, smaller size, and finer steering.</p>",
			"stats": [
				{
					"label": "Steering",
					"value": "160°",
					"description": "native; >180° with expander"
				},
				{
					"label": "Response",
					"value": "40 µs",
					"description": "any angle"
				},
				{
					"label": "Angular step",
					"value": "Down to 0.1°",
					"description": "LS20"
				},
				{
					"label": "LS20 size",
					"value": "10.8 × 9.9 mm"
				}
			],
			"anchor": "overview",
			"align": "container",
			"background": "none",
			"width": "contained",
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "5d2b71ae",
			"type": "cardsSpecComparison",
			"designVersion": "specComparison",
			"heading": "LM10 and LS20 at a glance",
			"cards": [
				{
					"eyebrow": "Gen 1",
					"title": "LM10",
					"body": "<ul><li>Architecture: Beam steering module, external driver and scan controller</li><li>Target markets: Industrial, robotics, IoT, smart infrastructure</li><li>Lidar range class: Short to mid (10–100 m)</li><li>Dimensions: 60 × 24 × 3.5 mm</li><li>Active optical aperture: 11 × 9 mm</li><li>Angular step: 0.4°</li><li>Steering field of view: 160° native, >180° with expander</li><li>Steering mode: 1D, software-definable</li><li>Response time: 40 µs, any angle</li><li>Wavelength: 910 nm</li><li>Light sources: Edge emitters, VCSELs</li></ul>"
				},
				{
					"eyebrow": "Gen 2",
					"title": "LS20",
					"body": "<ul><li>Architecture: System-on-chip with integrated ASIC driver and scan controller</li><li>Target markets: Automotive, industrial, robotics, IoT, smart infrastructure</li><li>Lidar range class: Short to mid (10–100 m)</li><li>Dimensions: 10.8 × 9.9 × 1.6 mm</li><li>Active optical aperture: 5.6 × 4.0 mm</li><li>Angular step: 0.1°</li><li>Steering field of view: 160° native, >180° with expander</li><li>Steering mode: 1D, software-definable</li><li>Response time: 40 µs, any angle</li><li>Wavelength: 910 nm</li><li>Light sources: Edge emitters, VCSELs</li></ul>"
				}
			],
			"anchor": "at-a-glance",
			"align": "container",
			"background": "none",
			"width": "contained",
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "9f08c3d6",
			"type": "cardsIconQuad",
			"designVersion": "iconQuad",
			"eyebrow": "How LCM fits in your lidar",
			"heading": "From fixed sensors to programmable eyes",
			"intro": "LCM sits in the transmit path of a time-of-flight lidar. The laser fires into the LCM, which steers the beam through the transmit optics to one region of the scene at a time. The time-of-flight sensor reads out only that region. Software decides the order, the dwell time, and the beam width, every frame.",
			"cards": [
				{
					"eyebrow": "1",
					"title": "Laser",
					"body": "<p>edge emitter or VCSEL</p>",
					"accent": "accent1"
				},
				{
					"eyebrow": "2",
					"title": "LCM beam steering",
					"body": "<p>directs the beam to any angle, electronically</p>",
					"accent": "accent2"
				},
				{
					"eyebrow": "3",
					"title": "Transmit optics",
					"body": "<p>set the field of view</p>",
					"accent": "accent3"
				},
				{
					"eyebrow": "4",
					"title": "ToF sensor and receive lens",
					"body": "<p>read out only the illuminated ROI</p>",
					"accent": "accent1"
				}
			],
			"anchor": "how-lcm-fits",
			"align": "container",
			"background": "none",
			"width": "contained",
			"spacingTop": "md",
			"spacingBottom": "none"
		},
		{
			"id": "2a6e54bc",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"intro": "Every scan is a sequence you program: which angle, for how long, how wide, and in what order. The field of view is illuminated in discrete regions of interest (ROIs).",
			"cards": [
				{
					"title": "Software-defined range",
					"body": "<p>Set dwell time per region to reach the range and precision you need.</p>",
					"accent": "accent1"
				},
				{
					"title": "Software-defined frame rate",
					"body": "<p>Control scan order and revisit critical regions more often.</p>",
					"accent": "accent2"
				},
				{
					"title": "Software-defined field of view and resolution",
					"body": "<p>Set scan steps, skip angles, and adjust scan range to focus where you need to.</p>",
					"accent": "accent3"
				},
				{
					"title": "Software-defined beam width",
					"body": "<p>Scan narrow lines or wide ROIs on demand.</p>",
					"accent": "accent1"
				},
				{
					"title": "Multiple pulses for HDR",
					"body": "<p>A low-power pulse in the same scan keeps bright targets sharp and dark targets visible.</p>",
					"accent": "accent2"
				}
			],
			"anchor": "",
			"align": "container",
			"background": "none",
			"width": "contained",
			"spacingTop": "none",
			"spacingBottom": "md"
		},
		{
			"id": "84f1b7e2",
			"type": "cardsSpecComparison",
			"designVersion": "specComparison",
			"heading": "Three design choices, decoupled",
			"intro": "In a segmented VCSEL lidar, the emitter array fixes peak power, scan angles, and beam width together. Change one, and you redesign the others. With LCM, each is set on its own.",
			"outro": "Optimize range, resolution, or coverage without trading one against another.",
			"cards": [
				{
					"title": "Segmented VCSEL lidar",
					"body": "<ul><li>Peak power: Tied to segment layout</li><li>Scan angles: Fixed by the number of segments</li><li>Beam width: Fixed by segment optics</li></ul>"
				},
				{
					"title": "LCM-based lidar",
					"body": "<ul><li>Peak power: Set by the laser</li><li>Scan angles: Set by LCM step size, in software</li><li>Beam width: Controlled by LCM, per scan</li></ul>"
				}
			],
			"anchor": "decoupled",
			"align": "container",
			"background": "none",
			"width": "contained",
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "6c0d39fa",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"heading": "Works with your architecture",
			"note": "New to metasurfaces?",
			"link": {
				"type": "custom",
				"url": "/platform",
				"label": "Explore how LCM steers light",
				"newTab": false
			},
			"linkLabel": "Explore how LCM steers light",
			"linkNewTab": false,
			"linkUrl": "/platform",
			"cards": [
				{
					"title": "Lasers",
					"body": "<p>VCSELs and edge emitters.</p>",
					"accent": "accent1"
				},
				{
					"title": "Wavelengths",
					"body": "<p>905 and 940 nm.</p>",
					"accent": "accent2"
				},
				{
					"title": "Sensing",
					"body": "<p>iToF and dToF.</p>",
					"accent": "accent3"
				}
			],
			"anchor": "architecture",
			"align": "container",
			"background": "none",
			"width": "contained",
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "d5b82e14",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"eyebrow": "Start building",
			"heading": "Evaluate LCM at the level you need",
			"note": "Reference designs show what LCM enables. They are not optimized for size, cost, or qualification.",
			"cards": [
				{
					"title": "Transmit Modules",
					"body": "<p>Add LCM beam steering to your own sensor design.</p>",
					"accent": "accent1",
					"link": {
						"type": "custom",
						"url": "/dev-kits/transmit-modules",
						"label": "Explore transmit modules",
						"newTab": false
					},
					"linkLabel": "Explore transmit modules",
					"linkNewTab": false,
					"linkUrl": "/dev-kits/transmit-modules"
				},
				{
					"title": "iToF Dev Kits",
					"body": "<p>Long-range iToF depth, from embedded modules to RGB-D on Jetson.</p>",
					"accent": "accent2",
					"link": {
						"type": "custom",
						"url": "/dev-kits/itof",
						"label": "Explore iToF dev kits",
						"newTab": false
					},
					"linkLabel": "Explore iToF dev kits",
					"linkNewTab": false,
					"linkUrl": "/dev-kits/itof"
				},
				{
					"title": "dToF Dev Kits",
					"body": "<p>Solid-state dToF lidar for indoor, outdoor, and surround sensing.</p>",
					"accent": "accent3",
					"link": {
						"type": "custom",
						"url": "/dev-kits/dtof",
						"label": "Explore dToF dev kits",
						"newTab": false
					},
					"linkLabel": "Explore dToF dev kits",
					"linkNewTab": false,
					"linkUrl": "/dev-kits/dtof"
				}
			],
			"anchor": "start-building",
			"align": "container",
			"background": "none",
			"width": "contained",
			"spacingTop": "md",
			"spacingBottom": "md"
		}
	]

// The /lm10 sections exactly as this branch found them, so the down path puts
// the page back rather than approximating it.
const PREV_SECTIONS = [
		{
			"anchor": "",
			"background": "none",
			"body": "<p>LM10 is the world’s first commercially available optical beamforming semiconductor — an LCM™ chip that steers and shapes laser light on the surface of silicon, with no mirrors, no lenses and no moving parts.</p>",
			"designVersion": "band",
			"eyebrow": "LM10 · Light Control Metasurface™",
			"heading": "The optical beamforming semiconductor",
			"id": "36a3598b",
			"media": {
				"kind": "url",
				"value": "/lumotive/img/hero-lm10.jpg"
			},
			"primaryLink": {
				"label": "Evaluate LM10",
				"newTab": false,
				"type": "custom",
				"url": "/dev-kits"
			},
			"primaryLinkLabel": "Evaluate LM10",
			"primaryLinkNewTab": false,
			"primaryLinkUrl": "/dev-kits",
			"secondaryLink": {
				"label": "Talk to our team",
				"newTab": false,
				"type": "custom",
				"url": "/contact"
			},
			"secondaryLinkLabel": "Talk to our team",
			"secondaryLinkNewTab": false,
			"secondaryLinkUrl": "/contact",
			"spacingBottom": "none",
			"spacingTop": "none",
			"type": "heroBand",
			"width": "contained"
		},
		{
			"anchor": "specifications",
			"background": "none",
			"designVersion": "lightTraits",
			"eyebrow": "Product overview",
			"heading": "Flexible beam steering for 3D sensing",
			"id": "cb4792cc",
			"intro": "LM10 brings electronic beam steering and software-defined control to LiDAR and 3D sensing systems. Its solid-state architecture gives designers precise control over where and how the beam scans, with support for wide steering angles, multiple laser sources, and both iToF and dToF architectures.",
			"spacingBottom": "md",
			"spacingTop": "md",
			"stats": [
				{
					"label": "Solid-state",
					"value": "No moving parts"
				},
				{
					"label": "Software-defined scanning",
					"value": "Random access"
				},
				{
					"label": "Wide-angle steering",
					"value": "Up to 160° native"
				},
				{
					"label": "Expanded field of view",
					"value": "180° with optics"
				},
				{
					"label": "Laser compatibility",
					"value": "VCSEL + EEL"
				},
				{
					"label": "Time-of-flight support",
					"value": "iToF + dToF"
				}
			],
			"type": "statsLightTraits",
			"width": "contained"
		},
		{
			"anchor": "how-it-works",
			"background": "none",
			"body": "<p>At the heart of LM10 is Lumotive’s Light Control Metasurface™ technology. Tunable structures on the semiconductor surface control the direction of reflected laser light electronically, allowing the beam to be steered without mechanically moving the device.</p><p>This solid-state approach replaces mechanical beam steering with electronic control, enabling scan behavior to be programmed through software.</p>",
			"designVersion": "darkPanel",
			"eyebrow": "How it works",
			"heading": "A metasurface that steers light electronically",
			"id": "15569607",
			"link": {
				"label": "Explore LCM technology",
				"newTab": false,
				"type": "custom",
				"url": "/platform"
			},
			"linkLabel": "Explore LCM technology",
			"linkNewTab": false,
			"linkUrl": "/platform",
			"media": {
				"kind": "url",
				"value": "/lumotive/img/lm10-metasurface-module.webp"
			},
			"mediaPosition": "left",
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "splitDarkPanel",
			"width": "contained"
		},
		{
			"anchor": "why-a-chip",
			"background": "none",
			"cards": [
				{
					"accent": "accent1",
					"body": "<p>Direct the beam where it is needed rather than following a fixed mechanical scan path.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-dynamic-roi.png"
					},
					"title": "Flexible scan patterns"
				},
				{
					"accent": "accent2",
					"body": "<p>Reduce the space required for beam-steering hardware and support smaller sensing form factors.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-compact-system.png"
					},
					"title": "Compact integration"
				},
				{
					"accent": "accent3",
					"body": "<p>Configure scanning behavior through software as sensing requirements change.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-software-defined.png"
					},
					"title": "Software control"
				},
				{
					"accent": "accent1",
					"body": "<p>Eliminate the moving components used in conventional mechanical beam-steering systems.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-solid-state.png"
					},
					"title": "Solid-state architecture"
				}
			],
			"designVersion": "iconCards",
			"eyebrow": "Why a chip",
			"heading": "What electronic beam steering makes possible",
			"id": "d16927f2",
			"intro": "Moving beam steering onto a semiconductor gives system designers more control over how the sensing system scans, packages, and responds to different application requirements.",
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "cardsIconCards",
			"width": "contained"
		},
		{
			"anchor": "video",
			"background": "none",
			"designVersion": "videoEmbed",
			"heading": "Next generation hardware,\ndefined by software",
			"id": "9fa9070a",
			"mode": "video",
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "mediaVideoEmbed",
			"videoUrl": "https://vimeo.com/1040582713",
			"width": "contained"
		},
		{
			"anchor": "coverage",
			"background": "none",
			"body": "<p>The LM10 LCM supports a broad array of 3D sensing systems built on the same architecture, ranging from ultra-wide fields of view to long-range capabilities. The system’s performance is influenced by laser power, the field of view of the transmit/receive optics, and the selection of depth sensors. The LM10 is compatible with both indirect time-of-flight (iToF) and direct time-of-flight (dToF) sensors.</p>",
			"designVersion": "stackedCard",
			"heading": "One LCM, endless possibilities",
			"id": "86d89897",
			"media": {
				"kind": "url",
				"value": "/lumotive/img/lm10-field-of-view-horizontal.png"
			},
			"mediaPosition": "left",
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "splitStackedCard",
			"width": "contained"
		},
		{
			"anchor": "module",
			"background": "subtle",
			"body": "<p>The LM10 LCM supports a broad array of 3D sensing systems built on the same architecture, ranging from ultra-wide fields of view to long-range capabilities. The system’s performance is influenced by laser power, the field of view of the transmit/receive optics, and the selection of depth sensors. The LM10 is compatible with both indirect time-of-flight (iToF) and direct time-of-flight (dToF) sensors.</p><ul><li>Scalable in cost, size, and performance</li><li>Camera module-type design with high integration</li><li>Adaptive, software-defined functionality</li></ul>",
			"designVersion": "default",
			"heading": "Transforming 3D sensing",
			"id": "aa4906d7",
			"media": {
				"kind": "url",
				"value": "/lumotive/img/m30-dev-hardware-software.png"
			},
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "splitDefault",
			"width": "contained"
		},
		{
			"anchor": "evaluate",
			"background": "none",
			"body": "<p>Lumotive development kits and reference designs provide a path for evaluating LM10 and integrating LCM beam steering into 3D sensing systems.</p><p>Choose from iToF and dToF configurations designed to support development across different range, field-of-view, and sensing requirements.</p>",
			"designVersion": "darkPanel",
			"eyebrow": "Get started with LM10",
			"heading": "From evaluation to system development",
			"id": "6fe4abe3",
			"link": {
				"label": "Explore development kits",
				"newTab": false,
				"type": "custom",
				"url": "/dev-kits"
			},
			"linkLabel": "Explore development kits",
			"linkNewTab": false,
			"linkUrl": "/dev-kits",
			"media": {
				"kind": "url",
				"value": "/lumotive/img/lm10-evaluate-kit.webp"
			},
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "splitDarkPanel",
			"width": "contained"
		},
		{
			"anchor": "",
			"background": "none",
			"body": "<p>Tell us the field of view, range and form factor you are designing to, and we will point you at the development kit or reference design that gets you there fastest.</p>",
			"designVersion": "lattice",
			"heading": "Design LM10 into your system",
			"id": "8a2ba126",
			"primaryLink": {
				"label": "Talk to our team",
				"newTab": false,
				"type": "custom",
				"url": "/contact"
			},
			"primaryLinkLabel": "Talk to our team",
			"primaryLinkNewTab": false,
			"primaryLinkUrl": "/contact",
			"spacingBottom": "lg",
			"spacingTop": "lg",
			"type": "ctaLattice",
			"width": "contained"
		}
	]

const findPage = (app, path) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path })
	} catch {
		return null
	}
}

const apply = (app, { from, to, page, sections }) => {
	const record = findPage(app, from) ?? findPage(app, to)
	if (!record) return

	for (const key of Object.keys(page)) record.set(key, page[key])
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, { from: PREV_PATH, to: NEXT_PATH, page: NEXT_PAGE, sections: NEXT_SECTIONS })
	},
	(app) => {
		apply(app, { from: NEXT_PATH, to: PREV_PATH, page: PREV_PAGE, sections: PREV_SECTIONS })
	}
)
