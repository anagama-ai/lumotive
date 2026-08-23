const DEFAULT_RESET_SUBJECT = "Reset your {APP_NAME} password"
const DEFAULT_RESET_BODY = `<p>Hello,</p>
<p>Click on the button below to reset your password.</p>
<p>
  <a class="btn" href="{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}" target="_blank" rel="noopener">Reset password</a>
</p>
<p><i>If you didn't ask to reset your password, please ignore this email.</i></p>
<p>
  Thanks,<br/>
  {APP_NAME} team
</p>`

const RESET_SUBJECT = "Set your {APP_NAME} password"
const RESET_BODY = `<p>Hello,</p>
<p>Use the button below to set a password for your {APP_NAME} account.</p>
<p>
  <a class="btn" href="{APP_URL}/admin/reset/{TOKEN}" target="_blank" rel="noopener">Set password</a>
</p>
<p><i>If you didn't request this link or expect an account invitation, you can ignore this email.</i></p>
<p>
  Thanks,<br/>
  {APP_NAME} team
</p>`

migrate(
	(app) => {
		const resendKey = $os.getenv("RESEND_API_KEY")
		const siteURL = $os.getenv("SITE_URL")
		const senderName = $os.getenv("MAIL_SENDER_NAME")
		const senderAddress = $os.getenv("MAIL_SENDER_ADDRESS")
		const settings = app.settings()

		settings.smtp.enabled = Boolean(resendKey)
		settings.smtp.host = "smtp.resend.com"
		settings.smtp.port = 2465
		settings.smtp.tls = true
		settings.smtp.username = "resend"
		settings.smtp.password = resendKey || ""
		if (siteURL) settings.meta.appURL = siteURL
		if (senderName) {
			settings.meta.appName = senderName
			settings.meta.senderName = senderName
		}
		if (senderAddress) settings.meta.senderAddress = senderAddress
		app.save(settings)

		const editors = app.findCollectionByNameOrId("editors")
		editors.resetPasswordTemplate.subject = RESET_SUBJECT
		editors.resetPasswordTemplate.body = RESET_BODY
		app.save(editors)
	},
	(app) => {
		const settings = app.settings()

		settings.smtp.enabled = false
		settings.smtp.host = "smtp.example.com"
		settings.smtp.port = 587
		settings.smtp.tls = false
		settings.smtp.username = ""
		settings.smtp.password = ""
		settings.meta.senderName = "Support"
		settings.meta.senderAddress = "support@example.com"
		settings.meta.appName = "Acme"
		settings.meta.appURL = "http://localhost:8090"
		app.save(settings)

		const editors = app.findCollectionByNameOrId("editors")
		editors.resetPasswordTemplate.subject = DEFAULT_RESET_SUBJECT
		editors.resetPasswordTemplate.body = DEFAULT_RESET_BODY
		app.save(editors)
	}
)
