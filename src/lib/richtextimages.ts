import { variantPath } from '$lib/imagesizes';

export function rewriteRichTextImages(html: string): string {
	return html.replace(
		/(<img\b[^>]*?\s+src\s*=\s*)(['"])https?:\/\/[^'"\s]+?\/api\/files\/media\/([^/'"?#]+)\/([^/'"?#]+)(?:\?thumb=[^'"]*)?\2/gi,
		(match, prefix: string, quote: string, recordId: string, filename: string) => {
			try {
				return `${prefix}${quote}${variantPath(decodeURIComponent(recordId), decodeURIComponent(filename), 1024)}${quote}`;
			} catch {
				return match;
			}
		}
	);
}
