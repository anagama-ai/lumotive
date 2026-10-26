// About mobile portraits: equal 20rem frames below 768px, individual focal
// points and tighter caption rhythm. No source images, copy or links change.
const SECTION_IDS = ['f9d1f9ab', '7d5fdafa']
const POSITIONS = {
	'Sam Heidari, Ph.D.': '50% 30%',
	'Gleb Akselrod, Ph.D.': '50% 35%',
	'Apurva Jain, Ph.D.': '50% 30%',
	'Clement Kong': '50% 40%',
	'Rakinder Grover': '50% 26%',
	'Diane Krzysik': '50% 34%',
	'Axel Fuchs, Ph.D.': '50% 34%',
	'Sajid Husain': '50% 40%',
	'Larry Zhao, Ph.D.': '50% 36%',
	'Conrad Burke': '50% 22%',
	'Jim Anderson': '50% 22%'
}

const apply = (app, forward) => {
	let record
	try { record = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'about' }) } catch { return }
	let sections
	try { sections = JSON.parse(record.getString('sections') || '[]') } catch { return }
	if (!Array.isArray(sections)) return
	let changed = false
	const update = (target, key, value) => {
		if (forward && target[key] === undefined) {
			target[key] = value
			changed = true
		} else if (!forward && target[key] === value) {
			delete target[key]
			changed = true
		}
	}
	for (const section of sections) {
		if (!section || !SECTION_IDS.includes(section.id) || section.type !== 'cardsTeamCards') continue
		update(section, 'compactMobile', true)
		for (const member of Array.isArray(section.cards) ? section.cards : []) {
			if (member && POSITIONS[member.name]) update(member, 'mobileHeadshotPosition', POSITIONS[member.name])
		}
	}
	if (!changed) return
	record.set('sections', sections)
	app.save(record)
}

migrate((app) => apply(app, true), (app) => apply(app, false))
