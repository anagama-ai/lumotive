#!/usr/bin/env node
/**
 * Staging migration dry-run and rollback rehearsal (PocketBase).
 *
 * Applies this repo's pending migrations to a COPY of a PocketBase database
 * (a staging backup), reports what each migration actually changed against a
 * reference database (normally this repo's local pb_data), then rolls the copy
 * back and checks that it matches the copy's starting state.
 *
 * Why: the production PocketBase container runs `pocketbase serve
 * --migrationsDir`, which applies every pending migration on start, i.e. as
 * soon as a merge to `main` redeploys. Most content migrations are guarded on
 * prior values and return silently when staging content was edited in the CMS.
 * Only a run against a real staging copy shows which ones would no-op.
 *
 * Usage (Node 22.13+ for node:sqlite; run from the repo root):
 *   node scripts/staging-migration-dry-run.mjs --backup <backup.zip | pb_data dir> \
 *     [--reference ./pb_data/data.db] [--pocketbase ./bin/pocketbase.exe] \
 *     [--migrations ./pb_migrations] [--out <dir outside the repo>] [--no-rollback]
 *
 * The backup is never modified: it is extracted or copied into --out first.
 * Use the PocketBase binary of the version the deployment runs (0.39.11 in
 * Dockerfile.pocketbase). Exit codes: 0 ok, 1 migrate up/down failed or bad
 * input, 2 the rollback did not restore the starting state.
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, isAbsolute, join, relative, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const args = Object.fromEntries(
	process.argv.slice(2).reduce((pairs, token, index, all) => {
		if (!token.startsWith('--')) return pairs;
		const next = all[index + 1];
		pairs.push([token.slice(2), next && !next.startsWith('--') ? next : true]);
		return pairs;
	}, [])
);
const repo = process.cwd();
const fail = (message) => {
	console.error(`dry-run: ${message}`);
	process.exit(1);
};
if (!args.backup || args.backup === true) fail('--backup <backup.zip | pb_data dir> is required');

const backup = resolve(String(args.backup));
const reference = resolve(String(args.reference ?? join(repo, 'pb_data', 'data.db')));
const pocketbase = String(args.pocketbase ?? (process.platform === 'win32' ? join(repo, 'bin', 'pocketbase.exe') : 'pocketbase'));
const migrations = resolve(String(args.migrations ?? join(repo, 'pb_migrations')));
const out = resolve(String(args.out ?? join(tmpdir(), `pb-dry-run-${new Date().toISOString().replace(/[:.]/g, '-')}`)));
const rollback = !args['no-rollback'];

const inside = (child, parent) => {
	const rel = relative(parent, child);
	return !rel.startsWith('..') && !isAbsolute(rel);
};
if (!existsSync(backup)) fail(`backup not found: ${backup}`);
if (resolve(backup) === resolve(repo, 'pb_data') || inside(backup, resolve(repo, 'pb_data'))) fail('refusing to use the repo pb_data as the backup');
if (inside(out, repo)) fail(`--out must be outside the repository: ${out}`);
if (!existsSync(reference)) fail(`reference database not found: ${reference}`);

// ---- 1. Working copy of the backup ---------------------------------------
const work = join(out, 'pb_data');
mkdirSync(work, { recursive: true });
if (statSync(backup).isDirectory()) {
	cpSync(backup, work, { recursive: true });
} else {
	// PocketBase backups are zips of the pb_data contents. bsdtar (Windows,
	// macOS) reads zips; GNU tar does not, so fall back to unzip.
	const tar = spawnSync('tar', ['-xf', backup, '-C', work], { encoding: 'utf8' });
	if (tar.status !== 0 && spawnSync('unzip', ['-q', backup, '-d', work], { encoding: 'utf8' }).status !== 0) {
		fail(`could not extract ${backup} (tried tar and unzip)`);
	}
}
// The database may sit one level down if the zip wrapped a folder.
const findDb = (dir, depth = 0) => {
	if (existsSync(join(dir, 'data.db'))) return dir;
	if (depth >= 2) return null;
	for (const entry of readdirSync(dir)) {
		const child = join(dir, entry);
		if (statSync(child).isDirectory()) {
			const found = findDb(child, depth + 1);
			if (found) return found;
		}
	}
	return null;
};
const dataDir = findDb(work) ?? fail(`no data.db found inside ${work}`);

// The reference is copied too (with its WAL files) so a running server is never locked.
const refDir = join(out, 'reference');
mkdirSync(refDir, { recursive: true });
for (const suffix of ['', '-wal', '-shm']) {
	if (existsSync(reference + suffix)) cpSync(reference + suffix, join(refDir, basename(reference) + suffix));
}

// ---- 2. Snapshots -------------------------------------------------------
const PAGE_FIELDS = ['slug', 'path', 'parent', 'title', 'status', 'seoTitle', 'seoDescription', 'canonical', 'noindex', 'ogImage'];
function snapshot(dbFile) {
	const db = new DatabaseSync(dbFile, { readOnly: true });
	const rows = (sql) => db.prepare(sql).all();
	const pages = rows(`select id, sections, ${PAGE_FIELDS.join(', ')} from pages`);
	const pathOf = Object.fromEntries(pages.map((p) => [p.id, p.path || p.slug]));
	const postsCollection = rows("select fields from _collections where name = 'posts'")[0];
	const postColumns = rows('pragma table_info(posts)').map((c) => c.name);
	const state = {
		pages: Object.fromEntries(
			pages.map((p) => [p.id, { ...p, parentPath: p.parent ? (pathOf[p.parent] ?? `?${p.parent}`) : '' }])
		),
		globals: Object.fromEntries(rows('select key, data from globals').map((g) => [g.key, g.data])),
		redirects: Object.fromEntries(rows('select "from", "to", active from redirects').map((r) => [r.from, { to: r.to, active: r.active }])),
		postFields: postsCollection ? JSON.parse(postsCollection.fields).map((f) => f.name).sort() : [],
		featured: postColumns.includes('featured')
			? rows('select slug from posts where featured = 1').map((p) => p.slug).sort()
			: [],
		migrations: rows('select file from _migrations order by applied, file').map((m) => m.file)
	};
	db.close();
	return state;
}
const byPath = (state) => Object.fromEntries(Object.values(state.pages).map((p) => [p.path || p.slug, p]));
const parse = (json) => {
	try {
		return JSON.parse(json || '[]');
	} catch {
		return null;
	}
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function run(command, input) {
	const result = spawnSync(pocketbase, [...command, `--dir=${dataDir}`, `--migrationsDir=${migrations}`], {
		encoding: 'utf8',
		input
	});
	return { ok: result.status === 0, status: result.status, output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
}

// ---- 3. Apply -----------------------------------------------------------
const pre = snapshot(join(dataDir, 'data.db'));
const up = run(['migrate', 'up']);
if (!up.ok) {
	writeFileSync(join(out, 'migrate-up.log'), up.output);
	fail(`migrate up failed (exit ${up.status}); see ${join(out, 'migrate-up.log')}`);
}
const post = snapshot(join(dataDir, 'data.db'));
const applied = post.migrations.filter((file) => !pre.migrations.includes(file));

// ---- 4. Compare the migrated copy with the reference ----------------------
const ref = snapshot(join(refDir, basename(reference)));
const differences = { pages: [], globals: [], redirects: [], posts: [] };
const postPaths = byPath(post);
for (const [path, want] of Object.entries(byPath(ref))) {
	const got = postPaths[path];
	if (!got) {
		differences.pages.push({ path, issue: 'page missing after migrate up' });
		continue;
	}
	for (const field of [...PAGE_FIELDS.filter((f) => f !== 'parent'), 'parentPath']) {
		if (!same(got[field], want[field])) differences.pages.push({ path, issue: `page field ${field} differs`, got: got[field], want: want[field] });
	}
	const wantSections = parse(want.sections) ?? [];
	const gotSections = parse(got.sections) ?? [];
	const gotById = Object.fromEntries(gotSections.map((s) => [s?.id, s]));
	for (const section of wantSections) {
		const match = gotById[section?.id];
		if (!match) {
			differences.pages.push({ path, issue: 'section missing', section: section?.id, type: section?.type });
			continue;
		}
		const keys = [...new Set([...Object.keys(section), ...Object.keys(match)])].filter((k) => !same(section[k], match[k]));
		if (keys.length) differences.pages.push({ path, issue: 'section keys differ', section: section.id, type: section.type, keys });
	}
	const wantIds = new Set(wantSections.map((s) => s?.id));
	for (const section of gotSections) {
		if (!wantIds.has(section?.id)) differences.pages.push({ path, issue: 'extra section', section: section?.id, type: section?.type });
	}
	if (!same(gotSections.map((s) => s?.id), wantSections.map((s) => s?.id)) && gotSections.length === wantSections.length) {
		differences.pages.push({ path, issue: 'section order differs' });
	}
}
for (const path of Object.keys(postPaths)) {
	if (!byPath(ref)[path]) differences.pages.push({ path, issue: 'page present after migrate up but not in the reference' });
}
for (const key of new Set([...Object.keys(ref.globals), ...Object.keys(post.globals)])) {
	if (same(parse(post.globals[key]), parse(ref.globals[key]))) continue;
	const a = parse(post.globals[key]) ?? {};
	const b = parse(ref.globals[key]) ?? {};
	differences.globals.push({ key, keys: [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => !same(a[k], b[k])) });
}
for (const from of new Set([...Object.keys(ref.redirects), ...Object.keys(post.redirects)])) {
	if (!same(post.redirects[from], ref.redirects[from])) differences.redirects.push({ from, got: post.redirects[from] ?? null, want: ref.redirects[from] ?? null });
}
if (!same(post.postFields, ref.postFields)) differences.posts.push({ issue: 'posts schema fields differ', got: post.postFields, want: ref.postFields });
if (!same(post.featured, ref.featured)) differences.posts.push({ issue: 'featured posts differ', got: post.featured, want: ref.featured });

// ---- 5. Roll back and compare with the starting state ---------------------
let down = null;
const rollbackIssues = [];
if (rollback && applied.length) {
	down = run(['migrate', 'down', String(applied.length)], 'y\n');
	if (down.ok) {
		const back = snapshot(join(dataDir, 'data.db'));
		for (const id of new Set([...Object.keys(pre.pages), ...Object.keys(back.pages)])) {
			const a = pre.pages[id];
			const b = back.pages[id];
			if (!a || !b) {
				rollbackIssues.push({ page: (a ?? b).path, issue: a ? 'page missing after rollback' : 'page left behind by rollback' });
				continue;
			}
			for (const field of ['sections', ...PAGE_FIELDS]) {
				if (a[field] !== b[field]) rollbackIssues.push({ page: a.path || a.slug, issue: `${field} not restored byte-identically` });
			}
		}
		for (const key of new Set([...Object.keys(pre.globals), ...Object.keys(back.globals)])) {
			if (pre.globals[key] !== back.globals[key]) rollbackIssues.push({ global: key, issue: 'data not restored byte-identically' });
		}
		if (!same(pre.redirects, back.redirects)) rollbackIssues.push({ issue: 'redirects not restored' });
		if (!same(pre.postFields, back.postFields)) rollbackIssues.push({ issue: 'posts schema not restored' });
		if (!same(pre.featured, back.featured)) rollbackIssues.push({ issue: 'featured posts not restored' });
		if (!same(pre.migrations, back.migrations)) rollbackIssues.push({ issue: '_migrations not restored' });
	}
}

// ---- 6. Report ------------------------------------------------------------
const report = {
	backup,
	reference,
	migrations,
	pocketbase,
	workingCopy: dataDir,
	pendingBefore: applied.length,
	applied,
	migrateUp: up.output.split('\n').filter((line) => line.startsWith('Applied')).length,
	differences,
	rollback: rollback ? (down ? { ok: down.ok, issues: rollbackIssues, output: down.ok ? undefined : down.output } : { skipped: 'nothing applied' }) : { skipped: '--no-rollback' }
};
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 1));
const lines = [
	'# PocketBase migration dry-run',
	'',
	`- Backup: \`${backup}\``,
	`- Working copy: \`${dataDir}\` (the backup itself was not modified)`,
	`- Migrations: \`${migrations}\`; reference: \`${reference}\``,
	`- Applied: ${applied.length} migration(s)${applied.length ? `, \`${applied[0]}\` … \`${applied.at(-1)}\`` : ''}`,
	`- Differences from the reference after migrate up: ${differences.pages.length} page, ${differences.globals.length} globals, ${differences.redirects.length} redirect, ${differences.posts.length} posts`,
	`- Rollback: ${report.rollback.skipped ?? (report.rollback.ok ? (rollbackIssues.length ? `${rollbackIssues.length} issue(s)` : 'starting state restored exactly') : 'migrate down FAILED')}`,
	''
];
const table = (title, items, cols) => {
	if (!items.length) return;
	lines.push(`## ${title}`, '', `| ${cols.join(' | ')} |`, `|${cols.map(() => '---').join('|')}|`);
	for (const item of items) lines.push(`| ${cols.map((c) => String(Array.isArray(item[c]) ? item[c].join(', ') : (item[c] ?? '')).replace(/\|/g, '\\|').slice(0, 160)).join(' | ')} |`);
	lines.push('');
};
table('Pages: differences from the reference', differences.pages, ['path', 'issue', 'section', 'type', 'keys']);
table('Globals', differences.globals, ['key', 'keys']);
table('Redirects', differences.redirects.map((r) => ({ ...r, got: JSON.stringify(r.got), want: JSON.stringify(r.want) })), ['from', 'got', 'want']);
table('Posts', differences.posts.map((p) => ({ issue: p.issue })), ['issue']);
table('Rollback issues', rollbackIssues.map((i) => ({ target: i.page ?? i.global ?? '', issue: i.issue })), ['target', 'issue']);
writeFileSync(join(out, 'report.md'), lines.join('\n'));
console.log(lines.join('\n'));
console.log(`\nReports: ${join(out, 'report.md')} and report.json`);
if (down && !down.ok) {
	console.error(down.output);
	process.exit(1);
}
process.exit(rollbackIssues.length ? 2 : 0);
