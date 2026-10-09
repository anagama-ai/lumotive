// Header > Applications: Robotics links to the "Software-defined 3D sensing for
// Physical AI" split (anchor "sense"), Automotive to "Automotive Safety Cocoon"
// (anchor "safety-cocoon"), instead of the market cards further down.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const REMAP = [
	{ from: '/applications#robotics', to: '/applications#sense' },
	{ from: '/applications#automotive', to: '/applications#safety-cocoon' }
]

const rewrite = (app, pairs) => {
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

	let changed = false
	for (const item of data.items) {
		for (const sub of item?.subitems ?? []) {
			const pair = pairs.find((p) => sub?.linkUrl === p.from)
			if (!pair) continue
			sub.linkUrl = pair.to
			if (sub.link) sub.link.url = pair.to
			changed = true
		}
	}
	if (!changed) return
	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => rewrite(app, REMAP),
	(app) => rewrite(app, REMAP.map(({ from, to }) => ({ from: to, to: from })))
)
