// Dev Kits v4 (PDF page 12). Copy and kit order unchanged.
// - Hero (`1b368f3c`): wscgr's Lineup.png, the five-kit family cut-out, laid
//   whole on the right of a white 2880x1200 banner (hero-devkits-lineup.webp),
//   as the dToF hero composes its NM120: `mediaAnchor: "100%"` keeps the
//   lineup whole right of the copy from 1024px, and phones keep it behind
//   the copy at the right. The white banner is brighter behind the phone
//   copy than the old dark bench photo (body measured 3.22-3.66:1 at the
//   brightest backdrop pixel with `strong`), so phones take `max`, as other
//   white-backed heroes do (S26); tablet and desktop measure >= 4.66:1.
// - Find Your Dev Kit, iToF row (`8d3b05e6`): ON140, LI140 and M30 photos
//   together on the light-grey kit panel, as TX10 / NM120 / MD180 already
//   are. ON140 and LI140 reuse the cut-outs made for /sense/robotics from
//   wscgr's files; M30 is the existing m30-dev-kit-contents.webp (Simon's
//   IMG_7224 on this page). This ends the temporary text-only row (D6).
// Guarded on prior values; down restores them exactly.
const ABSENT = undefined
const PAGE = 'dev-kits'
const HERO_ID = '1b368f3c'
const ITOF_ID = '8d3b05e6'
const HERO_BEFORE = { kind: 'url', value: '/lumotive/img/hero-devkits.jpg' }
const HERO_AFTER = { kind: 'url', value: '/lumotive/img/hero-devkits-lineup.webp' }
const PHOTOS = {
	ON140: '/lumotive/img/kit-on140.webp',
	LI140: '/lumotive/img/kit-li140.webp',
	M30: '/lumotive/img/m30-dev-kit-contents.webp'
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE })
	} catch {
		return
	}
	let sections
	try {
		sections = JSON.parse(record.getString('sections') || '[]')
	} catch {
		return
	}
	if (!Array.isArray(sections)) return
	let changed = false
	const hero = sections.find((entry) => entry && entry.id === HERO_ID)
	if (hero) {
		if (forward && same(hero.media, HERO_BEFORE) && hero.mediaAnchor === ABSENT && hero.mobileMediaPosition === ABSENT && hero.mobileShade === 'strong') {
			hero.media = HERO_AFTER
			hero.mediaAnchor = '100%'
			hero.mobileMediaPosition = '100%'
			hero.mobileShade = 'max'
			changed = true
		} else if (!forward && same(hero.media, HERO_AFTER) && hero.mediaAnchor === '100%' && hero.mobileMediaPosition === '100%' && hero.mobileShade === 'max') {
			hero.media = HERO_BEFORE
			delete hero.mediaAnchor
			delete hero.mobileMediaPosition
			hero.mobileShade = 'strong'
			changed = true
		}
	}
	const row = sections.find((entry) => entry && entry.id === ITOF_ID)
	if (row && Array.isArray(row.cards)) {
		const ready = row.cards.every((card) => !PHOTOS[card?.title] || card.media === ABSENT || card.media === null)
		if (forward && row.mediaFrame === ABSENT && ready) {
			row.mediaFrame = 'panel'
			for (const card of row.cards) if (PHOTOS[card?.title]) card.media = { kind: 'url', value: PHOTOS[card.title] }
			changed = true
		} else if (!forward && row.mediaFrame === 'panel') {
			delete row.mediaFrame
			for (const card of row.cards) {
				if (PHOTOS[card?.title] && same(card.media, { kind: 'url', value: PHOTOS[card.title] })) delete card.media
			}
			changed = true
		}
	}
	if (!changed) return
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
