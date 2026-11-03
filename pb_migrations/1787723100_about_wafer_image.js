// /about's story image is a static URL in PocketBase sections, not an upload.
const OLD_IMAGE = '/lumotive/img/lm10-metasurface-module.webp'
const NEW_IMAGE = '/lumotive/img/lumotive-lcm-wafer.webp'
const ALT = 'Lumotive LCM wafer'

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'about' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const section = sections.find((entry) => entry && entry.id === '4e30aac9' && entry.type === 'splitDefault')
	if (!section || section.media?.kind !== 'url') return
	if (section.media.value !== (forward ? OLD_IMAGE : NEW_IMAGE)) return
	// Preserve any CMS edits to the image metadata rather than overwrite them.
	if (forward) {
		if (section.mediaAlt != null || section.mediaWidth != null || section.mediaHeight != null) return
		section.media.value = NEW_IMAGE
		section.mediaAlt = ALT
		section.mediaWidth = 1600
		section.mediaHeight = 900
	} else {
		if (section.mediaAlt !== ALT || section.mediaWidth !== 1600 || section.mediaHeight !== 900) return
		section.media.value = OLD_IMAGE
		delete section.mediaAlt
		delete section.mediaWidth
		delete section.mediaHeight
	}
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
