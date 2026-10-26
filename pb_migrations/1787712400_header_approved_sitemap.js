// Site header. Approved content package rev. 2026-10-07, page 01 site map and
// page 02 "Top Navigation, Fully Expanded".
//
// The Sense group was brought to the approved list when pages 10, 11, 13, 14
// and 15 shipped. The other three groups never were, and the final audit found
// what that cost:
//
//   - Platform was a bare link with no dropdown, so its two approved children
//     had nowhere to live. /lcm-chips, which shipped as package page 07, was
//     UNREACHABLE FROM THE HEADER ENTIRELY.
//   - Applications sat as its own top-level group. The site map puts it under
//     Platform as entry 1.3, not beside it.
//   - Company carried a "Careers" entry pointing at the Lever board. The site
//     map's Company group is About, Culture & Careers, Partners and News &
//     Events; careers reach the visitor through Culture & Careers.
//   - Several labels were short forms the site map does not use.
//
// The menu becomes the approved one, in the approved order:
//
//   Platform   LCM Technology /platform · LCM Chips /lcm-chips ·
//              Applications /applications
//   Sense      Overview · Robotics · Automotive ·
//              Dev Kits & Reference Designs (Transmit Modules, iToF, dToF)
//   Connect    /connect, a direct link with no dropdown, as the site map shows
//   Company    About · Culture & Careers · Partners · News & Events
//   Contact    the button, unchanged
//
// Data only. The dropdown markup, its hover and tap behaviour, the mobile
// accordion and every style are untouched: the header component already
// renders groups, children and grandchildren from exactly this shape, and the
// Sense group proves all three levels work.
//
// The small descriptive line under each entry is chrome rather than approved
// copy, so the three new ones are taken from the pages' own approved hero
// sublines rather than written fresh: "Software-defined light control, built
// on optical semiconductor technology" from /platform, "Solid-state
// beamforming on a semiconductor" from /lcm-chips — already in Claudia's
// renamed wording — and "One semiconductor platform, many ways to put light to
// work" from /applications.
//
// ONE APPROVED BEHAVIOUR IS STILL MISSING, and it is a component change rather
// than data: page 02 says clicking a top-level label goes to the URL beside it,
// while the component renders the label as a plain <details> summary. Every
// destination is reachable because the first child of each group carries the
// group's own URL — LCM Technology is /platform, About is /about — so no link
// is lost. Recorded for a later pass.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const NEXT_DATA = {
	 "buttons": [
	  {
	   "link": {
	    "appearance": "default",
	    "label": "Contact",
	    "newTab": false,
	    "type": "custom",
	    "url": "/contact"
	   },
	   "linkLabel": "Contact",
	   "linkNewTab": false,
	   "linkUrl": "/contact"
	  }
	 ],
	 "items": [
	  {
	   "blockType": "sub",
	   "label": "Platform",
	   "subitems": [
	    {
	     "Description": "Software-defined light control, built on optical semiconductor technology",
	     "link": {
	      "label": "LCM Technology",
	      "newTab": false,
	      "type": "custom",
	      "url": "/platform"
	     },
	     "linkLabel": "LCM Technology",
	     "linkNewTab": false,
	     "linkUrl": "/platform"
	    },
	    {
	     "Description": "Solid-state beamforming on a semiconductor",
	     "link": {
	      "label": "LCM Chips",
	      "newTab": false,
	      "type": "custom",
	      "url": "/lcm-chips"
	     },
	     "linkLabel": "LCM Chips",
	     "linkNewTab": false,
	     "linkUrl": "/lcm-chips"
	    },
	    {
	     "Description": "One semiconductor platform, many ways to put light to work",
	     "link": {
	      "label": "Applications",
	      "newTab": false,
	      "type": "custom",
	      "url": "/applications"
	     },
	     "linkLabel": "Applications",
	     "linkNewTab": false,
	     "linkUrl": "/applications"
	    }
	   ]
	  },
	  {
	   "blockType": "sub",
	   "label": "Sense",
	   "subitems": [
	    {
	     "Description": "Software-defined 3D sensing for Physical AI",
	     "link": {
	      "label": "Overview",
	      "newTab": false,
	      "type": "custom",
	      "url": "/sense"
	     },
	     "linkLabel": "Overview",
	     "linkNewTab": false,
	     "linkUrl": "/sense"
	    },
	    {
	     "Description": "Adaptive 3D sensing for robots and humanoids",
	     "link": {
	      "label": "Robotics",
	      "newTab": false,
	      "type": "custom",
	      "url": "/sense/robotics"
	     },
	     "linkLabel": "Robotics",
	     "linkNewTab": false,
	     "linkUrl": "/sense/robotics"
	    },
	    {
	     "Description": "Surround sensing for vehicles and heavy equipment",
	     "link": {
	      "label": "Automotive",
	      "newTab": false,
	      "type": "custom",
	      "url": "/sense/automotive"
	     },
	     "linkLabel": "Automotive",
	     "linkNewTab": false,
	     "linkUrl": "/sense/automotive"
	    },
	    {
	     "Description": "Evaluate LCM in your own system",
	     "link": {
	      "label": "Dev Kits & Reference Designs",
	      "newTab": false,
	      "type": "custom",
	      "url": "/dev-kits"
	     },
	     "linkLabel": "Dev Kits & Reference Designs",
	     "linkNewTab": false,
	     "linkUrl": "/dev-kits",
	     "subitems": [
	      {
	       "link": {
	        "label": "Transmit modules",
	        "newTab": false,
	        "type": "custom",
	        "url": "/dev-kits/transmit-modules"
	       },
	       "linkLabel": "Transmit modules",
	       "linkNewTab": false,
	       "linkUrl": "/dev-kits/transmit-modules"
	      },
	      {
	       "link": {
	        "label": "iToF dev kits",
	        "newTab": false,
	        "type": "custom",
	        "url": "/dev-kits/itof"
	       },
	       "linkLabel": "iToF dev kits",
	       "linkNewTab": false,
	       "linkUrl": "/dev-kits/itof"
	      },
	      {
	       "link": {
	        "label": "dToF dev kits",
	        "newTab": false,
	        "type": "custom",
	        "url": "/dev-kits/dtof"
	       },
	       "linkLabel": "dToF dev kits",
	       "linkNewTab": false,
	       "linkUrl": "/dev-kits/dtof"
	      }
	     ]
	    }
	   ]
	  },
	  {
	   "blockType": "link",
	   "link": {
	    "label": "Connect",
	    "newTab": false,
	    "type": "custom",
	    "url": "/connect"
	   },
	   "linkLabel": "Connect",
	   "linkNewTab": false,
	   "linkUrl": "/connect"
	  },
	  {
	   "blockType": "sub",
	   "label": "Company",
	   "subitems": [
	    {
	     "Description": "Lumotive's story, leadership and investors",
	     "link": {
	      "label": "About",
	      "newTab": false,
	      "type": "custom",
	      "url": "/about"
	     },
	     "linkLabel": "About",
	     "linkNewTab": false,
	     "linkUrl": "/about"
	    },
	    {
	     "Description": "Values, working at Lumotive and open positions",
	     "link": {
	      "label": "Culture & Careers",
	      "newTab": false,
	      "type": "custom",
	      "url": "/culture"
	     },
	     "linkLabel": "Culture & Careers",
	     "linkNewTab": false,
	     "linkUrl": "/culture"
	    },
	    {
	     "Description": "Distribution, customer and technology ecosystem",
	     "link": {
	      "label": "Partners",
	      "newTab": false,
	      "type": "custom",
	      "url": "/partners"
	     },
	     "linkLabel": "Partners",
	     "linkNewTab": false,
	     "linkUrl": "/partners"
	    },
	    {
	     "Description": "Latest company news and announcements",
	     "link": {
	      "label": "News & Events",
	      "newTab": false,
	      "type": "custom",
	      "url": "/news"
	     },
	     "linkLabel": "News & Events",
	     "linkNewTab": false,
	     "linkUrl": "/news"
	    }
	   ]
	  }
	 ]
	}

const PREV_DATA = {
	 "buttons": [
	  {
	   "link": {
	    "appearance": "default",
	    "label": "Contact",
	    "newTab": false,
	    "type": "custom",
	    "url": "/contact"
	   },
	   "linkLabel": "Contact",
	   "linkNewTab": false,
	   "linkUrl": "/contact"
	  }
	 ],
	 "items": [
	  {
	   "blockType": "link",
	   "link": {
	    "label": "Platform",
	    "newTab": false,
	    "type": "custom",
	    "url": "/platform"
	   },
	   "linkLabel": "Platform",
	   "linkNewTab": false,
	   "linkUrl": "/platform"
	  },
	  {
	   "blockType": "sub",
	   "label": "Sense",
	   "subitems": [
	    {
	     "Description": "Software-defined 3D sensing for Physical AI",
	     "link": {
	      "label": "Overview",
	      "newTab": false,
	      "type": "custom",
	      "url": "/sense"
	     },
	     "linkLabel": "Overview",
	     "linkNewTab": false,
	     "linkUrl": "/sense"
	    },
	    {
	     "Description": "Adaptive 3D sensing for robots and humanoids",
	     "link": {
	      "label": "Robotics",
	      "newTab": false,
	      "type": "custom",
	      "url": "/sense/robotics"
	     },
	     "linkLabel": "Robotics",
	     "linkNewTab": false,
	     "linkUrl": "/sense/robotics"
	    },
	    {
	     "Description": "Surround sensing for vehicles and heavy equipment",
	     "link": {
	      "label": "Automotive",
	      "newTab": false,
	      "type": "custom",
	      "url": "/sense/automotive"
	     },
	     "linkLabel": "Automotive",
	     "linkNewTab": false,
	     "linkUrl": "/sense/automotive"
	    },
	    {
	     "Description": "Evaluate LCM in your own system",
	     "link": {
	      "label": "Dev kits",
	      "newTab": false,
	      "type": "custom",
	      "url": "/dev-kits"
	     },
	     "linkLabel": "Dev kits",
	     "linkNewTab": false,
	     "linkUrl": "/dev-kits",
	     "subitems": [
	      {
	       "link": {
	        "label": "Transmit modules",
	        "newTab": false,
	        "type": "custom",
	        "url": "/dev-kits/transmit-modules"
	       },
	       "linkLabel": "Transmit modules",
	       "linkNewTab": false,
	       "linkUrl": "/dev-kits/transmit-modules"
	      },
	      {
	       "link": {
	        "label": "iToF dev kits",
	        "newTab": false,
	        "type": "custom",
	        "url": "/dev-kits/itof"
	       },
	       "linkLabel": "iToF dev kits",
	       "linkNewTab": false,
	       "linkUrl": "/dev-kits/itof"
	      },
	      {
	       "link": {
	        "label": "dToF dev kits",
	        "newTab": false,
	        "type": "custom",
	        "url": "/dev-kits/dtof"
	       },
	       "linkLabel": "dToF dev kits",
	       "linkNewTab": false,
	       "linkUrl": "/dev-kits/dtof"
	      }
	     ]
	    }
	   ]
	  },
	  {
	   "blockType": "link",
	   "link": {
	    "label": "Connect",
	    "newTab": false,
	    "type": "custom",
	    "url": "/connect"
	   },
	   "linkLabel": "Connect",
	   "linkNewTab": false,
	   "linkUrl": "/connect"
	  },
	  {
	   "blockType": "sub",
	   "label": "Applications",
	   "subitems": [
	    {
	     "Description": "Programmable optics across applications",
	     "link": {
	      "label": "Overview",
	      "newTab": false,
	      "type": "custom",
	      "url": "/applications"
	     },
	     "linkLabel": "Overview",
	     "linkNewTab": false,
	     "linkUrl": "/applications"
	    },
	    {
	     "Description": "Adaptive 3D sensing for robots and humanoids",
	     "link": {
	      "label": "Robotics",
	      "newTab": false,
	      "type": "custom",
	      "url": "/sense/robotics"
	     },
	     "linkLabel": "Robotics",
	     "linkNewTab": false,
	     "linkUrl": "/sense/robotics"
	    },
	    {
	     "Description": "Surround sensing for vehicles and heavy equipment",
	     "link": {
	      "label": "Automotive",
	      "newTab": false,
	      "type": "custom",
	      "url": "/sense/automotive"
	     },
	     "linkLabel": "Automotive",
	     "linkNewTab": false,
	     "linkUrl": "/sense/automotive"
	    }
	   ]
	  },
	  {
	   "blockType": "sub",
	   "label": "Company",
	   "subitems": [
	    {
	     "Description": "Lumotive’s story, leadership and investors",
	     "link": {
	      "label": "About",
	      "newTab": false,
	      "type": "custom",
	      "url": "/about"
	     },
	     "linkLabel": "About",
	     "linkNewTab": false,
	     "linkUrl": "/about"
	    },
	    {
	     "Description": "Values, working at Lumotive and open positions",
	     "link": {
	      "label": "Culture",
	      "newTab": false,
	      "type": "custom",
	      "url": "/culture"
	     },
	     "linkLabel": "Culture",
	     "linkNewTab": false,
	     "linkUrl": "/culture"
	    },
	    {
	     "Description": "Distribution, customer and technology ecosystem",
	     "link": {
	      "label": "Partners",
	      "newTab": false,
	      "type": "custom",
	      "url": "/partners"
	     },
	     "linkLabel": "Partners",
	     "linkNewTab": false,
	     "linkUrl": "/partners"
	    },
	    {
	     "Description": "Latest company news and announcements",
	     "link": {
	      "label": "News",
	      "newTab": false,
	      "type": "custom",
	      "url": "/news"
	     },
	     "linkLabel": "News",
	     "linkNewTab": false,
	     "linkUrl": "/news"
	    },
	    {
	     "Description": "Browse open positions",
	     "link": {
	      "label": "Careers",
	      "newTab": false,
	      "type": "custom",
	      "url": "https://jobs.lever.co/lumotive"
	     },
	     "linkLabel": "Careers",
	     "linkNewTab": false,
	     "linkUrl": "https://jobs.lever.co/lumotive"
	    }
	   ]
	  }
	 ]
	}

const apply = (app, data) => {
	let record
	try {
		record = app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'header' })
	} catch {
		return
	}
	if (!record) return

	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, NEXT_DATA)
	},
	(app) => {
		apply(app, PREV_DATA)
	}
)
