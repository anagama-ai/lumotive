// Contact (/contact), approved content package rev. 2026-10-07, page 21 of 21.
// The route and the record are unchanged.
//
//   1 heroBand       KEEP AS IS. The eyebrow, heading and hero-contact.jpg
//                    already matched. Two corrections the page-01 copy rule
//                    requires: the subline is the package's sentence, which
//                    takes the serial comma and ends "find your next role"
//                    where staging ran on with "at Lumotive", and the hero
//                    carries no actions, where staging added "Careers" and
//                    "Find an office". The approved page prints neither.
//   2 formPipedrive  KEEP AS IS · FORM. The staging Pipedrive embed, its URL
//                    and its heading are untouched. NEW · HIDDEN FIELDS is
//                    component work, not data; see below.
//   3 cardsTextCards KEEP AS IS. "Lumotive Offices" and the four existing
//                    addresses, untouched but for the container alignment.
//                    Webvizio #137 is the package's own pending input here and
//                    nothing is guessed: see below.
//   4 cardsTextCards NEW · CLOSING BLOCK. "Not Ready to Reach Out Yet?" with
//                    the three approved cards, replacing the staging
//                    "Looking for your next challenge?" CTA, which the
//                    approved composition does not carry. Restored by the down
//                    path.
//
// HIDDEN FIELDS. Page 02 asks every submission to carry the inquiry type a CTA
// set through `?inquiry=`, the page the visitor came from, and any UTM
// campaign. The form lives inside Pipedrive's iframe, so the parent page cannot
// inject fields into it; what it can do is prefill them, which Pipedrive does
// from query parameters on the form URL keyed by each field's own API key.
// formPipedrive now captures all three values and appends them for whichever
// keys are configured. The keys exist only once the hidden fields are added
// inside Pipedrive and are not ours to guess, so they stay unset here and the
// embed is byte-identical to the one that ships today. Supplying them is a
// data-only edit to this one section.
//
// CLOSING BLOCK DESTINATIONS. "Dev kits" goes to /dev-kits and "Careers" to the
// Lever board, which is the destination /about and /culture already use.
// "Interactive explorer" goes to /platform: the site map puts the explorer at
// /lcm-explorer/, but that bundle is still an unsupplied asset and the route
// does not exist, and page 03 places the explorer itself on the Platform page.
// Pointing the card at a 404 is not an option and inventing a route is not
// either, so it goes to the page that will host the explorer, and becomes
// /lcm-explorer/ in one field once the bundle is hosted.
//
// HELD, NOTHING INVENTED IN ITS PLACE: the LinkedIn follow line the package
// prints under the closing block. The LinkedIn URL is still the unresolved
// input recorded in 1787708000_footer_sitemap.js, which also holds back the
// footer icon and the same line on /about, /culture and /news.
//
// OFFICE ADDRESSES. The package's pending box asks Lumotive which address is
// incorrect (#137). Until they say which, every address stays exactly as it is
// on staging: correcting the wrong one, or guessing at a correction, would be
// worse than leaving all four as published.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'contact'

const NEXT_PAGE = {
	seoTitle: 'Contact',
	seoDescription:
		'Evaluate programmable 3D sensing, discuss optical connectivity, or find your next role.'
}

const PREV_PAGE = {
	seoTitle: "",
	seoDescription: ""
}

const NEXT_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Evaluate programmable 3D sensing, discuss optical connectivity, or find your next role.</p>",
	  "designVersion": "band",
	  "eyebrow": "Contact Lumotive",
	  "heading": "Start with the team closest to your project",
	  "id": "ad9c07fe",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-contact.jpg"
	  },
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "heroBand",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "enquiries",
	  "background": "none",
	  "designVersion": "pipedrive",
	  "eyebrow": "How can we help?",
	  "formUrl": "https://webforms.pipedrive.com/f/31lkaELFMo0BDvBhsaRvd2vKXljrekefvh9YWPmcwdaLZVwnKruGDasdAlpSd4Hp9",
	  "heading": "Tell us about your project",
	  "id": "f1d7c3a2",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "formPipedrive",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "offices",
	  "background": "subtle",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>4104 148th Ave NE, Redmond, WA 98052, USA</p>",
	    "eyebrow": "Corporate headquarters",
	    "title": "Redmond, Washington"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>1900 McCarthy Blvd, Suite 420, Milpitas, CA 95035, USA</p>",
	    "eyebrow": "United States",
	    "title": "Milpitas, California"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>4664 Lougheed Hwy #162, Burnaby, BC V5C 5T5, Canada</p>",
	    "eyebrow": "Canada",
	    "title": "Burnaby, British Columbia"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>18 MOD Building, Office #301, Seeb 112, Oman</p>",
	    "eyebrow": "Oman",
	    "title": "Muscat"
	   }
	  ],
	  "designVersion": "textCards",
	  "eyebrow": "Global presence",
	  "heading": "Lumotive offices",
	  "id": "fbfa54dc",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsTextCards",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "id": "6d2f10ba",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "not-ready",
	  "heading": "Not ready to reach out yet?",
	  "columns": "3",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Find your dev kit",
	    "body": "<p>Compare kits and pick a starting point.</p>",
	    "accent": "accent1",
	    "link": {
	     "type": "custom",
	     "url": "/dev-kits",
	     "label": "Dev kits",
	     "newTab": false
	    },
	    "linkLabel": "Dev kits",
	    "linkUrl": "/dev-kits",
	    "linkNewTab": false
	   },
	   {
	    "title": "See LCM in action",
	    "body": "<p>Explore how programmable optics work.</p>",
	    "accent": "accent2",
	    "link": {
	     "type": "custom",
	     "url": "/platform",
	     "label": "Interactive explorer",
	     "newTab": false
	    },
	    "linkLabel": "Interactive explorer",
	    "linkUrl": "/platform",
	    "linkNewTab": false
	   },
	   {
	    "title": "Join the team",
	    "body": "<p>See open roles across our offices.</p>",
	    "accent": "accent3",
	    "link": {
	     "type": "custom",
	     "url": "https://jobs.lever.co/lumotive",
	     "label": "Careers",
	     "newTab": true
	    },
	    "linkLabel": "Careers",
	    "linkUrl": "https://jobs.lever.co/lumotive",
	    "linkNewTab": "true"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "lg",
	  "spacingBottom": "lg"
	 }
	]

const PREV_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Evaluate programmable 3D sensing, discuss optical connectivity or find your next role at Lumotive.</p>",
	  "designVersion": "band",
	  "eyebrow": "Contact Lumotive",
	  "heading": "Start with the team closest to your project",
	  "id": "ad9c07fe",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-contact.jpg"
	  },
	  "primaryLink": {
	   "label": "Careers",
	   "newTab": false,
	   "type": "custom",
	   "url": "https://jobs.lever.co/lumotive"
	  },
	  "primaryLinkLabel": "Careers",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "https://jobs.lever.co/lumotive",
	  "secondaryLink": {
	   "label": "Find an office",
	   "newTab": false,
	   "type": "custom",
	   "url": "#offices"
	  },
	  "secondaryLinkLabel": "Find an office",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "#offices",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "heroBand",
	  "width": "contained"
	 },
	 {
	  "anchor": "enquiries",
	  "background": "none",
	  "designVersion": "pipedrive",
	  "eyebrow": "How can we help?",
	  "formUrl": "https://webforms.pipedrive.com/f/31lkaELFMo0BDvBhsaRvd2vKXljrekefvh9YWPmcwdaLZVwnKruGDasdAlpSd4Hp9",
	  "heading": "Tell us about your project",
	  "id": "f1d7c3a2",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "formPipedrive",
	  "width": "contained"
	 },
	 {
	  "anchor": "offices",
	  "background": "subtle",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>4104 148th Ave NE, Redmond, WA 98052, USA</p>",
	    "eyebrow": "Corporate headquarters",
	    "title": "Redmond, Washington"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>1900 McCarthy Blvd, Suite 420, Milpitas, CA 95035, USA</p>",
	    "eyebrow": "United States",
	    "title": "Milpitas, California"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>4664 Lougheed Hwy #162, Burnaby, BC V5C 5T5, Canada</p>",
	    "eyebrow": "Canada",
	    "title": "Burnaby, British Columbia"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>18 MOD Building, Office #301, Seeb 112, Oman</p>",
	    "eyebrow": "Oman",
	    "title": "Muscat"
	   }
	  ],
	  "designVersion": "textCards",
	  "eyebrow": "Global presence",
	  "heading": "Lumotive offices",
	  "id": "fbfa54dc",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsTextCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Lumotive is growing across engineering, product, operations and the teams that support its customers.</p>",
	  "designVersion": "splitLinks",
	  "eyebrow": "Life at Lumotive",
	  "heading": "Looking for your next challenge?",
	  "id": "9ab67cf3",
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
	   "label": "Explore our culture",
	   "newTab": false,
	   "type": "custom",
	   "url": "/culture"
	  },
	  "secondaryLinkLabel": "Explore our culture",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "/culture",
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
