// Sense › Dev Kits › iToF Dev Kits (/dev-kits/itof), approved content package
// rev. 2026-10-07, page 14 of 21. "NEW · CATEGORY PAGE, REPLACES M30 PAGE".
//
// Like page 13 this is a move and a rewrite. The existing /m30 record is
// renamed to /dev-kits/itof, parented to the Dev Kits hub, and its sections are
// swapped for the page-14 set, so the page keeps its id and its version
// history. /m30 then has no page, which is what lets the redirect in
// 1787710800_m30_to_itof_redirect.js answer it with the approved deep link to
// the M30 section.
//
// The page follows the package's category page frame: hero, quick guide, the
// three kit sections in the lidar kit template, one category feature, and the
// closing CTA. Each kit section is a group of sections sharing one anchor:
// an opener carrying the eyebrow, headline and subline; its spec tiles; its
// signature features; and its own action row. The anchors are #li140, #on140
// and #m30, which the site map requires and which the quick guide links to.
//
// SPEC BLOCKS. Every figure is the package's, character for character,
// including the qualifier lines ("7 m at 10%", "up to 900 Hz in ROIs",
// "~13 W total with NXP compute"). The package's own eight-tile maximum is
// respected: LI140 and M30 take eight, ON140 six. No spec tables, per the
// page-03 component spec.
//
// REMOVED WITH THE OLD M30 PAGE, as the page-14 dev note requires: the "A New
// Era" subtitle, the stereo comparison table, the "Where M30 Fits" grid, "Who
// M30 Is For", "A Mature Platform", the availability rows, the operating
// temperature and the klux figure. The down path restores all seven previous
// sections verbatim.
//
// INQUIRY VALUES. The three datasheet actions carry li140-datasheet,
// on140-datasheet and m30-datasheet, and the hero and closing CTA carry
// itof-evaluation, which is the page-03 list for this page in full. The three
// secondary "Talk to us about ..." actions have no value of their own on that
// list, so they carry itof-evaluation, the page-level value; if Lumotive wants
// them tracked separately the list needs three more values.
//
// NAVIGATION. The Sense dropdown gains "iToF dev kits" under Dev kits, entry
// 2.4.2 of the site map, beside the Transmit modules entry page 13 added.
// dToF Dev Kits is 2.4.3 and stays out until page 15 supplies its route.
//
// PENDING IMAGERY, nothing invented in its place:
//   - The hero's three-kit family photograph (LI140, ON140 and M30 together).
//     The page keeps the incumbent M30 kit photograph, a real Lumotive iToF kit
//     asset already on this record, rather than being stripped to a bare band.
//     Swapping `media` on the hero is a one-field change.
//   - The clean flash / LCM / stereo point-cloud renders for "Better Data,
//     Safer Robots", which package page 04 lists as a new asset and whose only
//     existing version carries the slide header, footer and confidentiality
//     line the package tells us not to use.
//   - The LI140 sensor head photograph and the ON140 bench-top kit photograph.
//     Neither exists in this repository.
//   - The warehouse shelving point cloud at high resolution, shared by the
//     LI140 and ON140 sections.
//   - The top-down scan diagram for "Software-Defined Scanning" and its
//     interactive five-tab mode selector. The approved mode data is copy, not
//     imagery, so the five modes ship as a card each with the package's own
//     figures and its range caveat; the diagram and the tab interaction follow
//     when the artwork arrives.
//   - The compact M30 AMR demo clip.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const NEXT_PATH = 'dev-kits/itof'
const PREV_PATH = 'm30'
const PARENT_PATH = 'dev-kits'

const NEXT_PAGE = {
	title: 'iToF Dev Kits',
	slug: 'itof',
	path: NEXT_PATH,
	status: 'published',
	seoTitle: 'iToF Dev Kits',
	seoDescription:
		'LCM beam steering extends iToF range to up to 30 m, with software-defined ROIs, virtual sensors, and HDR.'
}

const PREV_PAGE = {
	title: 'M30 Development Kit',
	slug: PREV_PATH,
	path: PREV_PATH,
	status: 'published',
	seoTitle: '',
	seoDescription: ''
}

const NEXT_SECTIONS = [
	 {
	  "id": "5a1c9f20",
	  "type": "heroBand",
	  "designVersion": "band",
	  "anchor": "",
	  "eyebrow": "iToF dev kits",
	  "heading": "Long-range iToF development kits",
	  "body": "<p>LCM beam steering extends iToF range to up to 30 m, with software-defined ROIs, virtual sensors, and HDR.</p>",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/m30-dev-hero.jpg"
	  },
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=itof-evaluation",
	   "label": "Set up an evaluation",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Set up an evaluation",
	  "primaryLinkUrl": "/contact?inquiry=itof-evaluation",
	  "primaryLinkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "none",
	  "spacingBottom": "none"
	 },
	 {
	  "id": "b8140c73",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "which-kit",
	  "heading": "Which iToF kit fits?",
	  "columns": "3",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Robot OEMs",
	    "body": "<p>Depth and color in one head, ready on Jetson.</p>",
	    "accent": "accent1",
	    "link": {
	     "type": "custom",
	     "url": "#li140",
	     "label": "LI140",
	     "newTab": false
	    },
	    "linkLabel": "LI140",
	    "linkUrl": "#li140",
	    "linkNewTab": false
	   },
	   {
	    "title": "Camera and module makers",
	    "body": "<p>Evaluate AF0130 + TX10 on a PC.</p>",
	    "accent": "accent2",
	    "link": {
	     "type": "custom",
	     "url": "#on140",
	     "label": "ON140",
	     "newTab": false
	    },
	    "linkLabel": "ON140",
	    "linkUrl": "#on140",
	    "linkNewTab": false
	   },
	   {
	    "title": "Embedded integration",
	    "body": "<p>Compact module for your own compute.</p>",
	    "accent": "accent3",
	    "link": {
	     "type": "custom",
	     "url": "#m30",
	     "label": "M30",
	     "newTab": false
	    },
	    "linkLabel": "M30",
	    "linkUrl": "#m30",
	    "linkNewTab": false
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "d4e09a21",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "better-data",
	  "eyebrow": "Same scene, three sensors",
	  "heading": "Better data, safer robots",
	  "intro": "Accurate point clouds with less noise, fewer artifacts, and fewer blind spots mean reliable detection of people, floors, and corners.",
	  "columns": "2",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Built for bright light",
	    "body": "<p>Concentrating laser power on one line at a time puts far more signal over ambient light than flash ToF.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Sees where stereo struggles",
	    "body": "<p>Active illumination delivers dense depth in low light and on low-texture surfaces such as plain walls and floors.</p>",
	    "accent": "accent2"
	   }
	  ],
	  "linkLabel": "Watch the comparison",
	  "linkUrl": "https://vimeo.com/1053591397",
	  "linkNewTab": "true",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "f27b6c40",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "li140",
	  "eyebrow": "LI140",
	  "heading": "Long-range, high-resolution integrated RGB-D module",
	  "body": "<p>140° × 105° iToF depth with LCM beam steering and a global-shutter color camera, in one sensor head.</p>",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "lg",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "a9c31e85",
	  "type": "statsLightTraits",
	  "designVersion": "specTiles",
	  "anchor": "li140-specs",
	  "stats": [
	   {
	    "label": "Field of view",
	    "value": "140° × 105°",
	    "description": ""
	   },
	   {
	    "label": "Range",
	    "value": "30 m max",
	    "description": "7 m at 10%"
	   },
	   {
	    "label": "Depth resolution",
	    "value": "Up to 1.2 MP",
	    "description": ""
	   },
	   {
	    "label": "Angular resolution",
	    "value": "~0.2°",
	    "description": "at VGA"
	   },
	   {
	    "label": "Frame rate",
	    "value": "30 Hz",
	    "description": "up to 47 Hz"
	   },
	   {
	    "label": "Color",
	    "value": "2.3 MP",
	    "description": "global shutter"
	   },
	   {
	    "label": "Host",
	    "value": "GMSL2",
	    "description": "NVIDIA Jetson AGX Orin"
	   },
	   {
	    "label": "Sensor head",
	    "value": "8 W",
	    "description": "127 × 46 × 41 mm"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "c60d2fb9",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "",
	  "columns": "4",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Software-defined modes",
	    "body": "<p>Change resolution, frame rate, ROIs, and virtual sensors on the fly.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Built for bright light",
	    "body": "<p>Line illumination puts far more signal over ambient light than flash ToF.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Wide 140° × 105° coverage",
	    "body": "<p>About twice a typical depth camera. Three to four units cover a full robot.</p>",
	    "accent": "accent3"
	   },
	   {
	    "title": "RGB-D, ready on Jetson",
	    "body": "<p>Global-shutter color and iToF depth over one GMSL2 link.</p>",
	    "accent": "accent1"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "31ae7d06",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "",
	  "heading": "High-resolution depth across a wide field",
	  "body": "<p>Up to 1.2 MP depth and ~0.2° angular resolution at VGA, enough detail to see individual bins and edges across a 140° × 105° field.</p>",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "7f50b3ec",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "",
	  "heading": "Software-defined scanning",
	  "columns": "5",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Balanced",
	    "body": "<p>VGA · 13 Hz · 4.5 m</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "High rate",
	    "body": "<p>VGA · 47 Hz · 2.5 m</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Max range",
	    "body": "<p>QVGA · 17 Hz · 7 m</p>",
	    "accent": "accent3"
	   },
	   {
	    "title": "AMR",
	    "body": "<p>QVGA · 30 Hz · 10 m slice / 3 m full field</p><p>Use it for navigation and docking at speed.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Object",
	    "body": "<p>1.2 MP · 15 Hz · scenes within 5 m</p>",
	    "accent": "accent2"
	   }
	  ],
	  "note": "Range to a 10% target. 30 m maximum range except 1.2 MP.",
	  "conclusion": "Plus everything LCM-based iToF does: software-defined ROIs and virtual sensors, HDR for bright targets, and reduced multipath and interference.",
	  "linkLabel": "See it in action on robots",
	  "linkUrl": "/sense/robotics",
	  "linkNewTab": false,
	  "outro": "In the kit: sensor head, NVIDIA Jetson AGX Orin, cables, Lumoview visualizer.",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "e13f94a7",
	  "type": "ctaSplitLinks",
	  "designVersion": "splitLinks",
	  "mode": "stacked",
	  "tone": "light",
	  "anchor": "",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=li140-datasheet",
	   "label": "Request the LI140 datasheet",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Request the LI140 datasheet",
	  "primaryLinkUrl": "/contact?inquiry=li140-datasheet",
	  "primaryLinkNewTab": false,
	  "secondaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=itof-evaluation",
	   "label": "Talk to us about LI140 on your robot",
	   "newTab": false
	  },
	  "secondaryLinkLabel": "Talk to us about LI140 on your robot",
	  "secondaryLinkUrl": "/contact?inquiry=itof-evaluation",
	  "secondaryLinkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "2b6e85d1",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "on140",
	  "eyebrow": "ON140",
	  "heading": "Scanning iToF evaluation kit for onsemi AF0130",
	  "body": "<p>The fastest way for camera and module makers to evaluate AF0130 + TX10 iToF depth on a Windows PC.</p>",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "lg",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "8c47a0f3",
	  "type": "statsLightTraits",
	  "designVersion": "specTiles",
	  "anchor": "on140-specs",
	  "columns": "4",
   "stats": [
	   {
	    "label": "Field of view",
	    "value": "140° × 105°",
	    "description": ""
	   },
	   {
	    "label": "Range",
	    "value": "30 m max",
	    "description": "7 m at 10%"
	   },
	   {
	    "label": "Depth resolution",
	    "value": "1.2 MP",
	    "description": "1280 × 960"
	   },
	   {
	    "label": "Angular resolution",
	    "value": "0.2°",
	    "description": "at VGA"
	   },
	   {
	    "label": "Frame rate",
	    "value": "30 Hz",
	    "description": "adjustable"
	   },
	   {
	    "label": "Host",
	    "value": "Windows PC",
	    "description": "USB3, onsemi DevWareX"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "5d92c6ba",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "",
	  "columns": "3",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Familiar onsemi software",
	    "body": "<p>Runs in onsemi DevWareX through a plugin developed by onsemi with our support.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Same depth path as LI140",
	    "body": "<p>Same AF0130 sensor and TX10 transmitter, so depth performance matches.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Developed with onsemi",
	    "body": "<p>A joint reference design. After evaluation, explore reference design licensing with onsemi and Lumotive.</p>",
	    "accent": "accent3"
	   }
	  ],
	  "conclusion": "Plus everything LCM-based iToF does: software-defined ROIs and virtual sensors, HDR for bright targets, and reduced multipath and interference.",
	  "outro": "In the kit: pre-assembled bench-top system with AF0130 receiver, TX10 transmitter, and USB3 adapter.",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "9a30fe52",
	  "type": "ctaSplitLinks",
	  "designVersion": "splitLinks",
	  "mode": "stacked",
	  "tone": "light",
	  "anchor": "",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=on140-datasheet",
	   "label": "Request the ON140 datasheet",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Request the ON140 datasheet",
	  "primaryLinkUrl": "/contact?inquiry=on140-datasheet",
	  "primaryLinkNewTab": false,
	  "secondaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=itof-evaluation",
	   "label": "Talk to us about designing with AF0130",
	   "newTab": false
	  },
	  "secondaryLinkLabel": "Talk to us about designing with AF0130",
	  "secondaryLinkUrl": "/contact?inquiry=itof-evaluation",
	  "secondaryLinkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "6e81d47c",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "m30",
	  "eyebrow": "M30",
	  "heading": "Embedded long-range iToF module",
	  "body": "<p>M30 extends the range of conventional ToF cameras by 5–6x, to 25 m, with active illumination that works on low-texture surfaces and in low light.</p><p>Built for AMRs, humanoids, drones, forklifts, industrial automation, and indoor surveillance.</p>",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/m30-dev-kit-contents.jpg"
	  },
	  "mediaPosition": "right",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "lg",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "0f5ab938",
	  "type": "statsLightTraits",
	  "designVersion": "specTiles",
	  "anchor": "m30-specs",
	  "stats": [
	   {
	    "label": "Range",
	    "value": "25 m",
	    "description": "85% target"
	   },
	   {
	    "label": "Range, 10% target",
	    "value": "10 m",
	    "description": ""
	   },
	   {
	    "label": "Field of view",
	    "value": "120° × 90°",
	    "description": "90° steering"
	   },
	   {
	    "label": "Frame rate",
	    "value": "10 Hz full frame",
	    "description": "up to 900 Hz in ROIs"
	   },
	   {
	    "label": "Resolution",
	    "value": "QVGA",
	    "description": "VGA supported"
	   },
	   {
	    "label": "Interface",
	    "value": "MIPI",
	    "description": "Ethernet with dev kit NXP compute"
	   },
	   {
	    "label": "Power",
	    "value": "8 W",
	    "description": "sensor head; ~13 W total with NXP compute"
	   },
	   {
	    "label": "Size",
	    "value": "55 × 35 × 25 mm",
	    "description": ""
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "ac72039e",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "",
	  "heading": "See it on your bench: three virtual sensors on one M30",
	  "body": "<p>Localization (long-range center slice), cliff detection (low ROI, short integration), and object avoidance (full field), each with its own frame rate.</p>",
	  "linkLabel": "Why this matters for your robot",
	  "linkUrl": "/sense/robotics",
	  "linkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "sm"
	 },
	 {
	  "id": "4b19d8f6",
	  "type": "ctaSplitLinks",
	  "designVersion": "splitLinks",
	  "mode": "stacked",
	  "tone": "light",
	  "anchor": "",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=m30-datasheet",
	   "label": "Request the M30 datasheet",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Request the M30 datasheet",
	  "primaryLinkUrl": "/contact?inquiry=m30-datasheet",
	  "primaryLinkNewTab": false,
	  "secondaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=itof-evaluation",
	   "label": "Talk to us about embedding M30 in your platform",
	   "newTab": false
	  },
	  "secondaryLinkLabel": "Talk to us about embedding M30 in your platform",
	  "secondaryLinkUrl": "/contact?inquiry=itof-evaluation",
	  "secondaryLinkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "cd6240b1",
	  "type": "ctaSplitLinks",
	  "designVersion": "splitLinks",
	  "mode": "stacked",
	  "anchor": "",
	  "heading": "Bring long-range iToF to your platform",
	  "headingSize": "statement",
	  "body": "<p>Tell us your target range, field of view, and host platform. We will send the right datasheets and set up your evaluation.</p>",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=itof-evaluation",
	   "label": "Set up an evaluation",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Set up an evaluation",
	  "primaryLinkUrl": "/contact?inquiry=itof-evaluation",
	  "primaryLinkNewTab": false,
	  "caveat": "Reference designs show what LCM enables. They are not optimized for size, cost, or qualification.",
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
	  "body": "<p>A New Era For 3D Sensing</p>",
	  "designVersion": "band",
	  "eyebrow": "M30 Development Kit",
	  "heading": "iToF Development Kit powered by LM10 Programmable Optics",
	  "id": "5a1c9f20",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/m30-dev-hero.jpg"
	  },
	  "primaryLink": {
	   "label": "Talk to an expert",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "primaryLinkLabel": "Talk to an expert",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact",
	  "secondaryLink": {
	   "label": "Learn more",
	   "newTab": false,
	   "type": "custom",
	   "url": "/lm10"
	  },
	  "secondaryLinkLabel": "Learn more",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "/lm10",
	  "spacingBottom": "none",
	  "spacingTop": "none",
	  "type": "heroBand",
	  "width": "contained"
	 },
	 {
	  "anchor": "key-features",
	  "background": "none",
	  "body": "<p>The M30 Lidar Module Reference Design unveils exciting opportunities in 3D sensing. Utilizing Light Control Metasurface (LCM™) solid-state beamforming technology, the M30 achieves a range of over 25 meters, demonstrating reliable performance both outdoors and in environments with reflectors or multipath interference, all while being compact—smaller than a credit card. This Reference Design exemplifies how solid-state LCM beamforming modules can revolutionize the development of affordable, high-performance lidar systems featuring remarkable software programmability.</p>",
	  "designVersion": "default",
	  "heading": "M30 Key Features",
	  "id": "7b3e4c18",
	  "link": {
	   "label": "Learn more",
	   "newTab": false,
	   "type": "custom",
	   "url": "/lm10"
	  },
	  "linkLabel": "Learn more",
	  "linkNewTab": false,
	  "linkUrl": "/lm10",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/m30-dev-golf-ball.png"
	  },
	  "mediaPosition": "right",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained"
	 },
	 {
	  "anchor": "development-path",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>Developers want to quickly set up the tools and hardware to evaluate and learn about the new M30. The Development Kit includes software, cables, and power supply to simplify this process, allowing developers to focus on their applications.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-m30-out-of-the-box.png"
	    },
	    "title": "Out-of-the-Box"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>For key performance indicators (KPIs) such as resolution, point cloud quality, multipath performance, and ROI capabilities.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-m30-evaluation.png"
	    },
	    "title": "Evaluation"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>A LiDAR system user or developer should next look to incorporate the M30 into a possible application or use case, creating a proof of concept to confirm the system’s functionality and offer an initial validation demo.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-m30-prototyping.png"
	    },
	    "title": "Prototyping"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>Finally, to demonstrate applications utilizing the ROS framework or an internal framework via integration with APIs.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-m30-demonstration.png"
	    },
	    "title": "Demonstration"
	   }
	  ],
	  "designVersion": "iconCards",
	  "id": "2d9a71c4",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsIconCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "changing-the-game",
	  "background": "none",
	  "body": "<p>M30 marks the beginning of a new era of optical 3D sensing, delivering the performance of a scanning lidar sensor with all the benefits of a purely solid-state solution.</p><ul><li>Scalable in cost, size, and performance</li><li>Highly integrated, modular construction</li><li>Adaptive, software-defined functionality</li></ul>",
	  "designVersion": "default",
	  "heading": "Changing the Game For 3D Sensing",
	  "id": "9c27de6a",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/m30-dev-kit-contents.png"
	  },
	  "mediaPosition": "left",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained"
	 },
	 {
	  "anchor": "specifications",
	  "background": "none",
	  "designVersion": "specTable",
	  "eyebrow": "Specifications",
	  "heading": "M30 Lidar Module",
	  "id": "1f5d84ab",
	  "intro": "Specifications subject to change\n† Lidar performance is software-defined through Lumotive’s Open Lidar API and can vary based on configuration\n†† All other specifications are measured at the default resolution of QVGA",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-devkits.jpg"
	  },
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "stats": [
	   {
	    "label": "Availability",
	    "value": "Now"
	   },
	   {
	    "label": "Featured LCM",
	    "value": "LM10"
	   },
	   {
	    "label": "Absolute Maximum Range",
	    "value": "25 m"
	   },
	   {
	    "label": "Minimum Range",
	    "value": "0.1 m"
	   },
	   {
	    "description": "85% target, 10 klux ambient",
	    "label": "Range Performance†",
	    "value": "25 m"
	   },
	   {
	    "description": "10% target, 100 klux ambient",
	    "label": "Range Performance†",
	    "value": "10 m"
	   },
	   {
	    "label": "Field of View†",
	    "value": "120° (non-steering) x 90° (steering, programmable)"
	   },
	   {
	    "label": "Frame Rate†",
	    "value": "10 Hz full-frame"
	   },
	   {
	    "label": "Readout Rate†",
	    "value": "910 regions/second"
	   },
	   {
	    "label": "Supported Resolutions†",
	    "value": "VGA (640×480)\nQVGA†† (320×240)"
	   },
	   {
	    "label": "Power Consumption†",
	    "value": "8 W"
	   },
	   {
	    "label": "Dimensions",
	    "value": "55mm x 35mm x 25mm"
	   },
	   {
	    "label": "Operating Temperature",
	    "value": "−20°C to +70°C"
	   },
	   {
	    "label": "Eye Safety",
	    "value": "Class 1"
	   },
	   {
	    "label": "Data Interface",
	    "value": "MIPI"
	   }
	  ],
	  "type": "statsLightTraits",
	  "width": "full"
	 },
	 {
	  "anchor": "industries",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>Warehouse automation, AGV/AMR navigation, pick-and-place cobots, volumetric dimensioning and humanoids.</p>",
	    "eyebrow": "Sense",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/market-robot-dog.jpg"
	    },
	    "title": "Industrial & robotics"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>L2+ surround view, pedestrian and VRU detection, robotaxi perception, and forward lidar beyond 200 m.</p>",
	    "eyebrow": "Sense",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/market-passenger-adas.jpg"
	    },
	    "title": "Auto ADAS & autonomy"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>Perimeter and border security, traffic monitoring, and infrastructure sensing that holds calibration for years.</p>",
	    "eyebrow": "Sense",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/market-perimeter-security.jpg"
	    },
	    "title": "ITS & surveillance"
	   }
	  ],
	  "designVersion": "applicationBento",
	  "heading": "Ideal industries for M30 Development Kit",
	  "id": "6a04b9d7",
	  "intro": "Lumotive products scale across multiple industries and offer a wide range of applications",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsApplicationBento",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "designVersion": "default",
	  "heading": "Talk to an expert",
	  "id": "8f21c5be",
	  "primaryLink": {
	   "label": "Talk to an expert",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "primaryLinkLabel": "Talk to an expert",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact",
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaDefault",
	  "width": "contained"
	 }
	]

const GROUP_LABEL = 'Sense'
const DEV_KITS_LABEL = 'Dev kits'

const child = (label, url) => ({
	link: { label, newTab: false, type: 'custom', url },
	linkLabel: label,
	linkNewTab: false,
	linkUrl: url
})

const NEXT_DEV_KIT_CHILDREN = [
	child('Transmit modules', '/dev-kits/transmit-modules'),
	child('iToF dev kits', '/dev-kits/itof')
]

const PREV_DEV_KIT_CHILDREN = [child('Transmit modules', '/dev-kits/transmit-modules')]

const findPage = (app, path) => {
	try {
		return app.findFirstRecordByFilter('pages', 'path = {:path}', { path })
	} catch {
		return null
	}
}

const applyPage = (app, { from, to, page, sections, parent }) => {
	const record = findPage(app, from) ?? findPage(app, to)
	if (!record) return

	for (const key of Object.keys(page)) record.set(key, page[key])
	record.set('parent', parent)
	record.set('sections', sections)
	app.save(record)
}

const applyMenu = (app, children) => {
	let record
	try {
		record = app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'header' })
	} catch {
		return
	}
	if (!record) return

	let data
	try {
		data = JSON.parse(record.getString('data') || '{}')
	} catch {
		return
	}
	if (!data || !Array.isArray(data.items)) return

	const group = data.items.find((entry) => entry && entry.label === GROUP_LABEL)
	if (!group || !Array.isArray(group.subitems)) return

	const devKits = group.subitems.find((entry) => entry && entry.linkLabel === DEV_KITS_LABEL)
	if (!devKits) return

	devKits.subitems = JSON.parse(JSON.stringify(children))
	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => {
		const parent = findPage(app, PARENT_PATH)
		applyPage(app, {
			from: PREV_PATH,
			to: NEXT_PATH,
			page: NEXT_PAGE,
			sections: NEXT_SECTIONS,
			parent: parent ? parent.id : ''
		})
		applyMenu(app, NEXT_DEV_KIT_CHILDREN)
	},
	(app) => {
		applyPage(app, {
			from: NEXT_PATH,
			to: PREV_PATH,
			page: PREV_PAGE,
			sections: PREV_SECTIONS,
			parent: ''
		})
		applyMenu(app, PREV_DEV_KIT_CHILDREN)
	}
)
