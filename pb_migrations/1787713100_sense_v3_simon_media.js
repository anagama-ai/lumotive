// v3 page 09 (/sense). The only v3 copy change ("Add LCM beamforming…")
// already shipped in 1787712600_beamforming_terminology.js. What v3 adds is
// Simon's media, matched to its slot by each sticky note's position:
//   A1 Industrial-scaled  → Better Perception, indoor iToF card
//   A2 3D-Sensing         → Better Perception, outdoor dToF card
//   A6 Vimeo 1235957120   → HDR section ("Lumotive HDR"), right column, 21:9 frame
//   A3 robot conveyor     → Applications, Robotics card
//   A4 Driverless-Car     → Applications, Automotive card
//   A5 Robotaxi (aerial traffic scene) → Applications, Smart infrastructure
// The images are local WebP copies under /lumotive/img. The perception pair
// is cropped to 16:9 because text cards frame media at that ratio.
// Also sets the meta description from the hero sentence (global rule 14).
// Every change is guarded on the prior value and reverses exactly.
const PAGE = 'sense'
const PERCEPTION_ID = 'a1d7c40e'
const HDR_ID = 'f52b9a16'
const APPLICATIONS_ID = '2a6b5ed9'
const PERCEPTION = {
	'Indoor sensing · LCM-based iToF': '/lumotive/img/sense-perception-indoor.webp',
	'Outdoor and surround sensing · LCM-based dToF': '/lumotive/img/sense-perception-outdoor.webp'
}
const HDR_VIDEO = 'https://vimeo.com/1235957120'
// The clip is 2520 × 1080 (21:9); a 16:9 frame would letterbox it.
const HDR_ASPECT = '21 / 9'
const APPLICATIONS = {
	Robotics: { from: '/lumotive/img/market-robot-dog.jpg', to: '/lumotive/img/sense-application-robotics.webp' },
	Automotive: { from: '/lumotive/img/market-passenger-adas.jpg', to: '/lumotive/img/sense-application-automotive.webp' },
	'Smart infrastructure & surveillance': { from: '/lumotive/img/market-its.jpg', to: '/lumotive/img/sense-application-smart-infrastructure.webp' }
}
const META = '3D sensing for Physical AI. One sensor, multiple modes, adapted in software.'

const isUrl = (media, value) => media && media.kind === 'url' && media.value === value

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: PAGE }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	let changed = false
	const find = (id, type) => sections.find((section) => section && section.id === id && section.type === type)

	const perception = find(PERCEPTION_ID, 'cardsTextCards')
	if (perception && Array.isArray(perception.cards)) {
		for (const card of perception.cards) {
			const path = card && PERCEPTION[card.eyebrow]
			if (!path) continue
			if (forward && card.media == null) {
				card.media = { kind: 'url', value: path }
				changed = true
			} else if (!forward && isUrl(card.media, path)) {
				delete card.media
				changed = true
			}
		}
	}

	const hdr = find(HDR_ID, 'splitDefault')
	if (hdr) {
		if (forward && !hdr.videoUrl && hdr.media == null && !hdr.mediaPosition && !hdr.videoAspect) {
			hdr.videoUrl = HDR_VIDEO
			hdr.videoAspect = HDR_ASPECT
			hdr.mediaPosition = 'right'
			changed = true
		} else if (!forward && hdr.videoUrl === HDR_VIDEO) {
			delete hdr.videoUrl
			if (hdr.mediaPosition === 'right') delete hdr.mediaPosition
			if (hdr.videoAspect === HDR_ASPECT) delete hdr.videoAspect
			changed = true
		}
	}

	const applications = find(APPLICATIONS_ID, 'cardsMediaCards')
	if (applications && Array.isArray(applications.cards)) {
		for (const card of applications.cards) {
			const swap = card && APPLICATIONS[card.title]
			if (!swap) continue
			const [from, to] = forward ? [swap.from, swap.to] : [swap.to, swap.from]
			if (isUrl(card.media, from)) {
				card.media = { kind: 'url', value: to }
				changed = true
			}
		}
	}

	if (changed) page.set('sections', sections)
	const description = page.getString('seoDescription')
	if (forward && !description) {
		page.set('seoDescription', META)
		changed = true
	} else if (!forward && description === META) {
		page.set('seoDescription', '')
		changed = true
	}
	if (changed) app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
