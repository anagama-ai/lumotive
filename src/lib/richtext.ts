// The one allowlist. The rich text editor is configured from it, and the
// server sanitiser enforces it. Stored rich text is rendered with {@html} on the
// public site, so this list is a security boundary, not a formatting preference.

export const RICH_TEXT_TAGS = [
	'p',
	'br',
	'h1',
	'h2',
	'h3',
	'h4',
	'strong',
	'em',
	'u',
	'a',
	'ol',
	'ul',
	'li',
	'blockquote',
	'hr',
	'img'
] as const;

export const RICH_TEXT_ATTRIBUTES: Record<string, readonly string[]> = {
	a: ['href'],
	img: ['src', 'alt']
};

/** Schemes permitted in href and src. Anything else (javascript:, data:) is dropped. */
export const RICH_TEXT_SCHEMES = ['http', 'https', 'mailto'] as const;
