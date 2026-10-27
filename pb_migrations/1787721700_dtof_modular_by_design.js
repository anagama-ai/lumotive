// /dev-kits/dtof: new "Modular by design" section (6d2a9c41) above "HDR
// without losing frame rate" (91e6c3a8): heading, intro, a placeholder photo
// of the NM120 internals beside three cards (complete lidar / your compute /
// your enclosure), and a note. The photo is a placeholder until Lumotive
// supplies the real one. Guarded; down removes exactly this section.
const SECTION = {"id": "6d2a9c41", "type": "cardsTextCards", "designVersion": "textCards", "anchor": "modular", "align": "container", "background": "none", "width": "contained", "spacingTop": "sm", "spacingBottom": "sm", "casing": "exact", "heading": "Modular by Design", "intro": "Use NM120 as a complete lidar, or take it apart. The sensor head outputs MIPI, so you can pair it with your own compute and embed it directly in your platform or a custom enclosure.", "columns": "2", "accentBar": "none", "visualLayout": "cards", "media": {"kind": "url", "value": "/lumotive/img/placeholder-nm120-internals.svg"}, "mediaAlt": "Placeholder: NM120 internals without enclosure, sensor head and compute board shown separately.", "cards": [{"title": "Complete lidar", "body": "<p>Sensor head plus compute, GigE out.</p>"}, {"title": "Your compute", "body": "<p>Sensor head only, MIPI out.</p>"}, {"title": "Your enclosure", "body": "<p>Embed the internals in your platform.</p>"}], "note": "Built on Namuga's Stella-120, the same sensor head customers build into products."}
const BEFORE_ID = '91e6c3a8'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dtof' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const at = sections.findIndex((s) => s && s.id === SECTION.id)
	if (forward) {
		const before = sections.findIndex((s) => s && s.id === BEFORE_ID)
		if (at >= 0 || before < 0) return
		sections.splice(before, 0, JSON.parse(JSON.stringify(SECTION)))
	} else {
		if (at < 0) return
		sections.splice(at, 1)
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
