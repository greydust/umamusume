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
    'react/prop-types': ['off'],
  },
};
