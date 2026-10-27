// Mobile spacing follow-up to the live-site review. Phones only on /sense;
// /platform's two former peel sections get flow spacing.
//
// /sense, measured at 390px: two `md` paddings (80 + 80) stacked between
// sections, plus the next eyebrow's margin, left 172px after the Poor
// Adaptability card, 189px after "The result: robots and vehicles…" and
// 172px after the Smart Infrastructure & Surveillance card. Only the two
// edges that meet at each of those transitions take `md-compact-phone`:
// 2.5rem a side on phones with the outermost margins dropped; 768px and up
// keep `md` exactly.
//
// /platform: "Groundbreaking Physics Meets Mature Manufacturing" and "Light
// Control Metasurface™ Optical Beamforming Technology" no longer ride in a
// PeelScene, whose panel supplied their padding from 768px up (they were
// stored none/none). In flow they take `md-compact-phone` a side: the same
// 5rem from 768px up, and 2.5rem on phones, which also keeps the band's
// heading off its top edge on the shortest phones.
//
// Each value changes only from its expected prior value; down restores it
// only from the new value.
const CHANGES = {
	sense: [
		['9d8fe777', 'spacingBottom', 'md', 'md-compact-phone'], // The problem
		['bb989678', 'spacingTop', 'md', 'md-compact-phone'], // The answer
		['bb989678', 'spacingBottom', 'md', 'md-compact-phone'],
		['a1d7c40e', 'spacingTop', 'md', 'md-compact-phone'], // Sensing for robots and vehicles
		['2a6b5ed9', 'spacingBottom', 'md', 'md-compact-phone'], // Applications
		['c83f1b77', 'spacingTop', 'md', 'md-compact-phone'] // Start building
	],
	platform: [
		['ace8d391', 'spacingTop', 'none', 'md-compact-phone'], // Groundbreaking physics…
		['ace8d391', 'spacingBottom', 'none', 'md-compact-phone'],
		['fbe8b045', 'spacingTop', 'none', 'md-compact-phone'], // Optical beamforming band
		['fbe8b045', 'spacingBottom', 'none', 'md-compact-phone']
	]
}

const apply = (app, forward) => {
	for (const [slug, changes] of Object.entries(CHANGES)) {
		let record
		try {
			record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug })
		} catch {
			continue
		}
		let sections
		try {
			sections = JSON.parse(record.getString('sections') || '[]')
		} catch {
			continue
		}
		if (!Array.isArray(sections)) continue
		let changed = false
		for (const [id, key, before, after] of changes) {
			const section = sections.find((entry) => entry && entry.id === id)
			if (!section) continue
			const [from, to] = forward ? [before, after] : [after, before]
			if (section[key] !== from) continue
			section[key] = to
			changed = true
		}
		if (!changed) continue
		record.set('sections', sections)
		app.save(record)
	}
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
