// Release cleanup, no visible page copy changes.
// S11 (global rule 14): Home, Platform and Applications were the last pages
//   with no meta description; each takes its hero line, as every other page
//   does. Their <title> also read "Home" / "Platform" / "Applications";
//   seoTitle now reads the brand plus the approved hero heading for Home and
//   the approved nav labels for the other two ("LCM Technology" is /platform
//   in the page-02 menu).
// S13: globals.seo still carried the starter's boilerplate (description,
//   default meta description, tagline) and a placeholder contact email. Not
//   rendered today, but editor-visible: the text becomes approved Home copy
//   and the example address is cleared (the real press contact is pending, N2).
// S14: globals.code_injection shipped a debug console.log and a placeholder
//   head comment into every page; both are emptied.
// Every change is guarded on the prior value and reverses exactly.
const HOME_LINE = 'LCM™ chips steer and shape laser light electronically, on the surface of a semiconductor, with no moving parts.'

const PAGES = [
	['home', 'seoTitle', '', 'Lumotive | Programmable Optics'],
	['home', 'seoDescription', '', HOME_LINE],
	['platform', 'seoTitle', '', 'LCM Technology'],
	['platform', 'seoDescription', '', 'Software-defined light control, built on optical semiconductor technology.'],
	['applications', 'seoTitle', '', 'Applications'],
	['applications', 'seoDescription', '', 'One semiconductor platform. Many ways to put light to work.']
]

const GLOBALS = [
	['seo', ['description'], 'A clean black-and-white boilerplate for building editable Next.js sites with Payload CMS.', HOME_LINE],
	['seo', ['defaultMeta', 'description'], 'A neutral Next.js and Payload starter with editable pages, forms, and site settings.', HOME_LINE],
	['seo', ['tagline'], 'A neutral Next.js and Payload starter.', 'Programmable optics'],
	['seo', ['contactEmail'], 'hello@example.com', ''],
	['code_injection', ['head'], '<!-- code injection: head -->', ''],
	['code_injection', ['bodyEnd'], "<script>console.log('code injection: bodyEnd')</script>", '']
]

// `record.get('data')` on a json field yields Go-side JSONRaw; read the raw
// text and parse it instead (see 1787700100_footer_copyright.js).
const readData = (record) => {
	try {
		const parsed = JSON.parse(record.getString('data') || '{}')
		return parsed && typeof parsed === 'object' ? parsed : {}
	} catch {
		return {}
	}
}

const apply = (app, forward) => {
	for (const [slug, field, before, after] of PAGES) {
		let page
		try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug }) }
		catch { continue }
		const [from, to] = forward ? [before, after] : [after, before]
		if (page.getString(field) !== from) continue
		page.set(field, to)
		app.save(page)
	}

	for (const key of [...new Set(GLOBALS.map(([k]) => k))]) {
		let record
		try { record = app.findFirstRecordByFilter('globals', 'key = {:key}', { key }) }
		catch { continue }
		const data = readData(record)
		let changed = false
		for (const [globalKey, path, before, after] of GLOBALS) {
			if (globalKey !== key) continue
			const [from, to] = forward ? [before, after] : [after, before]
			const parent = path.slice(0, -1).reduce((node, part) => (node && typeof node === 'object' ? node[part] : undefined), data)
			const leaf = path[path.length - 1]
			if (!parent || typeof parent !== 'object' || parent[leaf] !== from) continue
			parent[leaf] = to
			changed = true
		}
		if (!changed) continue
		record.set('data', data)
		app.save(record)
	}
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
