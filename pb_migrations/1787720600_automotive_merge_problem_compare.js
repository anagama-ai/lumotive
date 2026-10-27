// /sense/automotive: "Near-field blind spots need too many sensors"
// (b47c9e13) is folded into "A programmable cocoon around the vehicle"
// (3e05d7b2) as a problem/solution comparison (after the Vizcom
// "Unblocking the process" pattern on Mobbin): the problem text becomes the
// ✕ list, the four benefit bullets become the ✓ list, and the coverage
// diagram stays below. The separate problem section is removed. Guarded on
// the exact prior sections; down restores both in place.
const PROBLEM = {"align": "container", "anchor": "problem", "background": "none", "body": "<p>Covering the area around a vehicle takes several narrow-FOV sensors or a mechanical spinner. Both add cost, integration work, and blind spots close to the vehicle, exactly where pedestrians, cyclists, and obstacles appear during parking and low-speed maneuvers.</p>", "designVersion": "default", "eyebrow": "The problem", "heading": "Near-field blind spots need too many sensors", "id": "b47c9e13", "spacingBottom": "sm", "spacingTop": "sm", "type": "splitDefault", "width": "contained"}
const BEFORE = {"align": "container", "anchor": "safety-cocoon", "background": "none", "body": "<p>Wide-FOV LCM-based dToF sensors at the corners create continuous near-field coverage. Software decides where to look harder: a pedestrian at the curb, a bollard behind the bumper, a cyclist alongside.</p><ul><li>180° and wider field of view per sensor</li><li>ROIs at up to 900 Hz for fast-moving objects</li><li>Solid state, with no moving parts</li><li>Coverage zones at roughly 10 m, 20 m, and 50 m</li></ul>", "designVersion": "default", "eyebrow": "Safety cocoon", "heading": "A programmable cocoon around the vehicle", "id": "3e05d7b2", "media": {"kind": "url", "value": "/lumotive/img/automotive-fov-regions.webp"}, "mediaAlt": "Coverage diagram from one sensor, in side and top views. Near field: ground plane, 10 m, 180° × 30°, 50 Hz, detects curbs, floor changes and close-proximity obstacles. Mid field: collision avoidance, 20 m, 180° × 60°, 10 Hz, detects surrounding objects in blind spots. Far field: long-range slice, 50 m, 180° × 10°, 10 Hz, detects oncoming traffic and supports localization.", "mediaHint": "Swipe to view the full diagram", "mediaLayout": "below", "spacingBottom": "md-compact-phone", "spacingTop": "md-compact-phone", "type": "splitDefault", "width": "contained"}
const AFTER = {"align": "container", "anchor": "safety-cocoon", "background": "none", "body": "<p>Wide-FOV LCM-based dToF sensors at the corners create continuous near-field coverage. Software decides where to look harder: a pedestrian at the curb, a bollard behind the bumper, a cyclist alongside.</p>", "designVersion": "default", "eyebrow": "Safety cocoon", "heading": "A programmable cocoon around the vehicle", "id": "3e05d7b2", "media": {"kind": "url", "value": "/lumotive/img/automotive-fov-regions.webp"}, "mediaAlt": "Coverage diagram from one sensor, in side and top views. Near field: ground plane, 10 m, 180° × 30°, 50 Hz, detects curbs, floor changes and close-proximity obstacles. Mid field: collision avoidance, 20 m, 180° × 60°, 10 Hz, detects surrounding objects in blind spots. Far field: long-range slice, 50 m, 180° × 10°, 10 Hz, detects oncoming traffic and supports localization.", "mediaHint": "Swipe to view the full diagram", "mediaLayout": "below", "spacingBottom": "md-compact-phone", "spacingTop": "md-compact-phone", "type": "splitDefault", "width": "contained", "problemLabel": "Surround sensing today", "problemItems": [{"title": "Too many sensors", "body": "Covering the area around a vehicle takes several narrow-FOV sensors or a mechanical spinner."}, {"title": "Cost and integration", "body": "Every added sensor brings more cost and more integration work."}, {"title": "Near-field blind spots", "body": "Gaps close to the vehicle, exactly where pedestrians, cyclists, and obstacles appear during parking and low-speed maneuvers."}], "solutionLabel": "With LCM", "solutionItems": [{"title": "180° and wider", "body": "Field of view per sensor."}, {"title": "ROIs at up to 900 Hz", "body": "For fast-moving objects."}, {"title": "Solid state", "body": "No moving parts."}, {"title": "Layered coverage", "body": "Zones at roughly 10 m, 20 m, and 50 m."}]}

// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'automotive' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const at = sections.findIndex((s) => s && s.id === BEFORE.id)
	if (at < 0) return
	const problemAt = sections.findIndex((s) => s && s.id === PROBLEM.id)
	if (forward) {
		if (problemAt < 0 || !same(sections[at], BEFORE) || !same(sections[problemAt], PROBLEM)) return
		sections[at] = JSON.parse(JSON.stringify(AFTER))
		sections.splice(problemAt, 1)
	} else {
		if (problemAt >= 0 || !same(sections[at], AFTER)) return
		sections[at] = JSON.parse(JSON.stringify(BEFORE))
		sections.splice(at, 0, JSON.parse(JSON.stringify(PROBLEM)))
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
