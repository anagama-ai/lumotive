// v3 page 06: Simon's LM10 photo in Two Chips, One Platform, paired with
// the LS20 image identified on page 07. The existing hero image stays: the
// printed page marks it KEEP AS IS despite a Vimeo link beside that slot.
// Neither the #125 mirrors/prisms graphic nor the 1D/2D and Explorer source
// files are supplied by those comments; do not substitute other visuals.
const CHIPS_ID = 'c0a71d35'
const SCANNING_ID = '97a0771d'
const PHOTOS = [
	{ title: 'LM10', path: '/lumotive/img/platform-lm10.webp' },
	{ title: 'LS20', path: '/lumotive/img/platform-ls20.webp' }
]
const OLD_SCANNING = '<p>Digital beam steering, enabled by optical beamforming with Lumotive LCMs, lights the way for the future of lidar and 3D sensing. Unconstrained by the motion and reliability of mechanical parts, a sensor can adjust its scanning behavior instantaneously, in real time, to respond to the situation.</p>'
const NEW_SCANNING = '<p>Optical beamforming with Lumotive LCMs lights the way for the future of lidar and 3D sensing. Unconstrained by the motion and reliability of mechanical parts, a sensor can adjust its scanning behavior instantaneously, in real time, to respond to the situation.</p>'

const apply = (app, forward) => {
	let record
	try { record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(record.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	let changed = false
	const chips = sections.find((section) => section && section.id === CHIPS_ID)
	if (chips && chips.type === 'cardsTextCards' && Array.isArray(chips.cards)) {
		for (const { title, path } of PHOTOS) {
			const card = chips.cards.find((entry) => entry && entry.title === title)
			if (!card) continue
			if (forward && card.media == null) {
				card.media = { kind: 'url', value: path }
				changed = true
			} else if (!forward && card.media && card.media.kind === 'url' && card.media.value === path) {
				delete card.media
				changed = true
			}
		}
	}
	const scanning = sections.find((section) => section && section.id === SCANNING_ID)
	if (scanning && scanning.type === 'splitDarkPanel') {
		const from = forward ? OLD_SCANNING : NEW_SCANNING
		if (scanning.body === from) {
			scanning.body = forward ? NEW_SCANNING : OLD_SCANNING
			changed = true
		}
	}
	if (!changed) return
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
