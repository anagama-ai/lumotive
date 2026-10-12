// Sense › Dev Kits & Reference Designs (/dev-kits), approved content package
// rev. 2026-10-07, page 12 of 21.
//
// 1. HERO (1b368f3c) — CHANGE · HUB PAGE. The heading drops the "for LM10-based
//    lidar" qualifier the package does not print, the body takes the approved
//    sentence, and the action becomes "Talk to an engineer" carrying the
//    page-02 inquiry value `kit-recommendation`. The eyebrow and the existing
//    hero image are unchanged; see the note on the kit family photo below.
//
// 2. WHY START WITH A LUMOTIVE KIT (new, 5b7e01d4) — NEW. The four approved
//    reasons, four across.
//
// 3. FIND YOUR DEV KIT (new, 2c84f7a1 / 8d3b05e6 / a90f62b3) — NEW · REPLACES
//    TABLE AND CARDS. One section per family, so each row is sized to its own
//    family rather than padded to a common width: Transmit Modules carries
//    TX10, iToF Dev Kits carries ON140, LI140 and M30, and dToF Dev Kits
//    carries NM120 and MD180. The three are joined by spacing, so the heading
//    is printed once, as the package prints it.
//
//    Each card follows the page-03 kit card spec: name, one line, four spec
//    lines and a link to the category page. Specifications are the package's,
//    character for character, including MD180 substituting a frame rate for a
//    resolution row. Destinations follow product type: TX10 to transmit
//    modules, ON140 and LI140 and M30 to iToF, NM120 to dToF, and MD180 to the
//    contact form with the page-02 inquiry value `md180`.
//
//    The reference design caveat sits under the last family, which is the only
//    place the package prints it on this page.
//
// 4. CLOSING CTA (116c9e28) — CHANGE. "Tell Us Your Spec. We Will Match the
//    Kit." with the approved body and the same "Talk to an engineer" action.
//    The generic "Contact Us" heading and body it replaces are what global
//    rule 8 forbids.
//
// 5. REMOVED. Two sections are not part of the approved page:
//      4bf76360  the old three development kit cards, which the package
//                replaces outright and which still linked to /tx10, /m30 and
//                /nm120, all retired by the site map.
//      e91c47a5  "Shipping today on the LCM platform", the Hokuyo and Namuga
//                customer products. The package's own composition does not
//                carry it, and the Module and Solution Providers component is
//                what now names those builders. It also carried external links
//                on customer logos, which page 01 removes site-wide.
//    Both are restored verbatim by the down path.
//
// 6. CONTAINER ALIGNMENT. Every section on the page opts into the header
//    container, matching pages 05 to 11.
//
// NOT IMPLEMENTED — "Module and Solution Providers". Still blocked on the
// Leopard Imaging and Electronic Photonics logos, across package pages 09, 10,
// 12 and 19. See handoff/page-09-sense.md.
//
// PENDING IMAGERY, nothing invented in its place:
//   - The kit family photo in the hero. The page keeps its incumbent dev kit
//     bench photograph, which is a real Lumotive asset showing kit hardware,
//     rather than being stripped back to a bare band. The package asks for a
//     family shot of the kits together, which is an upgrade on it; swapping
//     `media` on the hero is a one-field change.
//   - All six kit photographs (TX10, ON140, LI140, M30, NM120, MD180). Package
//     page 04 lists the kit photos at full resolution as a new asset, and
//     LI140, ON140 and MD180 have no photograph in this repository at all, so
//     the row ships uniform rather than half illustrated.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'dev-kits'

const HERO_ID = '1b368f3c'
const CTA_ID = '116c9e28'
const REMOVED_IDS = ['4bf76360', 'e91c47a5']

const HERO_AFTER = {
		"heading": "Development kits and reference designs",
		"body": "<p>Evaluate LCM at the transmit, module, or system level. Start with a kit, or use a reference design as the foundation for your own product.</p>",
		"primaryLink": {
			"type": "custom",
			"url": "/contact?inquiry=kit-recommendation",
			"label": "Talk to an engineer",
			"newTab": false
		},
		"primaryLinkLabel": "Talk to an engineer",
		"primaryLinkUrl": "/contact?inquiry=kit-recommendation",
		"primaryLinkNewTab": false,
		"align": "container",
		"spacingTop": "none",
		"spacingBottom": "none"
	}

const HERO_BEFORE = {
		"heading": "Development kits and reference designs for LM10-based lidar",
		"body": "<p>Evaluate Lumotive programmable optics at the component, transmit or complete lidar system level. Start with a physical development kit, or use a reference design as the foundation for a custom system.</p>",
		"primaryLink": {
			"label": "Request more information",
			"newTab": false,
			"type": "custom",
			"url": "/contact"
		},
		"primaryLinkLabel": "Request more information",
		"primaryLinkUrl": "/contact",
		"primaryLinkNewTab": false,
		"align": null,
		"spacingTop": "md",
		"spacingBottom": "md"
	}

const CTA_AFTER = {
		"heading": "Tell us your spec. We will match the kit.",
		"body": "<p>Share your range, field of view, and form factor. Our engineers will point you to the kit or reference design that gets you there fastest.</p>",
		"primaryLink": {
			"type": "custom",
			"url": "/contact?inquiry=kit-recommendation",
			"label": "Talk to an engineer",
			"newTab": false
		},
		"primaryLinkLabel": "Talk to an engineer",
		"primaryLinkUrl": "/contact?inquiry=kit-recommendation",
		"primaryLinkNewTab": false,
		"align": "container",
		"spacingTop": "lg",
		"spacingBottom": "lg"
	}

const CTA_BEFORE = {
		"heading": "Contact Us",
		"body": "<p>Contact Lumotive to discuss development kits and reference designs for your 3D sensing application.</p>",
		"primaryLink": {
			"label": "Contact Us",
			"newTab": false,
			"type": "custom",
			"url": "/contact"
		},
		"primaryLinkLabel": "Contact Us",
		"primaryLinkUrl": "/contact",
		"primaryLinkNewTab": false,
		"align": null,
		"spacingTop": "sm",
		"spacingBottom": "sm"
	}

const WHY = {
		"id": "5b7e01d4",
		"type": "cardsTextCards",
		"designVersion": "textCards",
		"anchor": "why",
		"heading": "Why start with a Lumotive kit",
		"columns": "4",
		"cards": [
			{
				"title": "Evaluate on day one",
				"body": "<p>Hardware, software, and visualizer ready to run.</p>",
				"accent": "accent1"
			},
			{
				"title": "Skip the beam steering design",
				"body": "<p>Validated LCM transmit optics included.</p>",
				"accent": "accent2"
			},
			{
				"title": "Tune in software",
				"body": "<p>Scan patterns, ROIs, and frame rate without new hardware.</p>",
				"accent": "accent3"
			},
			{
				"title": "Engineering support",
				"body": "<p>Our team works with yours from evaluation onward.</p>",
				"accent": "accent1"
			}
		],
		"background": "none",
		"width": "contained",
		"align": "container",
		"spacingTop": "md",
		"spacingBottom": "md"
	}

const TRANSMIT = {
		"id": "2c84f7a1",
		"type": "cardsMediaCards",
		"designVersion": "mediaCards",
		"anchor": "find-your-dev-kit",
		"heading": "Find your dev kit",
		"eyebrow": "Transmit modules",
		"density": "tight",
		"cards": [
			{
				"title": "TX10",
				"body": "<p>LCM transmit module for your own iToF sensor</p><ul><li>Steering: Up to 105°</li><li>Peak power: Up to 35 W</li><li>Wavelength: 910 nm</li><li>Software: Python reference</li></ul>",
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
			}
		],
		"background": "none",
		"width": "contained",
		"align": "container",
		"spacingTop": "md",
		"spacingBottom": "none"
	}

const ITOF = {
		"id": "8d3b05e6",
		"type": "cardsMediaCards",
		"designVersion": "mediaCards",
		"anchor": "itof",
		"eyebrow": "iToF dev kits",
		"density": "tight",
		"cards": [
			{
				"title": "ON140",
				"body": "<p>onsemi AF0130 evaluation kit for camera and module makers</p><ul><li>Range: 30 m</li><li>FoV: 140° × 105°</li><li>Res: 0.2°</li><li>Interface: USB</li></ul>",
				"accent": "accent1",
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
				"title": "LI140",
				"body": "<p>RGB-D kit for robot OEMs</p><ul><li>Range: 30 m</li><li>FoV: 140° × 105°</li><li>Res: 0.2°</li><li>Interface: GMSL2, Jetson</li></ul>",
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
				"title": "M30",
				"body": "<p>Embedded iToF module</p><ul><li>Range: 25 m</li><li>FoV: 120° × 90°</li><li>Res: 0.38°</li><li>Interface: MIPI · Ethernet (dev kit)</li></ul>",
				"accent": "accent3",
				"link": {
					"type": "custom",
					"url": "/dev-kits/itof",
					"label": "Explore iToF dev kits",
					"newTab": false
				},
				"linkLabel": "Explore iToF dev kits",
				"linkNewTab": false,
				"linkUrl": "/dev-kits/itof"
			}
		],
		"background": "none",
		"width": "contained",
		"align": "container",
		"spacingTop": "sm",
		"spacingBottom": "none"
	}

const DTOF = {
		"id": "a90f62b3",
		"type": "cardsMediaCards",
		"designVersion": "mediaCards",
		"anchor": "dtof",
		"eyebrow": "dToF dev kits",
		"density": "tight",
		"note": "Reference designs show what LCM enables. They are not optimized for size, cost, or qualification.",
		"cards": [
			{
				"title": "NM120",
				"body": "<p>Solid-state dToF lidar</p><ul><li>Range: 72 m</li><li>FoV: 120° × 90°</li><li>Res: 0.5°</li><li>Interface: Integrated compute, GigE</li></ul>",
				"accent": "accent1",
				"link": {
					"type": "custom",
					"url": "/dev-kits/dtof",
					"label": "Explore dToF dev kits",
					"newTab": false
				},
				"linkLabel": "Explore dToF dev kits",
				"linkNewTab": false,
				"linkUrl": "/dev-kits/dtof"
			},
			{
				"title": "MD180",
				"body": "<p>180° solid-state dToF lidar</p><ul><li>Range: 50 m</li><li>FoV: 185° × 110°</li><li>Frame rate: 30 Hz</li><li>Interface: Integrated compute, GigE</li></ul>",
				"accent": "accent2",
				"link": {
					"type": "custom",
					"url": "/contact?inquiry=md180",
					"label": "Talk to us about MD180",
					"newTab": false
				},
				"linkLabel": "Talk to us about MD180",
				"linkNewTab": false,
				"linkUrl": "/contact?inquiry=md180"
			}
		],
		"background": "none",
		"width": "contained",
		"align": "container",
		"spacingTop": "sm",
		"spacingBottom": "md"
	}

// The two dropped sections, exactly as this branch found them.
const REMOVED_SECTIONS = [
		{
			"anchor": "offerings",
			"background": "subtle",
			"cards": [
				{
					"accent": "accent2",
					"body": "<p>Use a ready-to-evaluate LM10-based transmit module with your preferred receiver and lidar architecture. TX10 lets teams begin system development without designing the transmit subsystem from the ground up. Best for: lidar module makers and system developers.</p>",
					"eyebrow": "Evaluate a complete transmit subsystem",
					"link": {
						"label": "Explore TX10",
						"newTab": false,
						"type": "custom",
						"url": "/tx10"
					},
					"linkLabel": "Explore TX10",
					"linkNewTab": false,
					"linkUrl": "/tx10",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/tx10-dev-kit.webp"
					},
					"title": "TX10 Development Kit"
				},
				{
					"accent": "accent3",
					"body": "<p>Test an integrated LM10-based lidar module built for evaluation, prototyping and demonstration. M30 gives OEMs and application developers a ready-to-use system for exploring software-defined sensing. Best for: OEM evaluation, prototyping and application testing.</p>",
					"eyebrow": "Evaluate a compact, complete lidar module",
					"link": {
						"label": "Explore the M30 Development Kit",
						"newTab": false,
						"type": "custom",
						"url": "/m30"
					},
					"linkLabel": "Explore the M30 Development Kit",
					"linkNewTab": false,
					"linkUrl": "/m30",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/m30-kit.png"
					},
					"title": "M30 Development Kit"
				},
				{
					"accent": "accent1",
					"body": "<p>Evaluate a complete LM10-based sensing system with software-defined scanning and configurable sensing modes. NM120 supports broader system and application testing across indoor and outdoor environments. Best for: robotics, industrial automation, navigation and security.</p>",
					"eyebrow": "Evaluate a configurable lidar sensing system",
					"link": {
						"label": "Explore the NM120 Development Kit",
						"newTab": false,
						"type": "custom",
						"url": "/nm120"
					},
					"linkLabel": "Explore the NM120 Development Kit",
					"linkNewTab": false,
					"linkUrl": "/nm120",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/nm120-module.png"
					},
					"title": "NM120 Development Kit"
				}
			],
			"designVersion": "mediaCards",
			"heading": "Development kits and reference designs",
			"id": "4bf76360",
			"intro": "Start at the level that matches your development needs. Evaluate the LCM itself, work with a ready-to-use transmit module, test a complete lidar system, or use a reference design to begin developing a custom product.",
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "cardsMediaCards",
			"width": "contained"
		},
		{
			"anchor": "customer-products",
			"background": "none",
			"cards": [
				{
					"accent": "accent1",
					"eyebrow": "Hokuyo",
					"link": {
						"label": "View on hokuyo-aut.jp",
						"newTab": true,
						"type": "custom",
						"url": "https://www.hokuyo-aut.jp/search/single.php?serial=250"
					},
					"linkLabel": "View on hokuyo-aut.jp",
					"linkNewTab": true,
					"linkUrl": "https://www.hokuyo-aut.jp/search/single.php?serial=250",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/ylm-10lx.webp"
					},
					"title": "YLM-10LX"
				},
				{
					"accent": "accent2",
					"eyebrow": "Namuga",
					"link": {
						"label": "View on namuga.com",
						"newTab": true,
						"type": "custom",
						"url": "https://namuga.com/eng/business/mobility.php"
					},
					"linkLabel": "View on namuga.com",
					"linkNewTab": true,
					"linkUrl": "https://namuga.com/eng/business/mobility.php",
					"media": {
						"kind": "url",
						"value": "/lumotive/img/stella-2.webp"
					},
					"title": "Stella-120"
				}
			],
			"designVersion": "mediaCards",
			"eyebrow": "Customer products",
			"heading": "Shipping today on the LCM platform",
			"id": "e91c47a5",
			"intro": "Hokuyo and Namuga build LCM-powered lidar you can buy today. Both links open the manufacturer’s own site in a new tab.",
			"spacingBottom": "md",
			"spacingTop": "md",
			"type": "cardsMediaCards",
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

const clone = (value) => JSON.parse(JSON.stringify(value))

const assign = (section, patch) => {
	for (const key of Object.keys(patch)) {
		if (patch[key] === null) delete section[key]
		else section[key] = clone(patch[key])
	}
}

const NEW_IDS = [WHY.id, TRANSMIT.id, ITOF.id, DTOF.id]

migrate(
	(app) => {
		const record = findPage(app)
		if (!record) return

		const sections = readSections(record).filter(
			(entry) => entry && !REMOVED_IDS.includes(entry.id) && !NEW_IDS.includes(entry.id)
		)
		const hero = sections.find((entry) => entry.id === HERO_ID)
		const cta = sections.find((entry) => entry.id === CTA_ID)
		if (!hero || !cta) return

		assign(hero, HERO_AFTER)
		assign(cta, CTA_AFTER)

		sections.splice(sections.indexOf(cta), 0, clone(WHY), clone(TRANSMIT), clone(ITOF), clone(DTOF))

		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findPage(app)
		if (!record) return

		const sections = readSections(record).filter((entry) => entry && !NEW_IDS.includes(entry.id))
		const hero = sections.find((entry) => entry.id === HERO_ID)
		const cta = sections.find((entry) => entry.id === CTA_ID)
		if (!hero || !cta) return

		assign(hero, HERO_BEFORE)
		assign(cta, CTA_BEFORE)

		// Put the two dropped sections back between the hero and the CTA.
		const restored = []
		for (const entry of sections) {
			if (entry.id === CTA_ID) for (const section of REMOVED_SECTIONS) restored.push(clone(section))
			restored.push(entry)
		}

		record.set('sections', restored)
		app.save(record)
	}
)
