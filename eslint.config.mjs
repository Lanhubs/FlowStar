import globals from 'globals'
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'contracts/**',
      'e2e/**',
      'public/**',
    ],
  },
  js.configs.recommended,
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
]
