// Company › Culture & Careers (/culture), approved content package rev.
// 2026-10-07, page 18 of 21. The route and the record are unchanged.
//
// Blocks, in the package's order:
//
//   1 heroBand      KEEP AS IS. The eyebrow, heading and hero-culture.jpg
//                   already matched. Two corrections to the printed page: the
//                   subline is the package's sentence, where staging ran on
//                   with a clause the package does not print, and the hero
//                   carries the single printed action. Staging's "Explore our
//                   values" second action is not on the approved page.
//   2 splitDefault  CHANGE · HEADING PLUS VIDEO MOVED UP. The section takes the
//                   approved heading and the sentence naming the four sites,
//                   and The Lumotive Way video moves up out of its own
//                   full-width block to sit beside that copy. The "Why
//                   Lumotive" eyebrow and the repeated board link, neither of
//                   which the package prints here, are dropped, and so is the
//                   standalone video section the move empties.
//   3 cardsIconCards KEEP AS IS. "How We Work" and its values grid, untouched
//                   but for the container alignment.
//   4 testimonialsPeelScene  KEEP AS IS · RESTORE FROM STAGING. The staging
//                   quotes carousel, now carrying the approved "In Their Words"
//                   heading it had been rendering without.
//   5 openRoles     NEW · LIVE FROM LEVER. See below.
//   — cardsAwardCards  REMOVE · AWARDS. "Delete the awards section from Culture
//                   (awards live on About)." Gone; restored by the down path.
//   6 ctaSplitLinks NEW · CLOSING CTA. "Help Us Make Light Programmable" with
//                   the single printed action, replacing "Bring your ambition
//                   to Lumotive" and its second link.
//
// OPEN ROLES IS LIVE, NOT A PLACEHOLDER. The package prints "[Role title]" and
// "[Team] · [Location]", which page 01 says never to publish, and its dev note
// asks for "the latest four to six roles from the Lever careers board. If no
// feed is possible, keep only the button."
//
// Lever publishes Lumotive's board as an unauthenticated JSON feed, verified
// returning ten live postings, so the feed is possible and the section reads
// it. `/api/open-roles` fetches it server-side — same origin, no key, one
// shared 15-minute cache — and returns the six most recent roles as title,
// "Team · Location" and the posting URL. The board button is server-rendered
// and works with no JavaScript at all; the roles are an enhancement on top of
// it, so a feed outage, a blocked network or a visitor without scripting all
// land on exactly the fallback the dev note describes. Every role links to its
// own Lever posting, so the existing job links keep working.
//
// PENDING, nothing invented in its place: the LinkedIn follow line the package
// prints under the closing CTA. The LinkedIn URL is still the unresolved input
// recorded in 1787708000_footer_sitemap.js, which also holds back the footer
// icon and the same line on /about. One URL unblocks all three.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'culture'

const NEXT_PAGE = {
	seoTitle: 'Culture & Careers',
	seoDescription:
		'Join an intense intellectual environment where top performers have ownership, visibility, and responsibility.'
}

const PREV_PAGE = {
	seoTitle: "",
	seoDescription: ""
}

const NEXT_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Join an intense intellectual environment where top performers have ownership, visibility, and responsibility.</p>",
	  "designVersion": "band",
	  "eyebrow": "Life at Lumotive",
	  "heading": "Seeking ambitious problem solvers",
	  "id": "6c524b47",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-culture.jpg"
	  },
	  "primaryLink": {
	   "type": "custom",
	   "url": "https://jobs.lever.co/lumotive",
	   "label": "Browse open positions",
	   "newTab": true
	  },
	  "primaryLinkLabel": "Browse open positions",
	  "primaryLinkNewTab": "true",
	  "primaryLinkUrl": "https://jobs.lever.co/lumotive",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "heroBand",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "environment",
	  "background": "subtle",
	  "body": "<p>Physicists, chip designers, optical engineers, and software developers in Redmond, Milpitas, Burnaby, and Muscat, building programmable optics together.</p>",
	  "designVersion": "default",
	  "heading": "Build the technology that shapes light, and the future",
	  "id": "979b8fc6",
	  "mediaPosition": "right",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained",
	  "videoUrl": "https://www.youtube.com/watch?v=AcLAbtIxN64",
	  "align": "container"
	 },
	 {
	  "anchor": "values",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>We tackle big opportunities to maximize impact for our company and for society. We are ambitious and fearless but discerning about which risks we take.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-think-big.png"
	    },
	    "title": "Think Big"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>Act like an owner. We proactively find solutions with a can-do attitude, succeed as a team, respect and trust each other, then commit and execute as one.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-one-lumotive.png"
	    },
	    "title": "One Lumotive"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>We strive to make things better in every dimension of the business, thrive on new ideas and conquer challenges without fear of failure.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-always-innovate.png"
	    },
	    "title": "Always Innovate"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>We maintain high standards, use data to make strong decisions, deliver excellent products and experiences, and always look to raise the bar.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-seek-excellence.png"
	    },
	    "title": "Seek Excellence"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>We succeed when our customers do. We listen, learn and anticipate their needs so we can deliver on their ambitions.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-focus-customers.png"
	    },
	    "title": "Focus on Customers"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>Showing it can be done is not enough. We relentlessly get things to the finish line and deliver solutions that work despite setbacks.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-deliver-tenaciously.png"
	    },
	    "title": "Deliver Tenaciously"
	   }
	  ],
	  "designVersion": "iconCards",
	  "eyebrow": "Lumotive values",
	  "heading": "How we work",
	  "id": "58fa454f",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsIconCards",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "team-voices",
	  "background": "subtle",
	  "designVersion": "peelScene",
	  "id": "b4a91c73",
	  "quotes": [
	   {
	    "author": "Pankil",
	    "avatar": {
	     "kind": "url",
	     "value": "/lumotive/img/testimonial-pankil.png"
	    },
	    "quote": "At the forefront of innovation, our company thrives on creativity, powered by brilliant minds shaping the future — proud to be a part of this journey.",
	    "role": "Team Engineering - San Jose, CA."
	   },
	   {
	    "author": "Linda",
	    "avatar": {
	     "kind": "url",
	     "value": "/lumotive/img/testimonial-linda.jpg"
	    },
	    "quote": "Working at Lumotive combines the best engineering experiences in my career all in one place: collaboration with brilliant, motivated colleagues; empowerment to define top priorities for success and tools to achieve them; and opportunities to innovate trailblazing technology.",
	    "role": "Team Engineering - Redmond, WA."
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "testimonialsPeelScene",
	  "width": "contained",
	  "heading": "In their words",
	  "align": "container"
	 },
	 {
	  "id": "c0a74e31",
	  "type": "openRoles",
	  "designVersion": "openRoles",
	  "anchor": "open-roles",
	  "heading": "Open roles",
	  "linkLabel": "See all open roles",
	  "linkUrl": "https://jobs.lever.co/lumotive",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "designVersion": "splitLinks",
	  "heading": "Help us make light programmable",
	  "id": "8c3ed872",
	  "primaryLink": {
	   "type": "custom",
	   "url": "https://jobs.lever.co/lumotive",
	   "label": "See open roles",
	   "newTab": true
	  },
	  "primaryLinkLabel": "See open roles",
	  "primaryLinkNewTab": "true",
	  "primaryLinkUrl": "https://jobs.lever.co/lumotive",
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaSplitLinks",
	  "width": "contained",
	  "headingSize": "statement",
	  "mode": "stacked",
	  "align": "container"
	 }
	]

const PREV_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Join an intense intellectual environment where top performers have ownership, visibility and responsibility — and where colleagues trust, challenge and support one another.</p>",
	  "designVersion": "band",
	  "eyebrow": "Life at Lumotive",
	  "heading": "Seeking ambitious problem solvers",
	  "id": "6c524b47",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-culture.jpg"
	  },
	  "primaryLink": {
	   "label": "Browse open positions",
	   "newTab": false,
	   "type": "custom",
	   "url": "https://jobs.lever.co/lumotive"
	  },
	  "primaryLinkLabel": "Browse open positions",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "https://jobs.lever.co/lumotive",
	  "secondaryLink": {
	   "label": "Explore our values",
	   "newTab": false,
	   "type": "custom",
	   "url": "#values"
	  },
	  "secondaryLinkLabel": "Explore our values",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "#values",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "heroBand",
	  "width": "contained"
	 },
	 {
	  "anchor": "environment",
	  "background": "subtle",
	  "body": "<p>Lumotive pioneered programmable optical semiconductors. The team is building products that make 3D sensing and optical connectivity more capable, adaptable and scalable.</p>",
	  "designVersion": "default",
	  "eyebrow": "Why Lumotive",
	  "heading": "Do consequential work with people who care deeply about it",
	  "id": "979b8fc6",
	  "link": {
	   "label": "Browse open positions",
	   "newTab": false,
	   "type": "custom",
	   "url": "https://jobs.lever.co/lumotive"
	  },
	  "linkLabel": "Browse open positions",
	  "linkNewTab": false,
	  "linkUrl": "https://jobs.lever.co/lumotive",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/culture-bleed.png"
	  },
	  "mediaPosition": "left",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained"
	 },
	 {
	  "anchor": "values",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>We tackle big opportunities to maximize impact for our company and for society. We are ambitious and fearless but discerning about which risks we take.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-think-big.png"
	    },
	    "title": "Think Big"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>Act like an owner. We proactively find solutions with a can-do attitude, succeed as a team, respect and trust each other, then commit and execute as one.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-one-lumotive.png"
	    },
	    "title": "One Lumotive"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>We strive to make things better in every dimension of the business, thrive on new ideas and conquer challenges without fear of failure.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-always-innovate.png"
	    },
	    "title": "Always Innovate"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>We maintain high standards, use data to make strong decisions, deliver excellent products and experiences, and always look to raise the bar.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-seek-excellence.png"
	    },
	    "title": "Seek Excellence"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>We succeed when our customers do. We listen, learn and anticipate their needs so we can deliver on their ambitions.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-focus-customers.png"
	    },
	    "title": "Focus on Customers"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>Showing it can be done is not enough. We relentlessly get things to the finish line and deliver solutions that work despite setbacks.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-value-deliver-tenaciously.png"
	    },
	    "title": "Deliver Tenaciously"
	   }
	  ],
	  "designVersion": "iconCards",
	  "eyebrow": "Lumotive values",
	  "heading": "How we work",
	  "id": "58fa454f",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsIconCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "video",
	  "background": "none",
	  "designVersion": "videoEmbed",
	  "heading": "",
	  "id": "c1d7e2a4",
	  "intro": "",
	  "items": [],
	  "mode": "video",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "mediaVideoEmbed",
	  "videoUrl": "https://www.youtube.com/watch?v=AcLAbtIxN64",
	  "width": "contained"
	 },
	 {
	  "anchor": "team-voices",
	  "background": "subtle",
	  "designVersion": "peelScene",
	  "id": "b4a91c73",
	  "quotes": [
	   {
	    "author": "Pankil",
	    "avatar": {
	     "kind": "url",
	     "value": "/lumotive/img/testimonial-pankil.png"
	    },
	    "quote": "At the forefront of innovation, our company thrives on creativity, powered by brilliant minds shaping the future — proud to be a part of this journey.",
	    "role": "Team Engineering - San Jose, CA."
	   },
	   {
	    "author": "Linda",
	    "avatar": {
	     "kind": "url",
	     "value": "/lumotive/img/testimonial-linda.jpg"
	    },
	    "quote": "Working at Lumotive combines the best engineering experiences in my career all in one place: collaboration with brilliant, motivated colleagues; empowerment to define top priorities for success and tools to achieve them; and opportunities to innovate trailblazing technology.",
	    "role": "Team Engineering - Redmond, WA."
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "testimonialsPeelScene",
	  "width": "contained"
	 },
	 {
	  "anchor": "awards",
	  "background": "none",
	  "cards": [
	   {
	    "linkUrl": "https://www.ces.tech/innovation-awards/2025/ylm-10lx-3d-lidar-sensor/",
	    "title": "CES 2025 Innovation Awards",
	    "year": "2025"
	   },
	   {
	    "linkUrl": "https://www.laserfocusworld.com/home/article/55130256/2024-innovators-awards-meet-the-honorees",
	    "title": "Laser Focus World 2024 Innovators Awards",
	    "year": "2024"
	   },
	   {
	    "linkUrl": "https://www.gsaglobal.org/the-2024-gsa-award-nominees-revealed/",
	    "title": "GSA Awards 2024 Startup to Watch Finalist",
	    "year": "2024"
	   },
	   {
	    "linkUrl": "https://www.ces.tech/innovation-awards/honorees/2024/honorees/l/lumotive-lm10-chip.aspx",
	    "title": "CES 2024 Innovation Awards",
	    "year": "2024"
	   },
	   {
	    "linkUrl": "https://www.fastcompany.com/90979340/next-big-things-tech-transportation-2023",
	    "title": "Fast Company Next Big Things in Tech 2023",
	    "year": "2023"
	   },
	   {
	    "linkUrl": "https://lumotive.reportablenews.com/pr/consumer-technology-association-recognizes-lumotive-with-two-ces-2022-innovation-awards",
	    "title": "CES 2022 Innovation Awards",
	    "year": "2022"
	   },
	   {
	    "linkUrl": "https://www.businesswire.com/news/home/20220126005964/en/2022-SPIE-and-Photonics-Media-Prism-Awards-Celebrate-Innovative-Photonics-Technologies",
	    "title": "SPIE 2022 PRISM Award",
	    "year": "2022"
	   },
	   {
	    "linkUrl": "https://www.bintelligence.com/posts/6-people-26-companies-and-65-products-awarded-for-excellence-in-artificial-intelligence",
	    "title": "Business Intelligence 2022 Excellence in AI",
	    "year": "2022"
	   }
	  ],
	  "designVersion": "awardCards",
	  "eyebrow": "Awards and recognition",
	  "heading": "Recognized across the industry",
	  "id": "f70b28d5",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsAwardCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>See current opportunities across engineering, product, operations and the teams supporting Lumotive’s growth.</p>",
	  "designVersion": "splitLinks",
	  "eyebrow": "The team is growing",
	  "heading": "Bring your ambition to Lumotive",
	  "id": "8c3ed872",
	  "primaryLink": {
	   "label": "Browse open positions",
	   "newTab": false,
	   "type": "custom",
	   "url": "https://jobs.lever.co/lumotive"
	  },
	  "primaryLinkLabel": "Browse open positions",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "https://jobs.lever.co/lumotive",
	  "secondaryLink": {
	   "label": "Learn about Lumotive",
	   "newTab": false,
	   "type": "custom",
	   "url": "/about"
	  },
	  "secondaryLinkLabel": "Learn about Lumotive",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "/about",
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaSplitLinks",
	  "width": "contained"
	 }
	]

const apply = (app, { page, sections }) => {
	let record
	try {
		record = app.findFirstRecordByFilter('pages', 'path = {:path}', { path: PAGE_PATH })
	} catch {
		return
	}
	if (!record) return

	for (const key of Object.keys(page)) record.set(key, page[key])
	record.set('sections', sections)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, { page: NEXT_PAGE, sections: NEXT_SECTIONS })
	},
	(app) => {
		apply(app, { page: PREV_PAGE, sections: PREV_SECTIONS })
	}
)
