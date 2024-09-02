// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from 'eslint-plugin-prettier';

/**
 * @see https://typescript-eslint.io/getting-started/typed-linting
 */
export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier, {
  files: ['**/*.js', '**/*.ts'],
  languageOptions: {
    ecmaVersion: 2020,
  },
  plugins: { eslintPluginPrettier },
  rules: {
    quotes: ['error', 'single', { avoidEscape: true }],
    indent: ['error', 2],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'args': 'all',
        'argsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }
    ]
  },
});
