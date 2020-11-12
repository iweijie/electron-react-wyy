module.exports = {
  extends: 'erb/typescript',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/order': 0,
    'max-classes-per-file': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/forbid-prop-types': 0,
    'react/state-in-constructor': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    // 不能添加静态的 property， 包含 propTypes，defaultProps
    'react/static-property-placement': 0,
    // props 必须添加 默认值
    'react/require-default-props': 0,
    // 匿名函数
    'func-names': 0,
    // arguments 重新赋值
    'no-param-reassign': 0,
    // react类组件方法放置顺序
    'react/sort-comp': 0,
    // class 属性类型定义要有间距， 不爽所以取消了
    '@typescript-eslint/lines-between-class-members': 0,
    'prefer-destructuring': 0,
    // 自增自减
    'no-plusplus': 0,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
