// /dev-kits/dtof: one grid for NM120 specs and feature cards, with uniform gaps.
const ORIGINAL = {"align": "container", "anchor": "nm120-specs", "background": "none", "designVersion": "specTiles", "id": "6b28ce41", "spacingBottom": "none", "spacingTop": "sm", "stats": [{"description": "32 m at 10%", "label": "Range", "value": "72 m"}, {"description": "", "label": "Field of view", "value": "120° × 90°"}, {"description": "", "label": "Pixels", "value": "256 × 192"}, {"description": "900 Hz in ROIs", "label": "Frame rate", "value": "30 Hz full frame"}], "type": "statsLightTraits", "width": "contained"}
const FEATURES = {"align": "container", "anchor": "", "background": "none", "cards": [{"accent": "accent1", "body": "<p>72 m, with 32 m to a 10% target.</p>", "title": "Outdoor range"}, {"accent": "accent2", "body": "<p>ROIs at up to 900 Hz.</p>", "title": "Fast where it matters"}, {"accent": "accent3", "body": "<p>Bright and dark targets in one scan.</p>", "title": "HDR without losing frame rate"}, {"accent": "accent1", "body": "<p>New capabilities, such as HDR, near-range accuracy, and interference reduction, arrive as software updates.</p>", "title": "Software keeps improving it"}], "casing": "exact", "columns": "4", "designVersion": "textCards", "id": "2f74a0db", "spacingBottom": "sm", "spacingTop": "none", "type": "cardsTextCards", "width": "contained"}
const MERGED = [{"description": "32 m at 10%", "label": "Range", "value": "72 m"}, {"description": "", "label": "Field of view", "value": "120° × 90°"}, {"description": "", "label": "Pixels", "value": "256 × 192"}, {"description": "900 Hz in ROIs", "label": "Frame rate", "value": "30 Hz full frame"}, {"label": "Outdoor range", "body": "<p>72 m, with 32 m to a 10% target.</p>"}, {"label": "Fast where it matters", "body": "<p>ROIs at up to 900 Hz.</p>"}, {"label": "HDR without losing frame rate", "body": "<p>Bright and dark targets in one scan.</p>"}, {"label": "Software keeps improving it", "body": "<p>New capabilities, such as HDR, near-range accuracy, and interference reduction, arrive as software updates.</p>"}]
const apply = (app, forward) => {
 let page
 try { page = app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'dtof' }) } catch { return }
 const sections = JSON.parse(page.getString('sections') || '[]')
 const grid = sections.find((s) => s && s.id === ORIGINAL.id)
 const index = sections.findIndex((s) => s && s.id === FEATURES.id)
 if (!grid) return
 if (forward) {
  if (index < 0 || JSON.stringify(grid.stats) !== JSON.stringify(ORIGINAL.stats)) return
  grid.stats = MERGED
  grid.columns = '4'
  grid.spacingBottom = FEATURES.spacingBottom
  sections.splice(index, 1)
 } else {
  if (index >= 0 || JSON.stringify(grid.stats) !== JSON.stringify(MERGED)) return
  grid.stats = ORIGINAL.stats
  grid.spacingBottom = ORIGINAL.spacingBottom
  if (ORIGINAL.columns === undefined) delete grid.columns
  else grid.columns = ORIGINAL.columns
  sections.splice(sections.indexOf(grid) + 1, 0, FEATURES)
 }
 page.set('sections', sections)
 app.save(page)
}
migrate((app) => apply(app, true), (app) => apply(app, false))
