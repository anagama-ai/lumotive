// The Google tag lumotive.com loads through Site Kit (GT-T5RLZSRP), carried over
// into Settings > Code > head so analytics continue after launch.
const TAG = `<script async src="https://www.googletagmanager.com/gtag/js?id=GT-T5RLZSRP"></script>
<script>
	window.dataLayer = window.dataLayer || [];
	function gtag() { dataLayer.push(arguments); }
	gtag('js', new Date());
	gtag('config', 'GT-T5RLZSRP');
</script>`

const update = (app, edit) => {
	const record = app.findFirstRecordByFilter('globals', 'key = "code_injection"')
	const data = JSON.parse(record.getString('data') || '{}')
	edit(data)
	record.set('data', data)
	app.save(record)
}

migrate(
	(app) =>
		update(app, (data) => {
			if (String(data.head ?? '').includes('GT-T5RLZSRP')) return
			data.head = [String(data.head ?? '').trim(), TAG].filter(Boolean).join('\n')
		}),
	(app) =>
		update(app, (data) => {
			data.head = String(data.head ?? '').replace(TAG, '').trim()
		})
)
