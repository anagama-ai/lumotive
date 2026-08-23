const AUTH_RULE = "editors:authWithPassword"
const SUBMIT_RULE = "form_submissions:create"
const BACKUP_CRON = "0 3 * * *"
const BACKUP_KEEP = 7

migrate(
	(app) => {
		const settings = app.settings()

		settings.rateLimits.enabled = true
		settings.rateLimits.rules = settings.rateLimits.rules.filter(
			(rule) => rule.label !== AUTH_RULE && rule.label !== SUBMIT_RULE
		)
		// Ten attempts per five minutes stops password spraying without punishing ordinary typos.
		settings.rateLimits.rules.push({
			label: AUTH_RULE,
			audience: "@guest",
			duration: 300,
			maxRequests: 10
		})
		// Twenty submissions per minute stops burst spam while leaving headroom for a shared network.
		settings.rateLimits.rules.push({
			label: SUBMIT_RULE,
			audience: "@guest",
			duration: 60,
			maxRequests: 20
		})

		// Only claim the backup schedule when the deployment has not set one, so
		// re-running this never overwrites an operator's own arrangement.
		if (!settings.backups.cron) {
			settings.backups.cron = BACKUP_CRON
			// Seven daily snapshots cap disk growth while preserving a week of recovery points.
			settings.backups.cronMaxKeep = BACKUP_KEEP
		}

		app.save(settings)
	},
	(app) => {
		const settings = app.settings()

		// Remove only the two rules this migration owns; any rule an operator added
		// separately must survive. The limiter itself stays enabled for the same
		// reason: something else may now depend on it.
		settings.rateLimits.rules = settings.rateLimits.rules.filter(
			(rule) => rule.label !== AUTH_RULE && rule.label !== SUBMIT_RULE
		)

		// Clear the schedule only if it is still exactly the one set above. A changed
		// value means an operator took it over and it is not ours to revert.
		if (settings.backups.cron === BACKUP_CRON && settings.backups.cronMaxKeep === BACKUP_KEEP) {
			settings.backups.cron = ""
		}

		app.save(settings)
	}
)
