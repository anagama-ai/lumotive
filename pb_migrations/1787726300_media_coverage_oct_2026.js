// Third-party coverage from July–October 2026.
const POSTS = [
	{
		"title": "Fast-Switching OCS: Benefits, Technologies, System-Level Considerations, and Emerging Applications for Dynamic AI Fabrics",
		"slug": "media-fast-switching-ocs-benefits-technologies-system-level-considerations-and-emerging-applications-for-dynamic-ai",
		"status": "published",
		"category": "Media Coverage",
		"excerpt": "Coverage from Open Compute Project.",
		"body": "<p>Originally published by Open Compute Project.</p>",
		"publishedAt": "2026-10-19 00:00:00Z",
		"sourceUrl": "https://www.opencompute.org/wp-content/uploads/2026/10/OCP-OCS__Fast_Switching_OCS_October-19-2026_Final.pdf"
	},
	{
		"title": "Revolutionizing Machine Vision with Programmable RGB+Depth Sensing in Sirius Max Platform",
		"slug": "media-revolutionizing-machine-vision-with-programmable-rgb-depth-sensing-in-sirius-max-platform",
		"status": "published",
		"category": "Media Coverage",
		"excerpt": "Coverage from Vision Systems Design.",
		"body": "<p>Originally published by Vision Systems Design.</p>",
		"publishedAt": "2026-10-12 00:00:00Z",
		"sourceUrl": "https://www.vision-systems.com/cameras-accessories/article/55411247/revolutionizing-machine-vision-with-programmable-rgbdepth-sensing-in-sirius-max-platform"
	},
	{
		"title": "Leopard Imaging, Lumotive Launch 3D Perception Platform for Edge AI and Robotics",
		"slug": "media-leopard-imaging-lumotive-launch-3d-perception-platform-for-edge-ai-and-robotics",
		"status": "published",
		"category": "Media Coverage",
		"excerpt": "Coverage from Embedded.com.",
		"body": "<p>Originally published by Embedded.com.</p>",
		"publishedAt": "2026-09-24 00:00:00Z",
		"sourceUrl": "https://www.embedded.com/leopard-imaging-lumotive-launch-3d-perception-platform-for-edge-ai-and-robotics"
	},
	{
		"title": "Controlling Optical Signals for Dynamic Datacenter Switching",
		"slug": "media-controlling-optical-signals-for-dynamic-datacenter-switching",
		"status": "published",
		"category": "Media Coverage",
		"excerpt": "Coverage from Forbes.",
		"body": "<p>Originally published by Forbes.</p>",
		"publishedAt": "2026-09-01 00:00:00Z",
		"sourceUrl": "https://www.forbes.com/sites/sabbirrangwala/2026/09/01/controlling-optical-signals-for-dynamic-datacenter-switching/"
	},
	{
		"title": "Lumotive: Interview With CEO Dr. Sam Heidari About The Optical Chips Company",
		"slug": "media-lumotive-interview-with-ceo-dr-sam-heidari-about-the-optical-chips-company",
		"status": "published",
		"category": "Media Coverage",
		"excerpt": "Coverage from Pulse 2.0.",
		"body": "<p>Originally published by Pulse 2.0.</p>",
		"publishedAt": "2026-07-29 00:00:00Z",
		"sourceUrl": "https://pulse2.com/lumotive-profile-dr-sam-heidari-interview/"
	}
]

migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId('posts')
		for (const post of POSTS) {
			const record = new Record(collection)
			for (const key of Object.keys(post)) record.set(key, post[key])
			app.save(record)
		}
	},
	(app) => {
		for (const post of POSTS) app.delete(app.findFirstRecordByFilter('posts', 'slug = {:slug}', { slug: post.slug }))
	},
)
