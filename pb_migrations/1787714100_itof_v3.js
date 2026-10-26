// v3 page 14 (/dev-kits/itof). The v2->v3 copy changes ("beam steering" ->
// "beamforming" in the hero body and the LI140 subline) already shipped in
// 1787710900, so the live copy matches v3 verbatim. Of Simon's annotations,
// A1 (M30 with kit contents, IMG_7224) is already live as
// m30-dev-kit-contents.jpg, and A2 supplies the "Compact M30 AMR demo clip",
// Vimeo 1174547871/6e198e52ae ("Lumotive - AGV AMR", 16:9, the clip
// /applications already plays). It goes into the art column of "See It on
// Your Bench" (ac72039e), right-hand as printed. Everything else on the page
// is unchanged. Guarded on the prior values; reverses exactly.
const SECTION_ID = 'ac72039e'
const VIDEO = 'https://vimeo.com/1174547871/6e198e52ae'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'path = {:path}', { path: 'dev-kits/itof' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const bench = sections.find((s) => s && s.id === SECTION_ID)
	if (!bench) return
	if (forward) {
		if (bench.videoUrl != null || bench.mediaPosition != null) return
		bench.videoUrl = VIDEO
		bench.mediaPosition = 'right'
	} else {
		if (bench.videoUrl !== VIDEO || bench.mediaPosition !== 'right') return
		delete bench.videoUrl
		delete bench.mediaPosition
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
