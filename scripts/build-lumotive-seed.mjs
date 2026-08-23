import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = resolve(root, '..', 'lumotive', 'lumotive-website')
const output = join(root, 'pb_migrations', '1700000300_seed_lumotive.js')
const portDir = join(root, '.port')
const sourcePublic = join(sourceRoot, 'public')

const pairTypes = {
	'section.hero/fullHeight': 'heroFullHeight',
	'section.hero/band': 'heroBand',
	'section.cards/peelScene': 'cardsPeelScene',
	'section.cards/peelBento': 'cardsPeelBento',
	'section.cards/peelSwap': 'cardsPeelSwap',
	'section.cards/flowPanels': 'cardsFlowPanels',
	'section.cards/flowDiagram': 'cardsFlowDiagram',
	'section.cards/iconCards': 'cardsIconCards',
	'section.cards/iconQuad': 'cardsIconQuad',
	'section.cards/mediaCards': 'cardsMediaCards',
	'section.cards/textCards': 'cardsTextCards',
	'section.cards/specPanels': 'cardsSpecPanels',
	'section.cards/comparisonCards': 'cardsComparisonCards',
	'section.cards/comparisonTable': 'cardsComparisonTable',
	'section.cards/designSpace': 'cardsDesignSpace',
	'section.cards/applicationBento': 'cardsApplicationBento',
	'section.cards/awardCards': 'cardsAwardCards',
	'section.cards/teamCards': 'cardsTeamCards',
	'section.split/default': 'splitDefault',
	'section.split/darkPanel': 'splitDarkPanel',
	'section.split/peelBleed': 'splitPeelBleed',
	'section.split/stackedCard': 'splitStackedCard',
	'section.logos/marquee': 'logosMarquee',
	'section.logos/gridOnDark': 'logosGridOnDark',
	'section.logos/labelled': 'logosLabelled',
	'section.logos/sceneBand': 'logosSceneBand',
	'section.stats/centered': 'statsCentered',
	'section.stats/darkTraits': 'statsDarkTraits',
	'section.stats/lightTraits': 'statsLightTraits',
	'section.stats/specPills': 'statsSpecPills',
	'section.stats/peelScene': 'statsPeelScene',
	'section.stats/sceneBand': 'statsSceneBand',
	'section.testimonials/peelScene': 'testimonialsPeelScene',
	'section.media/videoEmbed': 'mediaVideoEmbed',
	'section.cta/default': 'ctaDefault',
	'section.cta/splitLinks': 'ctaSplitLinks',
	'section.cta/lattice': 'ctaLattice',
	'section.cta/fabric': 'ctaFabric',
	'section.cta/lightField': 'ctaLightField',
	'section.cta/spectrum': 'ctaSpectrum',
	'section.timeline/timeline': 'timeline',
}
const contractedTypes = new Set(Object.values(pairTypes))

const files = []
function walk(directory) {
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name)
		if (entry.isDirectory()) walk(path)
		else files.push(path)
	}
}
walk(sourcePublic)
const pathsByBasename = new Map()
for (const path of files) {
	const name = path.slice(path.lastIndexOf(sep) + 1)
	const paths = pathsByBasename.get(name) ?? []
	paths.push(path)
	pathsByBasename.set(name, paths)
}

const captured = { pages: new Map(), globals: new Map(), forms: [], awards: [], team: [] }
const originalFetch = globalThis.fetch
const response = (data) => ({ ok: true, status: 200, text: async () => JSON.stringify(data) })
globalThis.fetch = async (_url, options = {}) => {
	const body = JSON.parse(String(options.body ?? '{}'))
	if (body.op === 'find') {
		if (body.collection === 'media') {
			const filename = body.where?.filename?.equals
			return response({ docs: filename ? [{ id: `media::${filename}` }] : [] })
		}
		return response({ docs: [] })
	}
	if (body.op === 'create') {
		if (body.collection === 'pages') captured.pages.set(body.data.slug, body.data)
		else if (body.collection === 'forms') captured.forms.push(body.data)
		else if (body.collection === 'awards') captured.awards.push(body.data)
		else if (body.collection === 'team-members') captured.team.push(body.data)
		return response({ id: `${body.collection ?? 'record'}-${Date.now()}`, doc: { id: `${body.collection ?? 'record'}-${Date.now()}` } })
	}
	if (body.op === 'update' && body.collection === 'media') {
		return response({ id: body.id, doc: { id: body.id } })
	}
	if (body.op === 'updateGlobal') {
		captured.globals.set(body.global, body.data)
		return response({ global: body.data })
	}
	return response({})
}

const waitFor = async (predicate, label) => {
	for (let attempt = 0; attempt < 500; attempt += 1) {
		if (predicate()) return
		await new Promise((resolveWait) => setTimeout(resolveWait, 10))
	}
	throw new Error(`Timed out reading ${label}`)
}
mkdirSync(portDir, { recursive: true })
const boilerplateCopy = join(portDir, '.seed-boilerplate-source.mjs')
const boilerplateSource = readFileSync(join(sourceRoot, 'scripts', 'seed-boilerplate.mjs'), 'utf8')
const runnableBoilerplate = boilerplateSource
	.replace(
		"if (import.meta.url === pathToFileURL(process.argv[1]).href) {",
		'if (true) {',
	)
	.replace(
		"export const cmsRoot = path.resolve(scriptDir, '..')",
		`export const cmsRoot = ${JSON.stringify(sourceRoot)}`,
	)
if (runnableBoilerplate === boilerplateSource) throw new Error('Could not load source site metadata seed')
writeFileSync(boilerplateCopy, runnableBoilerplate)


try {
	await import(`${pathToFileURL(boilerplateCopy).href}?lumotive-port`)
	await waitFor(
		() => captured.globals.has('site-meta') && captured.globals.has('page-config') && captured.pages.has('contact'),
		'site metadata',
	)
	captured.pages.clear()
	captured.forms.length = 0
	await import(`${pathToFileURL(join(sourceRoot, 'scripts', 'seed-lumotive.mjs')).href}?lumotive-port`)
	await waitFor(() => captured.pages.has('home'), 'homepage')
	await import(`${pathToFileURL(join(sourceRoot, 'scripts', 'seed-pages.mjs')).href}?lumotive-port`)
	await waitFor(
		() => captured.pages.size >= 11 && captured.forms.length >= 1 && captured.awards.length === 8 && captured.team.length === 11 && captured.globals.has('footer'),
		'page seeds',
	)
} finally {
	rmSync(boilerplateCopy, { force: true })
	globalThis.fetch = originalFetch
}

const escapeHtml = (value) =>
	String(value ?? '').replace(/[&<>"']/g, (character) =>
		({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
	)
const unknownRichTextNodes = new Set()
function renderRichNode(node) {
	if (!node || typeof node !== 'object') return ''
	const children = () => (node.children ?? []).map(renderRichNode).join('')
	if (node.type === 'root') return children()
	if (node.type === 'paragraph') return `<p>${children()}</p>`
	if (node.type === 'text') {
		let text = escapeHtml(node.text)
		if (node.format & 2) text = `<em>${text}</em>`
		return text
	}
	if (node.type === 'list') return `<ul>${children()}</ul>`
	if (node.type === 'listitem') return `<li>${children()}</li>`
	if (node.type === 'link') {
		const url = node.fields?.url ?? node.url ?? ''
		const external = /^(?:https?:)?\/\//i.test(url)
		return `<a href="${escapeHtml(url)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${children()}</a>`
	}
	unknownRichTextNodes.add(String(node.type ?? '(missing)'))
	return children()
}

function sourcePathFor(filename) {
	const matches = pathsByBasename.get(filename) ?? []
	if (matches.length === 0) throw new Error(`Missing source asset ${filename}`)
	if (matches.length > 1) throw new Error(`Ambiguous source asset ${filename}: ${matches.join(', ')}`)
	return matches[0]
}

function normalise(value) {
	if (typeof value === 'string' && value.startsWith('media::')) {
		const source = sourcePathFor(value.slice(7))
		return { kind: 'url', value: `/${relative(sourcePublic, source).split(sep).join('/')}` }
	}
	if (Array.isArray(value)) return value.map(normalise)
	if (!value || typeof value !== 'object') return value
	if (value.root?.type === 'root') return renderRichNode(value.root)
	const result = Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalise(child)]))
	for (const key of ['primaryLink', 'secondaryLink', 'link']) {
		const link = result[key]
		if (!link || typeof link !== 'object') continue
		result[`${key}Label`] = String(link.label ?? '')
		result[`${key}Url`] = String(link.url ?? '')
		result[`${key}NewTab`] = link.newTab === true
	}
	if (Array.isArray(result.secondaryLinks)) {
		result.secondaryLinks = result.secondaryLinks.map((row) => {
			const link = row?.link ?? row
			return {
				label: String(link?.label ?? ''),
				url: String(link?.url ?? ''),
				newTab: link?.newTab === true,
			}
		})
	}
	return result
}

const invalidPresentationValues = new Set()
const presentationValues = {
	background: new Set(['none', 'subtle', 'strong', 'inverse']),
	width: new Set(['contained', 'wide', 'full']),
	spacingTop: new Set(['none', 'sm', 'md', 'lg']),
	spacingBottom: new Set(['none', 'sm', 'md', 'lg']),
}
const sectionId = (slug, index) => createHash('sha256').update(`${slug}:${index}`).digest('hex').slice(0, 8)
function mapSection(block, slug, index) {
	const design = block.presentation?.designVersion
	const type = pairTypes[`${block.blockType}/${design}`]
	if (!type) throw new Error(`Unsupported block ${block.blockType}/${design ?? ''} on ${slug}`)
	const { blockType: _blockType, presentation = {}, ...content } = block
	const section = {
		id: sectionId(slug, index),
		type,
		...normalise(content),
		designVersion: design,
		background: presentation.background ?? 'none',
		width: presentation.width ?? 'contained',
		spacingTop: presentation.spacingTop ?? 'md',
		spacingBottom: presentation.spacingBottom ?? 'md',
		anchor: presentation.anchor ?? '',
	}
	for (const [field, allowed] of Object.entries(presentationValues)) {
		if (!allowed.has(section[field])) invalidPresentationValues.add(`${slug}:${index + 1} ${field}=${section[field]}`)
	}
	if (!contractedTypes.has(section.type)) throw new Error(`Uncontracted section type ${section.type} on ${slug}`)
	return section
}

const awards = captured.awards.map((award) => ({
	title: String(award.title ?? ''),
	year: String(award.year ?? ''),
	linkUrl: String(award.link ?? ''),
}))
const team = captured.team.map((member) => normalise({
	name: member.name,
	title: member.title,
	roles: member.roles,
	headshot: member.headshot,
	headshotAlt: member.headshotAlt,
	biography: member.biography,
	order: member.order,
})).sort((a, b) => Number(a.order) - Number(b.order))

const routeOrder = [
	['home', 'home'],
	['platform', 'platform'],
	['sense', 'sense'],
	['lm10', 'lm10'],
	['dev-kits', 'dev-kits'],
	['connect', 'connect'],
	['applications', 'applications'],
	['about', 'about'],
	['culture', 'culture'],
	['partners', 'partners'],
	['contact', 'contact'],
]
const pages = routeOrder.map(([sourceSlug, path]) => {
	const source = captured.pages.get(sourceSlug)
	if (!source) throw new Error(`Missing source page ${sourceSlug}`)
	const sections = source.layout.map((block, index) => mapSection(block, path, index))
	if (path === 'about') {
		const awardSection = sections.find((section) => section.type === 'cardsAwardCards')
		if (!awardSection) throw new Error('Missing cardsAwardCards section on about')
		awardSection.cards = awards
		for (const section of sections.filter((candidate) => candidate.type === 'cardsTeamCards')) {
			const role = section.anchor === 'board' ? 'board' : 'leadership'
			section.cards = team.filter((member) => member.roles.includes(role))
		}
	}
	return {
		title: String(source.title ?? ''),
		slug: path,
		path,
		status: 'published',
		seoTitle: String(source.meta?.title ?? ''),
		seoDescription: String(source.meta?.description ?? ''),
		sections,
	}
})

const header = normalise(captured.globals.get('header') ?? {})
const footer = normalise(captured.globals.get('footer') ?? {})
const seo = normalise({
	...(captured.globals.get('site-meta') ?? {}),
	...(captured.globals.get('page-config') ?? {}),
})
const globals = [
	{ key: 'header', data: header },
	{ key: 'footer', data: footer },
	{ key: 'seo', data: seo },
]

const sourceForm = captured.forms[0]
if (!sourceForm) throw new Error('Missing source contact form')
const form = {
	name: String(sourceForm.title ?? ''),
	fields: (sourceForm.fields ?? []).map((field) => ({
		name: String(field.name ?? ''),
		label: String(field.label ?? ''),
		type: String(field.blockType ?? 'text'),
		required: field.required === true,
		...(field.blockType === 'select' ? { options: (field.options ?? []).map((option) => String(option.value ?? '')) } : {}),
	})),
	confirmation: normalise(sourceForm.confirmationMessage),
}

const migration = `// Generated by scripts/build-lumotive-seed.mjs. Do not edit by hand.\nmigrate((app) => {\n\tconst pages = ${JSON.stringify(pages, null, '\t').replaceAll('\n', '\n\t')}\n\tconst globals = ${JSON.stringify(globals, null, '\t').replaceAll('\n', '\n\t')}\n\tconst formData = ${JSON.stringify(form, null, '\t').replaceAll('\n', '\n\t')}\n\tconst upsert = (collectionName, field, value, data) => {\n\t\tlet record\n\t\ttry {\n\t\t\trecord = app.findFirstRecordByFilter(collectionName, \`\${field} = {:value}\`, { value })\n\t\t} catch {\n\t\t\trecord = new Record(app.findCollectionByNameOrId(collectionName))\n\t\t}\n\t\tfor (const key of Object.keys(data)) record.set(key, data[key])\n\t\tapp.save(record)\n\t\treturn record\n\t}\n\n\tfor (const page of pages) upsert('pages', 'path', page.path, page)\n\tfor (const global of globals) upsert('globals', 'key', global.key, global)\n\tconst form = upsert('forms', 'name', formData.name, formData)\n\tupsert('form_recipients', 'form', form.id, { form: form.id, addresses: 'info@lumotive.com' })\n}, () => {\n\t// Forward-only content migration.\n})\n`

mkdirSync(portDir, { recursive: true })
writeFileSync(output, migration)

const assets = new Set()
function collectAssets(value) {
	if (Array.isArray(value)) return value.forEach(collectAssets)
	if (!value || typeof value !== 'object') return
	if (value.kind === 'url' && typeof value.value === 'string' && value.value.startsWith('/')) assets.add(value.value.slice(1))
	for (const child of Object.values(value)) collectAssets(child)
}
pages.forEach(collectAssets)
globals.forEach(collectAssets)
for (const backdrop of ['cta-glow.jpg', 'cta-lattice.jpg', 'cta-fabric.jpg', 'cta-lightfield.jpg', 'cta-spectrum.jpg']) {
	assets.add(`lumotive/img/${backdrop}`)
}

let copiedBytes = 0
const manifest = []
for (const asset of [...assets].sort()) {
	const source = join(sourcePublic, asset)
	const destination = join(root, 'static', asset)
	mkdirSync(dirname(destination), { recursive: true })
	copyFileSync(source, destination)
	const bytes = statSync(source).size
	const checksum = createHash('sha256').update(readFileSync(source)).digest('hex')
	copiedBytes += bytes
	manifest.push(`${checksum}  ${bytes}  ${asset}`)
}
writeFileSync(join(portDir, 'media-manifest.txt'), `${manifest.join('\n')}\n`)

const inventory = ['# Lumotive port inventory', '']
const ctaBackdropByType = {
	ctaDefault: 'cta-glow.jpg',
	ctaSplitLinks: 'cta-glow.jpg',
	ctaLattice: 'cta-lattice.jpg',
	ctaFabric: 'cta-fabric.jpg',
	ctaLightField: 'cta-lightfield.jpg',
	ctaSpectrum: 'cta-spectrum.jpg',
}
for (const page of pages) {
	const pageAssets = new Set()
	collectPageAssets(page, pageAssets)
	for (const section of page.sections) {
		const backdrop = ctaBackdropByType[section.type]
		if (backdrop) pageAssets.add(`lumotive/img/${backdrop}`)
	}
	inventory.push(`## ${page.path === 'home' ? '/' : `/${page.path}`}`, '')
	page.sections.forEach((section, index) => inventory.push(`${index + 1}. \`${section.type}\``))
	inventory.push('', 'Assets:')
	if (pageAssets.size === 0) inventory.push('- None')
	else for (const asset of [...pageAssets].sort()) inventory.push(`- \`/${asset}\``)
	inventory.push('')
}
function collectPageAssets(value, target) {
	if (Array.isArray(value)) return value.forEach((child) => collectPageAssets(child, target))
	if (!value || typeof value !== 'object') return
	if (value.kind === 'url' && typeof value.value === 'string' && value.value.startsWith('/')) target.add(value.value.slice(1))
	for (const child of Object.values(value)) collectPageAssets(child, target)
}
inventory.push('## Build notes', '')
inventory.push(`- Contracted section types found: ${new Set(pages.flatMap((page) => page.sections.map((section) => section.type))).size}`)
inventory.push(`- Copied assets: ${assets.size} files, ${copiedBytes} bytes`)
inventory.push(`- Unsupported rich-text node types: ${unknownRichTextNodes.size ? [...unknownRichTextNodes].sort().join(', ') : 'none'}`)
inventory.push(`- Invalid presentation values: ${invalidPresentationValues.size ? [...invalidPresentationValues].sort().join(', ') : 'none'}`)
writeFileSync(join(portDir, 'inventory.md'), `${inventory.join('\n')}\n`)

const usedPairs = new Set(pages.flatMap((page) => page.sections.map((section) => `section.${section.type.split(/[A-Z]/)[0]}/${section.designVersion}`)))
console.log(`Wrote ${output}`)
console.log(`Pages: ${pages.length}; section types: ${new Set(pages.flatMap((page) => page.sections.map((section) => section.type))).size}; mapped pairs: ${usedPairs.size}`)
console.log(`Form: ${form.name}`)
console.log(`Assets: ${assets.size} files, ${copiedBytes} bytes`)
console.log(`Unsupported rich-text nodes: ${unknownRichTextNodes.size ? [...unknownRichTextNodes].join(', ') : 'none'}`)
console.log(`Invalid presentation values: ${invalidPresentationValues.size ? [...invalidPresentationValues].join(', ') : 'none'}`)
