// dToF Dev Kits v4 (PDF page 15, F5). Simon's Vimeo 1235957120 ("Lumotive
// HDR", 0:15, 21:9 - the clip /sense already plays) fills the printed "HDR
// demo" slot of HDR Without Losing Frame Rate (`91e6c3a8`), right-hand as
// printed and as the Track Fast-Moving Objects player below it, in the
// shared split player at its own 21:9 frame. Copy unchanged; the NM120 spec
// and Modular by Design inputs (F2-F4) stay withheld. Guarded; reversible.
const PAGE = 'dtof'
const SECTION_ID = '91e6c3a8'
const FIELDS = {
	mediaPosition: 'right',
	videoAspect: '21 / 9',
	videoUrl: 'https://vimeo.com/1235957120'
}

const apply = (app, forward) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE })
	} catch {
		return
	}
	let sections
	try {
		sections = JSON.parse(record.getString('sections') || '[]')
	} catch {
		return
	}
	if (!Array.isArray(sections)) return
	const index = sections.findIndex((entry) => entry && entry.id === SECTION_ID)
	if (index < 0) return
	const section = { ...sections[index] }
	if (forward) {
		if (Object.keys(FIELDS).some((key) => section[key] !== undefined)) return
		Object.assign(section, FIELDS)
	} else {
		if (!Object.entries(FIELDS).every(([key, value]) => section[key] === value)) return
		for (const key of Object.keys(FIELDS)) delete section[key]
	}
	sections[index] = Object.fromEntries(Object.keys(section).sort().map((key) => [key, section[key]]))
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
