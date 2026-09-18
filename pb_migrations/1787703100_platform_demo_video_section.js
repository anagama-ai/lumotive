// Webvizio #14: on /platform the six "Solving the limits of fixed optics"
// capability cards (cardsIconCards, id "b89bead0") are replaced by the demo
// video block. Nothing is duplicated and no copy is written: the page's own
// "Dynamic scanning for a dynamic world" section (splitDarkPanel, id
// "97a0771d") moves up into that slot and gains the demo player, so the page
// still holds exactly one Dynamic Scanning section.
//
// The player is the approved Vimeo demo already used in this project on /lm10
// (id "9fa9070a", https://vimeo.com/1040582713) — the same video
// lumotive.com/technology embeds beside this copy. It fills the section's
// right-hand column through the split section's new videoUrl field, and the
// "Watch the Demo Video" link points at the same video.
//
// The eyebrow, heading, body copy, mediaPosition "right", designVersion
// "darkPanel", background, width and md / md spacing are carried over
// untouched, as is the "dynamic-scanning" anchor. The hero, the two peel
// sections, the flow panels, the solutions media cards and the closing CTA
// keep their positions and content. The six cards are not lost from the site:
// /sense renders the same set in its "From platform to sensing system"
// section (id "c7f4a1e9").
//
// Positions are resolved from section ids, never fixed indexes.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '97a0771d'
const CARDS_ID = 'b89bead0'
const FLOW_ID = 'cac52f89'

const VIDEO_URL = 'https://vimeo.com/1040582713'
const CTA = { label: 'Watch the Demo Video', url: VIDEO_URL }

const CARDS_SECTION = {
 "anchor": "capabilities",
 "background": "none",
 "cards": [
  {
   "accent": "accent1",
   "body": "<p>Control light electronically, without mechanical steering components, motors, or moving assemblies.</p>",
   "media": {
    "kind": "url",
    "value": "/lumotive/img/icon-solid-state.png"
   },
   "title": "Solid-state optical control"
  },
  {
   "accent": "accent2",
   "body": "<p>Support wide fields of view with precise, software-controlled beam positioning — up to 160° native steering, and greater than 180° with expansion optics in supported designs.</p>",
   "media": {
    "kind": "url",
    "value": "/lumotive/img/icon-beam-steering.png"
   },
   "title": "Wide-angle beam steering"
  },
  {
   "accent": "accent3",
   "body": "<p>Program beam direction, lensing, collimation, multiple beams, adaptive optics, and custom phase or intensity patterns.</p>",
   "media": {
    "kind": "url",
    "value": "/lumotive/img/icon-software-defined.png"
   },
   "title": "Software-defined optical functions"
  },
  {
   "accent": "accent1",
   "body": "<p>Scale from compact sensing systems to optical communications, switching, computing, displays, and other light-based applications.</p>",
   "media": {
    "kind": "url",
    "value": "/lumotive/img/icon-scalability.png"
   },
   "title": "Scalability across applications"
  },
  {
   "accent": "accent2",
   "body": "<p>Support optical architectures spanning visible through infrared wavelengths, with compatibility across different light sources, sensing methods, and system designs.</p>",
   "media": {
    "kind": "url",
    "value": "/lumotive/img/icon-wavelengths.png"
   },
   "title": "Multiple wavelengths and architectures"
  },
  {
   "accent": "accent3",
   "body": "<p>Control light through subwavelength metasurface pixels engineered to shape optical phase at the semiconductor surface.</p>",
   "media": {
    "kind": "url",
    "value": "/lumotive/img/icon-metamaterials.png"
   },
   "title": "Powered by metamaterials"
  }
 ],
 "designVersion": "iconCards",
 "heading": "Solving the limits of fixed optics",
 "id": "b89bead0",
 "intro": "Backed by 160+ patents and more than a decade of R&D, Lumotive's programmable optics platform has a broad patent portfolio and products already in deployment.",
 "spacingBottom": "md",
 "spacingTop": "md",
 "type": "cardsIconCards",
 "width": "contained"
}

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

const findPlatformPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findPlatformPage(app)
		if (!record) return

		const sections = readSections(record)
		const section = sections.find((entry) => entry && entry.id === SECTION_ID)
		if (!section || section.type !== 'splitDarkPanel') return

		section.videoUrl = VIDEO_URL
		section.link = { label: CTA.label, newTab: true, type: 'custom', url: CTA.url }
		section.linkLabel = CTA.label
		section.linkUrl = CTA.url
		section.linkNewTab = true

		const next = sections.filter(
			(entry) => entry && entry.id !== SECTION_ID && entry.id !== CARDS_ID
		)
		const flow = next.findIndex((entry) => entry && entry.id === FLOW_ID)
		next.splice(flow === -1 ? next.length : flow + 1, 0, section)

		record.set('sections', next)
		app.save(record)
	},
	(app) => {
		const record = findPlatformPage(app)
		if (!record) return

		const sections = readSections(record)
		const section = sections.find((entry) => entry && entry.id === SECTION_ID)
		if (!section) return

		delete section.videoUrl
		delete section.link
		delete section.linkLabel
		delete section.linkUrl
		delete section.linkNewTab

		const next = sections.filter((entry) => entry && entry.id !== SECTION_ID)
		const flow = next.findIndex((entry) => entry && entry.id === FLOW_ID)
		const at = flow === -1 ? next.length : flow + 1
		if (!next.some((entry) => entry && entry.id === CARDS_ID)) next.splice(at, 0, CARDS_SECTION)
		const cards = next.findIndex((entry) => entry && entry.id === CARDS_ID)
		next.splice(cards === -1 ? next.length : cards + 1, 0, section)

		record.set('sections', next)
		app.save(record)
	}
)
