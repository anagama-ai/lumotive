// Company › Partners (/partners), approved content package rev. 2026-10-07,
// page 19 of 21. The route and the record are unchanged.
//
// The approved page is five blocks, where staging carried six strips:
//
//   1 heroBand        KEEP AS IS. The eyebrow, heading and hero-partners.jpg
//                     already matched. Two corrections the page-01 copy rule
//                     requires: the subline is the package's sentence, which
//                     opens "We work with" where staging opened "Lumotive works
//                     with" and adds the serial comma, and the hero carries the
//                     one printed action. Staging's "Explore the ecosystem"
//                     second action is not on the approved page.
//   2 logosGridOnDark CHANGE · MERGES CUSTOMERS AND MODULE PARTNERS (Webvizio
//                     #121, #122). "Customers shipping LCM-powered products"
//                     becomes "Module and Solution Providers", the shared
//                     component page 03 defines. Its descriptor is dropped
//                     ("No descriptors"), it carries no links ("no external
//                     links", which is also the page-01 site-wide removal), and
//                     the marks are larger, which is #135.
//   3 logosGridOnDark CHANGE · MERGES TECHNOLOGY AND COMPONENT PARTNERS (#135,
//                     #136). "3D sensing component partners" becomes
//                     "Technology Partners" and absorbs the single-logo
//                     "Software partner" strip, so MulticoreWare joins the one
//                     list. The order is the package's. Its descriptor is
//                     dropped with the merge. FORTSENSE IS REMOVED, which the
//                     dev note here and the page-01 site-wide removals both
//                     require; the file stays in the repository, unreferenced.
//   4 logosLabelled   KEEP AS IS. "Distribution Partners" and its four marks,
//                     untouched but for the container alignment.
//   5 ctaSpectrum     NEW · CLOSING CTA. "Build With Us" with the approved
//                     sentence and the single printed action, carrying the
//                     inquiry value the dev note names, partnership.
//
// The "Software partner" strip is removed by the merge in block 3, and is
// restored by the down path along with everything else.
//
// LIGHT PANELS, NOT DARK. Staging set both of these strips on the dark panel,
// where they were close to invisible: every partner mark here is a coloured or
// near-black wordmark drawn for a light background, and unlike the investor
// logos on /about none of them has a white variant in this repository.
// Inverting artwork is not ours to do, so both strips take the same light
// panel the Distribution Partners strip has always used, which also gives the
// three partner strips one treatment.
//
// LOGO SIZE (#135). The marks each shipped inside a canvas that was mostly
// empty — measured, content filled 15% to 52% of the file — so the CSS caps
// were sizing padding rather than the logo. All fourteen PNGs are cropped to
// their own content in the same commit, a lossless crop with no scaling and no
// stretching, which is what makes them larger. Blocks 2 and 3 also take
// `layout: "centered"`, so three marks and seven marks centre rather than
// hanging off the left of a five-column grid.
//
// HELD, NOTHING INVENTED IN ITS PLACE. Two named partners have no logo in this
// repository and none is fabricated:
//   - Leopard Imaging, first in the Module and Solution Providers order. Its
//     absence is why Webvizio #121 stays open; the strip ships with the three
//     marks that exist, in the package's relative order.
//   - onsemi, first in the Technology Partners order. The strip ships with the
//     other seven, in the package's order.
// Both are a one-entry data edit once the artwork arrives.
//
// ELECTRONIC PHOTONICS. Package page 04 lists the logo as a pending input, and
// earlier handoffs recorded this strip as blocked on it because the file is
// named ephotonics.png. The artwork itself was checked: it is a wordmark
// reading "≡ PHOTONICS", with the E set as three bars, and it carries none of
// the "e-Photonics" spelling page 01 removes. Only the CMS label did, and that
// label is now "Electronic Photonics". The mark is kept and the pending input
// becomes a swap rather than a blocker.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'partners'

const NEXT_PAGE = {
	seoTitle: 'Partners',
	seoDescription:
		'We work with distributors, customers, software specialists, and component leaders to turn programmable optics into production systems.'
}

const PREV_PAGE = {
	seoTitle: "",
	seoDescription: ""
}

const NEXT_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>We work with distributors, customers, software specialists, and component leaders to turn programmable optics into production systems.</p>",
	  "designVersion": "band",
	  "eyebrow": "Lumotive ecosystem",
	  "heading": "Building programmable optics together",
	  "id": "e95fe8b0",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-partners.jpg"
	  },
	  "primaryLink": {
	   "label": "Talk to our team",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "primaryLinkLabel": "Talk to our team",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "heroBand",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "providers",
	  "background": "none",
	  "designVersion": "gridOnDark",
	  "heading": "Module and solution providers",
	  "id": "c5fe1eab",
	  "logos": [
	   {
	    "name": "Namuga",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/namuga.png"
	    }
	   },
	   {
	    "name": "Hokuyo",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/hokuyo.png"
	    }
	   },
	   {
	    "name": "Electronic Photonics",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/ephotonics.png"
	    }
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "logosLabelled",
	  "width": "contained",
	  "layout": "centered",
	  "align": "container"
	 },
	 {
	  "anchor": "technology",
	  "background": "none",
	  "designVersion": "gridOnDark",
	  "heading": "Technology partners",
	  "id": "3138ddf9",
	  "logos": [
	   {
	    "name": "Lumentum",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/lumentum.png"
	    }
	   },
	   {
	    "name": "Vertilite",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/vertilite.png"
	    }
	   },
	   {
	    "name": "Gpixel",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/gpixel.png"
	    }
	   },
	   {
	    "name": "ADAPS",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/adaps.png"
	    }
	   },
	   {
	    "name": "Lattice",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/lattice.png"
	    }
	   },
	   {
	    "name": "SolidVue",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/solidvue.png"
	    }
	   },
	   {
	    "name": "MulticoreWare",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/multicoreware.png"
	    }
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "logosLabelled",
	  "width": "contained",
	  "layout": "centered",
	  "align": "container"
	 },
	 {
	  "anchor": "distribution",
	  "background": "none",
	  "designVersion": "labelled",
	  "heading": "Distribution partners",
	  "id": "7c333883",
	  "intro": "Regional partners helping customers evaluate, source and deploy Lumotive technology.",
	  "logos": [
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/edom.png"
	    },
	    "name": "EDOM Technology"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/uniquest.png"
	    },
	    "name": "Uniquest"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/restar.png"
	    },
	    "name": "Restar"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/macnica.png"
	    },
	    "name": "Macnica"
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "logosLabelled",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Module makers, system integrators, and distributors: let us talk about bringing programmable optics to your customers.</p>",
	  "designVersion": "spectrum",
	  "heading": "Build with us",
	  "id": "daf9e626",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=partnership",
	   "label": "Talk to us about partnering",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Talk to us about partnering",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact?inquiry=partnership",
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaSpectrum",
	  "width": "contained",
	  "align": "container"
	 }
	]

const PREV_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Lumotive works with distributors, customers, software specialists and component leaders to turn programmable optics into production systems.</p>",
	  "designVersion": "band",
	  "eyebrow": "Lumotive ecosystem",
	  "heading": "Building programmable optics together",
	  "id": "e95fe8b0",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-partners.jpg"
	  },
	  "primaryLink": {
	   "label": "Talk to our team",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "primaryLinkLabel": "Talk to our team",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact",
	  "secondaryLink": {
	   "label": "Explore the ecosystem",
	   "newTab": false,
	   "type": "custom",
	   "url": "#distribution"
	  },
	  "secondaryLinkLabel": "Explore the ecosystem",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "#distribution",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "heroBand",
	  "width": "contained"
	 },
	 {
	  "anchor": "distribution",
	  "background": "none",
	  "designVersion": "labelled",
	  "heading": "Distribution partners",
	  "id": "7c333883",
	  "intro": "Regional partners helping customers evaluate, source and deploy Lumotive technology.",
	  "logos": [
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/edom.png"
	    },
	    "name": "EDOM Technology"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/uniquest.png"
	    },
	    "name": "Uniquest"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/restar.png"
	    },
	    "name": "Restar"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/macnica.png"
	    },
	    "name": "Macnica"
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "logosLabelled",
	  "width": "contained"
	 },
	 {
	  "anchor": "customers",
	  "background": "none",
	  "designVersion": "gridOnDark",
	  "heading": "Customers shipping LCM-powered products",
	  "id": "c5fe1eab",
	  "intro": "Companies bringing solid-state 3D sensing products built on Lumotive technology to market.",
	  "logos": [
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/hokuyo.png"
	    },
	    "name": "Hokuyo"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/namuga.png"
	    },
	    "name": "Namuga"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/ephotonics.png"
	    },
	    "name": "e-Photonics"
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "logosGridOnDark",
	  "width": "full"
	 },
	 {
	  "anchor": "software",
	  "background": "none",
	  "designVersion": "labelled",
	  "heading": "Software partner",
	  "id": "e8ed2bab",
	  "intro": "Software expertise that helps customers move from optical hardware to complete sensing systems.",
	  "logos": [
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/multicoreware.png"
	    },
	    "name": "MultiCoreWare"
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "logosLabelled",
	  "width": "contained"
	 },
	 {
	  "anchor": "components",
	  "background": "none",
	  "designVersion": "gridOnDark",
	  "heading": "3D sensing component partners",
	  "id": "3138ddf9",
	  "intro": "An ecosystem of lasers, sensors, processing and semiconductor technology around the LCM platform.",
	  "logos": [
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/lumentum.png"
	    },
	    "name": "Lumentum"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/vertilite.png"
	    },
	    "name": "Vertilite"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/gpixel.png"
	    },
	    "name": "GPixel"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/adaps.png"
	    },
	    "name": "ADAPS Photonics"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/fortsense.png"
	    },
	    "name": "Fortsense"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/lattice.png"
	    },
	    "name": "Lattice Semiconductor"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/solidvue.png"
	    },
	    "name": "SolidVue"
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "logosGridOnDark",
	  "width": "full"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Talk with Lumotive about distribution, components, software integration, product development or optical connectivity.</p>",
	  "designVersion": "spectrum",
	  "eyebrow": "Partner with Lumotive",
	  "heading": "Bring programmable optics into your system",
	  "id": "daf9e626",
	  "primaryLink": {
	   "label": "Contact Lumotive",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "primaryLinkLabel": "Contact Lumotive",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact",
	  "secondaryLink": {
	   "label": "Explore the platform",
	   "newTab": false,
	   "type": "custom",
	   "url": "/platform"
	  },
	  "secondaryLinkLabel": "Explore the platform",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "/platform",
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaSpectrum",
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
