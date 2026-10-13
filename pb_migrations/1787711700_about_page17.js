// Company › About (/about), approved content package rev. 2026-10-07, page 17
// of 21. The route and the record are unchanged; the page keeps its id.
//
// Blocks, in the package's order:
//
//   1 heroBand         KEEP AS IS. The eyebrow, heading, subline, both actions
//                      and hero-about.jpg already match the package exactly, so
//                      only the container alignment is added.
//   2 splitDefault     KEEP AS IS on its copy and image. The package prints the
//                      heading as "Lumotive Is Pioneering the Era of
//                      Programmable Optics", where staging ran the whole
//                      sentence into the heading and repeated the hero's
//                      subline inside it. The page-01 copy rule is absolute, so
//                      the printed heading wins; the mission copy and the
//                      photograph beside it are untouched.
//   — statsCentered    REMOVE · STATS BLOCK. "Delete the Founded / Patents /
//                      Raised stats block." Gone; restored by the down path.
//   3 cardsAwardCards  CHANGE · #132 HEADING, AWARDS STRIP. The heading becomes
//                      "Recognized for Pioneering the Era of Programmable
//                      Optics" and the strip becomes the five approved awards
//                      in the package's order, with no years in copy, which
//                      collapses the three separate CES entries staging listed
//                      into one. Each still links to its award announcement,
//                      which is what the dev note asks for, and those links are
//                      the ones already on the page.
//   4 cardsTeamCards   FIX · TITLE AND ORDER (Webvizio #133). Apurva Jain's
//                      title becomes "SVP of Product & Marketing and General
//                      Manager", Clement Kong and Axel Fuchs swap positions,
//                      and Diane Krzysik and Sajid Husain swap positions. The
//                      grid, the biographies and the headshots are untouched.
//   5 cardsTeamCards   CHANGE · HEADING ONLY. The section already renders
//                      "Board of Directors", so only the alignment is added.
//   6 logosGridOnDark  NEW · INVESTOR LOGO GRID. The heading becomes
//                      "Investors" and the introduction is dropped, which is
//                      both the dev note here ("Logos only. No funding
//                      amounts.") and the one on the board block, which asks
//                      for "Backed by Strategic Investors" to be removed.
//   7 ctaDefault       NEW · CLOSING CTA. "Work With Us" with the approved
//                      sentence and the two approved actions, replacing the
//                      generic "Put programmable optics to work".
//
// INVESTOR LIST. The package prints six named logos and then "[Full list from
// staging]", and page 04 lists the final investor logo list as a pending input.
// The nine logos already on this page are that staging list, so they stay and
// the section ships under its approved heading; nothing is invented and nothing
// public is withdrawn. When Lumotive supplies the final list it is a data-only
// edit to this one section. Flagged in handoff/page-17-about.md.
//
// TERMINOLOGY. Claudia's rename needs no wording change here: "beam steering"
// appears nowhere on this page.
//
// CONTAINER ALIGNMENT. Every section opts into the header container. This page
// predates that work: all eight sections sat at the viewport edge while the
// header and footer aligned at 80px, so the page was the one place on the site
// where the two did not line up.
//
// PENDING, nothing invented in its place:
//   - The official award badges, which package page 04 lists as a new asset.
//     The strip ships as the approved names and their announcement links.
//   - The LinkedIn follow line the package prints under the closing CTA. The
//     LinkedIn URL is still the unresolved input recorded in
//     1787708000_footer_sitemap.js, which is why the footer icon is also still
//     held back. One URL unblocks both.
//   - "See open roles" points at the Lever careers board, which is the
//     destination already used on /culture. When page 18 gives /culture its
//     Open Roles section this becomes a one-field change.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const PAGE_PATH = 'about'

const NEXT_PAGE = {
	seoTitle: 'About',
	seoDescription:
		'For the first time, light can be controlled as intelligently and flexibly as software.'
}

const PREV_PAGE = {
	seoTitle: "",
	seoDescription: ""
}

const NEXT_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>For the first time, light can be controlled as intelligently and flexibly as software.</p>",
	  "designVersion": "band",
	  "eyebrow": "About Lumotive",
	  "heading": "Pioneering the era of programmable optics",
	  "id": "3998f57f",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-about.jpg"
	  },
	  "primaryLink": {
	   "label": "Explore the platform",
	   "newTab": false,
	   "type": "custom",
	   "url": "/platform"
	  },
	  "primaryLinkLabel": "Explore the platform",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/platform",
	  "secondaryLink": {
	   "label": "Meet the team",
	   "newTab": false,
	   "type": "custom",
	   "url": "#leadership"
	  },
	  "secondaryLinkLabel": "Meet the team",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "#leadership",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "heroBand",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "story",
	  "background": "subtle",
	  "body": "<p>Our patented Light Control Metasurface (LCM™) transforms photonics into a digital platform, unlocking breakthroughs in sensing, optical switching, and communication. With more than 160 patents and growing commercial traction, Lumotive is delivering the world’s first digital platform for light — and redefining what’s possible in the optical age.</p>",
	  "designVersion": "default",
	  "eyebrow": "Our mission",
	  "heading": "Lumotive is pioneering the era of programmable optics",
	  "id": "4e30aac9",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/lm10-metasurface-module.webp"
	  },
	  "mediaPosition": "left",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "recognition",
	  "background": "none",
	  "cards": [
	   {
	    "title": "CES Innovation Awards",
	    "linkUrl": "https://www.ces.tech/innovation-awards/2025/ylm-10lx-3d-lidar-sensor/"
	   },
	   {
	    "title": "Fast Company: Next Big Things in Tech",
	    "linkUrl": "https://www.fastcompany.com/90979340/next-big-things-tech-transportation-2023"
	   },
	   {
	    "title": "Laser Focus World Innovators Award",
	    "linkUrl": "https://www.laserfocusworld.com/home/article/55130256/2024-innovators-awards-meet-the-honorees"
	   },
	   {
	    "title": "SPIE Prism Award",
	    "linkUrl": "https://www.businesswire.com/news/home/20220126005964/en/2022-SPIE-and-Photonics-Media-Prism-Awards-Celebrate-Innovative-Photonics-Technologies"
	   },
	   {
	    "title": "GSA Startup to Watch",
	    "linkUrl": "https://www.gsaglobal.org/gratulations-to-the-2025-recipients-of-global-semiconductor-alliances-gsa-prestigious-annual-awards/"
	   }
	  ],
	  "designVersion": "awardCards",
	  "eyebrow": "Recognition",
	  "heading": "Recognized for pioneering the era of programmable optics",
	  "id": "718e83f2",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsAwardCards",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "leadership",
	  "background": "none",
	  "cards": [
	   {
	    "biography": "<p>Sam Heidari brings over 30 years of leadership experience across a range of technology sectors. He is currently the CEO of Lumotive and serves on the board of Morse Micro. His previous roles include CEO and Chairman of Quantenna Communications, CEO of Doradus Technologies, CTO of Ikanos, and Venture Partner at Cota Capital.</p><p>Dr. Heidari has contributed significantly to the tech industry, serving on the Global Semiconductor Alliance Board of Directors and the advisory boards for the Electrical Engineering and Computer Science departments at the University of Southern California.</p><p>His achievements have earned him numerous recognitions, including 2014 Executive of the Year by the Golden Bridge Awards, finalist for EY Entrepreneur of the Year in 2016, and 2017 Executive of the Year by UBM. A senior member of IEEE, Dr. Heidari holds more than 50 U.S. and international patents.</p><p>He earned his M.S. and Ph.D. in Electrical Engineering from the University of Southern California, and his B.S. in Electrical Engineering from Northeastern University.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/sam-heidari-1000.jpg"
	    },
	    "name": "Sam Heidari, Ph.D.",
	    "order": 1,
	    "roles": [
	     "leadership",
	     "board"
	    ],
	    "title": "CEO"
	   },
	   {
	    "biography": "<p>Gleb Akselrod has more than 10 years experience in photonics and optoelectronics. Prior to Lumotive he was the Director for Optical Technologies at Intellectual Ventures in Bellevue, WA, where he led a program on the commercialization of optical metamaterial and nanophotonic technologies.</p><p>Previously, he was a postdoctoral fellow in the Center for Metamaterials and Integrated Plasmonics at Duke University, where his work focused on plasmonic nanoantennas and metasurfaces. He completed his Ph.D. in 2013 at MIT, where he was a Hertz Foundation Fellow and an NSF Graduate Fellow studying excitons in materials for solar cells and OLEDs. Prior to MIT, Dr. Akselrod was at Landauer, Inc. where he developed and patented a fluorescent radiation sensor that is currently deployed by the US Army.</p><p>Dr. Akselrod received his Ph.D. in Physics from MIT and his B.S. in Engineering Physics from the University of Illinois at Urbana-Champaign. He holds more than 30 US Patents and has published over 25 scientific articles.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/gleb-akselrod-1000.jpg"
	    },
	    "name": "Gleb Akselrod, Ph.D.",
	    "order": 2,
	    "roles": [
	     "leadership",
	     "board"
	    ],
	    "title": "CTO & founder"
	   },
	   {
	    "biography": "<p>Apurva Jain is a recognized leader in optics, photonics, and semiconductor innovation, with over a decade of experience bringing transformative optical technologies to market. His expertise spans product strategy &amp; innovation, manufacturing operations, and customer success, guiding products from concept through mass deployment.</p><p>Apurva has contributed to multiple patents and publications and has led cross-functional teams delivering breakthrough solutions in sensing, imaging, automation, networking, and communications. Prior to Lumotive, he held leadership roles at Avo Photonics, where he helped commercialize advanced optoelectronic products. He earned a Ph.D. in Optics from CREOL, University of Central Florida, and a B.Eng. in Electrical Engineering from McGill University.</p><p>Beyond technology, Apurva is the founder of CCoffee (www.ccoffee.ca), a social impact venture that invests its profits into children’s education, reflecting his commitment to creating a positive global impact.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/apurva-jain-1000.jpg"
	    },
	    "name": "Apurva Jain, Ph.D.",
	    "order": 3,
	    "roles": [
	     "leadership"
	    ],
	    "title": "SVP of Product & Marketing and General Manager"
	   },
	   {
	    "biography": "<p>Clement Kong is a business leader with more than 20 years of experience in the automotive and sensing industries. Throughout his career, he has held leadership positions at global Tier 1 automotive suppliers, including Continental, Valeo, and Johnson, where he led strategic customer acquisition and drove business growth across international markets.</p><p>Most recently, Clement served as Vice President of Sales at leading LiDAR companies, including Ouster, Aeva, and Voyant Photonics. He has a proven track record of scaling high-growth technology companies from early-stage startups to IPO, securing strategic customer partnerships, and driving commercial adoption of advanced sensing technologies</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/clement-kong-1000.jpg"
	    },
	    "name": "Clement Kong",
	    "order": 4,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of Sales"
	   },
	   {
	    "biography": "<p>Rakinder Grover is a technology executive with over 25 years of experience. His expertise is in business management, business development and venture capital investing in high-growth, innovation-led companies.</p><p>Prior to Lumotive, Mr. Grover held various management roles at Dolby Laboratories and Ikanos. As a Managing Director at Walden International, he was a venture capital investor in early-stage semiconductor and communications startups.</p><p>Mr. Grover holds an MBA from The Wharton School of the University of Pennsylvania, a master’s degree in computer science from the University of Texas and a bachelor’s degree from the Indian Institute of Technology.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/rakinder-grover-1000.jpg"
	    },
	    "name": "Rakinder Grover",
	    "order": 5,
	    "roles": [
	     "leadership"
	    ],
	    "title": "SVP of Finance and Partnerships"
	   },
	   {
	    "biography": "<p>Diane Krzysik is a human resources executive with over 20 years of experience in all facets of human resources and business partnering. Her expertise is in Talent Acquisition, Talent Development and Nurturing a Vibrant and Inclusive Culture. She has deep experience in the following corporate life cycle changes: High-Growth, Public Transition Phase, Mergers &amp; Acquisitions, Down Market Conditions, Restructuring, Management Changes and Market Transitions.</p><p>Prior to Lumotive, Ms. Krzysik held management roles at Atomwise and Quantenna. There she built out the HR function, scaled a global high growth start up, supported the company through an IPO and was part of the team that took them through an M&amp;A and subsequent post acquisition transition to a Fortune 500 company. Prior to Quantenna, she held earlier director/manager positions at Arcwave, Carnegie Mellon University and TechTV.</p><p>Ms. Krzysik holds a Human Resource Management (HRM), Honors Distinction from the University of California Santa Cruz.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/diane-krzysik-1000.jpg"
	    },
	    "name": "Diane Krzysik",
	    "order": 6,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of Human Resources"
	   },
	   {
	    "biography": "<p>Over the past three decades, Axel Fuchs has demonstrated a strong track record in managing key aspects of global high-tech businesses.</p><p>In 1995, Dr. Fuchs co-founded the Daimler Benz Research and Technology office. He later joined Motorola&#39;s newly established Telematics division, where he led the Systems Engineering Team. Since 2002, Dr. Fuchs has held leadership positions at several Silicon Valley startups, where he played a pivotal role in developing the automotive business and expanding the consumer segment for Simple Devices, which was acquired by Universal Electronics in 2004. He also led business development for Quanergy, growing the business from inception to $50 million.</p><p>Dr. Fuchs holds a Ph.D. in Control Engineering from Darmstadt University of Technology.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/axel-fuchs-1000.jpg"
	    },
	    "name": "Axel Fuchs, Ph.D.",
	    "order": 7,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of Business Development"
	   },
	   {
	    "biography": "<p>Sajid Husain is a technology executive with more than 30 years of experience leading the development of complex semiconductor and system solutions across the communications, networking, storage, wireless, and photonics industries. He currently serves as Vice President of Mixed-Signal ASIC Engineering at Lumotive, where he leads the development of advanced mixed-signal ASICs enabling one-dimensional and two-dimensional beam steering technologies for next-generation 3D sensing and Optical Circuit Switching (OCS) applications for AI data centers.</p><p>Throughout his career, Sajid has successfully led multidisciplinary engineering organizations at both established semiconductor companies and high-growth startups. His expertise spans product definition, architecture, ASIC development, silicon validation, manufacturing ramp, and volume production. He has repeatedly built high-performing engineering teams from the ground up while delivering complex products from concept through commercialization.</p><p>Prior to Lumotive, Sajid led the development of Wi-Fi Access Point silicon at Quantenna Communications, contributing to industry-leading wireless networking solutions. Earlier in his career at Altera (later Intel), he played a key leadership role in the development of Stratix® 10 FPGA, one of the world&#39;s largest and most advanced programmable logic devices of its time. His broad technical background, combined with extensive leadership experience, has enabled him to successfully execute ambitious silicon development programs across multiple technology domains.</p><p>Sajid holds a Master of Technology (M.Tech.) in Electronic Design Engineering from the Indian Institute of Science (IISc), Bangalore, and a B.E in Electronics and Communication Engineering from SGSITS, Indore, India. He has also completed the Engineering Leadership Program at the UC Berkeley, with a focus on technology strategy and operational innovation.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/sajid-husain-1000.jpg"
	    },
	    "name": "Sajid Husain",
	    "order": 8,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of ASIC Engineering"
	   },
	   {
	    "biography": "<p>Larry Zhao, Ph.D. is an accomplished semiconductor and microelectronics professional with over 30 years of experience driving innovation in process integration and enabling new technology. Proven track record spanning major IDM, foundry, equipment vendor, R&amp;D consortia, and fabless environments, with deep expertise leading complex technical integration from design to high-volume manufacturing.</p><p>Dr. Zhao is a recognized expert and prolific innovator in the semiconductor field. He holds more than 40 U.S. patents, has co-authored over 80 conference/journal papers and a book chapter. He served on IEEE IITC committee for nearly a decade and served as Technical Advisory Board member for Semiconductor Research Corporation.</p><p>Dr. Zhao earned his Ph.D. in Electrical Engineering from KU Leuven and conducted Ph.D. research in Materials Science at Columbia University. He received his M.S. in Engineering from Dartmouth College, and a B.S. degree in Materials Science and Engineering from Shanghai Jiao Tong University.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/larry-zhao-1000.jpg"
	    },
	    "name": "Larry Zhao, Ph.D.",
	    "order": 9,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of Process Engineering"
	   }
	  ],
	  "designVersion": "teamCards",
	  "eyebrow": "Leadership",
	  "heading": "Leadership team",
	  "id": "f9d1f9ab",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsTeamCards",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "board",
	  "background": "subtle",
	  "cards": [
	   {
	    "biography": "<p>Sam Heidari brings over 30 years of leadership experience across a range of technology sectors. He is currently the CEO of Lumotive and serves on the board of Morse Micro. His previous roles include CEO and Chairman of Quantenna Communications, CEO of Doradus Technologies, CTO of Ikanos, and Venture Partner at Cota Capital.</p><p>Dr. Heidari has contributed significantly to the tech industry, serving on the Global Semiconductor Alliance Board of Directors and the advisory boards for the Electrical Engineering and Computer Science departments at the University of Southern California.</p><p>His achievements have earned him numerous recognitions, including 2014 Executive of the Year by the Golden Bridge Awards, finalist for EY Entrepreneur of the Year in 2016, and 2017 Executive of the Year by UBM. A senior member of IEEE, Dr. Heidari holds more than 50 U.S. and international patents.</p><p>He earned his M.S. and Ph.D. in Electrical Engineering from the University of Southern California, and his B.S. in Electrical Engineering from Northeastern University.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/sam-heidari-1000.jpg"
	    },
	    "name": "Sam Heidari, Ph.D.",
	    "order": 1,
	    "roles": [
	     "leadership",
	     "board"
	    ],
	    "title": "CEO"
	   },
	   {
	    "biography": "<p>Gleb Akselrod has more than 10 years experience in photonics and optoelectronics. Prior to Lumotive he was the Director for Optical Technologies at Intellectual Ventures in Bellevue, WA, where he led a program on the commercialization of optical metamaterial and nanophotonic technologies.</p><p>Previously, he was a postdoctoral fellow in the Center for Metamaterials and Integrated Plasmonics at Duke University, where his work focused on plasmonic nanoantennas and metasurfaces. He completed his Ph.D. in 2013 at MIT, where he was a Hertz Foundation Fellow and an NSF Graduate Fellow studying excitons in materials for solar cells and OLEDs. Prior to MIT, Dr. Akselrod was at Landauer, Inc. where he developed and patented a fluorescent radiation sensor that is currently deployed by the US Army.</p><p>Dr. Akselrod received his Ph.D. in Physics from MIT and his B.S. in Engineering Physics from the University of Illinois at Urbana-Champaign. He holds more than 30 US Patents and has published over 25 scientific articles.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/gleb-akselrod-1000.jpg"
	    },
	    "name": "Gleb Akselrod, Ph.D.",
	    "order": 2,
	    "roles": [
	     "leadership",
	     "board"
	    ],
	    "title": "CTO & founder"
	   },
	   {
	    "biography": "<p>Conrad Burke is based in Silicon Valley and is managing partner at MetaVC Partners, LLC. He is an entrepreneur and investor, building successful new businesses in renewable energy, communications, nanomaterials, and biosciences. He was founder and CEO of energy materials startup, Innovalight (acquired by DuPont) and was venture partner at Sevin Rosen Funds and Invention Science Fund (ISF).</p><p>Some of his past and current board responsibilities include Capella Photonics (acquired by Alcatel-Lucent), Lumotive, Imagia, and the advisory boards of Aelurus (acquired by Broadcom), InnerAnalytics and Cendana Capital. For three years, Mr. Burke served on the board of SolarPower Europe - the European solar industry association. He was a Technology Pioneer at the World Economic Forum in Davos for renewable energy innovations and he is a recipient of the Ernst &amp; Young Entrepreneur of the Year™ award. Conrad has extensive international experience having worked and lived in Japan, Germany, the U.K. at AT&amp;T, NEC and Lucent Technologies.</p><p>He has a MS in Physics from Trinity College and a BS in Physics from University College Dublin in Ireland.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/conrad-burke-daylight.jpg"
	    },
	    "name": "Conrad Burke",
	    "order": 10,
	    "roles": [
	     "board"
	    ],
	    "title": "Board member"
	   },
	   {
	    "biography": "<p>Jim Anderson was appointed Chief Executive Officer of Coherent Corp. and a member of the Board of Directors on June 3, 2024. He previously served as a director and as President and Chief Executive Officer of Lattice Semiconductor Corporation since September 2018.</p><p>Prior to joining Lattice, Mr. Anderson served as the Senior Vice President and General Manager of the Computing and Graphics Business Group at Advanced Micro Devices, Inc. (AMD). Prior to AMD, Mr. Anderson held a broad range of leadership positions spanning general management, engineering, sales, marketing, and corporate strategy at companies including Intel, Broadcom (formerly Avago Technologies), and LSI Corporation.</p><p>Mr. Anderson has served on the board of directors of Entegris, Inc., since March 2023, and he currently serves on the board of directors of the Semiconductor Industry Association. He previously served on the board of directors of Sierra Wireless from April 2020 to January 2023.</p><p>Mr. Anderson earned an MBA and Master of Science degree in electrical engineering and computer science from the Massachusetts Institute of Technology, a Master of Science degree in electrical engineering from Purdue University, and a bachelor’s degree in electrical engineering from the University of Minnesota.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/jim-anderson-1000.jpg"
	    },
	    "name": "Jim Anderson",
	    "order": 11,
	    "roles": [
	     "board"
	    ],
	    "title": "Board member"
	   }
	  ],
	  "designVersion": "teamCards",
	  "eyebrow": "Governance",
	  "heading": "Board of directors",
	  "id": "7d5fdafa",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsTeamCards",
	  "width": "contained",
	  "align": "container"
	 },
	 {
	  "anchor": "investors",
	  "background": "none",
	  "designVersion": "gridOnDark",
	  "heading": "Investors",
	  "id": "aadb4f18",
	  "logos": [
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/amazon-aiif.png"
	    },
	    "name": "Amazon Industrial Innovation Fund"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/east-bridge.png"
	    },
	    "name": "East Bridge"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/gates-frontier.png"
	    },
	    "name": "Gates Frontier"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/ithca.png"
	    },
	    "name": "ITHCA Group"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/metavc.png"
	    },
	    "name": "MetaVC Partners"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/quan-funds.png"
	    },
	    "name": "Quan Funds"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/samsung-ventures.png"
	    },
	    "name": "Samsung Ventures"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/swisscom.png"
	    },
	    "name": "Swisscom Ventures"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/usaa.png"
	    },
	    "name": "USAA"
	   }
	  ],
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "logosGridOnDark",
	  "width": "full",
	  "align": "container"
	 },
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>Help us make light programmable. We are hiring engineers and builders across our teams.</p>",
	  "designVersion": "default",
	  "eyebrow": "",
	  "heading": "Work with us",
	  "id": "efd6f4b0",
	  "primaryLink": {
	   "type": "custom",
	   "url": "https://jobs.lever.co/lumotive",
	   "label": "See open roles",
	   "newTab": true
	  },
	  "primaryLinkLabel": "See open roles",
	  "primaryLinkNewTab": "true",
	  "primaryLinkUrl": "https://jobs.lever.co/lumotive",
	  "secondaryLink": {
	   "type": "custom",
	   "url": "/culture",
	   "label": "Life at Lumotive",
	   "newTab": false
	  },
	  "secondaryLinkLabel": "Life at Lumotive",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "/culture",
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaDefault",
	  "width": "contained",
	  "align": "container"
	 }
	]

const PREV_SECTIONS = [
	 {
	  "anchor": "",
	  "background": "none",
	  "body": "<p>For the first time, light can be controlled as intelligently and flexibly as software.</p>",
	  "designVersion": "band",
	  "eyebrow": "About Lumotive",
	  "heading": "Pioneering the era of programmable optics",
	  "id": "3998f57f",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/hero-about.jpg"
	  },
	  "primaryLink": {
	   "label": "Explore the platform",
	   "newTab": false,
	   "type": "custom",
	   "url": "/platform"
	  },
	  "primaryLinkLabel": "Explore the platform",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/platform",
	  "secondaryLink": {
	   "label": "Meet the team",
	   "newTab": false,
	   "type": "custom",
	   "url": "#leadership"
	  },
	  "secondaryLinkLabel": "Meet the team",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "#leadership",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "heroBand",
	  "width": "contained"
	 },
	 {
	  "anchor": "story",
	  "background": "subtle",
	  "body": "<p>Our patented Light Control Metasurface (LCM™) transforms photonics into a digital platform, unlocking breakthroughs in sensing, optical switching, and communication. With more than 160 patents and growing commercial traction, Lumotive is delivering the world’s first digital platform for light — and redefining what’s possible in the optical age.</p>",
	  "designVersion": "default",
	  "eyebrow": "Our mission",
	  "heading": "Lumotive is pioneering the era of programmable optics, where for the first time, light is controlled as intelligently and flexibly as software.",
	  "id": "4e30aac9",
	  "media": {
	   "kind": "url",
	   "value": "/lumotive/img/lm10-metasurface-module.webp"
	  },
	  "mediaPosition": "left",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "splitDefault",
	  "width": "contained"
	 },
	 {
	  "anchor": "company-facts",
	  "background": "none",
	  "designVersion": "centered",
	  "eyebrow": "Built for the long term",
	  "heading": "Research depth, protected technology and strategic backing",
	  "id": "48ae11f0",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "stats": [
	   {
	    "label": "Lumotive founded",
	    "value": "2017"
	   },
	   {
	    "label": "Patents and growing",
	    "suffix": "+",
	    "value": "160"
	   },
	   {
	    "label": "Raised since founding",
	    "prefix": "$",
	    "suffix": "M+",
	    "value": "100"
	   }
	  ],
	  "type": "statsCentered",
	  "width": "contained"
	 },
	 {
	  "anchor": "recognition",
	  "background": "none",
	  "cards": [
	   {
	    "linkUrl": "https://www.gsaglobal.org/gratulations-to-the-2025-recipients-of-global-semiconductor-alliances-gsa-prestigious-annual-awards/",
	    "title": "GSA Startup to Watch Award",
	    "year": "2025"
	   },
	   {
	    "linkUrl": "https://www.ces.tech/innovation-awards/2025/ylm-10lx-3d-lidar-sensor/",
	    "title": "CES Innovation Award",
	    "year": "2025"
	   },
	   {
	    "linkUrl": "https://www.laserfocusworld.com/home/article/55130256/2024-innovators-awards-meet-the-honorees",
	    "title": "Laser Focus World Innovators Award",
	    "year": "2024"
	   },
	   {
	    "linkUrl": "https://www.ces.tech/innovation-awards/honorees/2024/honorees/l/lumotive-lm10-chip.aspx",
	    "title": "CES Innovation Award",
	    "year": "2024"
	   },
	   {
	    "linkUrl": "https://www.fastcompany.com/90979340/next-big-things-tech-transportation-2023",
	    "title": "Fast Company Next Big Things in Tech",
	    "year": "2023"
	   },
	   {
	    "linkUrl": "https://lumotive.reportablenews.com/pr/consumer-technology-association-recognizes-lumotive-with-two-ces-2022-innovation-awards",
	    "title": "CES Innovation Award",
	    "year": "2022"
	   },
	   {
	    "linkUrl": "https://www.businesswire.com/news/home/20220126005964/en/2022-SPIE-and-Photonics-Media-Prism-Awards-Celebrate-Innovative-Photonics-Technologies",
	    "title": "SPIE PRISM Award",
	    "year": "2022"
	   },
	   {
	    "linkUrl": "https://www.bintelligence.com/posts/6-people-26-companies-and-65-products-awarded-for-excellence-in-artificial-intelligence",
	    "title": "Business Intelligence Excellence in AI",
	    "year": "2022"
	   }
	  ],
	  "designVersion": "awardCards",
	  "eyebrow": "Recognition",
	  "heading": "Recognized for changing what optics can do",
	  "id": "718e83f2",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsAwardCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "leadership",
	  "background": "none",
	  "cards": [
	   {
	    "biography": "<p>Sam Heidari brings over 30 years of leadership experience across a range of technology sectors. He is currently the CEO of Lumotive and serves on the board of Morse Micro. His previous roles include CEO and Chairman of Quantenna Communications, CEO of Doradus Technologies, CTO of Ikanos, and Venture Partner at Cota Capital.</p><p>Dr. Heidari has contributed significantly to the tech industry, serving on the Global Semiconductor Alliance Board of Directors and the advisory boards for the Electrical Engineering and Computer Science departments at the University of Southern California.</p><p>His achievements have earned him numerous recognitions, including 2014 Executive of the Year by the Golden Bridge Awards, finalist for EY Entrepreneur of the Year in 2016, and 2017 Executive of the Year by UBM. A senior member of IEEE, Dr. Heidari holds more than 50 U.S. and international patents.</p><p>He earned his M.S. and Ph.D. in Electrical Engineering from the University of Southern California, and his B.S. in Electrical Engineering from Northeastern University.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/sam-heidari-1000.jpg"
	    },
	    "name": "Sam Heidari, Ph.D.",
	    "order": 1,
	    "roles": [
	     "leadership",
	     "board"
	    ],
	    "title": "CEO"
	   },
	   {
	    "biography": "<p>Gleb Akselrod has more than 10 years experience in photonics and optoelectronics. Prior to Lumotive he was the Director for Optical Technologies at Intellectual Ventures in Bellevue, WA, where he led a program on the commercialization of optical metamaterial and nanophotonic technologies.</p><p>Previously, he was a postdoctoral fellow in the Center for Metamaterials and Integrated Plasmonics at Duke University, where his work focused on plasmonic nanoantennas and metasurfaces. He completed his Ph.D. in 2013 at MIT, where he was a Hertz Foundation Fellow and an NSF Graduate Fellow studying excitons in materials for solar cells and OLEDs. Prior to MIT, Dr. Akselrod was at Landauer, Inc. where he developed and patented a fluorescent radiation sensor that is currently deployed by the US Army.</p><p>Dr. Akselrod received his Ph.D. in Physics from MIT and his B.S. in Engineering Physics from the University of Illinois at Urbana-Champaign. He holds more than 30 US Patents and has published over 25 scientific articles.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/gleb-akselrod-1000.jpg"
	    },
	    "name": "Gleb Akselrod, Ph.D.",
	    "order": 2,
	    "roles": [
	     "leadership",
	     "board"
	    ],
	    "title": "CTO & founder"
	   },
	   {
	    "biography": "<p>Apurva Jain is a recognized leader in optics, photonics, and semiconductor innovation, with over a decade of experience bringing transformative optical technologies to market. His expertise spans product strategy &amp; innovation, manufacturing operations, and customer success, guiding products from concept through mass deployment.</p><p>Apurva has contributed to multiple patents and publications and has led cross-functional teams delivering breakthrough solutions in sensing, imaging, automation, networking, and communications. Prior to Lumotive, he held leadership roles at Avo Photonics, where he helped commercialize advanced optoelectronic products. He earned a Ph.D. in Optics from CREOL, University of Central Florida, and a B.Eng. in Electrical Engineering from McGill University.</p><p>Beyond technology, Apurva is the founder of CCoffee (www.ccoffee.ca), a social impact venture that invests its profits into children’s education, reflecting his commitment to creating a positive global impact.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/apurva-jain-1000.jpg"
	    },
	    "name": "Apurva Jain, Ph.D.",
	    "order": 3,
	    "roles": [
	     "leadership"
	    ],
	    "title": "SVP of Product and Customer Success"
	   },
	   {
	    "biography": "<p>Over the past three decades, Axel Fuchs has demonstrated a strong track record in managing key aspects of global high-tech businesses.</p><p>In 1995, Dr. Fuchs co-founded the Daimler Benz Research and Technology office. He later joined Motorola&#39;s newly established Telematics division, where he led the Systems Engineering Team. Since 2002, Dr. Fuchs has held leadership positions at several Silicon Valley startups, where he played a pivotal role in developing the automotive business and expanding the consumer segment for Simple Devices, which was acquired by Universal Electronics in 2004. He also led business development for Quanergy, growing the business from inception to $50 million.</p><p>Dr. Fuchs holds a Ph.D. in Control Engineering from Darmstadt University of Technology.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/axel-fuchs-1000.jpg"
	    },
	    "name": "Axel Fuchs, Ph.D.",
	    "order": 4,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of Business Development"
	   },
	   {
	    "biography": "<p>Rakinder Grover is a technology executive with over 25 years of experience. His expertise is in business management, business development and venture capital investing in high-growth, innovation-led companies.</p><p>Prior to Lumotive, Mr. Grover held various management roles at Dolby Laboratories and Ikanos. As a Managing Director at Walden International, he was a venture capital investor in early-stage semiconductor and communications startups.</p><p>Mr. Grover holds an MBA from The Wharton School of the University of Pennsylvania, a master’s degree in computer science from the University of Texas and a bachelor’s degree from the Indian Institute of Technology.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/rakinder-grover-1000.jpg"
	    },
	    "name": "Rakinder Grover",
	    "order": 5,
	    "roles": [
	     "leadership"
	    ],
	    "title": "SVP of Finance and Partnerships"
	   },
	   {
	    "biography": "<p>Sajid Husain is a technology executive with more than 30 years of experience leading the development of complex semiconductor and system solutions across the communications, networking, storage, wireless, and photonics industries. He currently serves as Vice President of Mixed-Signal ASIC Engineering at Lumotive, where he leads the development of advanced mixed-signal ASICs enabling one-dimensional and two-dimensional beam steering technologies for next-generation 3D sensing and Optical Circuit Switching (OCS) applications for AI data centers.</p><p>Throughout his career, Sajid has successfully led multidisciplinary engineering organizations at both established semiconductor companies and high-growth startups. His expertise spans product definition, architecture, ASIC development, silicon validation, manufacturing ramp, and volume production. He has repeatedly built high-performing engineering teams from the ground up while delivering complex products from concept through commercialization.</p><p>Prior to Lumotive, Sajid led the development of Wi-Fi Access Point silicon at Quantenna Communications, contributing to industry-leading wireless networking solutions. Earlier in his career at Altera (later Intel), he played a key leadership role in the development of Stratix® 10 FPGA, one of the world&#39;s largest and most advanced programmable logic devices of its time. His broad technical background, combined with extensive leadership experience, has enabled him to successfully execute ambitious silicon development programs across multiple technology domains.</p><p>Sajid holds a Master of Technology (M.Tech.) in Electronic Design Engineering from the Indian Institute of Science (IISc), Bangalore, and a B.E in Electronics and Communication Engineering from SGSITS, Indore, India. He has also completed the Engineering Leadership Program at the UC Berkeley, with a focus on technology strategy and operational innovation.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/sajid-husain-1000.jpg"
	    },
	    "name": "Sajid Husain",
	    "order": 6,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of ASIC Engineering"
	   },
	   {
	    "biography": "<p>Clement Kong is a business leader with more than 20 years of experience in the automotive and sensing industries. Throughout his career, he has held leadership positions at global Tier 1 automotive suppliers, including Continental, Valeo, and Johnson, where he led strategic customer acquisition and drove business growth across international markets.</p><p>Most recently, Clement served as Vice President of Sales at leading LiDAR companies, including Ouster, Aeva, and Voyant Photonics. He has a proven track record of scaling high-growth technology companies from early-stage startups to IPO, securing strategic customer partnerships, and driving commercial adoption of advanced sensing technologies</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/clement-kong-1000.jpg"
	    },
	    "name": "Clement Kong",
	    "order": 7,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of Sales"
	   },
	   {
	    "biography": "<p>Diane Krzysik is a human resources executive with over 20 years of experience in all facets of human resources and business partnering. Her expertise is in Talent Acquisition, Talent Development and Nurturing a Vibrant and Inclusive Culture. She has deep experience in the following corporate life cycle changes: High-Growth, Public Transition Phase, Mergers &amp; Acquisitions, Down Market Conditions, Restructuring, Management Changes and Market Transitions.</p><p>Prior to Lumotive, Ms. Krzysik held management roles at Atomwise and Quantenna. There she built out the HR function, scaled a global high growth start up, supported the company through an IPO and was part of the team that took them through an M&amp;A and subsequent post acquisition transition to a Fortune 500 company. Prior to Quantenna, she held earlier director/manager positions at Arcwave, Carnegie Mellon University and TechTV.</p><p>Ms. Krzysik holds a Human Resource Management (HRM), Honors Distinction from the University of California Santa Cruz.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/diane-krzysik-1000.jpg"
	    },
	    "name": "Diane Krzysik",
	    "order": 8,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of Human Resources"
	   },
	   {
	    "biography": "<p>Larry Zhao, Ph.D. is an accomplished semiconductor and microelectronics professional with over 30 years of experience driving innovation in process integration and enabling new technology. Proven track record spanning major IDM, foundry, equipment vendor, R&amp;D consortia, and fabless environments, with deep expertise leading complex technical integration from design to high-volume manufacturing.</p><p>Dr. Zhao is a recognized expert and prolific innovator in the semiconductor field. He holds more than 40 U.S. patents, has co-authored over 80 conference/journal papers and a book chapter. He served on IEEE IITC committee for nearly a decade and served as Technical Advisory Board member for Semiconductor Research Corporation.</p><p>Dr. Zhao earned his Ph.D. in Electrical Engineering from KU Leuven and conducted Ph.D. research in Materials Science at Columbia University. He received his M.S. in Engineering from Dartmouth College, and a B.S. degree in Materials Science and Engineering from Shanghai Jiao Tong University.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/larry-zhao-1000.jpg"
	    },
	    "name": "Larry Zhao, Ph.D.",
	    "order": 9,
	    "roles": [
	     "leadership"
	    ],
	    "title": "VP of Process Engineering"
	   }
	  ],
	  "designVersion": "teamCards",
	  "eyebrow": "Leadership",
	  "heading": "Leadership team",
	  "id": "f9d1f9ab",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsTeamCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "board",
	  "background": "subtle",
	  "cards": [
	   {
	    "biography": "<p>Sam Heidari brings over 30 years of leadership experience across a range of technology sectors. He is currently the CEO of Lumotive and serves on the board of Morse Micro. His previous roles include CEO and Chairman of Quantenna Communications, CEO of Doradus Technologies, CTO of Ikanos, and Venture Partner at Cota Capital.</p><p>Dr. Heidari has contributed significantly to the tech industry, serving on the Global Semiconductor Alliance Board of Directors and the advisory boards for the Electrical Engineering and Computer Science departments at the University of Southern California.</p><p>His achievements have earned him numerous recognitions, including 2014 Executive of the Year by the Golden Bridge Awards, finalist for EY Entrepreneur of the Year in 2016, and 2017 Executive of the Year by UBM. A senior member of IEEE, Dr. Heidari holds more than 50 U.S. and international patents.</p><p>He earned his M.S. and Ph.D. in Electrical Engineering from the University of Southern California, and his B.S. in Electrical Engineering from Northeastern University.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/sam-heidari-1000.jpg"
	    },
	    "name": "Sam Heidari, Ph.D.",
	    "order": 1,
	    "roles": [
	     "leadership",
	     "board"
	    ],
	    "title": "CEO"
	   },
	   {
	    "biography": "<p>Gleb Akselrod has more than 10 years experience in photonics and optoelectronics. Prior to Lumotive he was the Director for Optical Technologies at Intellectual Ventures in Bellevue, WA, where he led a program on the commercialization of optical metamaterial and nanophotonic technologies.</p><p>Previously, he was a postdoctoral fellow in the Center for Metamaterials and Integrated Plasmonics at Duke University, where his work focused on plasmonic nanoantennas and metasurfaces. He completed his Ph.D. in 2013 at MIT, where he was a Hertz Foundation Fellow and an NSF Graduate Fellow studying excitons in materials for solar cells and OLEDs. Prior to MIT, Dr. Akselrod was at Landauer, Inc. where he developed and patented a fluorescent radiation sensor that is currently deployed by the US Army.</p><p>Dr. Akselrod received his Ph.D. in Physics from MIT and his B.S. in Engineering Physics from the University of Illinois at Urbana-Champaign. He holds more than 30 US Patents and has published over 25 scientific articles.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/gleb-akselrod-1000.jpg"
	    },
	    "name": "Gleb Akselrod, Ph.D.",
	    "order": 2,
	    "roles": [
	     "leadership",
	     "board"
	    ],
	    "title": "CTO & founder"
	   },
	   {
	    "biography": "<p>Conrad Burke is based in Silicon Valley and is managing partner at MetaVC Partners, LLC. He is an entrepreneur and investor, building successful new businesses in renewable energy, communications, nanomaterials, and biosciences. He was founder and CEO of energy materials startup, Innovalight (acquired by DuPont) and was venture partner at Sevin Rosen Funds and Invention Science Fund (ISF).</p><p>Some of his past and current board responsibilities include Capella Photonics (acquired by Alcatel-Lucent), Lumotive, Imagia, and the advisory boards of Aelurus (acquired by Broadcom), InnerAnalytics and Cendana Capital. For three years, Mr. Burke served on the board of SolarPower Europe - the European solar industry association. He was a Technology Pioneer at the World Economic Forum in Davos for renewable energy innovations and he is a recipient of the Ernst &amp; Young Entrepreneur of the Year™ award. Conrad has extensive international experience having worked and lived in Japan, Germany, the U.K. at AT&amp;T, NEC and Lucent Technologies.</p><p>He has a MS in Physics from Trinity College and a BS in Physics from University College Dublin in Ireland.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/conrad-burke-daylight.jpg"
	    },
	    "name": "Conrad Burke",
	    "order": 10,
	    "roles": [
	     "board"
	    ],
	    "title": "Board member"
	   },
	   {
	    "biography": "<p>Jim Anderson was appointed Chief Executive Officer of Coherent Corp. and a member of the Board of Directors on June 3, 2024. He previously served as a director and as President and Chief Executive Officer of Lattice Semiconductor Corporation since September 2018.</p><p>Prior to joining Lattice, Mr. Anderson served as the Senior Vice President and General Manager of the Computing and Graphics Business Group at Advanced Micro Devices, Inc. (AMD). Prior to AMD, Mr. Anderson held a broad range of leadership positions spanning general management, engineering, sales, marketing, and corporate strategy at companies including Intel, Broadcom (formerly Avago Technologies), and LSI Corporation.</p><p>Mr. Anderson has served on the board of directors of Entegris, Inc., since March 2023, and he currently serves on the board of directors of the Semiconductor Industry Association. He previously served on the board of directors of Sierra Wireless from April 2020 to January 2023.</p><p>Mr. Anderson earned an MBA and Master of Science degree in electrical engineering and computer science from the Massachusetts Institute of Technology, a Master of Science degree in electrical engineering from Purdue University, and a bachelor’s degree in electrical engineering from the University of Minnesota.</p>",
	    "headshot": {
	     "kind": "url",
	     "value": "/lumotive/img/team/jim-anderson-1000.jpg"
	    },
	    "name": "Jim Anderson",
	    "order": 11,
	    "roles": [
	     "board"
	    ],
	    "title": "Board member"
	   }
	  ],
	  "designVersion": "teamCards",
	  "eyebrow": "Governance",
	  "heading": "Board of directors",
	  "id": "7d5fdafa",
	  "spacingBottom": "md",
	  "spacingTop": "md",
	  "type": "cardsTeamCards",
	  "width": "contained"
	 },
	 {
	  "anchor": "investors",
	  "background": "none",
	  "designVersion": "gridOnDark",
	  "heading": "Backed by strategic investors",
	  "id": "aadb4f18",
	  "intro": "Lumotive’s investors span semiconductors, industrial innovation, telecommunications and advanced technology.",
	  "logos": [
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/amazon-aiif.png"
	    },
	    "name": "Amazon Industrial Innovation Fund"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/east-bridge.png"
	    },
	    "name": "East Bridge"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/gates-frontier.png"
	    },
	    "name": "Gates Frontier"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/ithca.png"
	    },
	    "name": "ITHCA Group"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/metavc.png"
	    },
	    "name": "MetaVC Partners"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/quan-funds.png"
	    },
	    "name": "Quan Funds"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/samsung-ventures.png"
	    },
	    "name": "Samsung Ventures"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/swisscom.png"
	    },
	    "name": "Swisscom Ventures"
	   },
	   {
	    "media": {
	     "kind": "url",
	     "value": "/lumotive/logos/usaa.png"
	    },
	    "name": "USAA"
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
	  "body": "<p>Explore the LCM platform, evaluate the LM10 or talk with Lumotive about optical switching and communications.</p>",
	  "designVersion": "default",
	  "eyebrow": "Build with Lumotive",
	  "heading": "Put programmable optics to work",
	  "id": "efd6f4b0",
	  "primaryLink": {
	   "label": "Explore the platform",
	   "newTab": false,
	   "type": "custom",
	   "url": "/platform"
	  },
	  "primaryLinkLabel": "Explore the platform",
	  "primaryLinkNewTab": false,
	  "primaryLinkUrl": "/platform",
	  "secondaryLink": {
	   "label": "Contact Lumotive",
	   "newTab": false,
	   "type": "custom",
	   "url": "/contact"
	  },
	  "secondaryLinkLabel": "Contact Lumotive",
	  "secondaryLinkNewTab": false,
	  "secondaryLinkUrl": "/contact",
	  "spacingBottom": "lg",
	  "spacingTop": "lg",
	  "type": "ctaDefault",
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
