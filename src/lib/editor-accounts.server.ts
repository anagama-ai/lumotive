type EditorAccountOptions = {
	roles: string[];
	passwordMinimum: number;
	passwordMaximum: number;
};

export const loadEditorAccountOptions = async (
	pb: App.Locals['pb']
): Promise<EditorAccountOptions> => {
	const options: unknown = await pb.send('/api/editor-account-options', { method: 'GET' });
	if (
		!options ||
		typeof options !== 'object' ||
		!('roles' in options) ||
		!Array.isArray(options.roles) ||
		options.roles.length === 0 ||
		!options.roles.every((role) => typeof role === 'string') ||
		!('passwordMinimum' in options) ||
		!Number.isInteger(options.passwordMinimum) ||
		Number(options.passwordMinimum) < 1 ||
		!('passwordMaximum' in options) ||
		!Number.isInteger(options.passwordMaximum) ||
		Number(options.passwordMaximum) < Number(options.passwordMinimum)
	) {
		throw new Error('PocketBase returned invalid editor account options.');
	}

	return {
		roles: options.roles,
		passwordMinimum: Number(options.passwordMinimum),
		passwordMaximum: Number(options.passwordMaximum)
	};
};
