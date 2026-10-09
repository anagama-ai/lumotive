// Home page, approved content package rev. 2026-10-07, page 05 of 21.
// NEW · PULLS FROM NEWS — "Latest From Lumotive", inserted directly after the
// Sense/Connect solution cards (cardsPeelScene, id "a20efeab").
//
// The section is a `postsFeatured` block: it stores only the label, heading and
// "All news" link, and the three teasers are read from the CMS at request time
// per the page 02 rule — the three most recent published posts marked Featured,
// filled with the latest press releases when fewer than three are marked. No
// dates are rendered, as the dev note requires.
//
// Initial featured set. Page 05 shows three cards:
//   1. "Leopard Imaging builds on LCM"            — post not written yet
//   2. "New LI140 and ON140 iToF dev kits"        — post not written yet
//   3. "World's first 2D photonic beamforming chip" — exists, and is flagged here
// Page 04 lists the first two among the pending inputs from Lumotive, so only
// the third is flagged. The other two slots fall back to the latest press
// releases, which is the approved behaviour, rather than carrying invented
// titles or placeholder summaries. Flag the other two posts once they exist.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const ANCHOR_SECTION_ID = 'a20efeab'
const SECTION_ID = 'e7b40d12'

const FEATURED_SLUG = 'lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor'

const section = () => ({
	anchor: 'latest',
	// `none` is the page background. The teaser cards are white, so a `subtle`
	// (white) section would erase their edges.
	background: 'none',
	designVersion: 'featured',
	eyebrow: "What's new",
	heading: 'Latest from Lumotive',
	id: SECTION_ID,
	linkLabel: 'All news',
	linkUrl: '/news',
	spacingBottom: 'md',
	spacingTop: 'md',
	type: 'postsFeatured',
	width: 'contained'
})

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

const findPost = (app, slug) => {
	try {
		return app.findFirstRecordByFilter('posts', 'slug = {:slug}', { slug })
	} catch {
		return null
	}
}

const setFeatured = (app, slug, value) => {
	const post = findPost(app, slug)
	if (!post) return
	post.set('featured', value)
	app.save(post)
}

migrate(
	(app) => {
		const record = findHomePage(app)
		if (record) {
			const sections = readSections(record)
			// Guarded so a re-run cannot insert the section twice.
			if (!sections.some((entry) => entry && entry.id === SECTION_ID)) {
				const at = sections.findIndex((entry) => entry && entry.id === ANCHOR_SECTION_ID)
				if (at !== -1) {
					sections.splice(at + 1, 0, section())
					record.set('sections', sections)
					app.save(record)
				}
			}
		}

		setFeatured(app, FEATURED_SLUG, true)
	},
	(app) => {
		const record = findHomePage(app)
		if (record) {
			const sections = readSections(record)
			const at = sections.findIndex((entry) => entry && entry.id === SECTION_ID)
			if (at !== -1) {
				sections.splice(at, 1)
				record.set('sections', sections)
				app.save(record)
			}
		}

		setFeatured(app, FEATURED_SLUG, false)
	}
)
