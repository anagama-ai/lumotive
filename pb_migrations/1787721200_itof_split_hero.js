// /itof hero (5a1c9f20): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped; copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = '5a1c9f20'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>LCM beamforming extends iToF range to up to 30 m, with software-defined ROIs, virtual sensors, and HDR.</p>", "designVersion": "band", "eyebrow": "iToF dev kits", "heading": "Long-range iToF development kits", "id": "5a1c9f20", "media": {"kind": "url", "value": "/lumotive/img/hero-itof-kits.webp"}, "mediaAnchor": "100%", "mobileMediaPosition": "100%", "mobileShade": "max", "primaryLink": {"label": "Set up an evaluation", "newTab": false, "type": "custom", "url": "/contact?inquiry=itof-evaluation"}, "primaryLinkLabel": "Set up an evaluation", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=itof-evaluation", "spacingBottom": "none", "spacingTop": "none", "tabletShade": "strong", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>LCM beamforming extends iToF range to up to 30 m, with software-defined ROIs, virtual sensors, and HDR.</p>", "designVersion": "split", "eyebrow": "iToF dev kits", "heading": "Long-range iToF development kits", "id": "5a1c9f20", "media": {"kind": "url", "value": "/lumotive/img/hero-itof-kits.webp"}, "mediaAnchor": "100%", "primaryLink": {"label": "Set up an evaluation", "newTab": false, "type": "custom", "url": "/contact?inquiry=itof-evaluation"}, "primaryLinkLabel": "Set up an evaluation", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=itof-evaluation", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'itof' }) }
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
