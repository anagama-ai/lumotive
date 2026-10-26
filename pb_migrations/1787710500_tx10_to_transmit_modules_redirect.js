// Redirect /tx10 → /dev-kits/transmit-modules, the second of the five
// redirects the approved content package rev. 2026-10-07 lists on page 02
// ("Redirects: /lm10 → /lcm-chips · /tx10 → /dev-kits/transmit-modules · /m30 →
// /dev-kits/itof#m30 · /nm120 → /dev-kits/dtof#nm120 · /products → /dev-kits").
// The remaining three wait on the pages that supply their destinations.
//
// 1787710400_transmit_modules_page13.js renames the /tx10 record, so /tx10 no
// longer resolves to a page. `hooks.server.ts` catches the resulting 404 on a
// GET or HEAD, looks the path up in this collection and answers 308 with the
// destination, so every existing /tx10 link on this site and off it keeps
// working, published or indexed.
//
// The collection enforces a unique index on `from`, so the up path updates the
// existing row when one is already present instead of failing. The down path
// removes only this row.
const FROM = '/tx10'
const TO = '/dev-kits/transmit-modules'

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
