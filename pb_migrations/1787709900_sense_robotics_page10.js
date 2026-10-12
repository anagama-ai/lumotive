// Sense › Robotics (/sense/robotics), approved content package
// rev. 2026-10-07, page 10 of 21. NEW PAGE.
//
// The page is created as a child of /sense, so computePath resolves it to
// "sense/robotics", which is the URL the page-01 site map gives it. The footer
// and the header's Applications submenu already link there and have been
// answering 404 since the footer was rebuilt.
//
// Sections, in the package's order:
//   1 heroBand        "Adaptive 3D Sensing for Robots and Humanoids", with the
//                     two approved actions. The approved hero image (an AMR and
//                     a humanoid in a warehouse under a depth overlay) has not
//                     been supplied, so the band ships without one rather than
//                     with a stand-in.
//   2 splitDefault    "Robots Carry Too Many Sensors". Copy only, so the split
//                     holds a single reading column.
//   3 cardsTextCards  "One Sensor, Three Jobs" and the three virtual sensors.
//   4 cardsTextCards  The four benefits that close that block, joined to it by
//                     spacing rather than repeated headings.
//   5 cardsTextCards  "Proven With a Major U.S. Robotics OEM", eight blocks.
//                     The package marks this "BLOCKS, NOT A TABLE", and the dev
//                     note keeps the customer unnamed, which the approved copy
//                     already does.
//   6 cardsTextCards  "Built for Every Kind of Robot", six cards.
//   7 cardsMediaCards "Kits for Robotics", the kit card component: name, one
//                     line, four spec lines and a link to the category page,
//                     four across desktop, two tablet, one mobile.
//   8 cardsTextCards  "Design Your Own Sensor With Lumotive", four steps and
//                     the approved line naming the providers.
//   9 ctaDefault      "Put a Programmable Sensor on Your Robot".
//
// Global rules honoured: no availability, launch timing, roadmap or generation
// dates; no operating temperature; no 1550 nm, FMCW or Tx/Rx; no klux; no
// downloads; lidar lowercase; "Physical AI" does not appear; the page ends on
// its own specific CTA. Both CTAs carry the page-02 inquiry parameter
// `?inquiry=robotics`.
//
// OMITTED, nothing invented in their place:
//   - The hero image, as above.
//   - The three-panel AMR demo video beside the virtual sensors. Package page
//     04 lists the clean flash / LCM / stereo point-cloud renders and
//     Vimeo 1053591397 as new assets for Robotics; none is in this repository.
//   - All four kit photographs. The package marks them "from the Q4 flyer",
//     and page 04 lists the kit photos at full resolution as a new asset. Two
//     of the four products, LI140 and ON140, have no photograph here at all,
//     and a half-illustrated kit row reads worse than a uniform one. Adding
//     `media` per card later is data-only.
//   - The Module and Solution Providers component. It stays pending across
//     pages 09, 10, 12 and 19 until the Leopard Imaging and Electronic
//     Photonics logos arrive. The approved sentence naming those providers is
//     copy, not the logo component, so it ships on section 6f24b8c1.
//
// The down path deletes the page, which is what reverses creating it.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PARENT_PATH = 'sense'
const PAGE_PATH = 'sense/robotics'
const PAGE_SLUG = 'robotics'

const SECTIONS = [
		{
			"id": "4c1a8e02",
			"type": "heroBand",
			"designVersion": "band",
			"anchor": "",
			"eyebrow": "Sense · Robotics",
			"heading": "Adaptive 3D sensing for robots and humanoids",
			"body": "<p>One LCM-based sensor handles localization, obstacle avoidance, and cliff detection at the same time, each configured in software.</p>",
			"primaryLink": {
				"type": "custom",
				"url": "/contact?inquiry=robotics",
				"label": "Talk to our robotics team",
				"newTab": false
			},
			"primaryLinkLabel": "Talk to our robotics team",
			"primaryLinkUrl": "/contact?inquiry=robotics",
			"primaryLinkNewTab": false,
			"secondaryLink": {
				"type": "custom",
				"url": "#kits",
				"label": "See the kits",
				"newTab": false
			},
			"secondaryLinkLabel": "See the kits",
			"secondaryLinkUrl": "#kits",
			"secondaryLinkNewTab": false,
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "none",
			"spacingBottom": "none"
		},
		{
			"id": "7d3e52b9",
			"type": "splitDefault",
			"designVersion": "default",
			"anchor": "problem",
			"eyebrow": "The problem",
			"heading": "Robots carry too many sensors",
			"body": "<p>A typical mobile robot stacks two or three depth sensors per side: one for localization, one for obstacles, one for cliffs. Each adds cost, calibration, power, and another point of failure.</p>",
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "sm",
			"spacingBottom": "sm"
		},
		{
			"id": "9a0b7f31",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"anchor": "virtual-sensors",
			"eyebrow": "Virtual sensors",
			"heading": "One sensor, three jobs",
			"intro": "LCM interleaves three virtual sensors in a single scan, each with its own field of view, frame rate, and integration time.",
			"columns": "3",
			"cards": [
				{
					"title": "Localization",
					"body": "<p>Long-range center slice for mapping walls and fixtures.</p>",
					"accent": "accent1"
				},
				{
					"title": "Cliff and obstacle",
					"body": "<p>Low ROI with short integration for ledges and low obstacles.</p>",
					"accent": "accent2"
				},
				{
					"title": "Object avoidance",
					"body": "<p>Full field of view for everything else.</p>",
					"accent": "accent3"
				}
			],
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "md",
			"spacingBottom": "none"
		},
		{
			"id": "2e6c48da",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"anchor": "",
			"columns": "4",
			"cards": [
				{
					"title": "Fewer sensors to buy",
					"accent": "accent1"
				},
				{
					"title": "Fewer parts to maintain",
					"accent": "accent2"
				},
				{
					"title": "Simpler calibration",
					"accent": "accent3"
				},
				{
					"title": "Lower total power",
					"accent": "accent1"
				}
			],
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "sm",
			"spacingBottom": "md"
		},
		{
			"id": "b5f91c67",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"anchor": "proof",
			"eyebrow": "Proof",
			"heading": "Proven with a major U.S. robotics OEM",
			"intro": "Software-defined sensing lowers total cost of ownership.",
			"columns": "4",
			"cards": [
				{
					"title": "Extended range",
					"body": "<p>Up to 30 m from iToF.</p>",
					"accent": "accent1"
				},
				{
					"title": "Sensor consolidation",
					"body": "<p>One sensor instead of two or three.</p>",
					"accent": "accent2"
				},
				{
					"title": "Solid-state reliability",
					"body": "<p>Less maintenance, more uptime.</p>",
					"accent": "accent3"
				},
				{
					"title": "Power efficiency",
					"body": "<p>Less heat, longer battery life.</p>",
					"accent": "accent1"
				},
				{
					"title": "High frame rates",
					"body": "<p>Higher speed and throughput.</p>",
					"accent": "accent2"
				},
				{
					"title": "High precision",
					"body": "<p>Work closer to walls, people, and objects.</p>",
					"accent": "accent3"
				},
				{
					"title": "Less noise, fewer artifacts",
					"body": "<p>Safer, more efficient operation.</p>",
					"accent": "accent1"
				},
				{
					"title": "Software-defined sensing",
					"body": "<p>Closed-loop learning and optimization.</p>",
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
			"id": "18d4a7e5",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"anchor": "robot-types",
			"heading": "Built for every kind of robot",
			"columns": "3",
			"cards": [
				{
					"title": "AMRs",
					"body": "<p>Navigation, docking, and people detection in aisles and open floors.</p>",
					"accent": "accent1"
				},
				{
					"title": "Humanoids",
					"body": "<p>Wide, adaptive depth for navigation and manipulation in human spaces.</p>",
					"accent": "accent2"
				},
				{
					"title": "Quadrupeds",
					"body": "<p>Terrain and obstacle sensing for last-mile and inspection robots.</p>",
					"accent": "accent3"
				},
				{
					"title": "Forklifts",
					"body": "<p>Pallet, rack, and people detection for autonomous handling.</p>",
					"accent": "accent1"
				},
				{
					"title": "Drones",
					"body": "<p>Lightweight depth for indoor navigation and inspection.</p>",
					"accent": "accent2"
				},
				{
					"title": "Industrial automation",
					"body": "<p>Conveyor tracking, material sorting, and volume measurement.</p>",
					"accent": "accent3"
				}
			],
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "c90e36b4",
			"type": "cardsMediaCards",
			"designVersion": "mediaCards",
			"anchor": "kits",
			"heading": "Kits for robotics",
			"columns": "4",
			"density": "tight",
			"cards": [
				{
					"title": "M30",
					"body": "<p>Gpixel iToF receiver</p><ul><li>Max range: 10–25 m</li><li>FoV: 120° × 90°</li><li>Res: 0.38° × 0.38°</li><li>Interface: MIPI · Ethernet (dev kit)</li></ul>",
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
					"title": "NM120",
					"body": "<p>ADAPS dToF receiver</p><ul><li>Max range: 72 m</li><li>FoV: 120° × 90°</li><li>Res: 0.5° × 0.5°</li><li>Interface: GigE</li></ul>",
					"accent": "accent2",
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
					"title": "LI140",
					"body": "<p>onsemi iToF receiver</p><ul><li>Max range: 30 m</li><li>FoV: 140° × 105°</li><li>Res: 0.2° × 0.2°</li><li>Interface: GMSL2</li></ul>",
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
				},
				{
					"title": "ON140",
					"body": "<p>onsemi AF0130 evaluation kit</p><ul><li>Max range: 30 m</li><li>FoV: 140° × 105°</li><li>Res: 0.2° × 0.2°</li><li>Interface: USB</li></ul>",
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
				}
			],
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "6f24b8c1",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"anchor": "design-your-own",
			"heading": "Design your own sensor with Lumotive",
			"intro": "Need a different range, field of view, or form factor? Build your own sensor on the Lumotive Sense platform, or integrate it directly into your robot.",
			"columns": "4",
			"note": "Leopard Imaging, Namuga, Hokuyo, and Electronic Photonics build their products on LCM.",
			"cards": [
				{
					"title": "Evaluate",
					"body": "<p>Start with a dev kit.</p>",
					"accent": "accent1"
				},
				{
					"title": "Customize",
					"body": "<p>Tune range, field of view, and scan patterns to your robot and its tasks.</p>",
					"accent": "accent2"
				},
				{
					"title": "Integrate",
					"body": "<p>Place the LCM transmitter and receiver directly on your robot’s compute board or your body, with no separate sensor box.</p>",
					"accent": "accent3"
				},
				{
					"title": "Build",
					"body": "<p>Our engineers support your team from evaluation through production design.</p>",
					"accent": "accent1"
				}
			],
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "a73d519f",
			"type": "ctaDefault",
			"designVersion": "default",
			"anchor": "",
			"heading": "Put a programmable sensor on your robot",
			"body": "<p>Tell us your robot, your sensor stack, and what you want to remove from it.</p>",
			"primaryLink": {
				"type": "custom",
				"url": "/contact?inquiry=robotics",
				"label": "Talk to our robotics team",
				"newTab": false
			},
			"primaryLinkLabel": "Talk to our robotics team",
			"primaryLinkUrl": "/contact?inquiry=robotics",
			"primaryLinkNewTab": false,
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "lg",
			"spacingBottom": "lg"
		}
	]

const findPage = (app, path) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const parent = findPage(app, PARENT_PATH)
		if (!parent) return

		const record = findPage(app, PAGE_PATH) ?? new Record(app.findCollectionByNameOrId('pages'))

		record.set('title', 'Robotics')
		record.set('slug', PAGE_SLUG)
		record.set('path', PAGE_PATH)
		record.set('parent', parent.id)
		record.set('status', 'published')
		record.set('seoTitle', 'Robotics')
		record.set('seoDescription',
			'One LCM-based sensor handles localization, obstacle avoidance, and cliff detection at the same time, each configured in software.')
		record.set('sections', SECTIONS)
		app.save(record)
	},
	(app) => {
		const record = findPage(app, PAGE_PATH)
		if (record) app.delete(record)
	}
)
