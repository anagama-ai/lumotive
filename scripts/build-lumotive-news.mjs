#!/usr/bin/env node

import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const targetRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = resolve(process.argv[2] ?? resolve(targetRoot, '../lumotive/lumotive-website'));
const sourceFile = resolve(sourceRoot, 'scripts/news-data.json');
const migrationFile = resolve(targetRoot, 'pb_migrations/1700000310_seed_lumotive_news.js');
const targetNewsRoot = resolve(targetRoot, 'static/lumotive/news');
const sourceNewsRoot = resolve(sourceRoot, 'public/lumotive/news');
const records = JSON.parse(await readFile(sourceFile, 'utf8'));

const vite = await createServer({ configFile: false, appType: 'custom', server: { middlewareMode: true } });
const { sanitizeRichText } = await vite.ssrLoadModule(resolve(targetRoot, 'src/lib/richtext.server.ts'));
await vite.close();

const escapeHtml = (value) =>
	String(value)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');

const converters = {
	heading: ({ text }) => `<h2>${escapeHtml(text)}</h2>`,
	paragraph: ({ text }) => `<p>${escapeHtml(text)}</p>`,
	link: ({ text, url }) => `<p><a href="${escapeHtml(url)}">${escapeHtml(text)}</a></p>`
};

const unsupported = [...new Set(records.flatMap((record) => record.blocks.map((block) => block.type)))]
	.filter((type) => !converters[type]);
if (unsupported.length) throw new Error(`Unsupported rich-text node types: ${unsupported.join(', ')}`);

const slugs = new Set();
const posts = records.map((record) => {
	if (!record.title || !record.slug || !record.publishedAt || !record.sourceUrl) {
		throw new Error(`Incomplete news record: ${record.slug || record.title || '(unknown)'}`);
	}
	if (slugs.has(record.slug)) throw new Error(`Duplicate news slug: ${record.slug}`);
	slugs.add(record.slug);

	const sourceUrl = new URL(record.sourceUrl);
	if (!['http:', 'https:'].includes(sourceUrl.protocol)) {
		throw new Error(`Unsupported source URL protocol for ${record.slug}`);
	}
	const contentBlocks = record.blocks.at(-1)?.type === 'link' && record.blocks.at(-1)?.url === record.sourceUrl
		? record.blocks.slice(0, -1)
		: record.blocks;
	const body = sanitizeRichText(contentBlocks.map((block) => converters[block.type](block)).join(''));

	return {
		title: record.title,
		slug: record.slug,
		status: 'published',
		excerpt: record.excerpt || '',
		body,
		publishedAt: record.publishedAt.replace('T', ' '),
		...(record.image ? { coverImage: { kind: 'url', value: `/${record.image}` } } : {}),
		sourceUrl: sourceUrl.href
	};
});

const migration = `migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId("posts")
		collection.fields.add(new TextField({ name: "sourceUrl" }))
		app.save(collection)

		const posts = ${JSON.stringify(posts, null, '\t')}
		for (const data of posts) {
			const record = new Record(collection)
			for (const key of Object.keys(data)) record.set(key, data[key])
			app.save(record)
		}
	},
	(app) => {
		for (const data of ${JSON.stringify(posts.map(({ slug }) => ({ slug })), null, '\t')}) {
			const records = app.findRecordsByFilter("posts", "slug = {:slug}", "", 1, 0, data)
			if (records.length) app.delete(records[0])
		}
		const collection = app.findCollectionByNameOrId("posts")
		collection.fields.removeByName("sourceUrl")
		app.save(collection)
	}
)
`;

await writeFile(migrationFile, migration);
await rm(targetNewsRoot, { recursive: true, force: true });
await mkdir(targetNewsRoot, { recursive: true });

let copiedBytes = 0;
const images = [...new Set(records.flatMap((record) => (record.image ? [record.image] : [])))];
for (const image of images) {
	const source = resolve(sourceRoot, 'public', image);
	const target = resolve(targetRoot, 'static', image);
	if (!source.startsWith(`${sourceNewsRoot}/`) || !target.startsWith(`${targetNewsRoot}/`)) {
		throw new Error(`News image escapes its directory: ${image}`);
	}
	await mkdir(dirname(target), { recursive: true });
	await copyFile(source, target);
	copiedBytes += (await stat(target)).size;
}

console.log(`Built ${posts.length} posts in ${migrationFile}`);
console.log(`Copied ${images.length} referenced images (${copiedBytes} bytes)`);
console.log('Unsupported rich-text node types: none');
