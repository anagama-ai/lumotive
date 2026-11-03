import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

const source = readFileSync(new URL('../pb_migrations/1787723100_about_wafer_image.js', import.meta.url), 'utf8');
const original = [
	{ id: 'other', type: 'splitDefault', media: { kind: 'url', value: 'untouched.webp' } },
	{ id: '4e30aac9', type: 'splitDefault', heading: 'Keep this', media: { kind: 'url', value: '/lumotive/img/lm10-metasurface-module.webp' } }
];
const fixture = (sections = original) => {
	let stored = JSON.stringify(sections);
	let saves = 0;
	let up, down;
	const record = { getString: () => stored, set: (key, value) => { assert.equal(key, 'sections'); stored = JSON.stringify(value); } };
	const app = {
		findFirstRecordByFilter: (collection, filter, params) => {
			assert.equal(collection, 'pages');
			assert.equal(filter, 'slug = {:slug}');
			assert.equal(params.slug, 'about');
			return record;
		},
		save: () => saves++
	};
	runInNewContext(source, { migrate: (forward, reverse) => { up = forward; down = reverse; } });
	return { up: () => up(app), down: () => down(app), read: () => JSON.parse(stored), saves: () => saves };
};

test('updates only the story media, repeats safely, and rolls back exactly', () => {
	const f = fixture();
	f.up();
	const expected = structuredClone(original);
	Object.assign(expected[1], { mediaAlt: 'Lumotive LCM wafer', mediaWidth: 1600, mediaHeight: 900 });
	expected[1].media.value = '/lumotive/img/lumotive-lcm-wafer.webp';
	assert.deepEqual(f.read(), expected);
	f.up();
	assert.equal(f.saves(), 1);
	f.down();
	assert.deepEqual(f.read(), original);
	f.down();
	assert.equal(f.saves(), 2);
});

test('preserves changed images and CMS metadata', () => {
	for (const edit of [{ mediaAlt: 'Custom alt' }, { mediaWidth: 1200 }, { mediaHeight: 800 }, { media: { kind: 'url', value: 'custom.webp' } }, { type: 'heroSplit' }]) {
		const sections = structuredClone(original);
		Object.assign(sections[1], edit);
		const f = fixture(sections);
		f.up();
		assert.deepEqual(f.read(), sections);
		assert.equal(f.saves(), 0);
	}
});


test('accepts empty and whitespace-only alt text with unset dimensions', () => {
	for (const mediaAlt of ['', '  \t ', null, undefined]) {
		for (const dimension of ['', null, undefined]) {
			const sections = structuredClone(original);
			Object.assign(sections[1], { mediaAlt, mediaWidth: dimension, mediaHeight: dimension });
			const f = fixture(sections);
			f.up();
			assert.equal(f.saves(), 1);
			assert.equal(f.read()[1].mediaAlt, 'Lumotive LCM wafer');
			assert.equal(f.read()[1].mediaWidth, 1600);
			assert.equal(f.read()[1].mediaHeight, 900);
			f.up();
			assert.equal(f.saves(), 1);
		}
	}
});
