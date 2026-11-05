import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';

test('vibe content changes are scoped, repeatable, and reversible', () => {
	const original = {
		home: [{ id: '677cf547', cards: [{ title: '3D Sensing' }, { title: 'Defense' }] }],
		'lcm-chips': [{ media: { value: '/lumotive/img/platform-ls20.webp' } }, { cards: [{ media: { value: '/lumotive/img/lcm-platform-chip.jpg' } }] }],
		footer: { copyright: 'Keep', navItems: [{ title: 'Sense', subNavItems: [{ link: { url: '/sense' } }, { link: { url: '/dev-kits' } }] }] }
	};
	const data = structuredClone(original);
	let up, down;
	runInNewContext(readFileSync(new URL('../pb_migrations/1787723300_home_chips_footer_vibe.js', import.meta.url), 'utf8'), {
		migrate: (forward, reverse) => { up = forward; down = reverse; }
	});
	const app = {
		findFirstRecordByFilter: (collection, filter, params) => {
			const key = collection === 'pages' ? params.slug : 'footer';
			return { getString: () => JSON.stringify(data[key]), set: (_, value) => { data[key] = JSON.parse(JSON.stringify(value)); } };
		},
		save: () => {}
	};
	up(app);
	assert.equal(data.home[0].cards[0].imageZoom, 'true');
	assert.deepEqual(data.home[0].cards[1], original.home[0].cards[1]);
	assert.equal(data['lcm-chips'][0].media.value, '/lumotive/img/lcm-ls20-hero.webp');
	assert.equal(data['lcm-chips'][1].cards[0].media.value, '/lumotive/img/lcm-ls20-chip-crop.png');
	assert.deepEqual(data.footer.navItems[0].subNavItems.map((i) => i.link.url), ['/sense', '/dev-kits', '/dev-kits/transmit-modules', '/dev-kits/itof', '/dev-kits/dtof']);
	const updated = structuredClone(data);
	up(app);
	assert.deepEqual(data, updated);
	down(app);
	assert.deepEqual(data, original);
});
