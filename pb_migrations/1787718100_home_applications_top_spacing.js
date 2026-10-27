// Home "When light becomes programmable" (cardsPeelBento, id "677cf547"):
// drop the duplicated top spacing after "Latest From Lumotive".
//
// `1787717900` gave this section md/md. The News section above already ends
// with its own md (5rem) bottom padding, so the two paddings stacked: 80 + 80px
// plus the heading's own top margin put 233px between "All news" and this
// heading at 1440. With the top set to `none`, the News padding alone carries
// the gap (about 153px at desktop widths), in line with the 160px from "See
// all applications" to the investor-band label. The bottom stays `md`.
//
// Only `spacingTop` on this one section changes, and only from the deployed
// md/md state; rollback restores `md` only from none/md. `1787717900` is left
// untouched because it has already run on staging.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = '677cf547'

const apply = (app, from, to) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'home' })
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
	const section = sections.find((entry) => entry && entry.id === SECTION_ID)
	if (!section || section.type !== 'cardsPeelBento') return
	if (section.spacingTop !== from || section.spacingBottom !== 'md') return
	section.spacingTop = to
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, 'md', 'none'),
	(app) => apply(app, 'none', 'md')
)
