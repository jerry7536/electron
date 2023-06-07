module.exports = {
  extends: '@subframe7536',
  rules: {
    'import/default': 'off',
    'react/jsx-curly-spacing': [
      'error',
      {
        when: 'never',
        attributes: {
          allowMultiline: true,
        },
        children: true,
      },
    ],
  },
}
