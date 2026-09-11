import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'build/**',
			'node_modules/**',
			'test-results/**',
			'playwright-report/**',
		],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		...react.configs.flat.recommended,
		settings: { react: { version: 'detect' } },
	},
	{ files: ['**/*.{ts,tsx}'], ...react.configs.flat['jsx-runtime'] },
	{ files: ['**/*.{ts,tsx}'], ...reactHooks.configs.flat.recommended },
	{ files: ['**/*.{ts,tsx}'], ...jsxA11y.flatConfigs.recommended },
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				chrome: 'readonly',
			},
		},
		rules: {
			'react/prop-types': 'off',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ prefer: 'type-imports', fixStyle: 'inline-type-imports' },
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', caughtErrors: 'none' },
			],
			'no-unused-expressions': 'off',
			'@typescript-eslint/no-unused-expressions': 'error',
		},
	},
	{
		// Playwright fixtures receive a `use` callback and destructure `{}` by convention.
		files: ['test/**/*.ts', 'playwright.config.ts'],
		rules: {
			'react-hooks/rules-of-hooks': 'off',
			'no-empty-pattern': 'off',
		},
	},
	prettier,
);
