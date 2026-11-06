// LS20 chip cutout: #37 re-padded lcm-ls20-chip-crop.png under the same name, so
// Cloudflare and browsers kept serving the old edge-to-edge copy (max-age 4 h).
// A versioned URL is a new cache key everywhere, so the padded (~30% smaller) chip shows.
const OLD = '/lumotive/img/lcm-ls20-chip-crop.png'
const NEW = '/lumotive/img/lcm-ls20-chip-crop.png?v=2'
const SLUGS = ['lcm-chips', 'platform']

const replaceIn = (node, from, to) => {
	let changed = 0
	if (Array.isArray(node)) {
		node.forEach((v, i) => {
			if (v === from) { node[i] = to; changed++ } else if (v && typeof v === 'object') changed += replaceIn(v, from, to)
		})
	} else if (node && typeof node === 'object') {
		for (const k of Object.keys(node)) {
			const v = node[k]
			if (v === from) { node[k] = to; changed++ } else if (v && typeof v === 'object') changed += replaceIn(v, from, to)
		}
	}
	return changed
}

const swap = (app, from, to) => {
	for (const slug of SLUGS) {
		let page
		try {
			page = app.findFirstRecordByFilter('pages', `slug = "${slug}"`)
		} catch (_) {
			continue
		}
		const sections = JSON.parse(page.getString('sections') || '[]')
		if (replaceIn(sections, from, to) === 0) continue
		page.set('sections', sections)
		app.save(page)
	}
}

migrate((app) => swap(app, OLD, NEW), (app) => swap(app, NEW, OLD))
