// /partners hero (e95fe8b0): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped; copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = 'e95fe8b0'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>We work with distributors, customers, software specialists, and component leaders to turn programmable optics into production systems.</p>", "designVersion": "band", "eyebrow": "Lumotive ecosystem", "heading": "Building programmable optics together", "id": "e95fe8b0", "media": {"kind": "url", "value": "/lumotive/img/hero-partners-lcm.webp"}, "primaryLink": {"label": "Talk to our team", "newTab": false, "type": "custom", "url": "/contact"}, "primaryLinkLabel": "Talk to our team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact", "spacingBottom": "md", "spacingTop": "md", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>We work with distributors, customers, software specialists, and component leaders to turn programmable optics into production systems.</p>", "designVersion": "split", "eyebrow": "Lumotive ecosystem", "heading": "Building programmable optics together", "id": "e95fe8b0", "media": {"kind": "url", "value": "/lumotive/img/hero-partners-lcm.webp"}, "primaryLink": {"label": "Talk to our team", "newTab": false, "type": "custom", "url": "/contact"}, "primaryLinkLabel": "Talk to our team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'partners' }) }
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
