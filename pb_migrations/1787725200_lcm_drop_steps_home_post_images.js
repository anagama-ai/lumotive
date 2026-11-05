/// <reference path="../pb_data/types.d.ts" />
function edit(app, path, id, patch) {
	const page = app.findFirstRecordByFilter('pages', 'path = {:path}', { path });
	const sections = JSON.parse(page.getString('sections') || '[]');
	const section = sections.find((s) => s.id === id);
	Object.assign(section, patch);
	page.set('sections', sections);
	app.save(page);
}
const LCM = ['lcm-chips', '9f08c3d6'];
const HOME = ['home', 'e7b40d12'];
const ORIGINAL = {"cards": [{"accent": "accent1", "body": "<p>edge emitter or VCSEL</p>", "eyebrow": "1", "title": "Laser"}, {"accent": "accent2", "body": "<p>directs the beam to any angle, electronically</p>", "eyebrow": "2", "title": "LCM beamforming"}, {"accent": "accent3", "body": "<p>set the field of view</p>", "eyebrow": "3", "title": "Transmit optics"}, {"accent": "accent1", "body": "<p>read out only the illuminated ROI</p>", "eyebrow": "4", "title": "ToF sensor and receive lens"}], "note": "The field of view is illuminated in discrete regions of interest (ROIs).", "outro": "Every scan is a sequence you program: which angle, for how long, how wide, and in what order."};
migrate(
	(app) => {
		edit(app, ...LCM, { cards: [], note: '', outro: '' });
		edit(app, ...HOME, { hideImages: 'true' });
	},
	(app) => {
		edit(app, ...LCM, ORIGINAL);
		edit(app, ...HOME, { hideImages: '' });
	}
);
