// Platform › LCM Chips (/lcm-chips), approved content package rev. 2026-10-07,
// page 07. Layout corrections against the PDF, after review of the first pass.
// Copy is untouched: every string below is byte-identical to the one
// 1787709000_lcm_chips_page.js published, including capitalization.
//
// 1. HERO (b7c41d08) — heroBand becomes heroSplit. The package sets this hero
//    as a split: copy on the left, the chip photo on the right. The band hero
//    paints its media as a full-bleed background behind the copy, which is the
//    wrong arrangement. heroSplit keeps the staging hero's type, amber eyebrow,
//    white pill and arrow link, and only moves the photo into its own column.
//
//    The approved chip-in-hand photograph has not been supplied: it is not in
//    static/lumotive/img and the media library is empty. Rather than hold an
//    empty half-hero open, the column carries the LM10 metasurface module on
//    its flex cable, which is a real Lumotive product photograph already in
//    this repository and already published on /about. It is a stand-in for the
//    approved shot, not a placeholder graphic, and swapping it is a one-field
//    change on this section. Tracked in handoff/page-07-lcm-chips.md.
//
// 2. PRODUCT OVERVIEW (3e9a06f5) — no data change. The four specifications now
//    render in their own compact cards, which is a change to the specTiles
//    design version in StatsCentered.svelte.
//
// 3. LM10 AND LS20 AT A GLANCE (5d2b71ae) — no data change. The table stays.
//    Neither column photo is supplied to this repository, so neither card gets
//    `media` and no empty photo frame renders.
//
// 4. HOW LCM FITS (9f08c3d6, 2a6e54bc) — the four numbered steps move from a
//    four-up card grid to one compact numbered list, the cardsTextCards
//    "steps" design version, so the signal path reads as a sequence instead of
//    four mostly empty boxes.
//
//    The package prints two captions here, one per media panel. The first pass
//    merged them into a single paragraph above the capability cards, which
//    lost that pairing. They are now two separate elements on the steps
//    section: `note` carries the caption that belongs with the numbered steps
//    and the system animation, and `outro` carries the scan-timeline caption.
//    The capability-card section loses the merged paragraph and keeps only its
//    five cards.
//
//    Neither the looping system animation nor the SVG scan timeline is
//    supplied, so no media slot is rendered and no empty panel is left behind.
//    Both remain tracked in handoff/page-07-lcm-chips.md.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'lcm-chips'

const HERO_ID = 'b7c41d08'
const STEPS_ID = '9f08c3d6'
const CAPABILITIES_ID = '2a6e54bc'

const HERO_MEDIA_AFTER = { kind: 'url', value: '/lumotive/img/lm10-metasurface-module.webp' }
const HERO_MEDIA_BEFORE = { kind: 'url', value: '/lumotive/img/hero-lm10.jpg' }

// The two approved captions, each with the panel it belongs to.
const STEPS_NOTE =
	'Every scan is a sequence you program: which angle, for how long, how wide, and in what order.'
const TIMELINE_NOTE =
	'The field of view is illuminated in discrete regions of interest (ROIs).'
const MERGED_INTRO = `${STEPS_NOTE} ${TIMELINE_NOTE}`

const readSections = (record) => {
	try {
		const raw = record.getString('sections')
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const findPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path: PAGE_PATH })
	} catch {
		return null
	}
}

const apply = (app, { heroType, heroVersion, heroMedia, stepsType, stepsVersion, stepsNote, timelineNote, capabilitiesIntro, capabilitiesSpacingTop }) => {
	const record = findPage(app)
	if (!record) return

	const sections = readSections(record)
	const hero = sections.find((entry) => entry && entry.id === HERO_ID)
	const steps = sections.find((entry) => entry && entry.id === STEPS_ID)
	const capabilities = sections.find((entry) => entry && entry.id === CAPABILITIES_ID)
	if (!hero || !steps || !capabilities) return

	hero.type = heroType
	hero.designVersion = heroVersion
	hero.media = JSON.parse(JSON.stringify(heroMedia))

	steps.type = stepsType
	steps.designVersion = stepsVersion
	if (stepsNote) steps.note = stepsNote
	else delete steps.note
	if (timelineNote) steps.outro = timelineNote
	else delete steps.outro

	if (capabilitiesIntro) capabilities.intro = capabilitiesIntro
	else delete capabilities.intro
	capabilities.spacingTop = capabilitiesSpacingTop

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, {
			heroType: 'heroSplit',
			heroVersion: 'split',
			heroMedia: HERO_MEDIA_AFTER,
			stepsType: 'cardsTextCards',
			stepsVersion: 'steps',
			stepsNote: STEPS_NOTE,
			timelineNote: TIMELINE_NOTE,
			capabilitiesIntro: null,
			capabilitiesSpacingTop: 'sm'
		})
	},
	(app) => {
		apply(app, {
			heroType: 'heroBand',
			heroVersion: 'band',
			heroMedia: HERO_MEDIA_BEFORE,
			stepsType: 'cardsIconQuad',
			stepsVersion: 'iconQuad',
			stepsNote: null,
			timelineNote: null,
			capabilitiesIntro: MERGED_INTRO,
			capabilitiesSpacingTop: 'none'
		})
	}
)
