import PocketBase from 'pocketbase';

export type Environment = 'prod' | 'staging';

const variables = {
	prod: {
		url: 'PROMOTE_PROD_URL',
		email: 'PROMOTE_PROD_EMAIL',
		password: 'PROMOTE_PROD_PASSWORD'
	},
	staging: {
		url: 'PROMOTE_STAGING_URL',
		email: 'PROMOTE_STAGING_EMAIL',
		password: 'PROMOTE_STAGING_PASSWORD'
	}
} as const;

const required = (name: string) => {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing required environment variable ${name}. Set it before running promotion.`);
	}
	return value;
};

const redact = (value: string, secrets: readonly string[]) =>
	secrets
		.filter(Boolean)
		.sort((left, right) => right.length - left.length)
		.reduce((result, secret) => result.replaceAll(secret, '[REDACTED]'), value);

export async function createEnvironmentClient(environment: Environment): Promise<PocketBase> {
	const names = variables[environment];
	const url = required(names.url);
	const email = required(names.email);
	const password = required(names.password);
	let pb: PocketBase;
	try {
		pb = new PocketBase(url).autoCancellation(false);
		await pb.collection('_superusers').authWithPassword(email, password);
	} catch (error) {
		const target = redact(url, [url, email, password]);
		// A throttled login is not a wrong password. Reporting them the same way sends an
		// operator rotating credentials to fix a rate limit.
		const status = (error as { status?: number } | null)?.status;
		if (status === 429) {
			throw new Error(
				`Rate limited while authenticating ${environment}. The credentials were not rejected; too many recent attempts against ${target}. Wait for the limiter window to pass and retry.`
			);
		}
		if (status !== undefined && status >= 500) {
			throw new Error(
				`Could not reach ${environment} to authenticate; ${target} returned ${status}. This is a transient server error, not a credential problem.`
			);
		}
		throw new Error(
			`Could not authenticate ${environment}. Verify ${names.url}, ${names.email}, and ${names.password}. Request to ${target} failed.`
		);
	}

	return pb;
}
