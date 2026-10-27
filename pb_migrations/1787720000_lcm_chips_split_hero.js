// /lcm-chips hero (b7c41d08): band hero → split hero, the /platform layout:
// copy on the left, the LS20 photo in the right column. Band-only framing
// keys (media scale/shift/anchor, phone position, shades) are dropped; copy,
// links and media are unchanged. Guarded on the exact prior object; down
// restores it exactly.
const SECTION_ID = 'b7c41d08'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>Solid-state beamforming on a semiconductor. Software-defined scanning with no moving parts.</p>", "designVersion": "band", "eyebrow": "LCM chips", "heading": "LCM beamforming chips", "id": "b7c41d08", "media": {"kind": "url", "value": "/lumotive/img/platform-ls20.webp"}, "mediaAnchor": "0%", "mediaScale": "1.6", "mediaShift": "25%", "mobileMediaPosition": "15%", "mobileShade": "max", "primaryLink": {"label": "Talk to our team", "newTab": false, "type": "custom", "url": "/contact?inquiry=lcm-chips"}, "primaryLinkLabel": "Talk to our team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=lcm-chips", "secondaryLink": {"label": "Request the LM10 and LS20 flyer", "newTab": false, "type": "custom", "url": "/contact?inquiry=chips-flyer"}, "secondaryLinkLabel": "Request the LM10 and LS20 flyer", "secondaryLinkNewTab": false, "secondaryLinkUrl": "/contact?inquiry=chips-flyer", "spacingBottom": "none", "spacingTop": "none", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>Solid-state beamforming on a semiconductor. Software-defined scanning with no moving parts.</p>", "designVersion": "split", "eyebrow": "LCM chips", "heading": "LCM beamforming chips", "id": "b7c41d08", "media": {"kind": "url", "value": "/lumotive/img/platform-ls20.webp"}, "primaryLink": {"label": "Talk to our team", "newTab": false, "type": "custom", "url": "/contact?inquiry=lcm-chips"}, "primaryLinkLabel": "Talk to our team", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=lcm-chips", "secondaryLink": {"label": "Request the LM10 and LS20 flyer", "newTab": false, "type": "custom", "url": "/contact?inquiry=chips-flyer"}, "secondaryLinkLabel": "Request the LM10 and LS20 flyer", "secondaryLinkNewTab": false, "secondaryLinkUrl": "/contact?inquiry=chips-flyer", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'lcm-chips' }) }
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
