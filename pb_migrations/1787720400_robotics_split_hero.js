// /sense/robotics hero (4c1a8e02): band hero → split hero, the /platform
// layout: copy on the left, the hero photo in the right column. Band-only
// framing keys are dropped; copy, links and media are unchanged. Guarded on
// the exact prior object; down restores it.
const SECTION_ID = '4c1a8e02'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>One LCM-based sensor handles localization, obstacle avoidance, and cliff detection at the same time, each configured in software.</p>", "designVersion": "band", "eyebrow": "Sense · Robotics", "heading": "Adaptive 3D sensing for robots and humanoids", "id": "4c1a8e02", "media": {"kind": "url", "value": "/lumotive/img/market-agv.jpg"}, "mobileMediaPosition": "0%", "mobileShade": "strong", "primaryLink": {"label": "Talk to our robotics team", "newTab": false, "type": "custom", "url": "/contact?inquiry=robotics"}, "primaryLinkLabel": "Talk to our robotics team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=robotics", "secondaryLink": {"label": "See the kits", "newTab": false, "type": "custom", "url": "#kits"}, "secondaryLinkLabel": "See the kits", "secondaryLinkNewTab": false, "secondaryLinkUrl": "#kits", "spacingBottom": "none", "spacingTop": "none", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>One LCM-based sensor handles localization, obstacle avoidance, and cliff detection at the same time, each configured in software.</p>", "designVersion": "split", "eyebrow": "Sense · Robotics", "heading": "Adaptive 3D sensing for robots and humanoids", "id": "4c1a8e02", "media": {"kind": "url", "value": "/lumotive/img/market-agv.jpg"}, "primaryLink": {"label": "Talk to our robotics team", "newTab": false, "type": "custom", "url": "/contact?inquiry=robotics"}, "primaryLinkLabel": "Talk to our robotics team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=robotics", "secondaryLink": {"label": "See the kits", "newTab": false, "type": "custom", "url": "#kits"}, "secondaryLinkLabel": "See the kits", "secondaryLinkNewTab": false, "secondaryLinkUrl": "#kits", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'robotics' }) }
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
