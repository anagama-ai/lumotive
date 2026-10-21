// /dev-kits/itof M30 opener (6e81d47c, "Embedded Long-Range iToF Module").
// The live JPG carries its white backdrop in the image, which on phones
// (where split photos sit at 75% width on the page field) read as a square
// white box. It is replaced by Simon's transparent original (IMG_7224, A1 on
// v3 page 14) at the same canvas and framing, saved as
// m30-dev-kit-contents.webp, and `mediaFrame: "panel"` draws the desktop
// white panel from the frame instead (768px up). The JPG stays for the down
// path. Guarded on the prior values; reverses exactly.
const SECTION_ID = '6e81d47c'
const OLD = '/lumotive/img/m30-dev-kit-contents.jpg'
const NEW = '/lumotive/img/m30-dev-kit-contents.webp'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'path = {:path}', { path: 'dev-kits/itof' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const m30 = sections.find((s) => s && s.id === SECTION_ID)
	if (!m30 || !m30.media || m30.media.kind !== 'url') return
	if (forward) {
		if (m30.media.value !== OLD || m30.mediaFrame != null) return
		m30.media.value = NEW
		m30.mediaFrame = 'panel'
	} else {
		if (m30.media.value !== NEW || m30.mediaFrame !== 'panel') return
		m30.media.value = OLD
		delete m30.mediaFrame
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
