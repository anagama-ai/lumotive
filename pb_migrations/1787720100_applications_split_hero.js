// /applications hero (acb2f280): band hero → split hero, the /platform
// layout: copy on the left, the applications photo in the right column.
// Band-only framing keys (phone/tablet shades) are dropped; copy, links and
// media are unchanged. Guarded on the exact prior object; down restores it.
const SECTION_ID = 'acb2f280'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>One semiconductor platform. Many ways to put light to work.</p>", "designVersion": "band", "eyebrow": "Applications", "heading": "Programmable optics across applications", "id": "acb2f280", "media": {"kind": "url", "value": "/lumotive/img/hero-applications.jpg"}, "mobileShade": "max", "primaryLink": {"label": "Talk to our team", "newTab": false, "type": "custom", "url": "/contact"}, "primaryLinkLabel": "Talk to our team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact", "spacingBottom": "none", "spacingTop": "none", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>One semiconductor platform. Many ways to put light to work.</p>", "designVersion": "split", "eyebrow": "Applications", "heading": "Programmable optics across applications", "id": "acb2f280", "media": {"kind": "url", "value": "/lumotive/img/hero-applications.jpg"}, "primaryLink": {"label": "Talk to our team", "newTab": false, "type": "custom", "url": "/contact"}, "primaryLinkLabel": "Talk to our team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'applications' }) }
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
