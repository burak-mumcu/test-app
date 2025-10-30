/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    browser: true,
    es2021: true
  },
  rules: {
    'react-refresh/only-export-components': 'warn'
  },
  ignorePatterns: ['dist', 'node_modules']
};

