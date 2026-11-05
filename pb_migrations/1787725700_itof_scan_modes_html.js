// /dev-kits/itof: the scan-mode diagram is drawn from editable data instead of
// a flattened image, so it reflows on narrow screens.
const ID = '7f50b3ec'
const spec = (frameRate, resolution, maxRange, maxUnit = 'm') => [
	{ label: 'Frame rate', value: frameRate, unit: 'Hz' },
	{ label: 'Resolution', value: resolution, unit: '' },
	{ label: 'Max range', value: maxRange, unit: maxUnit },
]
const MODES = [
	{ name: 'Balanced', kind: 'Uniform scan', range: '4.5', rangeLabel: '4.5 m', specs: spec('13', 'VGA', '30') },
	{ name: 'High frame rate', kind: 'Uniform scan', range: '2.5', rangeLabel: '2.5 m', specs: spec('47', 'VGA', '30') },
	{ name: 'Max range', kind: 'Uniform scan', range: '7', rangeLabel: '7 m', specs: spec('17', 'QVGA', '30') },
	{ name: 'AMR mode', kind: 'Wide field plus long-range center', range: '3', rangeLabel: '3 m', sliceRange: '10', sliceAngle: '6', sliceLabel: '10 m*', sliceNote: '6° center slice', specs: spec('30', 'QVGA', '30') },
	{ name: 'Object interaction', kind: 'Uniform scan', range: '0.9', rangeLabel: 'Very short range', rangeNote: 'Not yet measured', specs: spec('15', '1.2 MP', '~5') },
]
const FIELDS = { scanModes: MODES, scanFov: '105', scanGuideRange: '5', scanFootnote: 'All modes scan 105° horizontally (±52.5°). Diagrams share one distance scale.\n*Preliminary' }
const IMAGE = ['media', 'mediaAlt', 'mediaMinWidth', 'mediaHint']

const apply = (app, forward) => {
	const page = app.findFirstRecordByFilter('pages', 'path = "dev-kits/itof"')
	const sections = JSON.parse(page.getString('sections') || '[]')
	const section = sections.find((s) => s.id === ID)
	if (forward) {
		for (const key of IMAGE) delete section[key]
		Object.assign(section, FIELDS)
	} else {
		for (const key of Object.keys(FIELDS)) delete section[key]
		Object.assign(section, {
			media: { kind: 'url', value: '/lumotive/img/itof-scan-modes.webp' },
			mediaAlt: 'Top-down scan diagrams of the five modes on one distance scale, each scanning 105° horizontally: Balanced to 4.5 m, High frame rate to 2.5 m, Max range to 7 m, AMR mode with a 3 m wide field plus a 6° center slice to 10 m, and Object interaction at very short range.',
			mediaMinWidth: '75rem',
			mediaHint: 'Scroll sideways to see all five modes.',
		})
	}
	page.set('sections', sections)
	app.save(page)
}

migrate((app) => apply(app, true), (app) => apply(app, false))
