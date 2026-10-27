// /contact: the four offices move into the left column of "Tell us about
// your project" (f1d7c3a2), under the heading and beside the form; the
// separate "Lumotive offices" section (fbfa54dc) is removed. Office copy
// unchanged. Guarded on the exact prior sections; down restores both in place.
const FORM_BEFORE = {"align": "container", "anchor": "enquiries", "background": "none", "designVersion": "pipedrive", "eyebrow": "How can we help?", "formUrl": "https://webforms.pipedrive.com/f/31lkaELFMo0BDvBhsaRvd2vKXljrekefvh9YWPmcwdaLZVwnKruGDasdAlpSd4Hp9", "heading": "Tell us about your project", "id": "f1d7c3a2", "layout": "split", "spacingBottom": "md", "spacingTop": "md", "type": "formPipedrive", "width": "contained"}
const FORM_AFTER = {"align": "container", "anchor": "enquiries", "background": "none", "designVersion": "pipedrive", "eyebrow": "How can we help?", "formUrl": "https://webforms.pipedrive.com/f/31lkaELFMo0BDvBhsaRvd2vKXljrekefvh9YWPmcwdaLZVwnKruGDasdAlpSd4Hp9", "heading": "Tell us about your project", "id": "f1d7c3a2", "layout": "split", "spacingBottom": "md", "spacingTop": "md", "type": "formPipedrive", "width": "contained", "offices": [{"eyebrow": "Corporate headquarters", "title": "Redmond, Washington", "body": "<p>4104 148th Ave NE, Redmond, WA 98052, USA</p>"}, {"eyebrow": "United States", "title": "Milpitas, California", "body": "<p>1900 McCarthy Blvd, Suite 420, Milpitas, CA 95035, USA</p>"}, {"eyebrow": "Canada", "title": "Burnaby, British Columbia", "body": "<p>4664 Lougheed Hwy #162, Burnaby, BC V5C 5T5, Canada</p>"}, {"eyebrow": "Oman", "title": "Muscat", "body": "<p>18 MOD Building, Office #301, Seeb 112, Oman</p>"}]}
const OFFICES = {"align": "container", "anchor": "offices", "background": "subtle", "cards": [{"accent": "accent1", "body": "<p>4104 148th Ave NE, Redmond, WA 98052, USA</p>", "eyebrow": "Corporate headquarters", "title": "Redmond, Washington"}, {"accent": "accent2", "body": "<p>1900 McCarthy Blvd, Suite 420, Milpitas, CA 95035, USA</p>", "eyebrow": "United States", "title": "Milpitas, California"}, {"accent": "accent3", "body": "<p>4664 Lougheed Hwy #162, Burnaby, BC V5C 5T5, Canada</p>", "eyebrow": "Canada", "title": "Burnaby, British Columbia"}, {"accent": "accent1", "body": "<p>18 MOD Building, Office #301, Seeb 112, Oman</p>", "eyebrow": "Oman", "title": "Muscat"}], "columns": "4", "designVersion": "textCards", "eyebrow": "Global presence", "heading": "Lumotive offices", "id": "fbfa54dc", "spacingBottom": "md", "spacingTop": "md", "type": "cardsTextCards", "width": "contained"}
// PocketBase stores JSON with its keys re-sorted, so compare canonically.
const canon = (value) => Array.isArray(value)
	? value.map(canon)
	: value && typeof value === 'object'
		? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canon(value[key])]))
		: value
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b))


const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'contact' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const formAt = sections.findIndex((s) => s && s.id === FORM_BEFORE.id)
	const officesAt = sections.findIndex((s) => s && s.id === OFFICES.id)
	if (formAt < 0) return
	if (forward) {
		if (officesAt < 0 || !same(sections[formAt], FORM_BEFORE) || !same(sections[officesAt], OFFICES)) return
		sections[formAt] = JSON.parse(JSON.stringify(FORM_AFTER))
		sections.splice(officesAt, 1)
	} else {
		if (officesAt >= 0 || !same(sections[formAt], FORM_AFTER)) return
		sections[formAt] = JSON.parse(JSON.stringify(FORM_BEFORE))
		sections.splice(formAt + 1, 0, JSON.parse(JSON.stringify(OFFICES)))
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
