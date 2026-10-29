// /platform: turn the LM10 card's three paragraphs into bullets.
const apply = (app, forward) => {
 let page
 try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) } catch { return }
 const sections = JSON.parse(page.getString('sections') || '[]')
 const section = sections.find((s) => s && s.id === 'c0a71d35')
 const card = section && Array.isArray(section.cards) && section.cards.find((c) => c && c.title === 'LM10')
 if (!card || typeof card.body !== 'string') return
 if (forward) {
  if (!/^<p>[^]*<\/p>$/.test(card.body) || (card.body.match(/<p>/g) || []).length !== 3) return
  card.body = '<ul>' + card.body.replace(/<p>/g, '<li>').replace(/<\/p>/g, '</li>') + '</ul>'
 } else {
  if (!card.body.startsWith('<ul><li>') || (card.body.match(/<li>/g) || []).length !== 3) return
  card.body = card.body.slice(4, -5).replace(/<li>/g, '<p>').replace(/<\/li>/g, '</p>')
 }
 page.set('sections', sections)
 app.save(page)
}
migrate((app) => apply(app, true), (app) => apply(app, false))
