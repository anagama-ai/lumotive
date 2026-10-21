// /dev-kits/dtof spacing pass. Copy, colours, imagery and video unchanged.
// - Hero (a7c0d613): `compactMobile` (existing option) shortens the phone
//   band; its phone framing moves from 94% to 100%, since at the shorter
//   height 94% let the white backdrop show along the right edge.
// - NM120 opener (d903b4f2): `mediaMaxHeight: "25rem"` caps the photo and its
//   white panel from 768px (600x634 -> 600x400 at 1440, whole product,
//   contained); `compactMobile` takes the phone top padding from 112px to
//   40px before the photo.
// - Before MD180: the NM120 action row (e4b170cd) closes on `sm`, the MD180
//   opener (3d85f21b) opens on `md` (192px -> 120px).
// - MD180 specs to its action: specs (8c0416ae) close on `none`, the action
//   row (f512d7b0) opens on `compact` (128px -> 56px phones / 72px desktop).
// - Outdoor cards (7ac0952e): `titleLines: "row"` lines up the descriptions
//   under wrapping titles from 768px.
// - Closing CTA (a0cd6e37): `lg` -> `md`, 112px -> 80px a side (-29%).
// Guarded on the prior values; reverses exactly.
const ABSENT = undefined
const CHANGES = [
	['a7c0d613', 'compactMobile', ABSENT, 'true'],
	['a7c0d613', 'mobileMediaPosition', '94%', '100%'],
	['d903b4f2', 'mediaMaxHeight', ABSENT, '25rem'],
	['d903b4f2', 'compactMobile', ABSENT, 'true'],
	['e4b170cd', 'spacingBottom', 'md', 'sm'],
	['3d85f21b', 'spacingTop', 'lg', 'md'],
	['8c0416ae', 'spacingBottom', 'sm', 'none'],
	['f512d7b0', 'spacingTop', 'sm', 'compact'],
	['7ac0952e', 'titleLines', ABSENT, 'row'],
	['a0cd6e37', 'spacingTop', 'lg', 'md'],
	['a0cd6e37', 'spacingBottom', 'lg', 'md']
]

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'path = {:path}', { path: 'dev-kits/dtof' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	let changed = false
	for (const [id, key, before, after] of CHANGES) {
		const section = sections.find((s) => s && s.id === id)
		if (!section) continue
		const [from, to] = forward ? [before, after] : [after, before]
		if (section[key] !== from) continue
		if (to === ABSENT) delete section[key]
		else section[key] = to
		changed = true
	}
	if (!changed) return
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
