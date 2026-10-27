// /sense/robotics: "Robots carry too many sensors" (7d3e52b9) is folded
// into "One sensor, three jobs" (9a0b7f31): the problem text now opens that
// section's introduction, ahead of the virtual-sensor answer, and the
// separate problem section is removed. Guarded on the exact prior intro and
// section; down restores both in place.
const PROBLEM = {"align": "container", "anchor": "problem", "background": "none", "body": "<p>A typical mobile robot stacks two or three depth sensors per side: one for localization, one for obstacles, one for cliffs. Each adds cost, calibration, power, and another point of failure.</p>", "designVersion": "default", "eyebrow": "The problem", "heading": "Robots carry too many sensors", "id": "7d3e52b9", "spacingBottom": "sm", "spacingTop": "sm", "type": "splitDefault", "width": "contained"}
const TARGET_ID = '9a0b7f31'
const OLD_INTRO = "LCM interleaves three virtual sensors in a single scan, each with its own field of view, frame rate, and integration time."
const NEW_INTRO = "A typical mobile robot stacks two or three depth sensors per side: one for localization, one for obstacles, one for cliffs. Each adds cost, calibration, power, and another point of failure. LCM interleaves three virtual sensors in a single scan, each with its own field of view, frame rate, and integration time."

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'robotics' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const target = sections.find((s) => s && s.id === TARGET_ID && s.type === 'cardsTextCards')
	if (!target) return
	const at = sections.findIndex((s) => s && s.id === PROBLEM.id)
	if (forward) {
		if (at < 0 || target.intro !== OLD_INTRO) return
		sections.splice(at, 1)
		target.intro = NEW_INTRO
	} else {
		if (at >= 0 || target.intro !== NEW_INTRO) return
		target.intro = OLD_INTRO
		sections.splice(sections.indexOf(target), 0, JSON.parse(JSON.stringify(PROBLEM)))
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
