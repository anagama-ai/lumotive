const RESET_REQUEST_RULE = "editors:requestPasswordReset"

migrate(
	(app) => {
		const settings = app.settings()

		settings.rateLimits.enabled = true
		settings.rateLimits.rules = settings.rateLimits.rules.filter(
			(rule) => rule.label !== RESET_REQUEST_RULE
		)
		settings.rateLimits.rules.push({
			label: RESET_REQUEST_RULE,
			audience: "@guest",
			duration: 900,
			maxRequests: 3
		})
		app.save(settings)
	},
	(app) => {
		const settings = app.settings()
		settings.rateLimits.rules = settings.rateLimits.rules.filter(
			(rule) => rule.label !== RESET_REQUEST_RULE
		)
		app.save(settings)
	}
)
