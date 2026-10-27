// /dev-kits hero (1b368f3c): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped (the 100% anchor stays, so the kit lineup at the photo's
// right edge stays in frame); copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = '1b368f3c'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>Evaluate LCM at the transmit, module, or system level. Start with a kit, or use a reference design as the foundation for your own product.</p>", "designVersion": "band", "eyebrow": "Dev kits & reference designs", "heading": "Development kits and reference designs", "id": "1b368f3c", "media": {"kind": "url", "value": "/lumotive/img/hero-devkits-lineup.webp"}, "mediaAnchor": "100%", "mobileMediaPosition": "100%", "mobileShade": "max", "primaryLink": {"label": "Talk to an engineer", "newTab": false, "type": "custom", "url": "/contact?inquiry=kit-recommendation"}, "primaryLinkLabel": "Talk to an engineer", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=kit-recommendation", "spacingBottom": "none", "spacingTop": "none", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>Evaluate LCM at the transmit, module, or system level. Start with a kit, or use a reference design as the foundation for your own product.</p>", "designVersion": "split", "eyebrow": "Dev kits & reference designs", "heading": "Development kits and reference designs", "id": "1b368f3c", "media": {"kind": "url", "value": "/lumotive/img/hero-devkits-lineup.webp"}, "primaryLink": {"label": "Talk to an engineer", "newTab": false, "type": "custom", "url": "/contact?inquiry=kit-recommendation"}, "primaryLinkLabel": "Talk to an engineer", "primaryLinkNewTab": false, "primaryLinkUrl": "/contact?inquiry=kit-recommendation", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained", "mediaAnchor": "100%"}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dev-kits' }) }
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
