// /partners logo sections, per the client's partner list: Module and
// solution providers (c5fe1eab) gains Leopard Imaging first and larger marks
// (`logoSize: lg`; no descriptors, no links); Technology partners (3138ddf9)
// gains onsemi first, order onsemi, Lumentum, Vertilite, Gpixel, ADAPS,
// Lattice, SolidVue, MulticoreWare, six to a row. Logos: leopard-imaging.png
// (leopardimaging.com) and onsemi.png (Wikimedia Commons "Onsemi logo 2021").
// Distribution partners unchanged. Guarded on the exact prior sections; down
// restores them.
const CHANGES = [[{"align": "container", "anchor": "providers", "background": "none", "columns": "4", "compactMobile": true, "designVersion": "gridOnDark", "heading": "Module and solution providers", "id": "c5fe1eab", "layout": "centered", "logos": [{"media": {"kind": "url", "value": "/lumotive/logos/namuga.png"}, "name": "Namuga"}, {"media": {"kind": "url", "value": "/lumotive/logos/hokuyo.png"}, "name": "Hokuyo"}, {"media": {"kind": "url", "value": "/lumotive/logos/ephotonics.png"}, "name": "Electronic Photonics"}], "spacingBottom": "md", "spacingTop": "md", "type": "logosLabelled", "width": "contained"}, {"align": "container", "anchor": "providers", "background": "none", "columns": "4", "compactMobile": true, "designVersion": "gridOnDark", "heading": "Module and solution providers", "id": "c5fe1eab", "layout": "centered", "logos": [{"media": {"kind": "url", "value": "/lumotive/logos/leopard-imaging.png"}, "name": "Leopard Imaging"}, {"media": {"kind": "url", "value": "/lumotive/logos/namuga.png"}, "name": "Namuga"}, {"media": {"kind": "url", "value": "/lumotive/logos/hokuyo.png"}, "name": "Hokuyo"}, {"media": {"kind": "url", "value": "/lumotive/logos/ephotonics.png"}, "name": "Electronic Photonics"}], "spacingBottom": "md", "spacingTop": "md", "type": "logosLabelled", "width": "contained", "logoSize": "lg"}], [{"align": "container", "anchor": "technology", "background": "none", "columns": "4", "compactMobile": true, "designVersion": "gridOnDark", "heading": "Technology partners", "id": "3138ddf9", "layout": "centered", "logos": [{"media": {"kind": "url", "value": "/lumotive/logos/lumentum.png"}, "name": "Lumentum"}, {"media": {"kind": "url", "value": "/lumotive/logos/vertilite.png"}, "name": "Vertilite"}, {"media": {"kind": "url", "value": "/lumotive/logos/gpixel.png"}, "name": "Gpixel"}, {"media": {"kind": "url", "value": "/lumotive/logos/adaps.png"}, "name": "ADAPS"}, {"media": {"kind": "url", "value": "/lumotive/logos/lattice.png"}, "name": "Lattice"}, {"media": {"kind": "url", "value": "/lumotive/logos/solidvue.png"}, "name": "SolidVue"}, {"media": {"kind": "url", "value": "/lumotive/logos/multicoreware.png"}, "name": "MulticoreWare"}], "spacingBottom": "md", "spacingTop": "md", "type": "logosLabelled", "width": "contained"}, {"align": "container", "anchor": "technology", "background": "none", "columns": "6", "compactMobile": true, "designVersion": "gridOnDark", "heading": "Technology partners", "id": "3138ddf9", "layout": "centered", "logos": [{"media": {"kind": "url", "value": "/lumotive/logos/onsemi.png"}, "name": "onsemi"}, {"media": {"kind": "url", "value": "/lumotive/logos/lumentum.png"}, "name": "Lumentum"}, {"media": {"kind": "url", "value": "/lumotive/logos/vertilite.png"}, "name": "Vertilite"}, {"media": {"kind": "url", "value": "/lumotive/logos/gpixel.png"}, "name": "Gpixel"}, {"media": {"kind": "url", "value": "/lumotive/logos/adaps.png"}, "name": "ADAPS"}, {"media": {"kind": "url", "value": "/lumotive/logos/lattice.png"}, "name": "Lattice"}, {"media": {"kind": "url", "value": "/lumotive/logos/solidvue.png"}, "name": "SolidVue"}, {"media": {"kind": "url", "value": "/lumotive/logos/multicoreware.png"}, "name": "MulticoreWare"}], "spacingBottom": "md", "spacingTop": "md", "type": "logosLabelled", "width": "contained"}]]
// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'partners' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const plan = CHANGES.map(([before, after]) => {
		const from = forward ? before : after
		return [sections.findIndex((s) => s && s.id === before.id && same(s, from)), forward ? after : before]
	})
	if (plan.some(([at]) => at < 0)) return
	for (const [at, to] of plan) sections[at] = JSON.parse(JSON.stringify(to))
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
