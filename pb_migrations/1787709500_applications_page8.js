// Platform › Applications (/applications), approved content package
// rev. 2026-10-07, page 08 of 21.
//
// 1. HERO (acb2f280) — CHANGE. The body takes the approved sentence and the
//    section drops to the single approved action, "Talk to our team". The
//    staging hero carried "Explore Lumotive Sense" instead, which the package
//    does not print. Eyebrow, heading and the existing hero image are
//    unchanged; the package marks the image "Existing hero image".
//
// 2. EIGHT LCM APPLICATION AREAS (91a455fe) — CHANGE. The five-card bento
//    becomes the package's eight application areas. The section changes type
//    from cardsApplicationBento to cardsMediaCards with `columns: "4"`, so the
//    eight set as two even rows of four rather than the bento's deliberately
//    uneven tiling, which exists for a five-card feature block and has no
//    eight-card arrangement. Heading and introduction take the approved copy.
//
//    STATUS LABELS ARE OMITTED. The package shows a small accent label above
//    each title ("In production", "In development", "Active programs",
//    "Exploring"), but global rule 1 on package page 01 says "No product
//    availability, launch timing, roadmap, or generation dates anywhere on the
//    site". "In production" and "In development" read as availability and
//    roadmap state, so the two directions conflict. The question is open with
//    Apurva (Q19) and the labels stay out until it is settled. Adding them is
//    a data-only change: one `eyebrow` per card. "Your application" carries no
//    label in the package and must not be given one.
//
//    CARD IMAGES ARE OMITTED. The package calls for a photograph on each of
//    the eight. Three exist in this repository (quadruped robot, data center,
//    optical chip) and five do not (drones and vessel, satellite link and
//    delivery robot, lab instrument, AR headset, and the "open prompt"
//    treatment, whose medium is itself unclear). Shipping three photographed
//    cards beside five blank ones reads worse than a uniform text grid, which
//    is the same call already taken and accepted for the LM10/LS20 column
//    photos on page 07. Adding `media` per card later is data-only and needs
//    no further change.
//
// 3. REMOVALS — REMOVE · MOVE OFF THIS PAGE. Four sections leave:
//      ebb6cf90 "Software-defined 3D sensing for Physical AI"  -> Sense (09)
//      b3ce5d47 "Automotive Safety Cocoon"                     -> Automotive (11)
//      357cf90c "Scalable across 3D sensing markets"           -> Sense (09)
//      60dd50fb "The Lumotive advantage"                       -> Sense (09)
//    The package also moves the Mobility, Smart Infrastructure & Surveillance
//    and Robotics 3D-sensing sub-sections off this page; on this build those
//    are the Mobility and Smart-infrastructure bento cards plus the 357cf90c
//    market cards, all of which the rebuild above already removes.
//
//    Removing ebb6cf90 also clears global rule 9: "Physical AI" was in an h2
//    on this page, which the rule forbids.
//
//    The down path restores all four verbatim. That matters: their copy is the
//    source for pages 09 and 11, so this migration is the record of it until
//    those pages are built.
//
// 4. CLOSING CTA (9a19b24a) — CHANGE. New body, and the section drops to the
//    single approved action "Talk to our team". The staging section carried
//    "Contact Lumotive" plus a secondary "Explore Lumotive Sense".
//
// NOT IMPLEMENTED HERE — "Programmable Optics in Motion". The package replaces
// the single staging video with two side by side: an AMR animation on the left
// and vimeo.com/1227505713 on the right. The Connect video is supplied and
// already published on /connect. The AMR animation is not: the package's dev
// note is conditional, "If the existing staging video vimeo.com/1174547871 is
// the AMR animation, use it in the left slot", and that cannot be confirmed
// from here. Package page 04 also lists the AMR animation as a new asset
// request. Shipping the right-hand video alone would reproduce the single
// video the section exists to replace, so the whole section waits for the
// confirmation. Tracked in handoff/page-08-applications.md.
//
// 5. CONTAINER ALIGNMENT. The three surviving sections opt into the header
//    container, the same `align: "container"` that pages 05, 06 and 07 already
//    set. Without it this page's inner column would sit on a different edge to
//    every page beside it in the navigation.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'applications'

const HERO_ID = 'acb2f280'
const AREAS_ID = '91a455fe'
const CTA_ID = '9a19b24a'
const REMOVED_IDS = ['ebb6cf90', 'b3ce5d47', '357cf90c', '60dd50fb']

const HERO_AFTER = {
	body: '<p>One semiconductor platform. Many ways to put light to work.</p>',
	primaryLink: { type: 'custom', url: '/contact', label: 'Talk to our team', newTab: false },
	primaryLinkLabel: 'Talk to our team',
	primaryLinkUrl: '/contact',
	primaryLinkNewTab: false
}

const HERO_BEFORE = {
		"body": "<p>Lumotive&#39;s LCM™ platform brings software control to light, enabling new approaches to sensing, switching, communications, computing, and other light-based systems.</p>",
		"primaryLink": {
			"label": "Explore Lumotive Sense",
			"newTab": false,
			"type": "custom",
			"url": "/sense"
		},
		"primaryLinkLabel": "Explore Lumotive Sense",
		"primaryLinkUrl": "/sense",
		"primaryLinkNewTab": false
	}

const AREAS_AFTER = {
	type: 'cardsMediaCards',
	designVersion: 'mediaCards',
	columns: '4',
	heading: 'One platform, many applications',
	intro:
		'LCM brings software control to light. The same chip technology that steers lidar beams can route light in data centers, link satellites, and shape light for displays and instruments.',
	cards: [
		{
			"title": "3D sensing",
			"body": "<p>Programmable 3D sensing for robots, vehicles, and smart infrastructure.</p>",
			"accent": "accent1",
			"link": {
				"type": "custom",
				"url": "/sense",
				"label": "Explore Sense",
				"newTab": false
			},
			"linkLabel": "Explore Sense",
			"linkNewTab": false,
			"linkUrl": "/sense"
		},
		{
			"title": "Optical circuit switching",
			"body": "<p>Solid-state switching for AI data center networks.</p>",
			"accent": "accent2",
			"link": {
				"type": "custom",
				"url": "/connect",
				"label": "Explore Connect",
				"newTab": false
			},
			"linkLabel": "Explore Connect",
			"linkNewTab": false,
			"linkUrl": "/connect"
		},
		{
			"title": "Defense",
			"body": "<p>Solid-state beam control for sensing and optical systems.</p>",
			"accent": "accent3"
		},
		{
			"title": "Optical communications",
			"body": "<p>Beam steering for satellite, airborne, and terrestrial links.</p>",
			"accent": "accent1",
			"link": {
				"type": "custom",
				"url": "/connect",
				"label": "Explore Connect",
				"newTab": false
			},
			"linkLabel": "Explore Connect",
			"linkNewTab": false,
			"linkUrl": "/connect"
		},
		{
			"title": "Medical",
			"body": "<p>Programmable illumination for imaging and instrumentation.</p>",
			"accent": "accent2"
		},
		{
			"title": "AI computing",
			"body": "<p>Light-speed optical computing with programmable phase control.</p>",
			"accent": "accent3"
		},
		{
			"title": "AR & holographic displays",
			"body": "<p>Flat, programmable optics for near-eye and holographic displays.</p>",
			"accent": "accent1"
		},
		{
			"title": "Your application",
			"body": "<p>Applications yet to be created, built on innovations today. Tell us what you would build with programmable light.</p>",
			"accent": "accent2",
			"link": {
				"type": "custom",
				"url": "/contact",
				"label": "Talk to us",
				"newTab": false
			},
			"linkLabel": "Talk to us",
			"linkNewTab": false,
			"linkUrl": "/contact"
		}
	]
}

const AREAS_BEFORE = {
		"type": "cardsApplicationBento",
		"designVersion": "applicationBento",
		"heading": "One platform. Many optical applications.",
		"intro": "LCM is a programmable semiconductor platform that brings software control to light. One platform can support many optical applications across sensing, switching, communications, computing, and more.",
		"cards": [
			{
				"accent": "accent1",
				"body": "<p>Adaptive sensing for robotics, humanoids, automation, and other intelligent machines</p>",
				"eyebrow": "Sense",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/market-robot-dog.jpg"
				},
				"title": "3D sensing"
			},
			{
				"accent": "accent1",
				"body": "<p>Surround sensing for automotive, robotaxi, trucking, and heavy equipment</p>",
				"eyebrow": "Sense",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/market-passenger-adas.jpg"
				},
				"title": "Mobility"
			},
			{
				"accent": "accent1",
				"body": "<p>Programmable sensing for traffic, parking, perimeter security, public spaces, and industrial monitoring</p>",
				"eyebrow": "Sense",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/market-perimeter-security.jpg"
				},
				"title": "Smart infrastructure & surveillance"
			},
			{
				"accent": "accent2",
				"body": "<p>Optical circuit switching for AI infrastructure and beam control for satellite, airborne, terrestrial, and other optical links</p>",
				"eyebrow": "Connect",
				"link": {
					"label": "Explore Lumotive Connect",
					"newTab": false,
					"type": "custom",
					"url": "/connect"
				},
				"linkLabel": "Explore Lumotive Connect",
				"linkNewTab": false,
				"linkUrl": "/connect",
				"media": {
					"kind": "url",
					"value": "/lumotive/img/connect-optical.jpg"
				},
				"title": "AI data centers & optical communications"
			},
			{
				"accent": "accent3",
				"body": "<p>Solid-state optical control for sensing, communications, and advanced optical systems</p>",
				"eyebrow": "Defense",
				"title": "Defense"
			}
		]
	}

const CTA_AFTER = {
	body: '<p>Tell us the problem. We will show you where programmable light fits.</p>',
	primaryLink: { type: 'custom', url: '/contact', label: 'Talk to our team', newTab: false },
	primaryLinkLabel: 'Talk to our team',
	primaryLinkUrl: '/contact',
	primaryLinkNewTab: false,
	secondaryLink: null,
	secondaryLinkLabel: null,
	secondaryLinkUrl: null,
	secondaryLinkNewTab: null
}

const CTA_BEFORE = {
		"body": "<p>Explore how Lumotive&#39;s programmable optics platform can support your sensing architecture and next-generation optical systems.</p>",
		"primaryLink": {
			"label": "Contact Lumotive",
			"newTab": false,
			"type": "custom",
			"url": "/contact"
		},
		"primaryLinkLabel": "Contact Lumotive",
		"primaryLinkUrl": "/contact",
		"primaryLinkNewTab": false,
		"secondaryLink": {
			"label": "Explore Lumotive Sense",
			"newTab": false,
			"type": "custom",
			"url": "/sense"
		},
		"secondaryLinkLabel": "Explore Lumotive Sense",
		"secondaryLinkUrl": "/sense",
		"secondaryLinkNewTab": false
	}

// The four moved sections, exactly as this branch found them, so the down path
// restores the page rather than approximating it.
const REMOVED_SECTIONS = [
		{
			"anchor": "sense",
			"background": "none",
			"body": "<p>Lumotive Sense applies the LCM platform to 3D sensing, enabling systems to dynamically adjust scan patterns, field of view, frame rate, range, and resolution based on the task and environment.</p><p>Instead of capturing every scene in the same way, Lumotive Sense helps machines focus sensing resources on the information that matters most.</p>",
			"designVersion": "default",
			"eyebrow": "Lumotive Sense",
			"heading": "Software-defined 3D sensing for Physical AI",
			"id": "ebb6cf90",
			"link": {
				"label": "Explore Lumotive Sense",
				"newTab": false,
				"type": "custom",
				"url": "/sense"
			},
			"linkLabel": "Explore Lumotive Sense",
			"linkNewTab": false,
			"linkUrl": "/sense",
			"media": {
				"kind": "url",
				"value": "/lumotive/img/sense-agv.jpg"
			},
			"mediaPosition": "right",
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "splitDefault",
			"videoUrl": "https://vimeo.com/1174547871/6e198e52ae",
			"width": "contained"
		},
		{
			"anchor": "safety-cocoon",
			"background": "none",
			"body": "<p>Lumotive Sense enables programmable 3D sensing around the vehicle, supporting adaptable perception for automotive and autonomous mobility applications.</p>",
			"designVersion": "default",
			"eyebrow": "Lumotive Sense",
			"heading": "Automotive Safety Cocoon",
			"id": "b3ce5d47",
			"link": {
				"label": "Explore Lumotive Sense",
				"newTab": false,
				"type": "custom",
				"url": "/sense"
			},
			"linkLabel": "Explore Lumotive Sense",
			"linkNewTab": false,
			"linkUrl": "/sense",
			"media": {
				"kind": "url",
				"value": "/lumotive/img/market-passenger-adas.jpg"
			},
			"mediaPosition": "left",
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "splitDefault",
			"width": "contained"
		},
		{
			"anchor": "markets",
			"background": "none",
			"cards": [
				{
					"accent": "accent1",
					"anchor": "robotics",
					"body": "<p>Adaptive 3D sensing for robots operating around people, shelves, pallets, and changing environments. Lumotive Sense supports applications that require flexible perception, environmental awareness, and compact system design.</p><p>Examples:</p><ul><li>AMRs and autonomous mobile robots</li><li>Humanoids</li><li>Warehouse robotics</li><li>Industrial and collaborative robots</li></ul>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/market-agv.jpg"
					},
					"title": "Robotics and humanoids"
				},
				{
					"accent": "accent2",
					"anchor": "automotive",
					"body": "<p>Wide-field-of-view sensing for vehicles and machines operating in dynamic environments. Lumotive Sense supports surround sensing applications that improve awareness and safety around the vehicle or machine.</p><p>Examples:</p><ul><li>Automotive</li><li>Robotaxi</li><li>Trucking</li><li>Heavy equipment</li></ul>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/market-mobility-truck.webp"
					},
					"title": "Mobility and heavy equipment"
				},
				{
					"accent": "accent3",
					"body": "<p>Programmable 3D sensing for intelligent infrastructure, monitoring, and public-space awareness. Lumotive Sense supports configurable sensing zones, privacy-aware monitoring, and reliable operation across indoor and outdoor environments.</p><p>Examples:</p><ul><li>Smart infrastructure</li><li>Surveillance</li><li>Traffic and parking monitoring</li><li>Perimeter and industrial monitoring</li></ul>",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/market-its.jpg"
					},
					"title": "Smart infrastructure and surveillance"
				}
			],
			"designVersion": "mediaCards",
			"heading": "Scalable across 3D sensing markets",
			"id": "357cf90c",
			"intro": "Lumotive Sense supports three primary application groups, each with distinct operating environments and sensing requirements.",
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "cardsMediaCards",
			"width": "contained"
		},
		{
			"anchor": "advantage",
			"background": "none",
			"body": "<p>Lumotive Sense combines software-defined control, solid-state operation, and semiconductor scalability to simplify 3D sensing systems and adapt performance to the application.</p>",
			"designVersion": "darkTraits",
			"eyebrow": "Lumotive Sense",
			"heading": "The Lumotive advantage",
			"id": "60dd50fb",
			"media": {
				"kind": "url",
				"value": "/lumotive/img/advantage-bleed.png"
			},
			"spacingBottom": "lg",
			"spacingTop": "md",
			"stats": [
				{
					"description": "Adjust scan pattern, field of view, range, resolution and frame rate without touching the optics.",
					"label": "Adapt in software",
					"value": "No hardware change"
				},
				{
					"description": "Direct sensing toward the objects and zones that need more detail or faster updates.",
					"label": "Focus on what matters",
					"value": "Adaptive ROI"
				},
				{
					"description": "One programmable device covers several optical functions, with less mechanical complexity.",
					"label": "Reduce system complexity",
					"value": "Fewer sensors"
				},
				{
					"description": "No moving parts, manufactured through established semiconductor processes.",
					"label": "Built to scale",
					"value": "Solid-state"
				}
			],
			"type": "statsDarkTraits",
			"width": "contained"
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

const assign = (section, patch) => {
	for (const key of Object.keys(patch)) {
		if (patch[key] === null) delete section[key]
		else section[key] = JSON.parse(JSON.stringify(patch[key]))
	}
}

migrate(
	(app) => {
		const record = findPage(app)
		if (!record) return

		const sections = readSections(record).filter((entry) => entry && !REMOVED_IDS.includes(entry.id))
		const hero = sections.find((entry) => entry.id === HERO_ID)
		const areas = sections.find((entry) => entry.id === AREAS_ID)
		const cta = sections.find((entry) => entry.id === CTA_ID)
		if (!hero || !areas || !cta) return

		assign(hero, HERO_AFTER)
		assign(areas, AREAS_AFTER)
		assign(cta, CTA_AFTER)
		for (const section of [hero, areas, cta]) section.align = 'container'

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findPage(app)
		if (!record) return

		const sections = readSections(record)
		const hero = sections.find((entry) => entry.id === HERO_ID)
		const areas = sections.find((entry) => entry.id === AREAS_ID)
		const cta = sections.find((entry) => entry.id === CTA_ID)
		if (!hero || !areas || !cta) return

		assign(hero, HERO_BEFORE)
		assign(areas, AREAS_BEFORE)
		assign(cta, CTA_BEFORE)
		delete areas.columns
		for (const section of [hero, areas, cta]) delete section.align

		// Put the four moved sections back in their original positions.
		const restored = []
		for (const entry of sections) {
			restored.push(entry)
			if (entry.id === AREAS_ID) {
				for (const section of REMOVED_SECTIONS) restored.push(JSON.parse(JSON.stringify(section)))
			}
		}

		record.set('sections', restored)
		app.save(record)
	}
)
