/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'no-useless-constructor': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  globals: {
    acquireVsCodeApi: true,
  },
};
