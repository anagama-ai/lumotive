// Robotics "One Sensor, Three Jobs" as PDF page 10 prints it: heading,
// intro, the three virtual-sensor cards and the four benefit bullets in the
// left column, the demo video (Vimeo 1237762150) on the right. The bullets
// and the video move from the separate split `2e6c48da` into the cards
// section `9a0b7f31` (CardsTextCards `body` + `videoUrl`), and `2e6c48da` is
// removed. Copy is unchanged. The section takes back its own bottom spacing
// (it ended at `none` because the split followed it).
// Guarded on the exact prior state; down restores both sections exactly.
const PAGE = 'robotics'
const CARDS_ID = '9a0b7f31'
const SPLIT_ID = '2e6c48da'
const BODY = '<ul><li>Fewer sensors to buy</li><li>Fewer parts to maintain</li><li>Simpler calibration</li><li>Lower total power</li></ul>'
const VIDEO_URL = 'https://vimeo.com/1237762150'
const SPLIT = {
	align: 'container',
	anchor: '',
	background: 'none',
	body: BODY,
	designVersion: 'default',
	id: SPLIT_ID,
	mediaPosition: 'right',
	spacingBottom: 'md',
	spacingTop: 'sm',
	type: 'splitDefault',
	videoUrl: VIDEO_URL,
	width: 'contained'
}

const load = (app) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE })
	} catch {
		return null
	}
	try {
		const sections = JSON.parse(record.getString('sections') || '[]')
		return Array.isArray(sections) ? { record, sections } : null
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const loaded = load(app)
		if (!loaded) return
		const { record, sections } = loaded
		const cards = sections.find((entry) => entry && entry.id === CARDS_ID)
		const index = sections.findIndex((entry) => entry && entry.id === SPLIT_ID)
		if (!cards || index === -1) return
		if (JSON.stringify(sections[index]) !== JSON.stringify(SPLIT)) return
		if (cards.body !== undefined || cards.videoUrl !== undefined || cards.spacingBottom !== 'none') return
		cards.spacingBottom = 'md'
		cards.body = BODY
		cards.videoUrl = VIDEO_URL
		sections.splice(index, 1)
		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const loaded = load(app)
		if (!loaded) return
		const { record, sections } = loaded
		const index = sections.findIndex((entry) => entry && entry.id === CARDS_ID)
		if (index === -1 || sections.some((entry) => entry && entry.id === SPLIT_ID)) return
		const cards = sections[index]
		if (cards.body !== BODY || cards.videoUrl !== VIDEO_URL) return
		cards.spacingBottom = 'none'
		delete cards.body
		delete cards.videoUrl
		sections.splice(index + 1, 0, SPLIT)
		record.set('sections', sections)
		app.save(record)
	}
)
