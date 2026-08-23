// Self-check for the section-editor data layer. No test framework, no @types/node.
// Run: node --experimental-strip-types src/lib/components/admin/fields.test.ts
import { blankSection, sectionSpecs, type FieldSpec } from '../../sections.ts';
import { fill, move } from './fields.ts';

function eq(actual: unknown, expected: unknown, what: string) {
	const a = JSON.stringify(actual);
	const b = JSON.stringify(expected);
	if (a !== b) throw new Error(`${what}\n  expected ${b}\n  actual   ${a}`);
}

// 1. Missing values are seeded, unknown keys dropped, real values kept.
const spec: FieldSpec[] = [
	{ name: 'heading', label: 'Heading', type: 'text' },
	{
		name: 'items',
		label: 'Cards',
		type: 'list',
		fields: [{ name: 'title', label: 'T', type: 'text' }]
	}
];

eq(fill(spec), { heading: '', items: [] }, 'blank fill');
eq(fill(spec, { heading: 'Hi', junk: 'x' }), { heading: 'Hi', items: [] }, 'unknown key dropped');
eq(
	fill(spec, { items: [{ title: 'A', junk: 1 }, {}] }),
	{ heading: '', items: [{ title: 'A' }, { title: '' }] },
	'list rows shaped'
);

// 2. Malformed stored data degrades instead of throwing.
eq(fill(spec, { heading: 42, items: 'nope' }), { heading: '', items: [] }, 'wrong types');
eq(fill(spec, { items: [null] }), { heading: '', items: [{ title: '' }] }, 'null row');

// 3. Nested lists recurse.
const nested: FieldSpec[] = [
	{
		name: 'groups',
		label: 'Groups',
		type: 'list',
		fields: [
			{ name: 'rows', label: 'Rows', type: 'list', fields: [{ name: 'v', label: 'V', type: 'text' }] }
		]
	}
];
eq(
	fill(nested, { groups: [{ rows: [{ v: 'x' }] }] }),
	{ groups: [{ rows: [{ v: 'x' }] }] },
	'nested list'
);

// 4. move() swaps neighbours and is a no-op at the ends.
const arr = ['a', 'b', 'c'];
move(arr, 0, 1);
eq(arr, ['b', 'a', 'c'], 'move down');
move(arr, 0, -1);
eq(arr, ['b', 'a', 'c'], 'move up at top is a no-op');
move(arr, 2, 1);
eq(arr, ['b', 'a', 'c'], 'move down at bottom is a no-op');
move(arr, 2, -1);
eq(arr, ['b', 'c', 'a'], 'move up');

// 5. Every registered section type round-trips through blank -> fill unchanged.
for (const [type, s] of Object.entries(sectionSpecs)) {
	const blank = blankSection(type) as Record<string, unknown>;
	if (blank.type !== type) throw new Error(`${type}: wrong type on blank section`);
	if (String(blank.id).length !== 8) throw new Error(`${type}: id is not 8 characters`);
	eq(fill(s.fields, blank), fill(s.fields), `${type} blank is not spec-shaped`);
}

// 6. A section type the admin has never heard of needs no admin changes.
const invented: FieldSpec[] = [
	{ name: 'quote', label: 'Quote', type: 'textarea' },
	{ name: 'author', label: 'Author', type: 'text' },
	{ name: 'portrait', label: 'Portrait', type: 'media' }
];
eq(
	fill(invented, { quote: 'Hello', author: 'Ada' }),
	{ quote: 'Hello', author: 'Ada', portrait: '' },
	'unknown section type'
);

console.log(`fields.ts: all checks passed (${Object.keys(sectionSpecs).length} section types)`);
