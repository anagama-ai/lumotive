// Platform hero: copy on the left and the Vimeo player on the right.
// The full prior section is retained so rollback restores the exact content.
const BEFORE = {
	"align": "container",
	"anchor": "",
	"background": "none",
	"body": "<p>Software-defined light control, built on optical semiconductor technology.</p>",
	"designVersion": "band",
	"eyebrow": "Light Control Metasurface™",
	"heading": "The LCM™ programmable optics platform",
	"id": "a85debcc",
	"media": {
		"kind": "url",
		"value": "/lumotive/img/hero-platform.jpg"
	},
	"mobileShade": "strong",
	"primaryLink": {
		"label": "Talk to our team",
		"newTab": false,
		"type": "custom",
		"url": "/contact"
	},
	"primaryLinkLabel": "Talk to our team",
	"primaryLinkNewTab": false,
	"primaryLinkUrl": "/contact",
	"secondaryLink": {
		"label": "See how it works",
		"newTab": false,
		"type": "custom",
		"url": "#paradigm"
	},
	"secondaryLinkLabel": "See how it works",
	"secondaryLinkNewTab": false,
	"secondaryLinkUrl": "#paradigm",
	"spacingBottom": "none",
	"spacingTop": "none",
	"type": "heroBand",
	"width": "contained"
}
const AFTER = { ...BEFORE, type: 'heroSplit', videoUrl: 'https://vimeo.com/1040214357' }

// Compare object content independent of PocketBase's JSON key ordering.
const canonical = (value) => {
	if (Array.isArray(value)) return value.map(canonical)
	if (!value || typeof value !== 'object') return value
	const result = {}
	for (const key of Object.keys(value).sort()) result[key] = canonical(value[key])
	return result
}

const apply = (app, forward) => {
	let page
	try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) }
	catch { return }
	let sections
	try { sections = JSON.parse(page.getString('sections') || '[]') }
	catch { return }
	if (!Array.isArray(sections)) return
	const index = sections.findIndex((section) => section && section.id === BEFORE.id)
	if (index < 0) return
	const [from, to] = forward ? [BEFORE, AFTER] : [AFTER, BEFORE]
	if (JSON.stringify(canonical(sections[index])) !== JSON.stringify(canonical(from))) return
	sections[index] = JSON.parse(JSON.stringify(to))
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => apply(app, true),
	(app) => apply(app, false)
)
