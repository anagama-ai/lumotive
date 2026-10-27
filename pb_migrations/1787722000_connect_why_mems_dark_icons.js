// /connect "Today's optical switches are mechanical." (4c81e9a7, #why-mems):
// a dark section (`background: inverse`) of icon cards instead of numbered
// text cards: each MEMS limitation gets an accent-tinted icon. Copy, heading,
// intro and closing line unchanged. Guarded on the exact prior object; down
// restores it.
const BEFORE = {"align": "container", "anchor": "why-mems", "background": "none", "cards": [{"title": "Mechanical, with limited reliability over millions of cycles"}, {"title": "Small steering angles drive large system size and high cost per port"}, {"title": "Slow switching speed limits workload flexibility"}, {"title": "Expensive real-time calibration and assembly"}], "casing": "exact", "columns": "4", "conclusion": "Hyperscale networks need a switch that is solid-state, fast, and scalable.", "designVersion": "textCards", "eyebrow": "Why MEMS cannot scale", "heading": "Today’s optical switches are mechanical.", "id": "4c81e9a7", "intro": "Current state-of-the-art OCS systems rely on MEMS: micro-electromechanical mirrors that physically tilt to route light. They work, but they do not scale.", "numbered": "true", "spacingBottom": "sm", "spacingTop": "sm", "type": "cardsTextCards", "width": "contained"}
const AFTER = {"align": "container", "anchor": "why-mems", "background": "inverse", "cards": [{"title": "Mechanical, with limited reliability over millions of cycles", "media": {"kind": "url", "value": "/lumotive/img/icon-no-moving-parts.png"}, "accent": "accent1"}, {"title": "Small steering angles drive large system size and high cost per port", "media": {"kind": "url", "value": "/lumotive/img/icon-scalability.png"}, "accent": "accent2"}, {"title": "Slow switching speed limits workload flexibility", "media": {"kind": "url", "value": "/lumotive/img/icon-fast-reconfiguration.png"}, "accent": "accent3"}, {"title": "Expensive real-time calibration and assembly", "media": {"kind": "url", "value": "/lumotive/img/icon-software-defined.png"}, "accent": "accent1"}], "conclusion": "Hyperscale networks need a switch that is solid-state, fast, and scalable.", "eyebrow": "Why MEMS cannot scale", "heading": "Today’s optical switches are mechanical.", "id": "4c81e9a7", "intro": "Current state-of-the-art OCS systems rely on MEMS: micro-electromechanical mirrors that physically tilt to route light. They work, but they do not scale.", "spacingBottom": "md", "spacingTop": "md", "type": "cardsIconCards", "width": "contained", "designVersion": "iconCards", "iconTint": "accent", "iconSize": "sm", "casing": "exact"}
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
	const at = sections.findIndex((s) => s && s.id === BEFORE.id)
	if (at < 0 || !same(sections[at], forward ? BEFORE : AFTER)) return
	sections[at] = JSON.parse(JSON.stringify(forward ? AFTER : BEFORE))
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
