// Vibe annotation: drop the live Lever open-roles list from /culture; the hero
// and closing CTA still link to the Lever board.
const OPEN_ROLES = {
	align: 'container',
	anchor: 'open-roles',
	background: 'none',
	designVersion: 'openRoles',
	heading: 'Open roles',
	id: 'c0a74e31',
	linkLabel: 'See all open roles',
	linkUrl: 'https://jobs.lever.co/lumotive',
	spacingBottom: 'md',
	spacingTop: 'md',
	type: 'openRoles',
	width: 'contained'
}

const updateCulture = (app, edit) => {
	const page = app.findFirstRecordByFilter('pages', 'slug = "culture"')
	page.set('sections', edit(JSON.parse(page.getString('sections') || '[]')))
	app.save(page)
}

migrate(
	(app) => updateCulture(app, (sections) => sections.filter((s) => s.id !== OPEN_ROLES.id)),
	(app) =>
		updateCulture(app, (sections) => {
			if (sections.some((s) => s.id === OPEN_ROLES.id)) return sections
			const cta = sections.findIndex((s) => s.id === '8c3ed872')
			sections.splice(cta < 0 ? sections.length : cta, 0, OPEN_ROLES)
			return sections
		})
)
