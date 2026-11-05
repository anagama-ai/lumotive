// Vibe annotations: zoom the home sensing card, use tightly cropped chip cutouts and
// textured hero, and include the current dev-kit pages in the footer.
const KIT_LINKS = [
	['Transmit modules', '/dev-kits/transmit-modules'],
	['iToF dev kits', '/dev-kits/itof'],
	['dToF dev kits', '/dev-kits/dtof']
]

const updatePage = (app, slug, edit) => {
	const page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug })
	const sections = JSON.parse(page.getString('sections') || '[]')
	edit(sections)
	page.set('sections', sections)
	app.save(page)
}

const apply = (app, forward) => {
	updatePage(app, 'home', (sections) => {
		const card = sections.find((s) => s.id === '677cf547')?.cards?.find((c) => c.title === '3D Sensing')
		if (!card) return
		if (forward) card.imageZoom = 'true'
		else if (card.imageZoom === 'true') delete card.imageZoom
	})
	updatePage(app, 'lcm-chips', (sections) => {
		const swaps = [
			['/lumotive/img/lcm-platform-chip.jpg', '/lumotive/img/lcm-ls20-chip-crop.png'],
			['/lumotive/img/platform-lm10.webp', '/lumotive/img/lcm-lm10-chip-crop.webp'],
			['/lumotive/img/platform-ls20.webp', '/lumotive/img/lcm-ls20-hero.webp']
		]
		for (const section of sections) {
			for (const item of [section, ...(section.cards || [])]) {
				for (const [before, after] of swaps) {
					if (item.media?.value === (forward ? before : after)) item.media.value = forward ? after : before
				}
			}
		}
	})
	const footer = app.findFirstRecordByFilter('globals', 'key = "footer"')
	const data = JSON.parse(footer.getString('data') || '{}')
	const sense = data.navItems?.find((group) => group.title === 'Sense')
	if (!sense) return
	for (const [label, url] of KIT_LINKS) {
		if (forward) {
			if (!sense.subNavItems.some((item) => item.link?.url === url)) {
				const item = { link: { label, url, newTab: false, type: 'custom' }, linkLabel: label, linkUrl: url, linkNewTab: false }
				const overview = sense.subNavItems.findIndex((entry) => entry.link?.url === '/dev-kits')
				sense.subNavItems.splice(overview + 1 + KIT_LINKS.findIndex((entry) => entry[1] === url), 0, item)
			}
		} else {
			sense.subNavItems = sense.subNavItems.filter((item) => item.link?.url !== url || item.link?.label !== label)
		}
	}
	footer.set('data', data)
	app.save(footer)
}

migrate((app) => apply(app, true), (app) => apply(app, false))
