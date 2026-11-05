// The /news follow block gets the confirmed LinkedIn URL and press contact.
const URL_NEW = 'https://www.linkedin.com/company/lumotive'
const URL_OLD = 'https://www.linkedin.com/company/lumotive/'
const BODY = '<p>Follow Lumotive for news, research, and openings.</p>'
const PRESS = '<p>Media inquiries: <a href="mailto:marketing@lumotive.com">marketing@lumotive.com</a></p>'

const apply = (app, forward) => {
	const page = app.findFirstRecordByFilter('pages', 'path = "news"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	const follow = sections.find((s) => s.id === 'a9f3c1e2')
	const url = forward ? URL_NEW : URL_OLD
	follow.primaryLink.url = url
	follow.primaryLinkUrl = url
	follow.body = forward ? BODY + PRESS : BODY
	page.set('sections', sections)
	app.save(page)
}

migrate((app) => apply(app, true), (app) => apply(app, false))
