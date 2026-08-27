migrate(
	(app) => {
		const collection = app.findCollectionByNameOrId("posts")
		if (!collection.fields.getByName("category")) {
			collection.fields.add(new TextField({ name: "category" }))
			app.save(collection)
		}

		const categories = [
	{
		"slug": "media-why-optical-circuit-switching-is-becoming-essential-for-ai-data-centers",
		"category": "Media Coverage"
	},
	{
		"slug": "media-programmable-optics-turn-sensors-into-perception-platforms-for-lidar",
		"category": "Media Coverage"
	},
	{
		"slug": "media-optical-circuit-switching-for-ai-and-hyperscale-datacenters-benefits-technologies-current-and-future-deploymen",
		"category": "Media Coverage"
	},
	{
		"slug": "media-rethinking-sensors-for-physical-ai-why-machines-need-to-see-the-world-differently",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-enables-180-solid-state-lidar-at-30-fps",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotives-lcm-optical-semiconductor-platform-enables-first-solid-state-180-dtof-lidar-at-30-fps",
		"category": "Press Releases"
	},
	{
		"slug": "media-moving-laser-beams-in-data-centers-at-the-speed-of-light",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-on-its-world-first-2d-photonic-beamforming-chip",
		"category": "Media Coverage"
	},
	{
		"slug": "media-programmable-2d-photonic-beamforming-device",
		"category": "Media Coverage"
	},
	{
		"slug": "media-semiconductor-company-unveils-first-2d-photonic-beamforming-chip-for-ai-and-optical-systems",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor",
		"category": "Press Releases"
	},
	{
		"slug": "media-startups-bring-optical-metamaterials-to-ai-data-centers",
		"category": "Media Coverage"
	},
	{
		"slug": "media-the-programmable-optics-revolution",
		"category": "Media Coverage"
	},
	{
		"slug": "media-unlocking-the-next-generation-of-lidar-with-programmable-optics",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-expands-global-footprint-and-adds-key-leaders-amid-growing-demand-for-programmable-optical-semiconductors",
		"category": "Press Releases"
	},
	{
		"slug": "media-programmable-optics-pioneer-lumotive-opens-new-centers-in-oman-and-taiwan",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-opens-offices-in-oman-and-taiwan-to-boost-commercialization-of-its-optical-3d-sensor-chips",
		"category": "Media Coverage"
	},
	{
		"slug": "media-top-start-up-of-2025-lumotive",
		"category": "Media Coverage"
	},
	{
		"slug": "media-company-case-study-lumotive",
		"category": "Media Coverage"
	},
	{
		"slug": "media-we-cant-avoid-using-light-so-we-have-to-master-it-says-lumotive-ceo-on-chip-based-light-control-system",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-adds-amazon-and-ithca-group-to-series-b-raise",
		"category": "Media Coverage"
	},
	{
		"slug": "media-gates-backed-startup-secures-additional-14-million-from-amazon-oman-fund",
		"category": "Media Coverage"
	},
	{
		"slug": "amazon-and-ithca-invest-in-lumotive",
		"category": "Press Releases"
	},
	{
		"slug": "media-amazon-and-ithca-invest-in-lumotive",
		"category": "Media Coverage"
	},
	{
		"slug": "media-amazon-backs-programmable-optics-startup-lumotive",
		"category": "Media Coverage"
	},
	{
		"slug": "solidvue-and-lumotive-collaborate-to-advance-next-generation-lidar-systems",
		"category": "Press Releases"
	},
	{
		"slug": "media-namuga-debuts-stella-2-solid-state-lidar-powered-by-lumotive",
		"category": "Media Coverage"
	},
	{
		"slug": "namuga-unveils-stella-2-compact-solid-state-lidar-powered-by-lumotive-at-embedded-vision-summit",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-powers-e-photonics-launch-of-software-defined-lidar-solutions-for-its-applications-at-its-spain",
		"category": "Press Releases"
	},
	{
		"slug": "media-lumotive-powers-e-photonics-launch-of-software-defined-lidar-solutions-for-its-applications-at-its-spain",
		"category": "Media Coverage"
	},
	{
		"slug": "media-ithca-invests-in-us-chip-firm-to-boost-omans-tech-ambitions",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-eyes-new-frontiers-after-45m-series-b-investment",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-raises-45-million",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-45-million-series-b-raised-for-programmable-optical-semiconductor-products",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-raises-45m-for-ai-international-push",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-raises-45-million-to-expand-sales-of-programmable-optical-semiconductors",
		"category": "Press Releases"
	},
	{
		"slug": "media-redmond-chip-startup-lands-45-million-to-expand-growth-in-new-markets",
		"category": "Media Coverage"
	},
	{
		"slug": "media-bill-gates-backed-semiconductor-startup-lumotive-raises-45m",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-bucks-ai-trend-by-raising-45-million-for-optical-chips",
		"category": "Media Coverage"
	},
	{
		"slug": "e-photonics-launches-lidar-based-3d-sensing-solutions-powered-by-lumotive",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-introduces-transformative-advanced-3d-sensing-utilizing-sonys-sensors-at-ces-2025",
		"category": "Press Releases"
	},
	{
		"slug": "namuga-launches-next-generation-3d-sensing-solutions-powered-by-lumotive",
		"category": "Press Releases"
	},
	{
		"slug": "multicoreware-and-lumotive-announce-collaboration-designed-to-advance-3d-sensing-and-lidar-technology",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-and-lattice-semiconductor-to-demo-chip-based-beam-steering-for-3d-sensing-at-devcon-2024",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-unveils-md41-development-kit-elevating-3d-sensing-with-enhanced-flexibility-and-efficiency",
		"category": "Press Releases"
	},
	{
		"slug": "media-lumotive-unveils-md41-development-kit-elevating-3d-sensing-with-enhanced-flexibility-and-efficiency",
		"category": "Media Coverage"
	},
	{
		"slug": "media-the-2024-gsa-award-nominees-revealed",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-unveils-md42-development-kit-boosting-3d-sensing-innovation",
		"category": "Press Releases"
	},
	{
		"slug": "media-newest-breakthrough-in-agv-amr-3d-sensing-lumotive-lcm-sets-new-standard-chinese",
		"category": "Media Coverage"
	},
	{
		"slug": "media-namuga-forms-alliance-with-artificial-intelligence-ai-sensor-company",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-unveils-groundbreaking-open-development-platform-odp-moves-to-democratize-the-future-of-3d-sensing",
		"category": "Media Coverage"
	},
	{
		"slug": "media-cron-ai-and-lumotive-unveil-ai-powered-solid-state-lidar",
		"category": "Media Coverage"
	},
	{
		"slug": "media-open-development-platform-for-3d-metasurface-sensor",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-unveils-groundbreaking-open-development-platform-odp-moves-to-democratize-the-future-of-3d-sensing",
		"category": "Press Releases"
	},
	{
		"slug": "media-2024-innovators-awards-meet-the-honorees",
		"category": "Media Coverage"
	},
	{
		"slug": "media-3d-lidar-sensor-with-true-solid-state-beam-steering",
		"category": "Media Coverage"
	},
	{
		"slug": "media-solid-state-beam-steering-comes-to-3d-lidar",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-and-hokuyo-announce-commercial-release-of-worlds-first-3d-lidar-sensor-with-true-solid-state-beam-steering",
		"category": "Press Releases"
	},
	{
		"slug": "media-production-begins-on-first-optical-beamforming-chip",
		"category": "Media Coverage"
	},
	{
		"slug": "skywater-and-lumotive-announce-qualification-and-production-start-for-worlds-first-commercially-available-optical-beamforming-chip",
		"category": "Press Releases"
	},
	{
		"slug": "media-invest-vancouver-welcomes-us-high-tech-3d-sensor-company",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-edom-partner-to-market-optical-computer-chips-in-taiwan",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-taps-edom-to-accelerate-solid-state-lidar-adoption-in-taiwan",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-partners-with-leading-electronics-distributor-edom-to-accelerate-solid-state-lidar-adoption-in-taiwan",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-to-speak-at-26th-annual-needham-growth-conference",
		"category": "Press Releases"
	},
	{
		"slug": "media-can-metamaterials-revolutionize-optical-computing",
		"category": "Media Coverage"
	},
	{
		"slug": "media-photonics-tech-shines-at-ces-2024",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotives-digital-beam-steering-takes-center-stage-at-ces-2024",
		"category": "Media Coverage"
	},
	{
		"slug": "media-ces-2024-here-are-the-washington-state-companies-taking-tech-innovation-to-las-vegas",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-joins-with-tech-leaders-to-demo-digital-beam-steering-at-ces-2024",
		"category": "Press Releases"
	},
	{
		"slug": "experience-lumotives-award-winning-digital-beam-steering-technology-at-ces-2024",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-named-to-fast-companys-next-big-things-in-tech-2023",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-extends-global-reach-announces-new-sales-and-distribution-partners-worldwide",
		"category": "Press Releases"
	},
	{
		"slug": "media-lumotive-named-as-one-of-fast-companys-next-big-things-in-tech-2023",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lumotive-lm10-chip-is-a-ces-innovation-awards-2024-honoree",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-launches-the-worlds-first-commercially-available-optical-beam-steering-semiconductor",
		"category": "Press Releases"
	},
	{
		"slug": "namuga-selects-lumotive-to-build-next-gen-3d-sensing-solutions",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-partners-with-hokuyo-to-revolutionize-3d-lidar-sensing-for-industrial-automation",
		"category": "Press Releases"
	},
	{
		"slug": "media-lumotive-and-hokuyo-partner-to-build-3d-lidar-sensing-into-industrial-automation",
		"category": "Media Coverage"
	},
	{
		"slug": "media-62m-fund-for-metamaterial-startups",
		"category": "Media Coverage"
	},
	{
		"slug": "media-lighter-cheaper-fastermetavc-looks-for-metamaterials-startups",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-and-gpixel-demonstrate-innovative-lidar-reference-design-to-enable-faster-adoption-of-next-generation-3d-sensors",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-and-lumentum-introduce-innovative-reference-design-to-enable-faster-adoption-of-next-generation-3d-lidar-solutions",
		"category": "Press Releases"
	},
	{
		"slug": "media-new-lidar-solutions-presented-at-ces-2023",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-and-axibo-partner-to-bring-solid-state-3d-lidar-sensing-to-photography-and-cinematography-automation",
		"category": "Press Releases"
	},
	{
		"slug": "media-lidar-company-lumotive-raises-13m-in-round-led-by-samsung",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-adds-new-investments-from-usaa-and-uniquest-to-a-strategic-funding-round-led-by-samsung-ventures",
		"category": "Press Releases"
	},
	{
		"slug": "media-ces-2023-a-list-of-washington-state-companies-showing-off-their-latest-tech-gadgets-and-services",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-and-gpixel-jointly-unveil-m30-lidar-sensor-reference-design-platform-for-high-volume-mobility-and-industrial-applications",
		"category": "Press Releases"
	},
	{
		"slug": "media-lumotive-secures-funding-for-lcm-beam-steering-chips",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-closes-strategic-funding-round-led-by-samsung-ventures",
		"category": "Press Releases"
	},
	{
		"slug": "media-sam-heidari-focus-on-the-journey-not-just-the-destination",
		"category": "Media Coverage"
	},
	{
		"slug": "lumotive-expands-lidar-technology-access-program-to-include-its-patented-light-control-metasurface-lcm-beam-steering-chips-and-reference-designs",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-enhances-leadership-team-expands-its-headquarters-at-a-larger-facility",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-and-zkw-group-jointly-demonstrate-vehicle-headlight-with-integrated-functional-lidar-at-ces-2022",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-introduces-open-lidar-api-to-accelerate-market-adoption-of-software-defined-solid-state-lidar-2-0-solutions",
		"category": "Press Releases"
	},
	{
		"slug": "consumer-technology-association-recognizes-lumotive-with-two-ces-2022-innovation-awards",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-names-dr-sam-heidari-as-ceo-to-lead-lidar-innovators-next-stage-of-growth",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-wins-best-of-sensors-2021-startup-of-the-year-award",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-reveals-meta-lidar-platform-at-sensors-converge-event",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-unveils-meta-lidar-platform-industrys-smallest-solid-state-all-silicon-scalable-3d-sensing-solution",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-named-one-of-jmp-securities-efficient-fifty-companies-for-second-consecutive-year",
		"category": "Press Releases"
	},
	{
		"slug": "lumotives-mini-lidar-early-access-program-accelerates-adoption-of-tiny-lidar-in-smartphones-and-other-devices",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-earns-spot-on-built-ins-best-small-companies-to-work-for-in-seattle-list-for-2021",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-yole-developpement-and-lidar-news-to-host-lidar-one-size-does-not-fit-all-webinar-january-21-2021",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-introduces-exclusive-early-access-program-to-support-select-partners-and-accelerate-adoption-of-innovative-lidar-technology",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-unveils-industry-first-lidar-products-leveraging-liquid-crystal-metasurfaces-and-cmos-manufacturing-to-address-performance-cost-and-form-factor-needs-across-multiple-markets",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-named-one-of-jmp-securities-efficient-fifty-leading-private-companies-in-industrial-and-energy-technology",
		"category": "Press Releases"
	},
	{
		"slug": "lumotives-revolutionary-beam-steering-technology-for-lidar-systems-recognized-by-laser-focus-world-as-top-20-photonics-technology",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-named-one-of-built-in-seattles-prestigious-best-small-companies-to-work-for-in-2020",
		"category": "Press Releases"
	},
	{
		"slug": "lumotive-and-himax-technologies-target-autonomous-vehicles-with-industry-first-liquid-crystal-on-silicon-solution-for-high-performance-lidar-systems",
		"category": "Press Releases"
	},
	{
		"slug": "towerjazz-and-lumotive-demonstrate-true-solid-state-beam-steering-for-automotive-lidar-systems",
		"category": "Press Releases"
	}
]
		for (const data of categories) {
			const records = app.findRecordsByFilter("posts", "slug = {:slug}", "", 1, 0, data)
			if (!records.length) continue
			records[0].set("category", data.category)
			app.save(records[0])
		}
	},
	(app) => {
		const collection = app.findCollectionByNameOrId("posts")
		if (!collection.fields.getByName("category")) return
		collection.fields.removeByName("category")
		app.save(collection)
	}
)
