// Press releases imported from lumotive.com pointed back at the live site;
// this site replaces it, so only third-party coverage keeps its source link.
const SELF = 'https://lumotive.com/press-releases/'

migrate(
	(app) => {
		for (const post of app.findRecordsByFilter('posts', `sourceUrl ~ '${SELF}%'`, '', 0, 0)) {
			post.set('sourceUrl', '')
			app.save(post)
		}
	},
	(app) => {
		for (const post of app.findRecordsByFilter('posts', `category = 'Press Releases' && sourceUrl = ''`, '', 0, 0)) {
			post.set('sourceUrl', SELF + post.getString('slug'))
			app.save(post)
		}
	},
)
