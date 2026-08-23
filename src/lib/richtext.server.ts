import sanitizeHtml from 'sanitize-html';
import { RICH_TEXT_ATTRIBUTES, RICH_TEXT_SCHEMES, RICH_TEXT_TAGS } from './richtext';

const options: sanitizeHtml.IOptions = {
	allowedTags: [...RICH_TEXT_TAGS],
	allowedAttributes: Object.fromEntries(
		Object.entries(RICH_TEXT_ATTRIBUTES).map(([tag, attrs]) => [tag, [...attrs]])
	),
	allowedSchemes: [...RICH_TEXT_SCHEMES],
	// Relative hrefs like /about carry no scheme and must stay allowed.
	allowProtocolRelative: false,
	disallowedTagsMode: 'discard'
};

/**
 * Enforce the rich text allowlist. MUST run on every write path that stores
 * rich text, because the public site renders the stored value as raw HTML.
 */
export function sanitizeRichText(html: unknown): string {
	if (typeof html !== 'string' || !html.trim()) return '';
	return sanitizeHtml(html, options);
}
