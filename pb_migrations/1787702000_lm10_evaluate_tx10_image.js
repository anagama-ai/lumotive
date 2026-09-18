// Webvizio #77: the "From evaluation to system development" panel on /lm10
// (splitDarkPanel, id "6fe4abe3", anchor "evaluate") showed the LCM Evaluation
// Kit — the Delta Host / "LCM Eval Cntr" board of lek-kit.png — where the
// staging reference shows the TX10 module. Point the panel's media at the TX10
// product shot this site already ships and already uses for the TX10 offering
// card on /dev-kits, the page this panel links to.
//
// Only media.value changes. The eyebrow, heading, body, the "Explore
// development kits" link, mediaPosition (absent, so the component's own
// fallback decides the side), designVersion "darkPanel", background, width,
// spacingTop, spacingBottom and anchor are all left exactly as they are, and no
// component is touched — so the section's orientation, spacing and layout are
// unchanged. Both files are clean white-background cutouts of the same kind of
// bench assembly at the same framing, so the panel's media slot needs no
// treatment change.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '6fe4abe3'

const TX10_MEDIA = '/lumotive/img/tx10-module.png'
const LEK_MEDIA = '/lumotive/img/lek-kit.png'

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
		applyMedia(app, LEK_MEDIA, TX10_MEDIA)
	},
	(app) => {
		applyMedia(app, TX10_MEDIA, LEK_MEDIA)
	}
)
