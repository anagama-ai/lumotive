// Provenance for the /nm120 page imagery: pulls the NM120 Development Kit
// figures from https://lumotive.com/products/nm120-development-kit/ into
// static/lumotive/img so they ship through GitHub. Both are photographs, so
// they are resized and re-encoded as JPEG.
// Re-run with: node scripts/dev/fetch-nm120-assets.mjs
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = new URL('../../static/lumotive/img/', import.meta.url);

const jobs = [
	{
		url: 'https://lumotive.com/wp-content/uploads/2024/10/IMG_4715-copy_web.png',
		file: 'nm120-hero.jpg',
		width: 1800
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2026/04/IMG_0032-1-copy-1.png',
		file: 'nm120-sensor.jpg',
		width: 1200
	}
];

for (const job of jobs) {
	const response = await fetch(job.url);
	if (!response.ok) throw new Error(`${response.status} for ${job.url}`);

	const input = Buffer.from(await response.arrayBuffer());
	const output = await sharp(input)
		.resize({ width: job.width, withoutEnlargement: true })
		.flatten({ background: '#ffffff' })
		.jpeg({ quality: 82, mozjpeg: true })
		.toBuffer();

	await writeFile(new URL(job.file, OUT), output);
	const meta = await sharp(output).metadata();
	console.log(`${job.file} ${meta.width}x${meta.height} ${(output.length / 1024).toFixed(0)} KB`);
}
