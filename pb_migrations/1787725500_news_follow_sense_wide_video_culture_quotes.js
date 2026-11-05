// /news gains a CMS page (path "news") whose sections render under the feed,
// starting with the follow block. /sense's dynamic-range video takes 2/3 of
// its row, and the /culture quotes drop to the small section spacing.
const FOLLOW = {
	id: 'a9f3c1e2',
	type: 'ctaDefault',
	designVersion: 'default',
	align: 'container',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'lg',
	heading: 'Stay up to date',
	body: '<p>Follow Lumotive for news, research, and openings.</p>',
	primaryLink: { label: 'Follow Lumotive on LinkedIn', newTab: true, type: 'custom', url: 'https://www.linkedin.com/company/lumotive/' },
	primaryLinkLabel: 'Follow Lumotive on LinkedIn',
	primaryLinkNewTab: 'true',
	primaryLinkUrl: 'https://www.linkedin.com/company/lumotive/',
}

const patch = (app, path, id, values) => {
	const page = app.findFirstRecordByFilter('pages', 'path = {:path}', { path })
	const sections = JSON.parse(page.getString('sections') || '[]')
	Object.assign(sections.find((s) => s.id === id), values)
	page.set('sections', sections)
	app.save(page)
}

migrate(
	(app) => {
		const page = new Record(app.findCollectionByNameOrId('pages'))
		page.set('path', 'news')
		page.set('slug', 'news')
		page.set('title', 'News and Events')
		page.set('status', 'published')
		page.set('sections', [FOLLOW])
		app.save(page)
		patch(app, 'sense', 'f52b9a16', { mediaSpan: 'wide' })
		patch(app, 'culture', 'b4a91c73', { spacingTop: 'sm', spacingBottom: 'sm' })
	},
	(app) => {
		app.delete(app.findFirstRecordByFilter('pages', 'path = "news"'))
		patch(app, 'sense', 'f52b9a16', { mediaSpan: '' })
		patch(app, 'culture', 'b4a91c73', { spacingTop: 'md', spacingBottom: 'md' })
	},
)
