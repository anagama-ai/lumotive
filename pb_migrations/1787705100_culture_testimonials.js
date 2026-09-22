// The live /culture page features two employee testimonials that are missing from
// this site's culture page. Add the verified quotes and downloaded staff avatars
// immediately before the existing careers CTA.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const SECTION_ID = 'b4a91c73'
const CTA_SECTION_ID = '8c3ed872'

const TESTIMONIALS_SECTION = {
	anchor: 'team-voices',
	background: 'subtle',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md',
	designVersion: 'peelScene',
	id: SECTION_ID,
	type: 'testimonialsPeelScene',
	quotes: [
		{
			quote:
				'At the forefront of innovation, our company thrives on creativity, powered by brilliant minds shaping the future — proud to be a part of this journey.',
			author: 'Pankil',
			role: 'Team Engineering - San Jose, CA.',
			avatar: { kind: 'url', value: '/lumotive/img/testimonial-pankil.png' }
		},
		{
			quote:
				'Working at Lumotive combines the best engineering experiences in my career all in one place: collaboration with brilliant, motivated colleagues; empowerment to define top priorities for success and tools to achieve them; and opportunities to innovate trailblazing technology.',
			author: 'Linda',
			role: 'Team Engineering - Redmond, WA.',
			avatar: { kind: 'url', value: '/lumotive/img/testimonial-linda.jpg' }
		}
	]
}

const readSections = (record) => {
	try {
		const raw = record.getString('sections')
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const findCulturePage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'culture' })
	} catch {
		return null
	}
}

migrate(
	(app) => {
		const record = findCulturePage(app)
		if (!record) return

		const sections = readSections(record)
		if (sections.some((entry) => entry && entry.id === SECTION_ID)) return

		const cta = sections.findIndex((entry) => entry && entry.id === CTA_SECTION_ID)
		if (cta === -1) return

		sections.splice(cta, 0, TESTIMONIALS_SECTION)
		record.set('sections', sections)
		app.save(record)
	},
	(app) => {
		const record = findCulturePage(app)
		if (!record) return

		const sections = readSections(record)
		if (!sections.some((entry) => entry && entry.id === SECTION_ID)) return

		record.set(
			'sections',
			sections.filter((entry) => !entry || entry.id !== SECTION_ID)
		)
		app.save(record)
	}
)
