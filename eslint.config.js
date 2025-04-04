import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  ...pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  eslintConfigPrettier,
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
        // Global vitest and Cypress variables so they don't violate no-undef
        vi: 'readonly',
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
  },
]
