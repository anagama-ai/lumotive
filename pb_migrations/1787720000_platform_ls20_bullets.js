// /platform: render the LS20 card's three specifications as a semantic list.
const apply = (app, forward) => {
 let page
 try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'platform' }) } catch { return }
 const sections = JSON.parse(page.getString('sections') || '[]')
 const section = sections.find((s) => s && s.id === 'c0a71d35')
 const card = section && Array.isArray(section.cards) && section.cards.find((c) => c && c.title === 'LS20')
 if (!card || typeof card.body !== 'string') return
 const paragraphs = '<p>System-on-chip with integrated ASIC driver and scan controller</p><p>160° native steering, 0.1° steps</p><p>Automotive, industrial, robotics, IoT, smart infrastructure</p>'
 const bullets = '<ul>' + paragraphs.replace(/<p>/g, '<li>').replace(/<\/p>/g, '</li>') + '</ul>'
 if (card.body !== (forward ? paragraphs : bullets)) return
 card.body = forward ? bullets : paragraphs
 page.set('sections', sections)
 app.save(page)
}
migrate((app) => apply(app, true), (app) => apply(app, false))
