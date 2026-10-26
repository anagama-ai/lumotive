// Redirect /products → /dev-kits, the last of the five redirects the approved
// content package rev. 2026-10-07 lists on page 02 ("Redirects: /lm10 →
// /lcm-chips · /tx10 → /dev-kits/transmit-modules · /m30 → /dev-kits/itof#m30 ·
// /nm120 → /dev-kits/dtof#nm120 · /products → /dev-kits"), and the only one
// still missing. The site map repeats it on the Dev Kits row: "Hub; redirect
// /products here".
//
// Unlike the other four, nothing had to be renamed first: this repository has
// never had a /products record, so the path has been answering 404 the whole
// time. `hooks.server.ts` catches that 404 on a GET or HEAD, looks the path up
// in this collection and answers 308 with the destination, so an existing
// /products link from the old site or an index keeps working.
//
// The collection enforces a unique index on `from`, so the up path updates the
// existing row when one is already present instead of failing. The down path
// removes only this row.
const FROM = '/products'
const TO = '/dev-kits'

const findRedirect = (app, from) => {
	try {
		return app.findFirstRecordByFilter('redirects', 'from = {:from}', { from })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findRedirect(app, FROM) ?? new Record(app.findCollectionByNameOrId('redirects'))

		record.set('from', FROM)
		record.set('to', TO)
		record.set('active', true)
		app.save(record)
	},
	(app) => {
		const record = findRedirect(app, FROM)
		if (record) app.delete(record)
	}
)
