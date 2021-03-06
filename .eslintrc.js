module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    'no-console': 'error',
    'default-case': 'error',
    'default-case-last': 'error',
    '@typescript-eslint/default-param-last': 'error',
    eqeqeq: 'error',
    'dot-notation': 'error',
    'no-else-return': 'error',
    'consistent-return': 'error',
    '@typescript-eslint/no-magic-numbers': [
      'error',
      { ignoreArrayIndexes: true, ignore: [0, 1], ignoreDefaultValues: true },
    ],
    'no-return-assign': 'error',
    'no-return-await': 'error',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'no-param-reassign': ['error', { props: true }],
    'no-shadow': 'error',
    'react/react-in-jsx-scope': 'off',
  },
};
