// Sense › Overview (/sense), approved content package rev. 2026-10-07,
// page 09 of 21.
//
// 1. HERO (d9bf96da) — CHANGE. The heading drops to "Programmable 3D Sensing"
//    and the body takes the approved sentence. The dev note removes "Infinite
//    adaptability", and the new heading also clears global rule 9: "Physical
//    AI" was in the h1, which the rule forbids, and now appears once, in the
//    body. The actions become "Find your dev kit" and "See the LCM chips",
//    the second repointed from the retired /lm10 to /lcm-chips. The existing
//    hero image is unchanged, as the package marks it.
//
// 2. THE PROBLEM (9d8fe777) — KEEP AS IS. Untouched.
//
// 3. THE ANSWER (bb989678) — CHANGE · Webvizio #118. The "Why Lumotive is
//    different" comparison becomes the approved "Programmable Eyes" section:
//    the package's six benefit cards, the proposition under the introduction,
//    and the closing result line. The section changes type from
//    cardsComparisonCards to cardsTextCards, because the approved content is
//    six titled cards rather than two opposed lists.
//
// 4. BETTER PERCEPTION FOR ROBOTS AND VEHICLES (new, a1d7c40e) — CHANGE ·
//    Webvizio #119. Two cards, indoor LCM-based iToF and outdoor and surround
//    LCM-based dToF, each with its approved lead line, four approved bullets
//    and its dev kit link.
//
// 5. HDR (new, f52b9a16) — NEW. "See Bright and Dark Targets Together". The
//    approved HDR demo visual (main pulse vs low-power pulse, coloured by
//    intensity) is listed as a new asset on package page 04 and has not been
//    supplied, so the section ships copy-only; splitDefault holds a single
//    reading column when its art column is absent, so nothing is left empty.
//    Adding `media` later restores the two-column layout with no further
//    change.
//
// 6. APPLICATIONS (2a6b5ed9) — CHANGE. Three approved cards with the approved
//    copy and the Robotics and Automotive links. The section changes type from
//    cardsApplicationBento to cardsMediaCards, because the package prints
//    three equal cards and the bento tiles three cards as one feature plus two
//    halves. The dev note's "forward lidar beyond 200 m" does not appear in the
//    approved copy. The three images are the existing robot, vehicle and
//    intersection photographs this site already ships, which is what the
//    package's grey boxes describe.
//
// 7. START BUILDING (new, c83f1b77) — CHANGE · shared component. The same
//    three blocks page 07 carries, with this page's optional closing line,
//    "Designing at the chip level? Explore LCM chips →".
//
// 8. REMOVED. Three sections are not part of the approved page and leave:
//      c7f4a1e9 "From platform to sensing system" (cardsIconCards)
//      28be79eb the evaluation-paths timeline
//      e6595d2c the logo marquee
//    The marquee also breaches two site-wide removals on package page 01: it
//    carries the Fortsense logo and the "e-Photonics" spelling, both of which
//    the package removes everywhere. See the note on the providers component
//    below. The down path restores all three verbatim.
//
// 9. CLOSING CTA (3327d913) — KEEP AS IS. Untouched.
//
// 10. CONTAINER ALIGNMENT. Every section on the page opts into the header
//     container, matching pages 05 to 08.
//
// NOT IMPLEMENTED — "Module and Solution Providers". The component is specified
// as logos only, in order: Leopard Imaging, Namuga, Hokuyo, Electronic
// Photonics. Two of the four are unavailable: there is no Leopard Imaging logo
// in this repository, and the Electronic Photonics logo is an open Lumotive
// input on package page 04 (the existing ephotonics.png carries the
// "e-Photonics" spelling the package removes). A provider strip missing half
// its members misstates who builds on LCM, so the component waits for both
// logos rather than shipping partial. Tracked in handoff/page-09-sense.md.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'sense'

const HERO_ID = 'd9bf96da'
const ANSWER_ID = 'bb989678'
const APPLICATIONS_ID = '2a6b5ed9'
const CTA_ID = '3327d913'
const REMOVED_IDS = ['c7f4a1e9', '28be79eb', 'e6595d2c']

const HERO_AFTER = {
		"heading": "Programmable 3D sensing",
		"body": "<p>3D sensing for Physical AI. One sensor, multiple modes, adapted in software.</p>",
		"primaryLink": {
			"type": "custom",
			"url": "/dev-kits",
			"label": "Find your dev kit",
			"newTab": false
		},
		"primaryLinkLabel": "Find your dev kit",
		"primaryLinkUrl": "/dev-kits",
		"primaryLinkNewTab": false,
		"secondaryLink": {
			"type": "custom",
			"url": "/lcm-chips",
			"label": "See the LCM chips",
			"newTab": false
		},
		"secondaryLinkLabel": "See the LCM chips",
		"secondaryLinkUrl": "/lcm-chips",
		"secondaryLinkNewTab": false
	}

const HERO_BEFORE = {
		"heading": "Programmable 3D sensing for Physical AI",
		"body": "<p>Give autonomous machines software-defined vision. One sensor. Multiple modes. Infinite adaptability.</p>",
		"primaryLink": {
			"label": "Request a dev kit",
			"newTab": false,
			"type": "custom",
			"url": "/dev-kits"
		},
		"primaryLinkLabel": "Request a dev kit",
		"primaryLinkUrl": "/dev-kits",
		"primaryLinkNewTab": false,
		"secondaryLink": {
			"label": "See the LM10 chip",
			"newTab": false,
			"type": "custom",
			"url": "/lm10"
		},
		"secondaryLinkLabel": "See the LM10 chip",
		"secondaryLinkUrl": "/lm10",
		"secondaryLinkNewTab": false
	}

const ANSWER_AFTER = {
		"type": "cardsTextCards",
		"designVersion": "textCards",
		"anchor": "the-answer",
		"eyebrow": "The answer",
		"heading": "Lumotive Sense: programmable eyes for intelligent machines",
		"intro": "Each problem above, solved in software, by one sensor.",
		"statement": "Your perception system decides where to look. LCM puts the light there, in microseconds.",
		"conclusion": "The result: robots and vehicles that do more work, with less downtime.",
		"background": "none",
		"width": "contained",
		"spacingTop": "md",
		"spacingBottom": "md",
		"cards": [
			{
				"title": "Fewer sensors",
				"body": "<p>One wide-FOV sensor replaces several fixed ones.</p>",
				"accent": "accent1"
			},
			{
				"title": "Cleaner data",
				"body": "<p>Reduced multipath and saturation give your perception models better point clouds to train and run on.</p>",
				"accent": "accent2"
			},
			{
				"title": "Longer reach",
				"body": "<p>Laser power goes where it is needed, extending range.</p>",
				"accent": "accent3"
			},
			{
				"title": "Software-defined ROIs",
				"body": "<p>Focus on people, obstacles, or pallets, and change focus in software.</p>",
				"accent": "accent1"
			},
			{
				"title": "Lower cost and power",
				"body": "<p>Fewer sensors and targeted illumination reduce system cost and power budget.</p>",
				"accent": "accent2"
			},
			{
				"title": "Higher reliability",
				"body": "<p>Solid-state design means fewer failure points and less maintenance.</p>",
				"accent": "accent3"
			}
		]
	}

const ANSWER_BEFORE = {
		"anchor": "difference",
		"background": "subtle",
		"cards": [
			{
				"eyebrow": "Traditional lidar",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/icon-multiple-sensors.png"
				},
				"title": "Sensor"
			},
			{
				"eyebrow": "Traditional lidar",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/icon-fixed-fov.png"
				},
				"title": "Fixed FOV"
			},
			{
				"eyebrow": "Traditional lidar",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/icon-poor-adaptability.png"
				},
				"title": "Static scan"
			},
			{
				"eyebrow": "Traditional lidar",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/icon-blind-spots.png"
				},
				"title": "Compromises"
			},
			{
				"eyebrow": "Lumotive Sense powered by LCM™",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/icon-software-defined.png"
				},
				"title": "Software-defined optics"
			},
			{
				"eyebrow": "Lumotive Sense powered by LCM™",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/icon-beam-steering.png"
				},
				"title": "Adaptive beam steering"
			},
			{
				"eyebrow": "Lumotive Sense powered by LCM™",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/icon-dynamic-roi.png"
				},
				"title": "Dynamic ROI"
			}
		],
		"designVersion": "comparisonCards",
		"heading": "Why Lumotive is different",
		"id": "bb989678",
		"intro": "Our LCM™ platform brings software-defined optics to 3D sensing, enabling unmatched adaptability, performance and efficiency.",
		"spacingBottom": "md",
		"spacingTop": "md",
		"type": "cardsComparisonCards",
		"width": "contained"
	}

const APPLICATIONS_AFTER = {
		"type": "cardsMediaCards",
		"designVersion": "mediaCards",
		"anchor": "applications",
		"heading": "Built for a broad range of 3D sensing applications",
		"background": "none",
		"width": "contained",
		"spacingTop": "md",
		"spacingBottom": "md",
		"cards": [
			{
				"title": "Robotics",
				"body": "<p>AMRs, humanoids, quadrupeds, forklifts, and industrial automation.</p>",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/market-robot-dog.jpg"
				},
				"accent": "accent1",
				"link": {
					"type": "custom",
					"url": "/sense/robotics",
					"label": "Explore Robotics",
					"newTab": false
				},
				"linkLabel": "Explore Robotics",
				"linkNewTab": false,
				"linkUrl": "/sense/robotics"
			},
			{
				"title": "Automotive",
				"body": "<p>Surround sensing for passenger vehicles, robotaxis, trucking, and heavy equipment.</p>",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/market-passenger-adas.jpg"
				},
				"accent": "accent2",
				"link": {
					"type": "custom",
					"url": "/sense/automotive",
					"label": "Explore Automotive",
					"newTab": false
				},
				"linkLabel": "Explore Automotive",
				"linkNewTab": false,
				"linkUrl": "/sense/automotive"
			},
			{
				"title": "Smart infrastructure & surveillance",
				"body": "<p>Traffic and parking monitoring, perimeter security, and privacy-aware people counting with depth data.</p>",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/market-its.jpg"
				},
				"accent": "accent3"
			}
		]
	}

const APPLICATIONS_BEFORE = {
		"anchor": "applications",
		"background": "none",
		"cards": [
			{
				"accent": "accent1",
				"body": "<p>Warehouse automation, AGV/AMR navigation, pick-and-place cobots, volumetric dimensioning and humanoids.</p>",
				"eyebrow": "Sense",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/market-robot-dog.jpg"
				},
				"title": "Industrial & robotics"
			},
			{
				"accent": "accent1",
				"body": "<p>L2+ surround view, pedestrian and VRU detection, robotaxi perception, and forward lidar beyond 200 m.</p>",
				"eyebrow": "Sense",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/market-passenger-adas.jpg"
				},
				"title": "Auto ADAS & autonomy"
			},
			{
				"accent": "accent1",
				"body": "<p>Perimeter and border security, traffic monitoring, and infrastructure sensing that holds calibration for years.</p>",
				"eyebrow": "Sense",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/market-perimeter-security.jpg"
				},
				"title": "ITS & surveillance"
			}
		],
		"designVersion": "applicationBento",
		"heading": "Built for a broad range of 3D sensing applications",
		"id": "2a6b5ed9",
		"spacingBottom": "md",
		"spacingTop": "md",
		"type": "cardsApplicationBento",
		"width": "contained"
	}

// Inserted sections, in the package's order.
const PERCEPTION = {
		"id": "a1d7c40e",
		"type": "cardsTextCards",
		"designVersion": "textCards",
		"anchor": "robots-and-vehicles",
		"eyebrow": "Sensing for robots and vehicles",
		"heading": "Better perception for robots and vehicles",
		"intro": "Robots and vehicles need to see more, with fewer sensors, at lower cost and power. LCM-based 3D sensing gives perception teams control over where and how the sensor looks.",
		"columns": "2",
		"background": "none",
		"width": "contained",
		"spacingTop": "md",
		"spacingBottom": "md",
		"cards": [
			{
				"eyebrow": "Indoor sensing · LCM-based iToF",
				"accent": "accent1",
				"body": "<p>For AMRs, humanoids, forklifts, drones, and industrial automation.</p><ul><li>Up to 30 m from an iToF sensor, several times a conventional ToF camera</li><li>Cleaner depth: reduced multipath and saturation</li><li>Software-defined ROIs and virtual sensors</li><li>HDR for dark and bright targets in one scene</li></ul>",
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
				"eyebrow": "Outdoor and surround sensing · LCM-based dToF",
				"accent": "accent2",
				"body": "<p>For vehicles, heavy equipment, and outdoor robots.</p><ul><li>Up to 180° field of view from one sensor, so fewer sensors cover the full surround</li><li>Up to 72 m range, with ROIs at up to 900 Hz</li><li>HDR for bright and dark targets outdoors</li><li>Compact, solid-state, and reliable</li></ul>",
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
		]
	}

const HDR = {
		"id": "f52b9a16",
		"type": "splitDefault",
		"designVersion": "default",
		"anchor": "hdr",
		"eyebrow": "Only possible with LCM",
		"heading": "See bright and dark targets together",
		"body": "<p>Retroreflectors and nearby bright objects saturate time-of-flight sensors and smear the scene around them. LCM fires a low-power pulse in the same scan as the main pulse. Bright targets stay sharp, dark targets stay visible, and frame rate stays the same.</p>",
		"background": "none",
		"width": "contained",
		"spacingTop": "md",
		"spacingBottom": "md"
	}

const START_BUILDING = {
		"id": "c83f1b77",
		"type": "cardsTextCards",
		"designVersion": "textCards",
		"anchor": "start-building",
		"eyebrow": "Start building",
		"heading": "Evaluate LCM at the level you need",
		"note": "Designing at the chip level?",
		"link": {
			"type": "custom",
			"url": "/lcm-chips",
			"label": "Explore LCM chips",
			"newTab": false
		},
		"linkLabel": "Explore LCM chips",
		"linkNewTab": false,
		"linkUrl": "/lcm-chips",
		"background": "none",
		"width": "contained",
		"spacingTop": "md",
		"spacingBottom": "md",
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
		]
	}

// The three sections this page drops, exactly as the branch found them.
const REMOVED_SECTIONS = [
		{
			"anchor": "",
			"background": "none",
			"cards": [
				{
					"accent": "accent1",
					"body": "<p>Control light electronically, without mechanical steering components, motors, or moving assemblies.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-solid-state.png"
					},
					"title": "Solid-state optical control"
				},
				{
					"accent": "accent2",
					"body": "<p>Support wide fields of view with precise, software-controlled beam positioning — up to 160° native steering, and greater than 180° with expansion optics in supported designs.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-beam-steering.png"
					},
					"title": "Wide-angle beam steering"
				},
				{
					"accent": "accent3",
					"body": "<p>Program beam direction, lensing, collimation, multiple beams, adaptive optics, and custom phase or intensity patterns.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-software-defined.png"
					},
					"title": "Software-defined optical functions"
				},
				{
					"accent": "accent1",
					"body": "<p>Scale from compact sensing systems to optical communications, switching, computing, displays, and other light-based applications.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-scalability.png"
					},
					"title": "Scalability across applications"
				},
				{
					"accent": "accent2",
					"body": "<p>Support optical architectures spanning visible through infrared wavelengths, with compatibility across different light sources, sensing methods, and system designs.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-wavelengths.png"
					},
					"title": "Multiple wavelengths and architectures"
				},
				{
					"accent": "accent3",
					"body": "<p>Control light through subwavelength metasurface pixels engineered to shape optical phase at the semiconductor surface.</p>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-metamaterials.png"
					},
					"title": "Powered by metamaterials"
				}
			],
			"designVersion": "iconCards",
			"heading": "From platform to sensing system",
			"id": "c7f4a1e9",
			"intro": "Built on the LCM™ programmable optics platform and powered by the LM10 beamforming chip, Lumotive Sense gives you multiple ways to evaluate, develop, and build the sensing system that’s right for your application.",
			"spacingBottom": "none",
			"spacingTop": "md",
			"type": "cardsIconCards",
			"width": "contained"
		},
		{
			"anchor": "paths",
			"background": "none",
			"designVersion": "timeline",
			"heading": "",
			"id": "28be79eb",
			"intro": "",
			"rows": [
				{
					"level": "stage",
					"title": "Development paths"
				},
				{
					"body": "<p>Evaluate, prototype, and integrate LM10-based sensing.</p>",
					"level": "group",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/icon-dev-kits.png"
					},
					"title": "Development and Evaluation Kits"
				},
				{
					"body": "<p>Chip-level evaluation platform for the LM10.</p>",
					"level": "item",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/tx10-dev-kit.webp"
					},
					"title": "TX10 Development Kit"
				},
				{
					"body": "<p>System-level development kit for evaluating an LM10-based lidar configuration.</p>",
					"level": "item",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/m30-kit.png"
					},
					"title": "M30 Development Kit"
				},
				{
					"body": "<p>Development platform powered by LM10 beamforming.</p>",
					"level": "item",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/nm120-module.png"
					},
					"title": "NM120 Development Kit"
				}
			],
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "timeline",
			"width": "contained"
		},
		{
			"anchor": "",
			"background": "none",
			"designVersion": "marquee",
			"heading": "Hokuyo and Namuga ship LCM-powered lidar today",
			"id": "e6595d2c",
			"logos": [
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/hokuyo.png"
					},
					"name": "Hokuyo"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/namuga.png"
					},
					"name": "Namuga"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/lumentum.png"
					},
					"name": "Lumentum"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/lattice.png"
					},
					"name": "Lattice Semiconductor"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/adaps.png"
					},
					"name": "ADAPS Photonics"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/gpixel.png"
					},
					"name": "GPixel"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/vertilite.png"
					},
					"name": "Vertilite"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/fortsense.png"
					},
					"name": "Fortsense"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/solidvue.png"
					},
					"name": "SolidVue"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/ephotonics.png"
					},
					"name": "e-Photonics"
				},
				{
					"media": {
						"kind": "url",
						"value": "/lumotive/logos/multicoreware.png"
					},
					"name": "MulticoreWare"
				}
			],
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "logosMarquee",
			"width": "full"
		}
	]

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

const findPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path: PAGE_PATH })
	} catch {
		return null
	}
}

const clone = (value) => JSON.parse(JSON.stringify(value))

// Replace a section's contents in place, keeping its id, so the record keeps
// its identity and the editor's version history stays attached to it.
const rewrite = (section, next) => {
	const id = section.id
	for (const key of Object.keys(section)) delete section[key]
	Object.assign(section, clone(next))
	section.id = id
}

migrate(
	(app) => {
		const record = findPage(app)
		if (!record) return

		const sections = readSections(record).filter((entry) => entry && !REMOVED_IDS.includes(entry.id))
		const hero = sections.find((entry) => entry.id === HERO_ID)
		const answer = sections.find((entry) => entry.id === ANSWER_ID)
		const applications = sections.find((entry) => entry.id === APPLICATIONS_ID)
		if (!hero || !answer || !applications) return

		Object.assign(hero, clone(HERO_AFTER))
		rewrite(answer, ANSWER_AFTER)
		rewrite(applications, APPLICATIONS_AFTER)

		const answerIndex = sections.indexOf(answer)
		sections.splice(answerIndex + 1, 0, clone(PERCEPTION), clone(HDR))
		sections.splice(sections.indexOf(applications) + 1, 0, clone(START_BUILDING))

		for (const section of sections) section.align = 'container'

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findPage(app)
		if (!record) return

		const newIds = [PERCEPTION.id, HDR.id, START_BUILDING.id]
		const sections = readSections(record).filter((entry) => entry && !newIds.includes(entry.id))
		const hero = sections.find((entry) => entry.id === HERO_ID)
		const answer = sections.find((entry) => entry.id === ANSWER_ID)
		const applications = sections.find((entry) => entry.id === APPLICATIONS_ID)
		if (!hero || !answer || !applications) return

		Object.assign(hero, clone(HERO_BEFORE))
		rewrite(answer, ANSWER_BEFORE)
		rewrite(applications, APPLICATIONS_BEFORE)

		for (const section of sections) delete section.align

		// Put the three dropped sections back where they were: the icon cards
		// and the timeline after the answer, the marquee before the closing CTA.
		const restored = []
		for (const entry of sections) {
			if (entry.id === CTA_ID) restored.push(clone(REMOVED_SECTIONS[2]))
			restored.push(entry)
			if (entry.id === ANSWER_ID) {
				restored.push(clone(REMOVED_SECTIONS[0]), clone(REMOVED_SECTIONS[1]))
			}
		}

		record.set('sections', restored)
		app.save(record)
	}
)
