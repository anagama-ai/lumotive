// /automotive hero (d81f4a60): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped; copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = 'd81f4a60'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>LCM-based lidar covers 180° from a single sensor, with regions of interest at up to 900 Hz: a programmable safety cocoon around the vehicle.</p>", "designVersion": "band", "eyebrow": "Sense · Automotive", "heading": "Solid-state surround sensing for vehicles and heavy equipment", "id": "d81f4a60", "media": {"kind": "url", "value": "/lumotive/img/hero-automotive.webp"}, "mediaScale": "1.4", "mediaShift": "20%", "mobileShade": "max", "primaryLink": {"label": "Talk to our automotive team", "newTab": false, "type": "custom", "url": "/contact?inquiry=automotive"}, "primaryLinkLabel": "Talk to our automotive team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=automotive", "spacingBottom": "none", "spacingTop": "none", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>LCM-based lidar covers 180° from a single sensor, with regions of interest at up to 900 Hz: a programmable safety cocoon around the vehicle.</p>", "designVersion": "split", "eyebrow": "Sense · Automotive", "heading": "Solid-state surround sensing for vehicles and heavy equipment", "id": "d81f4a60", "media": {"kind": "url", "value": "/lumotive/img/hero-automotive.webp"}, "primaryLink": {"label": "Talk to our automotive team", "newTab": false, "type": "custom", "url": "/contact?inquiry=automotive"}, "primaryLinkLabel": "Talk to our automotive team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=automotive", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'automotive' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const at = sections.findIndex((s) => s && s.id === SECTION_ID)
	if (at < 0 || !same(sections[at], forward ? BEFORE : AFTER)) return
	sections[at] = JSON.parse(JSON.stringify(forward ? AFTER : BEFORE))
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
