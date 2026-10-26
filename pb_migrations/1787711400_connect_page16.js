// Connect › Optical Circuit Switching (/connect), approved content package
// rev. 2026-10-07, page 16 of 21. "CHANGE · REBUILT ON THE CURRENT LUMOTIVE.COM
// OCS PAGE", which is also how the page-01 site map describes this route.
//
// The route and the record are unchanged: this is a rebuild in place, not a new
// page. The approved composition is nine blocks, and the page now carries them
// in the package's order:
//
//   1 heroSplit         "Lumotive Connect" / "Optical Circuit Switching" /
//                       "Solid-state and at scale." Copy left, the existing OCS
//                       ports-and-lasers photograph right, which is the image
//                       the package names ("current lumotive.com hero") and
//                       which this repository already holds as hero-connect.jpg.
//   2 splitDefault      "Electronic Switches Are Hitting Their Limits." with
//                       the existing vimeo.com/1227505713 embed beside it. The
//                       video was a full-width section of its own; the package
//                       sets it next to this copy, so the two are merged.
//   3 cardsTextCards    "Send Light, Not Signals." and the four approved
//                       benefits.
//   4 cardsTextCards    "Today's Optical Switches Are Mechanical.", the four
//                       MEMS limitations as one compact list, and the approved
//                       closing line.
//   5 cardsTextCards    "Switching at Semiconductor Scale" and its six traits,
//                       which the package marks as replacing "LCM is built like
//                       a semiconductor".
//   6 statsLightTraits  The two approved figures, 50 μs and 10k × 10k, two
//                       across.
//   7 ctaSplitLinks     "2D Beamforming for High-Port-Count Switching", on the
//                       light tone, with the announcement action and the LCM
//                       link. No date and no generation label, per the dev note.
//   8 cardsSpecPanels   "From Compact to Hyperscale." — the existing section and
//                       its two reference-design graphics, kept.
//   9 cardsTextCards    "Where Lumotive Connect Applies", moved from
//                       Applications.
//  10 ctaFabric         "Architecting the Next AI Data Center?" with the
//                       approved single paragraph and both actions.
//
// REMOVED, because the approved composition does not carry them. All four are
// restored verbatim by the down path:
//   f4b9c1d7  the standalone video section, merged into block 2 above.
//   2a71fb29  "A programmable optical fabric for the AI era". Its subject —
//             mapping pixels to ports in software, with each port's position,
//             size, steering and lensing programmable — is the approved block
//             5, which states it in the package's own words.
//   835c0cd5  "How it works". Same subject, likewise folded into block 5.
//   2e561f30  "Built for AI infrastructure". The approved page carries "Where
//             Lumotive Connect Applies" in this role, with the package's own
//             two use cases.
//
// NOTE ON COMMIT 67f8f02. Its four repairs all remain in the components. Two
// are still exercised here: the outlined CTA action, which block 10 uses, and
// the spec-panel label contrast, which block 8 uses. The other two — the peel
// swap's dwell, its narrow-viewport and reduced-motion fallbacks, and the icon
// quad's title rhythm — belonged to sections the approved composition does not
// carry, so they no longer have anything to act on *on this page*. The swap
// repairs still serve /platform, which is the other page using that section.
//
// COPY. Every heading, subline, card and figure is the package's, character for
// character. Sentence case is the package's too: "Talk to our OCS team" and
// "Learn about LCM" replace the Title Case labels the page carried. The actions
// carry the page-03 inquiry value for this page, `ocs`.
//
// "From Compact to Hyperscale." is marked KEEP AS IS, but the package prints a
// heading and an introduction that differ from the ones on staging. The copy
// rule on page 01 is absolute — "Copy in these pages is final. Use it word for
// word" — so the printed copy wins and the section's graphics, spec lists and
// layout are untouched. Flagged in handoff/page-16-connect.md.
//
// PENDING, nothing invented in its place:
//   - The 2D beamforming visual shared with Platform, which package page 04
//     lists as a new asset, so block 7 ships as its copy and actions.
//   - The two use-case images in block 9, "AI data center" and "satellite and
//     airborne links". No satellite or airborne asset exists here, and a single
//     illustrated card beside a bare one reads worse than neither, so both are
//     omitted.
//   - A citation link for the Google figures. The dev note asks for the public
//     publication to be cited; the copy attributes them to Google by name, but
//     no URL has been supplied, so none is invented.
//   - The six existing icons on blocks 3 and 5 no longer match the approved
//     card titles, and no icon exists for "Compact", so both blocks ship as
//     text cards rather than pairing five approved titles with mismatched art.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'connect'

const NEXT_PAGE = {
	seoTitle: 'Optical Circuit Switching',
	seoDescription: 'Solid-state and at scale.'
}

const PREV_PAGE = {
	seoTitle: "",
	seoDescription: ""
}

const NEXT_SECTIONS = [
	 {
	  "id": "ffa907ea",
	  "type": "heroSplit",
	  "designVersion": "split",
	  "anchor": "",
	  "eyebrow": "Lumotive Connect",
	  "heading": "Optical circuit switching",
	  "body": "<p>Solid-state and at scale.</p>",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-connect.jpg"
	  },
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=ocs",
	   "label": "Talk to our OCS team",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Talk to our OCS team",
	  "primaryLinkUrl": "/contact?inquiry=ocs",
	  "primaryLinkNewTab": false,
	  "secondaryLink": {
	   "type": "custom",
	   "url": "/platform",
	   "label": "Learn about LCM",
	   "newTab": false
	  },
	  "secondaryLinkLabel": "Learn about LCM",
	  "secondaryLinkUrl": "/platform",
	  "secondaryLinkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "none",
	  "spacingBottom": "none"
	 },
	 {
	  "id": "d8c4ff1d",
	  "type": "splitDefault",
	  "designVersion": "default",
	  "anchor": "optical-matters-now",
	  "eyebrow": "Optical matters now",
	  "heading": "Electronic switches are hitting their limits.",
	  "body": "<p>As AI models grow, the network is becoming the bottleneck. Electronic switches struggle to keep up with the bandwidth, latency, and power demands of training and inference at scale. Hyperscalers are moving to a fundamentally new switching architecture, and that architecture is optical.</p><p>Google’s public deployment of optical circuit switching at scale cut network power by 40% and cost by 30%. The economics are clear. The remaining question is which optical technology will define the next decade.</p>",
	  "videoUrl": "https://vimeo.com/1227505713",
	  "mediaPosition": "right",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "d32ef2bd",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "send-light",
	  "heading": "Send light, not signals.",
	  "intro": "Routing light directly from point A to point B, rather than converting between optical and electrical at every hop, is the simplest path to the speed and efficiency AI infrastructure needs.",
	  "columns": "4",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Near-zero latency",
	    "body": "<p>No round trip through electronics. Photons travel end to end at the speed of light.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Near-zero power",
	    "body": "<p>Optical switches consume no power per packet. Less heat, less cooling, lower TCO.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Lower cost per port",
	    "body": "<p>High integration density and software-defined calibration drive port cost down at scale.</p>",
	    "accent": "accent3"
	   },
	   {
	    "title": "Upgradable bandwidth",
	    "body": "<p>The optical fabric is transparent to data rate. Upgrade the endpoints; keep the network.</p>",
	    "accent": "accent1"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "4c81e9a7",
	  "type": "cardsTextCards",
	  "designVersion": "steps",
	  "anchor": "why-mems",
	  "eyebrow": "Why MEMS cannot scale",
	  "heading": "Today’s optical switches are mechanical.",
	  "intro": "Current state-of-the-art OCS systems rely on MEMS: micro-electromechanical mirrors that physically tilt to route light. They work, but they do not scale.",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Mechanical, with limited reliability over millions of cycles"
	   },
	   {
	    "title": "Small steering angles drive large system size and high cost per port"
	   },
	   {
	    "title": "Slow switching speed limits workload flexibility"
	   },
	   {
	    "title": "Expensive real-time calibration and assembly"
	   }
	  ],
	  "conclusion": "Hyperscale networks need a switch that is solid-state, fast, and scalable.",
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "b0f3d514",
	  "type": "statsLightTraits",
	  "designVersion": "specTiles",
	  "anchor": "semiconductor-scale",
	  "columns": "2",
	  "stats": [
	   {
	    "label": "Switching speed",
	    "value": "50 μs",
	    "description": "between any two ports"
	   },
	   {
	    "label": "Scale",
	    "value": "10k × 10k",
	    "description": "in a 3RU chassis"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "none",
	  "heading": "Switching at semiconductor scale",
	  "intro": "By mapping pixels to ports in software, an LCM-based switch makes every port independently programmable in position, size, steering, and lensing. The result is a switch that is solid-state, ultra-compact, and scalable to 10k × 10k."
	 },
	 {
	  "id": "df99bb2e",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "semiconductor-traits",
	  "columns": "3",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "Solid-state",
	    "body": "<p>No moving parts. No drift. No periodic recalibration. Built to outlast the network it sits in.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Scalable port count",
	    "body": "<p>From a 256 × 256 compact form factor to 10,000 × 10,000 in a 3RU chassis, without redesigning the optics.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Software-defined ports",
	    "body": "<p>Pixels map to ports in software. Every port’s position, size, steering, and lensing is independently programmable.</p>",
	    "accent": "accent3"
	   },
	   {
	    "title": "Ultra-low insertion loss",
	    "body": "<p>1–2 dB, independent of port count.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Compact",
	    "body": "<p>A 256 × 256 reference design fits in 4 × 3 × 2 cm³, smaller than your phone.</p>",
	    "accent": "accent2"
	   },
	   {
	    "title": "Scalable, mature manufacturing",
	    "body": "<p>Standard, well-established CMOS nodes and LCoS packaging, scalable to hyperscale volumes.</p>",
	    "accent": "accent3"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "sm",
	  "spacingBottom": "md"
	 },
	 {
	  "id": "6e2a71c9",
	  "type": "ctaSplitLinks",
	  "designVersion": "splitLinks",
	  "mode": "stacked",
	  "tone": "light",
	  "anchor": "2d-beamforming",
	  "eyebrow": "Technology foundation",
	  "heading": "2D beamforming for high-port-count switching",
	  "headingSize": "statement",
	  "body": "<p>We have demonstrated the world’s first programmable 2D photonic beamforming chip. Steering light across two axes in one semiconductor device is the path to the high-port-count switching AI data centers need.</p>",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/posts/lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor",
	   "label": "Read the announcement",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Read the announcement",
	  "primaryLinkUrl": "/posts/lumotive-creates-worlds-first-2d-photonic-beamforming-semiconductor",
	  "primaryLinkNewTab": false,
	  "secondaryLink": {
	   "type": "custom",
	   "url": "/platform",
	   "label": "Learn about LCM",
	   "newTab": false
	  },
	  "secondaryLinkLabel": "Learn about LCM",
	  "secondaryLinkUrl": "/platform",
	  "secondaryLinkNewTab": false,
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "cards": [
	   {
	    "body": "<ul><li>Form factor: 4 × 3 × 2 cm</li><li>Use case: Scale-up, rack-level</li><li>Engine: Single LCM module</li></ul>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/ocs-256-reference.png"
	    },
	    "title": "256 × 256 reference design"
	   },
	   {
	    "body": "<ul><li>Form factor: 3RU chassis</li><li>Use case: Scale-out, cluster-level</li><li>Engine: Tiled LCM field-replaceable</li></ul>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/ocs-hyperscale-crossbar.png"
	    },
	    "title": "10,000 × 10,000 in 3RU"
	   }
	  ],
	  "designVersion": "specPanels",
	  "heading": "From compact to hyperscale.",
	  "id": "e856b692",
	  "intro": "Two reference architectures cover both ends of the AI infrastructure stack: scale-up inside the rack, scale-out across the cluster. Both use the same Lumotive LCM optical engine, tiled, packaged, and scaled differently.",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsSpecPanels",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "id": "93c4b0fe",
	  "type": "cardsTextCards",
	  "designVersion": "textCards",
	  "anchor": "use-cases",
	  "eyebrow": "Use cases",
	  "heading": "Where Lumotive Connect applies",
	  "columns": "2",
	  "casing": "exact",
	  "cards": [
	   {
	    "title": "AI data centers",
	    "body": "<p>Optical circuit switching for scale-up inside the rack and scale-out across the cluster.</p>",
	    "accent": "accent1"
	   },
	   {
	    "title": "Optical communications",
	    "body": "<p>Solid-state beam control for satellite, airborne, and terrestrial free-space optical links: electronic pointing and tracking, with no gimbals or moving mirrors.</p>",
	    "accent": "accent2"
	   }
	  ],
	  "background": "none",
	  "width": "contained",
	  "align": "container",
	  "spacingTop": "md",
	  "spacingBottom": "md"
	 },
	 {
	  "anchor": "development-partnership",
	  "background": "none",
	  "body": "<p>We are partnering with hyperscalers and infrastructure OEMs on OCS programs at every scale, from rack-level scale-up to 10k × 10k hyperscale fabrics.</p>",
	  "designVersion": "fabric",
	  "heading": "Architecting the next AI data center?",
	  "id": "9bb14000",
	  "primaryLink": {
	   "type": "custom",
	   "url": "/contact?inquiry=ocs",
	   "label": "Talk to our OCS team",
	   "newTab": false
	  },
	  "primaryLinkLabel": "Talk to our OCS team",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact?inquiry=ocs",
	  "secondaryLinks": [
	   {
	    "label": "Learn about LCM",
	    "newTab": false,
	    "url": "/platform"
	   }
	  ],
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaFabric",
	  "width": "contained",
	  "align": "container"
	 }
	]

const PREV_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Lumotive&#39;s LCM™ technology enables solid-state optical circuit switching designed to reduce network power, minimize latency, and scale across next-generation AI infrastructure.</p>",
	  "designVersion": "band",
	  "eyebrow": "Lumotive Connect",
	  "heading": "Programmable photonics for AI infrastructure",
	  "id": "ffa907ea",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-connect.jpg"
	  },
	  "primaryLink": {
	   "label": "Explore a Development Partnership",
	   "newTab": false,
	   "type": "custom",
	   "url": "#development-partnership"
	  },
	  "primaryLinkLabel": "Explore a Development Partnership",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "#development-partnership",
	  "secondaryLink": {
	   "label": "See How It Works",
	   "newTab": false,
	   "type": "custom",
	   "url": "#how-it-works"
	  },
	  "secondaryLinkLabel": "See How It Works",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "#how-it-works",
	  "spacingBottom": "none",
	  "spacingTop": "none",
	  "type": "heroBand",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>AI clusters are outgrowing traditional electrical switching. Power, latency, and complexity increase rapidly as systems scale.</p><p>Electrical bottlenecks waste energy, add latency, and make it harder to build the next generation of AI infrastructure.</p>",
	  "designVersion": "darkPanel",
	  "heading": "Electrical switching is reaching its limits",
	  "id": "d8c4ff1d",
	  "mediaPosition": "right",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDarkPanel",
	  "width": "contained"
	 },
	 {
	  "anchor": "video",
	  "background": "none",
	  "designVersion": "videoEmbed",
	  "heading": "",
	  "id": "f4b9c1d7",
	  "intro": "",
	  "items": [],
	  "mode": "video",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "mediaVideoEmbed",
	  "videoUrl": "https://vimeo.com/1227505713",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>Reduce electrical conversion and the associated energy use at scale.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-solid-state.png"
	    },
	    "title": "Lower power"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>Remove multiple optical-to-electrical conversion steps and packet-processing delays.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-beam-steering.png"
	    },
	    "title": "Lower latency"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>Support growing port counts and bandwidth requirements without rebuilding the network architecture.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-scalability.png"
	    },
	    "title": "Scalable networks"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>Increase endpoint bandwidth while retaining the underlying optical fabric.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-software-defined.png"
	    },
	    "title": "Upgradeable architecture"
	   }
	  ],
	  "designVersion": "iconCards",
	  "heading": "Send light, not signals",
	  "id": "d32ef2bd",
	  "intro": "Direct optical paths between endpoints eliminate repeated electrical conversion at every hop.",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsIconCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "fabric",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>Control optical connections through software.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/ocs-fabric.png"
	    },
	    "title": "Software-defined ports"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>Eliminate moving mirrors and mechanical switching components.</p>",
	    "title": "Solid-state operation"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>Preserve signal integrity across the optical path.</p>",
	    "title": "Low insertion loss"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>Support larger optical fabrics without redesigning the underlying technology.</p>",
	    "title": "Scalable port count"
	   }
	  ],
	  "designVersion": "peelSwap",
	  "heading": "A programmable optical fabric for the AI era",
	  "id": "2a71fb29",
	  "intro": "Lumotive Connect uses LCM technology to map pixels to ports in software. Each optical connection can be programmed independently, including its position, size, steering, and lensing. This software-defined approach creates a solid-state optical fabric that can be configured for different port counts, network topologies, and system requirements without mechanical movement.",
	  "spacingBottom": "none",
	  "spacingTop": "none",
	  "type": "cardsPeelSwap",
	  "width": "contained"
	 },
	 {
	  "anchor": "how-it-works",
	  "background": "none",
	  "body": "<p>LCM technology dynamically directs light from any input port to any output port. Software maps and controls each optical path across the LCM surface, allowing connections to be configured and changed without mechanical switching.</p>",
	  "designVersion": "peelBleed",
	  "eyebrow": "Reconfigurable. Scalable. Solid-state.",
	  "heading": "How it works",
	  "id": "835c0cd5",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/connect-fabric-bleed.png"
	  },
	  "mediaPosition": "right",
	  "spacingBottom": "none",
	  "spacingTop": "none",
	  "type": "splitPeelBleed",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "subtle",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>Solid-state switching eliminates mechanical drift, wear, and periodic recalibration.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-no-moving-parts.png"
	    },
	    "title": "No moving parts"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>Each port&#39;s position, size, steering, and lensing can be independently programmed.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-software-ports.png"
	    },
	    "title": "Software-defined ports"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>Scale from hundreds to thousands of ports without the mechanical complexity of mirror-based systems.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-port-density.png"
	    },
	    "title": "High port density"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>Maintain efficient optical paths as port counts increase.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-low-loss.png"
	    },
	    "title": "Low insertion loss"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>Change optical connections in microseconds rather than through mechanical movement.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-fast-reconfiguration.png"
	    },
	    "title": "Fast reconfiguration"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>Use liquid-crystal-on-silicon assembly and established semiconductor manufacturing processes.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-cmos-manufacturing.png"
	    },
	    "title": "CMOS-compatible manufacturing"
	   }
	  ],
	  "designVersion": "iconCards",
	  "heading": "LCM is built like a semiconductor",
	  "id": "df99bb2e",
	  "intro": "Today's optical switches are still largely mechanical. MEMS-based systems rely on moving mirrors, precise alignment, and complex calibration, creating limitations in port count, speed, size, and cost. LCM replaces mechanical steering with a solid-state, software-defined architecture designed for semiconductor-scale manufacturing.",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsIconCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "cards": [
	   {
	    "body": "<ul><li>Form factor: 4 × 3 × 2 cm</li><li>Use case: Scale-up, rack-level</li><li>Engine: Single LCM module</li></ul>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/ocs-256-reference.png"
	    },
	    "title": "256 × 256 reference design"
	   },
	   {
	    "body": "<ul><li>Form factor: 3RU chassis</li><li>Use case: Scale-out, cluster-level</li><li>Engine: Tiled LCM field-replaceable</li></ul>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/ocs-hyperscale-crossbar.png"
	    },
	    "title": "10,000 × 10,000 in 3RU"
	   }
	  ],
	  "designVersion": "specPanels",
	  "heading": "From compact to hyperscale",
	  "id": "e856b692",
	  "intro": "Lumotive supports reference architectures across the AI infrastructure stack, from compact scale-up systems inside the rack to large scale-out optical fabrics across the cluster.",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsSpecPanels",
	  "width": "contained"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "cards": [
	   {
	    "accent": "accent1",
	    "body": "<p>Support AI training and inference without network bottlenecks.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-scalability.png"
	    },
	    "title": "AI and machine learning clusters"
	   },
	   {
	    "accent": "accent2",
	    "body": "<p>Reduce power and network complexity while increasing capacity and efficiency.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-port-density.png"
	    },
	    "title": "Data centers"
	   },
	   {
	    "accent": "accent3",
	    "body": "<p>Enable high-bandwidth, low-latency connectivity between processors, accelerators, and memory systems.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-low-loss.png"
	    },
	    "title": "Scale-up networks"
	   },
	   {
	    "accent": "accent1",
	    "body": "<p>Build larger, resilient optical fabrics across clusters and data centers.</p>",
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/img/icon-software-ports.png"
	    },
	    "title": "Scale-out networks"
	   }
	  ],
	  "designVersion": "iconQuad",
	  "heading": "Built for AI infrastructure",
	  "id": "2e561f30",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsIconQuad",
	  "width": "contained"
	 },
	 {
	  "anchor": "development-partnership",
	  "background": "none",
	  "body": "<p>Lumotive is working with hyperscalers and infrastructure leaders to define the next generation of optical switching for AI data centers.</p><p>Contact us to explore potential solutions, share system requirements, or participate in the development process.</p>",
	  "designVersion": "fabric",
	  "heading": "Architecting the next AI data center?",
	  "id": "9bb14000",
	  "primaryLink": {
	   "label": "Talk to Our OCS Team",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "primaryLinkLabel": "Talk to Our OCS Team",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/contact",
	  "secondaryLinks": [
	   {
	    "label": "Learn About LCM",
	    "newTab": false,
	    "url": "/platform"
	   }
	  ],
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaFabric",
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
