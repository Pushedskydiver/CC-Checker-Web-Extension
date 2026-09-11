/** @type {import('stylelint').Config} */

export default {
	plugins: ['stylelint-use-logical'],
	ignoreFiles: ['build/**', 'node_modules/**'],
	rules: {
		'selector-class-pattern': null,
		'no-descending-specificity': null,
		'color-no-invalid-hex': true,
		'declaration-no-important': true,
		'max-nesting-depth': 4,
		'length-zero-no-unit': true,
		'declaration-block-no-duplicate-properties': true,
		'declaration-block-no-redundant-longhand-properties': true,
		'declaration-block-no-shorthand-property-overrides': true,
		'block-no-empty': true,
		'no-duplicate-selectors': true,
		'csstools/use-logical': true,
		'at-rule-no-unknown': [
			true,
			{
				// CSS Modules `@value` (breakpoint tokens shared between modules)
				ignoreAtRules: ['value'],
			},
		],
		'property-no-unknown': [
			true,
			{
				ignoreProperties: ['composes', 'composes-with'],
			},
		],
	},
};
