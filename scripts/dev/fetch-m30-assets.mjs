// Provenance for the /m30 page imagery: pulls the M30 Development Kit figures
// from https://lumotive.com/products/m30-dev/ into static/lumotive/img so they
// ship through GitHub. Photos are resized and re-encoded as JPEG. The source
// step icons are white line art drawn for a dark section; this site puts them
// on white cards, so each one is re-tinted to the brand colour matching its
// card accent, which is how the existing icon-*.png artwork is coloured.
// Re-run with: node scripts/dev/fetch-m30-assets.mjs
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const TINTS = {
	blue: [0x00, 0x78, 0xd0],
	green: [0x00, 0xa6, 0x51],
	amber: [0xff, 0xb1, 0x14]
};

const OUT = new URL('../../static/lumotive/img/', import.meta.url);

const jobs = [
	{
		url: 'https://lumotive.com/wp-content/uploads/2024/12/IMG_7179-Edit-1-copy-2048x1147.png',
		file: 'm30-dev-hero.jpg',
		width: 1800,
		format: 'jpeg'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2024/03/Golf_3.png',
		file: 'm30-dev-golf-ball.jpg',
		width: 1440,
		format: 'jpeg'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2024/10/IMG_7224-Edit-1-copy-2-2048x1375.png',
		file: 'm30-dev-kit-contents.jpg',
		width: 1800,
		format: 'jpeg'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2023/05/Group-18.png',
		file: 'm30-dev-hardware-software.png',
		width: 1440,
		format: 'png'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2024/12/Out-of-the-Box.png',
		file: 'icon-m30-out-of-the-box.png',
		width: 300,
		format: 'png',
		tint: 'blue'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2024/02/Lasers.png',
		file: 'icon-m30-evaluation.png',
		width: 300,
		format: 'png',
		tint: 'green'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2024/12/Prototype.png',
		file: 'icon-m30-prototyping.png',
		width: 300,
		format: 'png',
		tint: 'amber'
	},
	{
		url: 'https://lumotive.com/wp-content/uploads/2024/02/Software.png',
		file: 'icon-m30-demonstration.png',
		width: 300,
		format: 'png',
		tint: 'blue'
	}
];

const tint = async (buffer, rgb) => {
	const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
	for (let index = 0; index < data.length; index += 4) {
		data[index] = rgb[0];
		data[index + 1] = rgb[1];
		data[index + 2] = rgb[2];
	}
	return sharp(data, { raw: info }).png({ compressionLevel: 9 }).toBuffer();
};

for (const job of jobs) {
	const response = await fetch(job.url);
	if (!response.ok) throw new Error(`${response.status} for ${job.url}`);

	const input = Buffer.from(await response.arrayBuffer());
	const pipeline = sharp(input).resize({ width: job.width, withoutEnlargement: true });
	let output =
		job.format === 'jpeg'
			? await pipeline.flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer()
			: await pipeline.png({ compressionLevel: 9 }).toBuffer();

	if (job.tint) output = await tint(output, TINTS[job.tint]);

	await writeFile(new URL(job.file, OUT), output);
	const meta = await sharp(output).metadata();
	console.log(`${job.file} ${meta.width}x${meta.height} ${(output.length / 1024).toFixed(0)} KB${job.tint ? ` (${job.tint})` : ''}`);
}
