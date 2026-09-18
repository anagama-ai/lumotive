// Webvizio #59 (and the #60 / #66 form requests it supersedes): /contact drops
// the circular "Choose the right starting point" card flow (cardsTextCards, id
// "e43f1a85"), whose three cards pointed back out to /dev-kits, /connect and
// the careers board, and puts the live Pipedrive web form in its place.
//
// The embed is the one Josh approved, taken from lumotive.com/contact:
// https://webforms.pipedrive.com/f/31lkaELFMo0BDvBhsaRvd2vKXljrekefvh9YWPmcwdaLZVwnKruGDasdAlpSd4Hp9
// rendered by the new formPipedrive section, which mounts Pipedrive's own
// loader script in the container it ships with. The form keeps the section's
// "enquiries" anchor, so every existing "#enquiries" link now scrolls straight
// to it rather than to a card grid.
//
// The hero (id "ad9c07fe"), the "Lumotive offices" section and its "Find an
// office" link (anchor "offices"), and the closing careers CTA are untouched.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const CARDS_ID = 'e43f1a85'
const FORM_ID = 'f1d7c3a2'
const HERO_ID = 'ad9c07fe'

const FORM_SECTION = {
	id: FORM_ID,
	type: 'formPipedrive',
	eyebrow: 'How can we help?',
	heading: 'Tell us about your project',
	formUrl:
		'https://webforms.pipedrive.com/f/31lkaELFMo0BDvBhsaRvd2vKXljrekefvh9YWPmcwdaLZVwnKruGDasdAlpSd4Hp9',
	designVersion: 'pipedrive',
	background: 'none',
	width: 'contained',
	spacingTop: 'md',
	spacingBottom: 'md',
	anchor: 'enquiries'
}

const CARDS_SECTION = {
 "anchor": "enquiries",
 "background": "none",
 "cards": [
  {
   "accent": "accent1",
   "body": "<p>Compare development kits and reference designs for your field of view, range and form-factor requirements.</p>",
   "eyebrow": "Sense",
   "link": {
    "label": "Explore dev kits",
    "newTab": false,
    "type": "custom",
    "url": "/dev-kits"
   },
   "linkLabel": "Explore dev kits",
   "linkNewTab": false,
   "linkUrl": "/dev-kits",
   "title": "Evaluate LM10"
  },
  {
   "accent": "accent2",
   "body": "<p>Explore programmable optical circuit switching and communications for AI infrastructure and optical systems.</p>",
   "eyebrow": "Connect",
   "link": {
    "label": "Explore Lumotive Connect",
    "newTab": false,
    "type": "custom",
    "url": "/connect"
   },
   "linkLabel": "Explore Lumotive Connect",
   "linkNewTab": false,
   "linkUrl": "/connect",
   "title": "Discuss optical connectivity"
  },
  {
   "accent": "accent3",
   "body": "<p>Browse current opportunities and learn where your experience can make an impact.</p>",
   "eyebrow": "Careers",
   "link": {
    "label": "See open positions",
    "newTab": false,
    "type": "custom",
    "url": "https://jobs.lever.co/lumotive"
   },
   "linkLabel": "See open positions",
   "linkNewTab": false,
   "linkUrl": "https://jobs.lever.co/lumotive",
   "title": "Join the Lumotive team"
  }
 ],
 "designVersion": "textCards",
 "eyebrow": "How can we help?",
 "heading": "Choose the right starting point",
 "id": "e43f1a85",
 "spacingBottom": "md",
 "spacingTop": "md",
 "type": "cardsTextCards",
 "width": "contained"
}

const readSections = (record) => {
	try {
		const raw = record.getString('sections')
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

const findContactPage = (app) => {
	try {
		return app.findFirstRecordByFilter('pages', 'slug = {:slug}', { slug: 'contact' })
	} catch {
		return null
	}
}

// Swap `removeId` for `insert`, keeping the slot it occupied.
const swapSection = (app, removeId, insert) => {
	const record = findContactPage(app)
	if (!record) return

	const sections = readSections(record)
	if (sections.some((entry) => entry && entry.id === insert.id)) return

	const at = sections.findIndex((entry) => entry && entry.id === removeId)
	const next = sections.filter((entry) => entry && entry.id !== removeId)
	const hero = next.findIndex((entry) => entry && entry.id === HERO_ID)
	next.splice(at === -1 ? hero + 1 : at, 0, insert)

	record.set('sections', next)
	app.save(record)
}

migrate(
	(app) => {
		swapSection(app, CARDS_ID, FORM_SECTION)
	},
	(app) => {
		swapSection(app, FORM_ID, CARDS_SECTION)
	}
)
