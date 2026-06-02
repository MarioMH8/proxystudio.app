import hexadrop from '@hexadrop/eslint-config';

export default hexadrop(
	{
		rules: {
			'import/prefer-default-export': 'off',
		},
	},
	{
		files: ['src/modules/**/store/**.api.ts'],
		rules: {
			'typescript/no-invalid-void-type': 'off',
		},
	},
	{
		files: ['src/shared/store/store.ts'],
		rules: {
			'typescript/explicit-module-boundary-types': 'off',
			'unicorn/prefer-spread': 'off',
		},
	},
	{
		files: ['commitlint.config.ts'],
		rules: {
			'import/no-anonymous-default-export': 'off',
		},
	}
);
