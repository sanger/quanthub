import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginCypress from 'eslint-plugin-cypress'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  ...pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  eslintConfigPrettier,
  pluginCypress.configs.recommended,
  {
    rules: {
      'no-console': 'off', // It may be worth re-enabling this is we add proper error logging
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],
      'vue/no-v-model-argument': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-prop-types': 'off',
      'cypress/no-unnecessary-waiting': 'off',
    },
  },
  {
    ignores: ['dist/**/*.js'],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },
    },
  },
]
