export function fileUrl(collection: string, recordId: string, filename: string): string {
	if (collection !== 'media') throw new Error(`Unsupported media collection: ${collection}`);
	return `/media/${encodeURIComponent(recordId)}/${encodeURIComponent(filename)}/original`;
}
