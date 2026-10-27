// /contact hero (ad9c07fe): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped; copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = 'ad9c07fe'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>Evaluate programmable 3D sensing, discuss optical connectivity, or find your next role.</p>", "designVersion": "band", "eyebrow": "Contact Lumotive", "heading": "Start with the team closest to your project", "id": "ad9c07fe", "media": {"kind": "url", "value": "/lumotive/img/hero-contact.jpg"}, "mobileMediaPosition": "25%", "mobileShade": "strong", "spacingBottom": "md", "spacingTop": "md", "tabletShade": "strong", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>Evaluate programmable 3D sensing, discuss optical connectivity, or find your next role.</p>", "designVersion": "split", "eyebrow": "Contact Lumotive", "heading": "Start with the team closest to your project", "id": "ad9c07fe", "media": {"kind": "url", "value": "/lumotive/img/hero-contact.jpg"}, "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'contact' }) }
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
