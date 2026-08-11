import pluginVue from 'eslint-plugin-vue'
import pluginCypress from 'eslint-plugin-cypress'
import js from '@eslint/js'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/require-prop-types': 'off',
    },
  },
  {
    files: ['tests/e2e/**/*.js'],
    extends: [pluginCypress.configs.recommended],
  },
  {
    ignores: ['dist/**/*.js', 'docs/**/*.js', 'documentation/**/*.js'],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        // e.g. it, expect, describe
        ...globals.vitest,
        // e.g. document, alert, window
        ...globals.browser,
      },
    },
  },
])
