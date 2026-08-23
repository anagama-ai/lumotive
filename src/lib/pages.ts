export const PAGE_TREE_MAX_DEPTH = 100;

export type PageNode = {
	id: string;
	slug: string;
	parent?: string | null;
};

export type PageById = ReadonlyMap<string, PageNode>;

export function slugify(title: string) {
	return title
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

export function computePath(record: PageNode, byId: PageById) {
	const parts = [record.slug];
	const seen = new Set([record.id]);
	let parentId = record.parent || '';

	for (let depth = 0; parentId; depth += 1) {
		if (depth >= PAGE_TREE_MAX_DEPTH) throw new Error('Page hierarchy is too deep.');
		const parent = byId.get(parentId);
		if (!parent) throw new Error('A parent page no longer exists.');
		if (seen.has(parent.id)) throw new Error('Page hierarchy contains a cycle.');
		seen.add(parent.id);
		parts.unshift(parent.slug);
		parentId = parent.parent || '';
	}

	return parts.join('/');
}

export function wouldCycle(id: string, parentId: string, byId: PageById) {
	const seen = new Set<string>();
	let currentId = parentId;

	for (let depth = 0; currentId; depth += 1) {
		if (currentId === id || seen.has(currentId) || depth >= PAGE_TREE_MAX_DEPTH) return true;
		seen.add(currentId);
		currentId = byId.get(currentId)?.parent || '';
	}

	return false;
}

export function collectDescendants(id: string, byId: PageById) {
	const children = new Map<string, PageNode[]>();
	for (const page of byId.values()) {
		const parentId = page.parent || '';
		if (!parentId) continue;
		const siblings = children.get(parentId);
		if (siblings) siblings.push(page);
		else children.set(parentId, [page]);
	}

	const descendants: PageNode[] = [];
	const seen = new Set([id]);
	const visit = (parentId: string, depth: number) => {
		const directChildren = children.get(parentId);
		if (!directChildren?.length) return;
		if (depth >= PAGE_TREE_MAX_DEPTH) throw new Error('Page hierarchy is too deep.');
		for (const child of directChildren) {
			if (seen.has(child.id)) throw new Error('Page hierarchy contains a cycle.');
			seen.add(child.id);
			descendants.push(child);
			visit(child.id, depth + 1);
		}
	};

	visit(id, 0);
	return descendants;
}
