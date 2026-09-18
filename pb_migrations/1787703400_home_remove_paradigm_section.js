// Webvizio #50: the "From fixed optics to programmable light" scene on /
// (statsPeelScene, id "474ee80e", anchor "technology") is removed from the
// home page — heading, intro, the "Explore the LCM Platform" body link, the
// wafer image and the three stat entries go with it.
//
// Every other section keeps its place and content: the hero, the "One chip.
// Boundless applications." scene, the applications bento with its investor
// logo band, and the closing CTA. #61's migration, which existed only to move
// this section to the foot of the page, is dropped rather than kept as history
// for a section that no longer exists.
//
// Peel scenes size themselves from the panel above at runtime, so the two
// remaining scenes re-chain on their own and the page keeps its spacing with
// no section-level values to adjust. Nothing links to the "technology" anchor.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '474ee80e'
const SOLUTIONS_ID = 'a20efeab'

const SECTION = {
 "anchor": "technology",
 "background": "none",
 "body": "<p><a href=\"/platform\">Explore the LCM Platform</a></p>",
 "designVersion": "peelScene",
 "heading": "From fixed optics to programmable light",
 "id": "474ee80e",
 "intro": "Lumotive’s LCM™ programmable optical semiconductors control light without moving parts, enabling beam steering, lensing, multiple beams, adaptive optics, and more.",
 "media": {
  "kind": "url",
  "value": "/lumotive/img/lm10-wafer-scene-home.png"
 },
 "spacingBottom": "none",
 "spacingTop": "none",
 "stats": [
  {
   "label": "No moving parts",
   "value": "Solid-state control without mechanical steering"
  },
  {
   "label": "More optical functions",
   "value": "Beam steering, lensing, multiple beams, adaptive optics"
  },
  {
   "label": "Built for broader systems",
   "value": "From 3D sensing to switching and communications"
  }
 ],
 "type": "statsPeelScene",
 "width": "full"
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

const findHomePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findHomePage(app)
		if (!record) return

		const sections = readSections(record)
		const next = sections.filter((entry) => entry && entry.id !== SECTION_ID)
		if (next.length === sections.length) return

		record.set('sections', next)
		app.save(record)
	},
	(app) => {
		const record = findHomePage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((entry) => entry && entry.id === SECTION_ID)) return

		const solutions = sections.findIndex((entry) => entry && entry.id === SOLUTIONS_ID)
		sections.splice(solutions === -1 ? sections.length : solutions + 1, 0, SECTION)

		record.set('sections', sections)
		app.save(record)
	}
)
