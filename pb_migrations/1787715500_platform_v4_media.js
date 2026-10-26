// Platform v4 (PDF page 06, Simon's notes of 2026-10-20).
// - From 1D to 2D Beamforming (`b2d10f47`): the supplied "Ducky_v6" video
//   (Vimeo 1237753837, 16:9) fills the printed animation slot on the right.
//   SplitDefault turns `videoUrl` into the click-to-play player; the section
//   leaves its one-column no-media layout.
// - See LCM in Action (new, after `b2d10f47`): the supplied LCM explorer,
//   self-hosted at /lcm-explorer/ (static/lcm-explorer/), behind its own 16:9
//   poster frame as package page 03 specifies. The poster is the explorer's
//   inline poster, extracted unchanged (static/lcm-explorer/poster.jpg).
//   "Open full screen" names the file, /lcm-explorer/index.html: the Vite dev
//   server does not resolve a directory to its index.html (the production
//   adapter-node server does), and the file path works on both.
// Guarded on prior values; down restores the previous sections exactly.
const ABSENT = undefined
const PAGE = 'platform'
const SPLIT_ID = 'b2d10f47'
const EXPLORER_ID = '302ae187'
const VIDEO_URL = 'https://vimeo.com/1237753837'

const EXPLORER = {
	id: EXPLORER_ID,
	type: 'mediaVideoEmbed',
	mode: 'interactive',
	eyebrow: 'Interactive',
	heading: 'See LCM in action',
	intro: 'Change the phase pattern across the metasurface and watch the beam steer, split, and focus.',
	items: [],
	embedUrl: '/lcm-explorer/index.html',
	embedTitle: 'Interactive LCM explorer',
	media: { kind: 'url', value: '/lcm-explorer/poster.jpg' },
	launchLabel: 'Launch interactive explorer',
	linkLabel: 'Open full screen',
	linkUrl: '/lcm-explorer/index.html',
	designVersion: 'interactive',
	align: 'container',
	anchor: 'explorer',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md'
}

const findPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE })
	} catch {
		return null
	}
}

// `record.get(<json field>)` yields Go-side JSONRaw; read the text instead.
const readSections = (record) => {
	try {
		const parsed = JSON.parse(record.getString('sections') || '[]')
		return Array.isArray(parsed) ? parsed : null
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findPage(app)
		if (!record) return
		const sections = readSections(record)
		if (!sections) return
		const index = sections.findIndex((entry) => entry && entry.id === SPLIT_ID)
		if (index === -1) return
		let changed = false
		const split = sections[index]
		if (split.videoUrl === ABSENT) {
			split.videoUrl = VIDEO_URL
			changed = true
		}
		if (!sections.some((entry) => entry && entry.id === EXPLORER_ID)) {
			sections.splice(index + 1, 0, EXPLORER)
			changed = true
		}
		if (!changed) return
		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findPage(app)
		if (!record) return
		const sections = readSections(record)
		if (!sections) return
		let changed = false
		const split = sections.find((entry) => entry && entry.id === SPLIT_ID)
		if (split && split.videoUrl === VIDEO_URL) {
			delete split.videoUrl
			changed = true
		}
		const next = sections.filter((entry) => !entry || entry.id !== EXPLORER_ID)
		if (next.length !== sections.length) changed = true
		if (!changed) return
		record.set('sections', next)
		app.save(record)
	}
)
