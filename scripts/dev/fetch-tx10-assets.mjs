// Provenance for the /tx10 page imagery: pulls the TX10 figures from
// https://lumotive.com/products/tx10-reference-design/ into static/lumotive/img
// so they ship through GitHub. Product photographs are resized and re-encoded
// as JPEG; the performance graphic keeps PNG so its lettering stays crisp.
// Re-run with: node scripts/dev/fetch-tx10-assets.mjs
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = new URL('../../static/lumotive/img/', import.meta.url);

const jobs = [
	{
		url: 'https://lumotive.com/wp-content/uploads/2026/05/IMG_5630-1-copy-2-scaled-1-2048x1305.png',
		file: 'tx10-hero.jpg',
		width: 1800,
		format: 'jpeg'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2026/05/IMG_9317-1-copy-2.png',
		file: 'tx10-module-receiver.jpg',
		width: 1440,
		format: 'jpeg'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2026/05/IMG_9290-1-copy-2.png',
		file: 'tx10-module-closeup.jpg',
		width: 1440,
		format: 'jpeg'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2026/05/IMG_9291-1-copy-2.png',
		file: 'tx10-module-laser.jpg',
		width: 1440,
		format: 'jpeg'
	},
	{
		url: 'https://bv4.58e.myftpupload.com/wp-content/uploads/2026/04/Performance-vs-Cost-Efficiency.png',
		file: 'tx10-performance-vs-cost.png',
		width: 1440,
		format: 'png'
	}
];

for (const job of jobs) {
	const response = await fetch(job.url);
	if (!response.ok) throw new Error(`${response.status} for ${job.url}`);

	const input = Buffer.from(await response.arrayBuffer());
	const pipeline = sharp(input).resize({ width: job.width, withoutEnlargement: true });
	const output =
		job.format === 'jpeg'
			? await pipeline.flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer()
			: await pipeline.png({ compressionLevel: 9 }).toBuffer();

	await writeFile(new URL(job.file, OUT), output);
	const meta = await sharp(output).metadata();
	console.log(`${job.file} ${meta.width}x${meta.height} ${(output.length / 1024).toFixed(0)} KB`);
}
