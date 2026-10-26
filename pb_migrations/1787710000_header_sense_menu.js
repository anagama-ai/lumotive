// Site header, Sense dropdown. Approved content package rev. 2026-10-07,
// page 02 (Navigation) and the page 01 site map.
//
// The dropdown still carried the pre-package menu:
//
//   Overview                       /sense
//   LM10 chip                      /lm10
//   Dev kits & reference designs   /dev-kits
//     TX10 Development Kit         /tx10
//     M30 Development Kit          /m30
//     NM120 Development Kit        /nm120
//
// Two of those entries are retired by the package. /lm10 no longer exists: the
// LCM Chips page replaced it and /lm10 now 308s to /lcm-chips, so the entry was
// pointing a visitor through a redirect at a page the package lists under
// Platform, not Sense. The three kit children are retired too: the site map
// replaces /tx10, /m30 and /nm120 with /dev-kits/transmit-modules,
// /dev-kits/itof and /dev-kits/dtof, and the package's own Sense group lists no
// children under Dev kits.
//
// The group becomes the approved list:
//
//   Overview     /sense
//   Robotics     /sense/robotics
//   Dev kits     /dev-kits
//
// AUTOMOTIVE IS HELD BACK. The approved group is Overview, Robotics,
// Automotive, Dev kits, but /sense/automotive is package page 11 and has not
// been built, so adding it now would put a 404 in the primary navigation.
// Robotics is included because page 10 shipped and the route answers 200.
// Adding Automotive is a one-entry change to this list once page 11 lands; the
// entry is written out in the comment below so it can be pasted in verbatim:
//
//   sub('Automotive', '/sense/automotive', 'Surround sensing for vehicles and heavy equipment')
//
// The footer already lists Automotive and has been answering 404 there since
// the footer was rebuilt; that is tracked separately and is not widened here.
//
// A SECOND, SMALLER REPAIR in the Applications group. Its Robotics and
// Automotive entries pointed at /applications#sense and
// /applications#safety-cocoon. Page 08 removed both of those sections from
// /applications, so the fragments no longer exist: the page still answers 200,
// but the links land at the top of it instead of anywhere meaningful. Robotics
// now points at /sense/robotics, the real page that shipped with page 10.
// Automotive drops the dead fragment and points at /applications until page 11
// lands, at which point it becomes /sense/automotive alongside the Sense entry.
// Labels and descriptions are untouched.
//
// Nothing else changes. Platform, Connect, Company and the Contact button are
// untouched, as is every label, description and the dropdown's styling and
// behaviour, which are read from this same shape.
//
// `record.get(<json field>)` yields Go-side JSONRaw, which turns into junk in
// the JSVM. Read the raw text and parse it instead.
const GROUP_LABEL = 'Sense'

const sub = (label, url, description) => ({
	Description: description,
	link: { label, newTab: false, type: 'custom', url },
	linkLabel: label,
	linkNewTab: false,
	linkUrl: url
})

const NEXT_SUBITEMS = [
	sub('Overview', '/sense', 'Software-defined 3D sensing for Physical AI'),
	sub('Robotics', '/sense/robotics', 'Adaptive 3D sensing for robots and humanoids'),
	sub('Dev kits', '/dev-kits', 'Evaluate LCM in your own system')
]

const PREV_SUBITEMS = [
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
			"Description": "The LCM beamforming chip",
			"link": {
				"label": "LM10 chip",
				"newTab": false,
				"type": "custom",
				"url": "/lm10"
			},
			"linkLabel": "LM10 chip",
			"linkNewTab": false,
			"linkUrl": "/lm10"
		},
		{
			"Description": "Evaluate LCM in your own system",
			"link": {
				"label": "Dev kits & reference designs",
				"newTab": false,
				"type": "custom",
				"url": "/dev-kits"
			},
			"linkLabel": "Dev kits & reference designs",
			"linkNewTab": false,
			"linkUrl": "/dev-kits",
			"subitems": [
				{
					"link": {
						"label": "TX10 Development Kit",
						"newTab": false,
						"type": "custom",
						"url": "/tx10"
					},
					"linkLabel": "TX10 Development Kit",
					"linkNewTab": false,
					"linkUrl": "/tx10"
				},
				{
					"link": {
						"label": "M30 Development Kit",
						"newTab": false,
						"type": "custom",
						"url": "/m30"
					},
					"linkLabel": "M30 Development Kit",
					"linkNewTab": false,
					"linkUrl": "/m30"
				},
				{
					"link": {
						"label": "NM120 Development Kit",
						"newTab": false,
						"type": "custom",
						"url": "/nm120"
					},
					"linkLabel": "NM120 Development Kit",
					"linkNewTab": false,
					"linkUrl": "/nm120"
				}
			]
		}
	]

const APPS_LABEL = 'Applications'

const NEXT_APPS = [
	sub('Overview', '/applications', 'Programmable optics across applications'),
	sub('Robotics', '/sense/robotics', 'Adaptive 3D sensing for robots and humanoids'),
	sub('Automotive', '/applications', 'Surround sensing for vehicles and heavy equipment')
]

const PREV_APPS = [
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
				"url": "/applications#sense"
			},
			"linkLabel": "Robotics",
			"linkNewTab": false,
			"linkUrl": "/applications#sense"
		},
		{
			"Description": "Surround sensing for vehicles and heavy equipment",
			"link": {
				"label": "Automotive",
				"newTab": false,
				"type": "custom",
				"url": "/applications#safety-cocoon"
			},
			"linkLabel": "Automotive",
			"linkNewTab": false,
			"linkUrl": "/applications#safety-cocoon"
		}
	]

const findHeader = (app) => {
	try {
		return app.findFirstRecordByFilter('globals', 'key = {:key}', { key: 'header' })
	} catch {
		return null
	}
}

const apply = (app, subitems, appsSubitems) => {
	const record = findHeader(app)
	if (!record) return

	let data
	try {
		data = JSON.parse(record.getString('data') || '{}')
	} catch {
		return
	}
	if (!data || !Array.isArray(data.items)) return

	const group = data.items.find((entry) => entry && entry.label === GROUP_LABEL)
	if (!group || group.blockType !== 'sub') return

	const apps = data.items.find((entry) => entry && entry.label === APPS_LABEL)
	if (!apps || apps.blockType !== 'sub') return

	group.subitems = JSON.parse(JSON.stringify(subitems))
	apps.subitems = JSON.parse(JSON.stringify(appsSubitems))

	record.set('data', data)
	app.save(record)
}

migrate(
	(app) => {
		apply(app, NEXT_SUBITEMS, NEXT_APPS)
	},
	(app) => {
		apply(app, PREV_SUBITEMS, PREV_APPS)
	}
)
