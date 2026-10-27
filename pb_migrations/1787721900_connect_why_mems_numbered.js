// /connect "Today's optical switches are mechanical." (4c81e9a7, #why-mems):
// redesigned after Heron AI's "Problems" section on Mobbin. The four MEMS
// limitations move from a compact step list to four numbered cards (01-04)
// in one row (`designVersion` steps → textCards, `columns: 4`,
// `numbered: true`). Copy unchanged. Guarded on the exact prior object; down
// restores it.
const BEFORE = {"align": "container", "anchor": "why-mems", "background": "none", "cards": [{"title": "Mechanical, with limited reliability over millions of cycles"}, {"title": "Small steering angles drive large system size and high cost per port"}, {"title": "Slow switching speed limits workload flexibility"}, {"title": "Expensive real-time calibration and assembly"}], "casing": "exact", "conclusion": "Hyperscale networks need a switch that is solid-state, fast, and scalable.", "designVersion": "steps", "eyebrow": "Why MEMS cannot scale", "heading": "Today’s optical switches are mechanical.", "id": "4c81e9a7", "intro": "Current state-of-the-art OCS systems rely on MEMS: micro-electromechanical mirrors that physically tilt to route light. They work, but they do not scale.", "spacingBottom": "sm", "spacingTop": "sm", "type": "cardsTextCards", "width": "contained"}
const AFTER = {"align": "container", "anchor": "why-mems", "background": "none", "cards": [{"title": "Mechanical, with limited reliability over millions of cycles"}, {"title": "Small steering angles drive large system size and high cost per port"}, {"title": "Slow switching speed limits workload flexibility"}, {"title": "Expensive real-time calibration and assembly"}], "casing": "exact", "conclusion": "Hyperscale networks need a switch that is solid-state, fast, and scalable.", "designVersion": "textCards", "eyebrow": "Why MEMS cannot scale", "heading": "Today’s optical switches are mechanical.", "id": "4c81e9a7", "intro": "Current state-of-the-art OCS systems rely on MEMS: micro-electromechanical mirrors that physically tilt to route light. They work, but they do not scale.", "spacingBottom": "sm", "spacingTop": "sm", "type": "cardsTextCards", "width": "contained", "columns": "4", "numbered": "true"}
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
