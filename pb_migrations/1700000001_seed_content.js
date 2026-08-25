migrate((app) => {
	// Never seed a privileged account with a password shared by every clone.
	const superuserPassword = $os.getenv('PB_SEED_SUPERUSER_PASSWORD')
	const editorPassword = $os.getenv('PB_SEED_EDITOR_PASSWORD')

	const seedRecord = (collectionName, field, value, data) => {
		try {
			app.findFirstRecordByFilter(collectionName, `${field} = {:value}`, { value })
		} catch {
			const record = new Record(app.findCollectionByNameOrId(collectionName))
			for (const key of Object.keys(data)) record.set(key, data[key])
			app.save(record)
		}
	}

	if (!superuserPassword) {
		console.log('[seed] PB_SEED_SUPERUSER_PASSWORD is not set; skipping the seeded superuser account.')
	} else {
		try {
			app.findAuthRecordByEmail("_superusers", "admin@example.com")
		} catch {
			const record = new Record(app.findCollectionByNameOrId("_superusers"))
			record.set("email", "admin@example.com")
			record.set("password", superuserPassword)
			app.save(record)
		}
	}

	if (!editorPassword) {
		console.log('[seed] PB_SEED_EDITOR_PASSWORD is not set; skipping the seeded editor account.')
	} else {
		try {
			app.findAuthRecordByEmail("editors", "editor@example.com")
		} catch {
			const record = new Record(app.findCollectionByNameOrId("editors"))
			record.set("email", "editor@example.com")
			record.set("password", editorPassword)
			record.set("verified", true)
			record.set("name", "Demo Editor")
			record.set("role", "admin")
			app.save(record)
		}
	}

	seedRecord("globals", "key", "header", {
		key: "header",
		data: {
			siteName: "Northwind Studio",
			nav: [
				{ label: "Home", href: "/" },
				{ label: "About", href: "/about" },
				{ label: "Blog", href: "/blog" },
				{ label: "Contact", href: "/contact" }
			]
		}
	})

	seedRecord("globals", "key", "footer", {
		key: "footer",
		data: {
			text: "© 2026 Northwind Studio. All rights reserved.",
			nav: [
				{ label: "Privacy", href: "/privacy" },
				{ label: "Terms", href: "/terms" }
			]
		}
	})

	seedRecord("globals", "key", "code_injection", {
		key: "code_injection",
		data: {
			head: "<!-- code injection: head -->",
			bodyEnd: "<script>console.log('code injection: bodyEnd')</script>"
		}
	})

	seedRecord("pages", "slug", "home", {
		title: "Home",
		slug: "home",
		status: "published",
		seoTitle: "Northwind Studio — Brand and Digital Design",
		seoDescription: "Northwind Studio creates clear brands, useful websites, and thoughtful digital experiences for growing businesses.",
		sections: [
			{
				id: "homehero",
				type: "hero",
				heading: "Design that gives ambitious ideas a clear direction.",
				subheading: "Northwind Studio helps growing teams turn complex stories into confident brands and digital experiences.",
				ctaLabel: "Start a project",
				ctaHref: "/contact",
				image: "https://picsum.photos/seed/northwind/1600/900"
			},
			{
				id: "homepros",
				type: "prose",
				html: "<h2>Strategy before decoration</h2><p>We listen closely, find the useful truth in your business, and build a visual system around it. The result is work your team can understand, use, and grow with.</p>"
			},
			{
				id: "homecard",
				type: "cards",
				heading: "What we make",
				items: [
					{
						title: "Brand foundations",
						body: "Positioning, identity, and practical guidelines that help every message feel like it comes from the same company.",
						href: "/contact"
					},
					{
						title: "Web experiences",
						body: "Fast, accessible marketing sites designed around the questions your customers actually ask.",
						href: "/contact"
					},
					{
						title: "Launch support",
						body: "Campaign direction and reusable assets that keep the first announcement from becoming the last good one.",
						href: "/contact"
					}
				]
			},
			{
				id: "homectaa",
				type: "cta",
				heading: "Ready to make the next move feel obvious?",
				body: "Tell us where your business is headed. We will help shape the story and the tools that get it there.",
				buttonLabel: "Tell us about your project",
				buttonHref: "/contact"
			}
		]
	})

	seedRecord("pages", "slug", "about", {
		title: "About",
		slug: "about",
		status: "published",
		seoTitle: "About Northwind Studio",
		seoDescription: "Meet the independent design studio bringing clarity, craft, and momentum to growing organizations.",
		sections: [
			{
				id: "abouther",
				type: "hero",
				heading: "A small studio for work that matters.",
				subheading: "We pair senior-level thinking with a close, collaborative process—no layers of account management and no mystery handoffs.",
				ctaLabel: "Work with us",
				ctaHref: "/contact",
				image: ""
			},
			{
				id: "aboutpro",
				type: "prose",
				html: "<h2>Clarity is our craft</h2><p>Northwind Studio was founded to give growing teams direct access to experienced designers. We ask practical questions, share the reasoning behind the work, and leave clients with systems they can run without us.</p><p>Our best partnerships are candid, curious, and focused on making useful things well.</p>"
			}
		]
	})

	seedRecord("pages", "slug", "contact", {
		title: "Contact",
		slug: "contact",
		status: "published",
		seoTitle: "Contact Northwind Studio",
		seoDescription: "Talk with Northwind Studio about your next brand, website, or digital design project.",
		sections: [
			{
				id: "conthero",
				type: "hero",
				heading: "Bring us the ambitious version.",
				subheading: "Share what you are building, what is getting in the way, and what a strong outcome would change for your team.",
				ctaLabel: "Email the studio",
				ctaHref: "mailto:hello@northwind.studio",
				image: ""
			},
			{
				id: "contctaa",
				type: "cta",
				heading: "Start with a conversation",
				body: "We reply within two working days with honest questions, a suggested next step, and whether we are the right fit.",
				buttonLabel: "hello@northwind.studio",
				buttonHref: "mailto:hello@northwind.studio"
			}
		]
	})

	seedRecord("pages", "slug", "draft-example", {
		title: "Draft Example",
		slug: "draft-example",
		status: "draft",
		sections: []
	})

	seedRecord("posts", "slug", "designing-for-decisions", {
		title: "Designing for Decisions, Not Decoration",
		slug: "designing-for-decisions",
		status: "published",
		excerpt: "A practical way to judge whether a design is helping customers move forward or simply adding polish.",
		body: "<p>Good marketing design makes the next decision easier. Before choosing colors or layouts, define what a visitor needs to understand, trust, and do.</p><h2>Give every page one job</h2><p>A focused page can still tell a rich story, but its hierarchy should point toward one meaningful outcome.</p><ul><li>Lead with the customer problem.</li><li>Support claims with specific evidence.</li><li>Make the next action unmistakable.</li></ul><p>Decoration has a place. It works best after the decision path is clear.</p>",
		publishedAt: "2026-02-12 09:00:00.000Z"
	})

	seedRecord("posts", "slug", "a-brand-system-your-team-can-use", {
		title: "A Brand System Your Team Can Actually Use",
		slug: "a-brand-system-your-team-can-use",
		status: "published",
		excerpt: "The most valuable identity is not the one with the thickest guidelines—it is the one people can apply with confidence.",
		body: "<p>A brand system succeeds when the whole team can make consistent choices without asking a designer to approve every slide, post, or proposal.</p><h2>Build around real work</h2><p>Start with the formats your organization produces every week. Design those first, then extract rules from patterns that have already proved useful.</p><ul><li>Use a small, dependable type scale.</li><li>Define a limited set of color roles.</li><li>Provide finished examples alongside rules.</li></ul><p>A lighter system that gets used will create more consistency than an exhaustive manual that sits unopened.</p>",
		publishedAt: "2026-03-05 14:30:00.000Z"
	})
}, (app) => {
	const deleteSeedRecord = (collectionName, field, value) => {
		const records = app.findRecordsByFilter(collectionName, `${field} = {:value}`, '', 1, 0, { value })
		if (records.length > 0) app.delete(records[0])
	}

	deleteSeedRecord('pages', 'slug', 'home')
	deleteSeedRecord('pages', 'slug', 'about')
	deleteSeedRecord('pages', 'slug', 'contact')
	deleteSeedRecord('pages', 'slug', 'draft-example')
	deleteSeedRecord('posts', 'slug', 'designing-for-decisions')
	deleteSeedRecord('posts', 'slug', 'a-brand-system-your-team-can-use')
	deleteSeedRecord('globals', 'key', 'header')
	deleteSeedRecord('globals', 'key', 'footer')
	deleteSeedRecord('globals', 'key', 'code_injection')
	deleteSeedRecord('_superusers', 'email', 'admin@example.com')
	deleteSeedRecord('editors', 'email', 'editor@example.com')
})
