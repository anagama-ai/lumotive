// Sense › Overview (/sense), approved content package rev. 2026-10-07,
// page 09. Refine the HDR section after visual review.
//
// The section ships copy-only, because the approved HDR demo visual (main
// pulse vs low-power pulse, coloured by intensity) is an unsupplied asset. In
// that state splitDefault drops to one column and caps the copy at 48rem, but
// the section still carried the page's default 5rem top and bottom padding.
// With 185px of content that put 160px of padding around it, nearly half the
// section's height, and the approved copy sat as a single three-line block.
//
// Two changes, both data, both on this section only:
//
// 1. The body becomes the two paragraphs the package prints: the problem
//    retroreflectors cause, then what LCM does about it. The wording is
//    untouched, character for character; only the paragraph break is added.
//
// 2. Top and bottom spacing drop from "md" (5rem) to "sm" (2.5rem), which
//    suits a short copy-only band sitting between two full sections.
//
// The heading, eyebrow, typography, colours and the container alignment are
// unchanged, and nothing outside this section is touched: the other
// splitDefault section without media, /platform's "From 1D to 2D Beamforming",
// keeps its own spacing because this is a per-section field rather than a
// change to the shared no-media styling.
//
// Returning to two columns needs no further work. splitDefault applies its
// one-column no-media layout only while the section has no media, so setting
// `media` on this section restores the two-column split and releases the 48rem
// cap on its own. Consider restoring "md" spacing at the same time, since a
// section with a visual is tall enough to carry it.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'sense'
const HDR_ID = 'f52b9a16'

const BODY_AFTER =
	'<p>Retroreflectors and nearby bright objects saturate time-of-flight sensors and smear the scene around them.</p>' +
	'<p>LCM fires a low-power pulse in the same scan as the main pulse. Bright targets stay sharp, dark targets stay visible, and frame rate stays the same.</p>'

const BODY_BEFORE =
	'<p>Retroreflectors and nearby bright objects saturate time-of-flight sensors and smear the scene around them. LCM fires a low-power pulse in the same scan as the main pulse. Bright targets stay sharp, dark targets stay visible, and frame rate stays the same.</p>'

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

const apply = (app, { body, spacing }) => {
	const record = findPage(app)
	if (!record) return

	const sections = readSections(record)
	const hdr = sections.find((entry) => entry && entry.id === HDR_ID)
	if (!hdr || hdr.type !== 'splitDefault') return

	hdr.body = body
	hdr.spacingTop = spacing
	hdr.spacingBottom = spacing

	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, { body: BODY_AFTER, spacing: 'sm' })
	},
	(app) => {
		apply(app, { body: BODY_BEFORE, spacing: 'md' })
	}
)
