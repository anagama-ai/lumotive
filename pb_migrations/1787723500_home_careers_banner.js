// Grey careers banner above the nav on the home page, edited in Settings > Header.
const LABEL = 'The Lumotive team is growing!'
const URL = 'https://jobs.lever.co/lumotive'

const updateHeader = (app, edit) => {
	const header = app.findFirstRecordByFilter('globals', 'key = "header"')
	const data = JSON.parse(header.getString('data') || '{}')
	edit(data)
	header.set('data', data)
	app.save(header)
}

migrate(
	(app) =>
		updateHeader(app, (data) => {
			if (data.banner?.length) return
			data.banner = [
				{ link: { type: 'custom', newTab: true, label: LABEL, url: URL }, linkLabel: LABEL, linkNewTab: true, linkUrl: URL }
			]
		}),
	(app) =>
		updateHeader(app, (data) => {
			if (data.banner?.[0]?.link?.url === URL) delete data.banner
		})
)
