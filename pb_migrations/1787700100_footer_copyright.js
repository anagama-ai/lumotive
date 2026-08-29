// The footer copyright was never seeded, so the footer fell back to the
// boilerplate's own string. Merge the real one in without disturbing the nav.
//
// `record.get('data')` on a json field yields Go-side JSONRaw, which spreads to
// an empty object in the JSVM and silently erases the record. Read the raw text
// and parse it instead.
const readData = (record) => {
	try {
		const raw = record.getString('data')
		if (!raw) return {}
		const parsed = JSON.parse(raw)
		return parsed && typeof parsed === 'object' ? parsed : {}
	} catch {
		return {}
	}
}

migrate(
	(app) => {
		let record
		try {
			record = app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'footer' })
		} catch {
			return
		}

		const data = readData(record)
		data.copyright = 'Lumotive, Inc. All rights reserved.'
		record.set('data', data)
		app.save(record)
	},
	(app) => {
		let record
		try {
			record = app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'footer' })
		} catch {
			return
		}

		const data = readData(record)
		delete data.copyright
		record.set('data', data)
		app.save(record)
	}
)
