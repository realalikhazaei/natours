import globals from 'globals';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  eslintPluginPrettier,
  {
    rules: {
      'prettier/prettier': 'off',
      'no-console': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'warn',
      'no-var': 'warn',
      'no-undef': 'error',
      'no-unused-vars': 'warn',
      'consistent-return': 'off',
      'no-process-exit': 'off',
      'no-param-reassign': 'warn',
    },
  },
];
