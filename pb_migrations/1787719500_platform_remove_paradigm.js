// /platform "Light Control Metasurface™ Optical Beamforming Technology"
// peel-bleed split (fbe8b045, #paradigm) is removed. Its heading now sits on
// the flow panels (cac52f89). Removes it wherever it sits; down restores the
// exact prior object after "From 1D to 2D beamforming" (b2d10f47).
const SECTION_ID = 'fbe8b045'
const AFTER = 'b2d10f47'
const SECTION = {"align":"container","anchor":"paradigm","background":"none","bleed":"compact","body":"<p>Traditional optical systems rely on fixed lenses, bulk components, or mechanical steering designed for a single function. Lumotive&#39;s LCM platform replaces that fixed architecture with a programmable optical semiconductor that controls light electronically, without moving parts.</p><p>By programming the optical phase across the surface of the chip, LCM technology can steer and shape beams, perform lensing and collimation, generate multiple beams, enable adaptive optics, and create custom phase or intensity patterns.</p><ul><li>Traditional Optics — Fixed lenses, bulk components, mechanical steering</li><li>LCM Platform — Programmable optical phase control on a semiconductor chip</li><li>Programmable Functions — Beamforming, lensing, multiple beams, adaptive optics, custom light patterns</li></ul>","designVersion":"peelBleed","heading":"Light Control Metasurface™ Optical Beamforming Technology","id":"fbe8b045","media":{"kind":"url","value":"/lumotive/img/paradigm-chip-bleed.png"},"mediaPosition":"left","spacingBottom":"md-compact-phone","spacingTop":"md-compact-phone","type":"splitPeelBleed","width":"contained"}

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const at = sections.findIndex((s) => s && s.id === SECTION_ID)
	if (forward) {
		if (at < 0) return
		sections.splice(at, 1)
	} else {
		if (at >= 0) return
		const anchor = sections.findIndex((s) => s && s.id === AFTER)
		if (anchor < 0) return
		sections.splice(anchor + 1, 0, JSON.parse(JSON.stringify(SECTION)))
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
