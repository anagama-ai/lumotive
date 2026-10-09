// Header > Sense > "Dev kits & reference designs" description says LM10;
// the product line is LCM.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const OLD = 'Evaluate LM10 in your own system'
const NEW = 'Evaluate LCM in your own system'

const setDescription = (app, from, to) => {
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
			if (sub?.Description === from) {
				sub.Description = to
				changed = true
			}
		}
	}
	if (!changed) return
	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => setDescription(app, OLD, NEW),
	(app) => setDescription(app, NEW, OLD)
)
