// /about hero (3998f57f): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped; copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = '3998f57f'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>For the first time, light can be controlled as intelligently and flexibly as software.</p>", "designVersion": "band", "eyebrow": "About Lumotive", "heading": "Pioneering the era of programmable optics", "id": "3998f57f", "media": {"kind": "url", "value": "/lumotive/img/hero-about-bench.webp"}, "mobileMediaPosition": "75%", "mobileShade": "strong", "primaryLink": {"label": "Explore the platform", "newTab": false, "type": "custom", "url": "/platform"}, "primaryLinkLabel": "Explore the platform", "primaryLinkNewTab": false, "primaryLinkUrl": "/platform", "secondaryLink": {"label": "Meet the team", "newTab": false, "type": "custom", "url": "#leadership"}, "secondaryLinkLabel": "Meet the team", "secondaryLinkNewTab": false, "secondaryLinkUrl": "#leadership", "spacingBottom": "md", "spacingTop": "md", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>For the first time, light can be controlled as intelligently and flexibly as software.</p>", "designVersion": "split", "eyebrow": "About Lumotive", "heading": "Pioneering the era of programmable optics", "id": "3998f57f", "media": {"kind": "url", "value": "/lumotive/img/hero-about-bench.webp"}, "primaryLink": {"label": "Explore the platform", "newTab": false, "type": "custom", "url": "/platform"}, "primaryLinkLabel": "Explore the platform", "primaryLinkNewTab": false, "primaryLinkUrl": "/platform", "secondaryLink": {"label": "Meet the team", "newTab": false, "type": "custom", "url": "#leadership"}, "secondaryLinkLabel": "Meet the team", "secondaryLinkNewTab": false, "secondaryLinkUrl": "#leadership", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'about' }) }
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
