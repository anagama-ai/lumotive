// Hidden short links from lumotive.com: /ocs (to the OCS page, which is /connect
// here; pointed straight at it rather than through the old OCS path's redirect)
// and /384721 (to the LCM demonstration kit page).
const REDIRECTS = [
	{ from: '/ocs', to: '/connect' },
	{ from: '/384721', to: '/technology/light-control-metasurface-demonstration' }
]

const find = (app, from) => {
	try {
		return app.findFirstRecordByFilter('redirects', 'from = {:from}', { from })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		for (const { from, to } of REDIRECTS) {
			const record = find(app, from) ?? new Record(app.findCollectionByNameOrId('redirects'))
			record.set('from', from)
			record.set('to', to)
			record.set('active', true)
			app.save(record)
		}
	},
	(app) => {
		for (const { from } of REDIRECTS) {
			const record = find(app, from)
			if (record) app.delete(record)
		}
	}
)
