// Redirect /m30 → /dev-kits/itof#m30, the third of the five redirects the
// approved content package rev. 2026-10-07 lists on page 02 ("Redirects: /lm10
// → /lcm-chips · /tx10 → /dev-kits/transmit-modules · /m30 → /dev-kits/itof#m30
// · /nm120 → /dev-kits/dtof#nm120 · /products → /dev-kits"). The remaining two
// wait on page 15 and on the /products destination.
//
// The destination carries the #m30 fragment, which the site map spells out, so
// an existing /m30 link lands on the M30 section of the category page rather
// than at the top of it. 1787710700_itof_dev_kits_page14.js gives that section
// its anchor.
//
// 1787710700_itof_dev_kits_page14.js renames the /m30 record, so /m30 no longer
// resolves to a page. `hooks.server.ts` catches the resulting 404 on a GET or
// HEAD, looks the path up in this collection and answers 308 with the
// destination, so every existing /m30 link on this site and off it keeps
// working, published or indexed.
//
// The collection enforces a unique index on `from`, so the up path updates the
// existing row when one is already present instead of failing. The down path
// removes only this row.
const FROM = '/m30'
const TO = '/dev-kits/itof#m30'

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
