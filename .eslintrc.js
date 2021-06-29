module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  extends: [
    'airbnb-typescript',
    'react-app',
  ],
  env: {
    node: true,
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'guard-for-in': ['off'],
    'jsx-a11y/control-has-associated-label': [
      'error',
      {
        labelAttributes: ['label'],
        controlComponents: ['CustomComponent'],
        ignoreElements: [
          'audio',
          'canvas',
          'embed',
          'input',
          'textarea',
          'tr',
          'th',
          'video',
        ],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid',
        ],
        depth: 3,
      },
    ],
    'max-len': ['error', { code: 160 }],
    'no-await-in-loop': ['off'],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'react/prop-types': ['off'],
  },
};
