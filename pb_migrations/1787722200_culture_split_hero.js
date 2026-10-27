// /culture hero (6c524b47): band hero → split hero, the /platform layout:
// copy on the left, the hero photo in the right column. Band-only framing
// keys are dropped; copy, links and media are unchanged. Guarded on the
// exact prior object; down restores it.
const SECTION_ID = '6c524b47'
const BEFORE = {"align": "container", "anchor": "", "background": "none", "body": "<p>Join an intense intellectual environment where top performers have ownership, visibility, and responsibility.</p>", "designVersion": "band", "eyebrow": "Life at Lumotive", "heading": "Seeking ambitious problem solvers", "id": "6c524b47", "media": {"kind": "url", "value": "/lumotive/img/hero-culture-team.webp"}, "mediaAnchor": "0%", "mobileMediaPosition": "100%", "mobileShade": "strong", "primaryLink": {"label": "Browse open positions", "newTab": true, "type": "custom", "url": "https://jobs.lever.co/lumotive"}, "primaryLinkLabel": "Browse open positions", "primaryLinkNewTab": "true", "primaryLinkUrl": "https://jobs.lever.co/lumotive", "spacingBottom": "md", "spacingTop": "md", "tabletShade": "strong", "type": "heroBand", "width": "contained"}
const AFTER = {"align": "container", "anchor": "", "background": "none", "body": "<p>Join an intense intellectual environment where top performers have ownership, visibility, and responsibility.</p>", "designVersion": "split", "eyebrow": "Life at Lumotive", "heading": "Seeking ambitious problem solvers", "id": "6c524b47", "media": {"kind": "url", "value": "/lumotive/img/hero-culture-team.webp"}, "mediaAnchor": "0%", "primaryLink": {"label": "Browse open positions", "newTab": true, "type": "custom", "url": "https://jobs.lever.co/lumotive"}, "primaryLinkLabel": "Browse open positions", "primaryLinkNewTab": "true", "primaryLinkUrl": "https://jobs.lever.co/lumotive", "spacingBottom": "none", "spacingTop": "none", "type": "heroSplit", "width": "contained"}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'culture' }) }
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
