// /dev-kits: TX10 occupies one cell of a three-column grid, like the iToF row.
const apply = (app, from, to) => {
 let page
 try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dev-kits' }) } catch { return }
 const sections = JSON.parse(page.getString('sections') || '[]')
 const section = sections.find((s) => s && s.id === '2c84f7a1')
 if (!section || String(section.columns) !== from) return
 section.columns = to
 page.set('sections', sections)
 app.save(page)
}
migrate((app) => apply(app, '1', '3'), (app) => apply(app, '3', '1'))
