// LS20 chip at half its current on-screen size on /lcm-chips and /platform.
// The cards gain an optional `mediaScale`, read by CardsTextCards and
// CardsSpecComparison; this sets it to "0.5" on the LS20 card only. The image
// file and its URL stay as they are, so no cache can hold the change back.
const SRC = '/lumotive/img/lcm-ls20-chip-crop.png?v=2'
const SCALE = '0.5'
const SLUGS = ['lcm-chips', 'platform']

const walk = (node, visit) => {
	if (Array.isArray(node)) {
		let changed = 0
		for (const v of node) changed += walk(v, visit)
		return changed
	}
	if (!node || typeof node !== 'object') return 0
	let changed = visit(node)
	for (const k of Object.keys(node)) {
		const v = node[k]
		if (v && typeof v === 'object') changed += walk(v, visit)
	}
	return changed
}

const isChip = (node) => node.media && typeof node.media === 'object' && node.media.value === SRC

const apply = (app, visit) => {
	for (const slug of SLUGS) {
		let page
		try {
			page = app.findFirstRecordByFilter('pages', `slug = "${slug}"`)
		} catch (_) {
			continue
		}
		const sections = JSON.parse(page.getString('sections') || '[]')
		if (walk(sections, visit) === 0) continue
		page.set('sections', sections)
		app.save(page)
	}
}

migrate(
	(app) =>
		apply(app, (node) => {
			if (!isChip(node) || node.mediaScale !== undefined) return 0
			node.mediaScale = SCALE
			return 1
		}),
	(app) =>
		apply(app, (node) => {
			if (!isChip(node) || node.mediaScale !== SCALE) return 0
			delete node.mediaScale
			return 1
		})
)
