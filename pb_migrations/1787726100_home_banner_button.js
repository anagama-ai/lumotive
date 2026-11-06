// The home careers banner gains a "Browse open positions" button as its second row.
const URL = 'https://jobs.lever.co/lumotive'
const LABEL = 'Browse open positions'

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
			if (data.banner?.length !== 1) return
			data.banner.push({ link: { type: 'custom', newTab: true, label: LABEL, url: URL }, linkLabel: LABEL, linkNewTab: true, linkUrl: URL })
		}),
	(app) =>
		updateHeader(app, (data) => {
			if (data.banner?.[1]?.link?.label === LABEL) data.banner = data.banner.slice(0, 1)
		})
)
