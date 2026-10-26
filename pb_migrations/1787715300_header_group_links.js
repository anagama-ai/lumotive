// S16, page 02: "clicking the label itself goes to the URL shown next to it."
// The three dropdown groups had no link of their own; they take the page-02
// URLs: Platform /platform, Sense /sense, Company /about. Header.svelte renders
// the label as that link and opens the dropdown from a separate arrow button.
// Guarded: only groups with no link yet are touched; reverses exactly.
const GROUP_URLS = { Platform: '/platform', Sense: '/sense', Company: '/about' }

const readData = (record) => {
	try {
		const parsed = JSON.parse(record.getString('data') || '{}')
		return parsed && typeof parsed === 'object' ? parsed : {}
	} catch {
		return {}
	}
}

const apply = (app, forward) => {
	let record
	try { record = app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'header' }) }
	catch { return }
	const data = readData(record)
	if (!Array.isArray(data.items)) return
	let changed = false
	for (const item of data.items) {
		if (!item || item.blockType !== 'sub') continue
		const url = GROUP_URLS[item.label]
		if (!url) continue
		if (forward && item.link == null) {
			item.link = { label: item.label, newTab: false, type: 'custom', url }
			changed = true
		} else if (!forward && item.link && item.link.url === url && item.link.label === item.label) {
			delete item.link
			changed = true
		}
	}
	if (!changed) return
	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
