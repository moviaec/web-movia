// @ts-check
const eslint = require('@eslint/js');
const { defineConfig, globalIgnores } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
	globalIgnores(['dist', '.angular', 'coverage', '**/*.spec.ts']),
	{
		files: ['**/*.ts'],
		extends: [eslint.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic, angular.configs.tsRecommended, prettier],
		processor: angular.processInlineTemplates,
		rules: {
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'app',
					style: 'camelCase'
				}
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'app',
					style: 'kebab-case'
				}
			],
			'@typescript-eslint/explicit-function-return-type': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			// RULES.md regla 22: el `_` marca lo que no sale de la clase, y solo eso.
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: ['classProperty', 'classMethod', 'accessor'],
					modifiers: ['private'],
					format: ['camelCase'],
					leadingUnderscore: 'require'
				},
				{
					selector: ['classProperty', 'classMethod', 'accessor'],
					modifiers: ['public'],
					format: ['camelCase'],
					leadingUnderscore: 'forbid'
				},
				{
					selector: ['classProperty', 'classMethod', 'accessor'],
					modifiers: ['protected'],
					format: ['camelCase'],
					leadingUnderscore: 'forbid'
				}
			],
			'no-console': ['error', { allow: ['error', 'warn'] }]
		}
	},
	{
		files: ['**/*.html'],
		extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
		rules: {}
	}
]);
