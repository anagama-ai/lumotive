// Sense › Automotive (/sense/automotive), approved content package
// rev. 2026-10-07, page 11 of 21. NEW PAGE, plus the two navigation entries
// that were waiting on it.
//
// The page is created as a child of /sense, so computePath resolves it to
// "sense/automotive", the URL the page-01 site map gives it. The footer has
// linked there since the footer was rebuilt and has been answering 404; that
// link now resolves.
//
// Sections, in the package's order:
//   1 heroBand        "Solid-State Surround Sensing for Vehicles and Heavy
//                     Equipment" with the single approved action.
//   2 splitDefault    "Near-Field Blind Spots Need Too Many Sensors".
//   3 splitDefault    "A Programmable Cocoon Around the Vehicle", with the four
//                     approved bullets.
//   4 splitDefault    "First Solid-State 180° dToF Lidar at 30 FPS". The dev
//                     note puts no date on the page and sends the link to the
//                     News post, which is the 2026-04-09 press release of that
//                     exact title.
//   5 cardsTextCards  "Built for Real-World Conditions", the five approved
//                     ways, five across.
//   6 cardsTextCards  "Beyond Passenger Vehicles", three cards.
//   7 cardsMediaCards "Evaluate Solid-State dToF", NM120 and MD180. The dev
//                     note removes the roadmap section and keeps software and
//                     compute partners unnamed; the approved copy already does.
//   8 ctaSplitLinks   "Build Your Safety Cocoon With Us", with the approved
//                     lead-in before the chip-level link.
//
// CONTENT MOVED FROM APPLICATIONS. Package page 08 moves "Automotive Safety
// Cocoon" off /applications to this page. Its destination is section 3e05d7b2,
// which carries page 11's own approved copy for that subject rather than the
// older Applications wording; page 11 is the authority for what this page says.
// The superseded copy stays recoverable in the down path of
// 1787709500_applications_page8.js.
//
// NAVIGATION. The Sense dropdown gains Automotive between Robotics and Dev
// kits, completing the approved group, and the Applications group's Automotive
// entry moves off the /applications placeholder onto this page. Both were held
// back in 1787710000_header_sense_menu.js precisely until this page existed.
//
// Global rules honoured: no availability, launch timing, roadmap or generation
// dates, and the roadmap section is dropped as the dev note requires; no
// operating temperature; no 1550 nm, FMCW or Tx/Rx; no klux; no downloads;
// lidar lowercase; "Physical AI" does not appear; the page ends on its own
// specific CTA. Actions carry the page-02 inquiry parameters `automotive` and
// `md180`.
//
// OMITTED, nothing invented in their place:
//   - The hero image, a vehicle with near-field coverage rings.
//   - The top-down safety cocoon graphic (vehicle with 10 m / 20 m / 50 m
//     coverage rings from corner sensors). Package page 04 lists it as a new
//     asset.
//   - The 180° point cloud or video beside the industry-first section.
//   - The heavy dust and rain multi-return images, also new assets on page 04.
//   Each omitted visual leaves its section as a single reading column rather
//   than a half-empty split; adding `media` later restores the two-column
//   layout with no further change.
//
// The down path deletes the page and restores both navigation entries.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PARENT_PATH = 'sense'
const PAGE_PATH = 'sense/automotive'
const PAGE_SLUG = 'automotive'

const SECTIONS = [
		{
			"id": "d81f4a60",
			"type": "heroBand",
			"designVersion": "band",
			"anchor": "",
			"eyebrow": "Sense · Automotive",
			"heading": "Solid-state surround sensing for vehicles and heavy equipment",
			"body": "<p>LCM-based lidar covers 180° from a single sensor, with regions of interest at up to 900 Hz: a programmable safety cocoon around the vehicle.</p>",
			"primaryLink": {
				"type": "custom",
				"url": "/contact?inquiry=automotive",
				"label": "Talk to our automotive team",
				"newTab": false
			},
			"primaryLinkLabel": "Talk to our automotive team",
			"primaryLinkUrl": "/contact?inquiry=automotive",
			"primaryLinkNewTab": false,
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "none",
			"spacingBottom": "none"
		},
		{
			"id": "b47c9e13",
			"type": "splitDefault",
			"designVersion": "default",
			"anchor": "problem",
			"eyebrow": "The problem",
			"heading": "Near-field blind spots need too many sensors",
			"body": "<p>Covering the area around a vehicle takes several narrow-FOV sensors or a mechanical spinner. Both add cost, integration work, and blind spots close to the vehicle, exactly where pedestrians, cyclists, and obstacles appear during parking and low-speed maneuvers.</p>",
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "sm",
			"spacingBottom": "sm"
		},
		{
			"id": "3e05d7b2",
			"type": "splitDefault",
			"designVersion": "default",
			"anchor": "safety-cocoon",
			"eyebrow": "Safety cocoon",
			"heading": "A programmable cocoon around the vehicle",
			"body": "<p>Wide-FOV LCM-based dToF sensors at the corners create continuous near-field coverage. Software decides where to look harder: a pedestrian at the curb, a bollard behind the bumper, a cyclist alongside.</p><ul><li>180° and wider field of view per sensor</li><li>ROIs at up to 900 Hz for fast-moving objects</li><li>Solid state, with no moving parts</li><li>Coverage zones at roughly 10 m, 20 m, and 50 m</li></ul>",
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "9c2a6f85",
			"type": "splitDefault",
			"designVersion": "default",
			"anchor": "industry-first",
			"eyebrow": "Industry first",
			"heading": "First solid-state 180° dToF lidar at 30 FPS",
			"body": "<p>By steering light electronically at semiconductor speed, LCM pushes dToF sensors past the limits of mechanical scanning and fixed-channel VCSEL arrays. Full 180° horizontal coverage removes blind spots in safety-critical applications.</p>",
			"link": {
				"type": "custom",
				"url": "/posts/lumotives-lcm-optical-semiconductor-platform-enables-first-solid-state-180-dtof-lidar-at-30-fps",
				"label": "Read the announcement",
				"newTab": false
			},
			"linkLabel": "Read the announcement",
			"linkNewTab": false,
			"linkUrl": "/posts/lumotives-lcm-optical-semiconductor-platform-enables-first-solid-state-180-dtof-lidar-at-30-fps",
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "6a1b38fc",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"anchor": "field-tested",
			"eyebrow": "Field tested",
			"heading": "Built for real-world conditions",
			"intro": "Outdoors, the sensor has to see past dust, rain, sunlight, and glare. LCM gives you several ways to do it, all in software.",
			"columns": "5",
			"cards": [
				{
					"title": "Multiple returns",
					"body": "<p>See through dust and rain to the object behind.</p>",
					"accent": "accent1"
				},
				{
					"title": "HDR",
					"body": "<p>A low-power pulse in the same scan keeps bright targets sharp and dark targets visible.</p>",
					"accent": "accent2"
				},
				{
					"title": "Focused ROIs",
					"body": "<p>Concentrate the beam where it matters for more signal per pixel.</p>",
					"accent": "accent3"
				},
				{
					"title": "Longer dwell",
					"body": "<p>Integrate longer on far or dark targets.</p>",
					"accent": "accent1"
				},
				{
					"title": "Optical design",
					"body": "<p>System-level optics minimize stray and ambient light.</p>",
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
			"id": "70e9c54d",
			"type": "cardsTextCards",
			"designVersion": "textCards",
			"anchor": "beyond-passenger",
			"heading": "Beyond passenger vehicles",
			"columns": "3",
			"cards": [
				{
					"title": "Robotaxi and trucking",
					"body": "<p>Near-field coverage around large vehicles and trailers.</p>",
					"accent": "accent1"
				},
				{
					"title": "Heavy equipment",
					"body": "<p>Agriculture, construction, and mining machines working near people.</p>",
					"accent": "accent2"
				},
				{
					"title": "Last-mile delivery",
					"body": "<p>Sidewalk robots and quadrupeds in mixed traffic.</p>",
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
			"id": "f2764b90",
			"type": "cardsMediaCards",
			"designVersion": "mediaCards",
			"anchor": "evaluate",
			"heading": "Evaluate solid-state dToF",
			"density": "tight",
			"cards": [
				{
					"title": "NM120",
					"body": "<p>72 m · 120° × 90° · 30 Hz full frame · 900 Hz in ROIs.</p>",
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
					"body": "<p>LS20-based 180° dToF · 185° × 110° · 50 m · 30 Hz.</p>",
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
			"spacingTop": "md",
			"spacingBottom": "md"
		},
		{
			"id": "c58e02a7",
			"type": "ctaSplitLinks",
			"designVersion": "splitLinks",
			"mode": "stacked",
			"anchor": "",
			"heading": "Build your safety cocoon with us",
			"body": "<p>Share your vehicle platform and coverage targets. We will map the sensor layout with you.</p>",
			"note": "Designing at the chip level?",
			"primaryLink": {
				"type": "custom",
				"url": "/contact?inquiry=automotive",
				"label": "Talk to our automotive team",
				"newTab": false
			},
			"primaryLinkLabel": "Talk to our automotive team",
			"primaryLinkUrl": "/contact?inquiry=automotive",
			"primaryLinkNewTab": false,
			"secondaryLink": {
				"type": "custom",
				"url": "/lcm-chips",
				"label": "Explore LCM chips",
				"newTab": false
			},
			"secondaryLinkLabel": "Explore LCM chips",
			"secondaryLinkUrl": "/lcm-chips",
			"secondaryLinkNewTab": false,
			"background": "none",
			"width": "contained",
			"align": "container",
			"spacingTop": "lg",
			"spacingBottom": "lg"
		}
	]

const sub = (label, url, description) => ({
	Description: description,
	link: { label, newTab: false, type: 'custom', url },
	linkLabel: label,
	linkNewTab: false,
	linkUrl: url
})

const AUTOMOTIVE_DESCRIPTION = 'Surround sensing for vehicles and heavy equipment'

const findPage = (app, path) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path })
	} catch {
		return null
	}
}

const findHeader = (app) => {
	try {
		return app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'header' })
	} catch {
		return null
	}
}

// Adds or removes the Sense group's Automotive entry, and repoints the
// Applications group's Automotive entry, in one pass over the header record.
const setNavigation = (app, live) => {
	const record = findHeader(app)
	if (!record) return

	let data
	try {
		data = JSON.parse(record.getString('data') || '{}')
	} catch {
		return
	}
	if (!data || !Array.isArray(data.items)) return

	const sense = data.items.find((entry) => entry && entry.label === 'Sense')
	if (sense && Array.isArray(sense.subitems)) {
		const without = sense.subitems.filter((entry) => entry && entry.linkUrl !== '/' + PAGE_PATH)
		if (live) {
			const at = without.findIndex((entry) => entry && entry.linkUrl === '/sense/robotics')
			const entry = sub('Automotive', '/' + PAGE_PATH, AUTOMOTIVE_DESCRIPTION)
			if (at === -1) without.push(entry)
			else without.splice(at + 1, 0, entry)
		}
		sense.subitems = without
	}

	const applications = data.items.find((entry) => entry && entry.label === 'Applications')
	if (applications && Array.isArray(applications.subitems)) {
		for (const entry of applications.subitems) {
			if (!entry || entry.linkLabel !== 'Automotive') continue
			const url = live ? '/' + PAGE_PATH : '/applications'
			entry.linkUrl = url
			if (entry.link) entry.link.url = url
		}
	}

	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => {
		const parent = findPage(app, PARENT_PATH)
		if (!parent) return

		const record = findPage(app, PAGE_PATH) ?? new Record(app.findCollectionByNameOrId('pages'))

		record.set('title', 'Automotive')
		record.set('slug', PAGE_SLUG)
		record.set('path', PAGE_PATH)
		record.set('parent', parent.id)
		record.set('status', 'published')
		record.set('seoTitle', 'Automotive')
		record.set('seoDescription',
			'LCM-based lidar covers 180\u00b0 from a single sensor, with regions of interest at up to 900 Hz: a programmable safety cocoon around the vehicle.')
		record.set('sections', SECTIONS)
		app.save(record)

		setNavigation(app, true)
	},
	(app) => {
		setNavigation(app, false)

		const record = findPage(app, PAGE_PATH)
		if (record) app.delete(record)
	}
)
