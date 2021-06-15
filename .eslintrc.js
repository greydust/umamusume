module.exports = {
  extends: [
    'airbnb',
    'react-app',
  ],
  env: {
    mocha: false,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module',
  },
  plugins: ['react'],
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
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      fragment: 'Fragment',
      version: 'detect',
      flowVersion: '0.53',
    },
    propWrapperFunctions: [
      'forbidExtraProps',
      { property: 'freeze', object: 'Object' },
      { property: 'myFavoriteWrapper' },
    ],
    componentWrapperFunctions: [
      'observer',
      { property: 'styled' },
      { property: 'observer', object: 'Mobx' },
      { property: 'observer', object: '<pragma>' },
    ],
    linkComponents: [
      'Hyperlink',
      { name: 'Link', linkAttribute: 'to' },
    ],
  },
};
