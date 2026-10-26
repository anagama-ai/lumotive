// Site-wide terminology. Claudia has confirmed that the combination phrase
// "beam steering" becomes "beamforming" across the site. Page 14 was renamed
// when it shipped; this is the rest.
//
// The rename is a phrase substitution, not a word one. "steer", "steered" and
// a standalone "steering" are legitimate and stay: "160° native steering",
// "90° steering", "mechanical steering" on the traditional-optics comparison,
// "steering range", "Steering-direction divergence" and the "Steer" capability
// card are all untouched. Only the two-word phrase is rewritten, and its case
// is preserved, so "Beam steering module" becomes "Beamforming module" and
// "LCM beam steering chips" becomes "LCM beamforming chips".
//
// Fourteen strings across six pages, including the two meta descriptions the
// audit found, which the rendered-page sweep could not see:
//
//   /about                      one leadership biography
//   /platform                   the programmable-functions list, the LM10 card
//   /applications               the optical communications card
//   /sense                      the Start Building transmit-module card
//   /lcm-chips                  hero heading and body, two cards, one spec
//                               line, and seoDescription
//   /dev-kits                   the "Skip the beam steering design" card title
//   /dev-kits/transmit-modules  hero body (twice) and seoDescription
//
// TWO OCCURRENCES ARE DELIBERATELY LEFT, both on /platform:
//
//   1. The media value /lumotive/video/beam-steering.mp4. That is a file path,
//      not copy. Renaming the string would break the reference, and renaming
//      the asset is not part of a terminology pass.
//   2. "Digital beam steering, enabled by optical beamforming with Lumotive
//      LCMs, lights the way for the future of lidar and 3D sensing." A
//      mechanical substitution reads "Digital beamforming, enabled by optical
//      beamforming", which is worse than what it replaces. Fixing it properly
//      means rewriting the clause, which is Claudia's call and not a rename.
//      Flagged for her rather than guessed at.
//
// The approved package itself still prints "beam steering" in several of these
// places; Claudia's instruction supersedes it, which is why the printed copy
// and the live copy now differ on this phrase alone.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.

// Each edit names its page, the exact string before, and the string after, so
// the down path is the same list read the other way and nothing is matched by
// a loose pattern.
const EDITS = [
	{
		path: 'about',
		before: 'two-dimensional beam steering technologies',
		after: 'two-dimensional beamforming technologies'
	},
	{
		path: 'platform',
		before: 'Programmable Functions — Beam steering, lensing',
		after: 'Programmable Functions — Beamforming, lensing'
	},
	// No angle brackets in this pair: `getString` hands back the stored JSON,
	// where "<" is escaped as \u003c, so a match written as "<p>…</p>" never
	// fires. The text alone is unique on this page.
	{ path: 'platform', before: 'Beam steering module', after: 'Beamforming module' },
	{
		path: 'applications',
		before: 'Beam steering for satellite, airborne, and terrestrial links.',
		after: 'Beamforming for satellite, airborne, and terrestrial links.'
	},
	{
		path: 'sense',
		before: 'Add LCM beam steering to your own sensor design.',
		after: 'Add LCM beamforming to your own sensor design.'
	},
	{
		path: 'lcm-chips',
		before: 'LCM beam steering chips',
		after: 'LCM beamforming chips'
	},
	{
		path: 'lcm-chips',
		before: 'Solid-state beam steering on a semiconductor.',
		after: 'Solid-state beamforming on a semiconductor.'
	},
	{
		path: 'lcm-chips',
		before: 'Architecture: Beam steering module,',
		after: 'Architecture: Beamforming module,'
	},
	{ path: 'lcm-chips', before: 'LCM beam steering', after: 'LCM beamforming' },
	{
		path: 'lcm-chips',
		before: 'Add LCM beam steering to your own sensor design.',
		after: 'Add LCM beamforming to your own sensor design.'
	},
	{
		path: 'dev-kits',
		before: 'Skip the beam steering design',
		after: 'Skip the beamforming design'
	},
	{
		path: 'dev-kits/transmit-modules',
		before: 'Software-defined beam steering for the longest-range iToF sensors.',
		after: 'Software-defined beamforming for the longest-range iToF sensors.'
	},
	{
		path: 'dev-kits/transmit-modules',
		before: 'without designing custom beam steering hardware.',
		after: 'without designing custom beamforming hardware.'
	}
]

// The two meta descriptions carry the same sentence as their hero, so they are
// rewritten with the same pair rather than a second rule.
const SEO = [
	{
		path: 'lcm-chips',
		before: 'Solid-state beam steering on a semiconductor.',
		after: 'Solid-state beamforming on a semiconductor.'
	},
	{
		path: 'dev-kits/transmit-modules',
		before: 'Software-defined beam steering for the longest-range iToF sensors.',
		after: 'Software-defined beamforming for the longest-range iToF sensors.'
	}
]

const paths = () => {
	const seen = []
	for (const edit of EDITS.concat(SEO)) if (!seen.includes(edit.path)) seen.push(edit.path)
	return seen
}

const apply = (app, forward) => {
	for (const path of paths()) {
		let record
		try {
			record = app.findFirstRecordByFilter('pages', 'path = {:path}', { path })
		} catch {
			continue
		}
		if (!record) continue

		let sections = record.getString('sections') || ''
		for (const edit of EDITS) {
			if (edit.path !== path) continue
			const from = forward ? edit.before : edit.after
			const to = forward ? edit.after : edit.before
			sections = sections.split(from).join(to)
		}

		let description = record.getString('seoDescription') || ''
		for (const edit of SEO) {
			if (edit.path !== path) continue
			const from = forward ? edit.before : edit.after
			const to = forward ? edit.after : edit.before
			description = description.split(from).join(to)
		}

		try {
			record.set('sections', JSON.parse(sections))
		} catch {
			continue
		}
		record.set('seoDescription', description)
		app.save(record)
	}
}

migrate(
	(app) => {
		apply(app, true)
	},
	(app) => {
		apply(app, false)
	}
)
