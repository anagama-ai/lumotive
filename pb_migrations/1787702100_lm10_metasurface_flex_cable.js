// Webvizio #76: "Replace image with one that has Flex cable." The "A
// metasurface that steers light electronically" panel on /lm10 (splitDarkPanel,
// id "15569607", anchor "how-it-works") showed lm10-chip-clean.png — the bare
// LM10 die as a cutout, with no flex cable anywhere in frame. Point it at the
// TX10 module close-up this site already ships and already uses on /tx10: the
// LCM aperture fills the frame with its iridescent striations, and the tan flex
// cable wraps visibly from the mount to the green host PCB.
//
// Chosen over the other repo assets that show a cable: lek-hero.png and
// lek-kit.png both bury a small flex behind a large Delta-host mounting plate,
// and every other LM10 image (hero-lm10.jpg, paradigm-chip-bleed.png,
// lm10-wafer-scene-home.png, lm10-module-anatomy.png, sense-architecture-
// wafer.png) is a bare die, a wire-bonded package or a render with no cable.
//
// Only media.value changes. The eyebrow, heading, body, the "Explore LCM
// technology" link, mediaPosition "left", designVersion "darkPanel",
// background, width, spacingTop, spacingBottom and anchor are untouched, and no
// component is touched — so orientation, spacing, styling and layout are
// unchanged. Both files are white-background studio shots of a single subject at
// comparable framing, so the panel's media slot needs no treatment change.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '15569607'

const FLEX_MEDIA = '/lumotive/img/tx10-module-closeup.jpg'
const CHIP_MEDIA = '/lumotive/img/lm10-chip-clean.png'

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

const findLm10Page = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'lm10' })
	} catch {
		return null
	}
}

const applyMedia = (app, from, to) => {
	const record = findLm10Page(app)
	if (!record) return

	const sections = readSections(record)
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'splitDarkPanel') return
	if (!section.media || section.media.kind !== 'url' || section.media.value !== from) return

	section.media.value = to

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		applyMedia(app, CHIP_MEDIA, FLEX_MEDIA)
	},
	(app) => {
		applyMedia(app, FLEX_MEDIA, CHIP_MEDIA)
	}
)
