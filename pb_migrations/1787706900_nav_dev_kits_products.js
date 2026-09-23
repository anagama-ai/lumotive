// Header > Sense > "Dev kits & reference designs" gains a third-level list of
// the three product pages (TX10, M30, NM120).
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PARENT_URL = '/dev-kits'

const navLink = (label, url) => ({
	link: { type: 'custom', url, label, newTab: false },
	linkLabel: label,
	linkUrl: url,
	linkNewTab: false
})

const CHILDREN = [
	navLink('TX10 Development Kit', '/tx10'),
	navLink('M30 Development Kit', '/m30'),
	navLink('NM120 Development Kit', '/nm120')
]

const update = (app, mutate) => {
	let record
	try {
		record = app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'header' })
	} catch {
		return
	}
	let data
	try {
		data = JSON.parse(record.getString('data'))
	} catch {
		return
	}
	if (!Array.isArray(data?.items)) return

	for (const item of data.items) {
		const sub = (item?.subitems ?? []).find((s) => s?.linkUrl === PARENT_URL)
		if (!sub) continue
		mutate(sub)
		record.set('data', data)
		app.save(record)
		return
	}
}

migrate(
	(app) => update(app, (sub) => { sub.subitems = CHILDREN }),
	(app) => update(app, (sub) => { delete sub.subitems })
)
