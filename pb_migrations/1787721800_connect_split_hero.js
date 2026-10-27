// /connect hero (ffa907ea): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped; copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = 'ffa907ea'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>Solid-state and at scale.</p>", "designVersion": "band", "eyebrow": "Lumotive Connect", "heading": "Optical circuit switching", "id": "ffa907ea", "media": {"kind": "url", "value": "/lumotive/img/home-2d-photonic-news.webp"}, "mobileMediaPosition": "0%", "primaryLink": {"label": "Talk to our OCS team", "newTab": false, "type": "custom", "url": "/contact?inquiry=ocs"}, "primaryLinkLabel": "Talk to our OCS team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=ocs", "secondaryLink": {"label": "Learn about LCM", "newTab": false, "type": "custom", "url": "/platform"}, "secondaryLinkLabel": "Learn about LCM", "secondaryLinkNewTab": false, "secondaryLinkUrl": "/platform", "spacingBottom": "none", "spacingTop": "none", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>Solid-state and at scale.</p>", "designVersion": "split", "eyebrow": "Lumotive Connect", "heading": "Optical circuit switching", "id": "ffa907ea", "media": {"kind": "url", "value": "/lumotive/img/home-2d-photonic-news.webp"}, "primaryLink": {"label": "Talk to our OCS team", "newTab": false, "type": "custom", "url": "/contact?inquiry=ocs"}, "primaryLinkLabel": "Talk to our OCS team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=ocs", "secondaryLink": {"label": "Learn about LCM", "newTab": false, "type": "custom", "url": "/platform"}, "secondaryLinkLabel": "Learn about LCM", "secondaryLinkNewTab": false, "secondaryLinkUrl": "/platform", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'connect' }) }
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
