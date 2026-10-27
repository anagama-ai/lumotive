// Home, phones only: "All news" → "When Light Becomes Programmable".
//
// Measured at 360–430px: 117px from the link to the heading's box (123px to
// its visible top). That is the News section's `md` bottom padding (80px)
// plus the heading's own top margin (36.5px); the bento's top padding is
// already `none` (1787718100).
//
// News (`e7b40d12`) takes `md-compact-phone` at the bottom: 2.5rem on
// phones, `md` (5rem) unchanged from 768px up. The heading keeps its margin,
// so the phone gap becomes ~77px, in line with the ~80px of the other
// corrected phone transitions.
//
// Applies only while News's bottom is `md` and the bento's top is `none`;
// rollback restores `md` only from `md-compact-phone`.
const PAGE = 'home'
const NEWS = 'e7b40d12'
const BENTO = '677cf547'

const apply = (app, from, to) => {
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
	const news = sections.find((entry) => entry && entry.id === NEWS)
	const bento = sections.find((entry) => entry && entry.id === BENTO)
	if (!news || !bento || news.spacingBottom !== from || bento.spacingTop !== 'none') return
	news.spacingBottom = to
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, 'md', 'md-compact-phone'),
	(app) => apply(app, 'md-compact-phone', 'md')
)
