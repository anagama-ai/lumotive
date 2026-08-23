// Run: node --experimental-strip-types src/lib/titlecase.test.ts
import assert from 'node:assert/strict';

import { titleCase } from './titlecase.ts';

assert.equal(
	titleCase('One platform for everything that moves light.'),
	'One Platform for Everything That Moves Light.'
);

assert.equal(
	titleCase('One chip. And boundless reach for'),
	'One Chip. And Boundless Reach For'
);

assert.equal(
	titleCase('3D sensing with the LM10 and iToF'),
	'3D Sensing With the LM10 and iToF'
);

assert.equal(titleCase('solid-state beam steering'), 'Solid-State Beam Steering');

assert.equal(titleCase(''), '');
assert.equal(titleCase(null), null);
