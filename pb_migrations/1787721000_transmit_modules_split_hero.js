// /transmit-modules hero (b41d7c05): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped; copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = 'b41d7c05'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>Software-defined beamforming for the longest-range iToF sensors.</p><p>TX10 is a fully developed transmit module built around our LM10 chip, so 3D sensor developers build longer-range, highly configurable iToF sensors without designing custom beamforming hardware.</p>", "designVersion": "band", "eyebrow": "Transmit modules · TX10", "heading": "LCM-based iToF transmit module", "id": "b41d7c05", "media": {"kind": "url", "value": "/lumotive/img/hero-tx10-in-hand.webp"}, "mobileMediaPosition": "65%", "mobileShade": "max", "primaryLink": {"label": "Request the TX10 datasheet", "newTab": false, "type": "custom", "url": "/contact?inquiry=tx10-datasheet"}, "primaryLinkLabel": "Request the TX10 datasheet", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=tx10-datasheet", "spacingBottom": "none", "spacingTop": "none", "tabletShade": "strong", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>Software-defined beamforming for the longest-range iToF sensors.</p><p>TX10 is a fully developed transmit module built around our LM10 chip, so 3D sensor developers build longer-range, highly configurable iToF sensors without designing custom beamforming hardware.</p>", "designVersion": "split", "eyebrow": "Transmit modules · TX10", "heading": "LCM-based iToF transmit module", "id": "b41d7c05", "media": {"kind": "url", "value": "/lumotive/img/hero-tx10-in-hand.webp"}, "primaryLink": {"label": "Request the TX10 datasheet", "newTab": false, "type": "custom", "url": "/contact?inquiry=tx10-datasheet"}, "primaryLinkLabel": "Request the TX10 datasheet", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=tx10-datasheet", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'transmit-modules' }) }
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
