module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', 'prettier'],
  rules: {
    'no-console': import.meta.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': import.meta.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-const': 'error',
  },
}
