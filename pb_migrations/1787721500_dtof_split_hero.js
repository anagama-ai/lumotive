// /dtof hero (a7c0d613): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped; copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = 'a7c0d613'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>LCM-based dToF lidar for outdoor robots, vehicles, and infrastructure.</p>", "designVersion": "band", "eyebrow": "dToF dev kits", "heading": "Solid-state dToF lidar development kits", "id": "a7c0d613", "media": {"kind": "url", "value": "/lumotive/img/hero-nm120-heatsink.webp"}, "mediaAnchor": "100%", "mobileMediaPosition": "100%", "mobileMediaScale": "1.8", "primaryLink": {"label": "Set up an evaluation", "newTab": false, "type": "custom", "url": "/contact?inquiry=dtof-evaluation"}, "primaryLinkLabel": "Set up an evaluation", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=dtof-evaluation", "spacingBottom": "none", "spacingTop": "none", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>LCM-based dToF lidar for outdoor robots, vehicles, and infrastructure.</p>", "designVersion": "split", "eyebrow": "dToF dev kits", "heading": "Solid-state dToF lidar development kits", "id": "a7c0d613", "media": {"kind": "url", "value": "/lumotive/img/hero-nm120-heatsink.webp"}, "mediaAnchor": "100%", "primaryLink": {"label": "Set up an evaluation", "newTab": false, "type": "custom", "url": "/contact?inquiry=dtof-evaluation"}, "primaryLinkLabel": "Set up an evaluation", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=dtof-evaluation", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dtof' }) }
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
