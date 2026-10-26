// /dev-kits/itof phone refinements. Desktop and tablet unchanged.
// 1. Hero (5a1c9f20): `compactMobile` drops the band's viewport minimum below
//    768px, so the copy no longer sits under ~200px of empty photograph, and
//    `mobileMediaScale: "1.2"` enlarges the photograph about its centre so
//    its white top and bottom margins (rows 0-75 and 944-1008 of 1008) fall
//    outside the band instead of showing as light bands under the shade.
//    The shorter band lifts the copy over the lens highlight, so
//    `mobileMediaPosition: "25%"` moves the frame left: the lens leaves the
//    copy and the body text measures 6.66:1 (390) / 7.24:1 (430) at the 99th
//    percentile of the photograph behind it, with the standard shade.
// 2. M30 spec tiles (0f5ab938): `compactMobile` takes the grid's lead from
//    48px to 24px on phones, so the M30 description reaches the first tile
//    in 64px (40px section padding + 24px) instead of 88px.
// Guarded on the prior values; reverses exactly.
const HERO_ID = '5a1c9f20'
const M30_SPECS_ID = '0f5ab938'
const HERO = { compactMobile: 'true', mobileMediaScale: '1.2', mobileMediaPosition: '25%' }
const SPECS = { compactMobile: 'true' }

const setOrClear = (section, values, forward) => {
	let changed = false
	for (const [key, value] of Object.entries(values)) {
		if (forward && section[key] == null) { section[key] = value; changed = true }
		else if (!forward && section[key] === value) { delete section[key]; changed = true }
	}
	return changed
}

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'path = {:path}', { path: 'dev-kits/itof' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	let changed = false
	const hero = sections.find((s) => s && s.id === HERO_ID)
	if (hero) changed = setOrClear(hero, HERO, forward) || changed
	const specs = sections.find((s) => s && s.id === M30_SPECS_ID)
	if (specs) changed = setOrClear(specs, SPECS, forward) || changed
	if (!changed) return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
