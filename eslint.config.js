import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'design']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.strict,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      // Los átomos se validan como su elemento nativo (CLAUDE.md §11)
      'jsx-a11y': {
        polymorphicPropName: 'as',
        components: {
          Button: 'button',
          IconButton: 'button',
          ButtonLink: 'a',
          Image: 'img',
          TextLink: 'a',
          NavLink: 'a',
          Input: 'input',
          Checkbox: 'input',
          Select: 'select',
          Textarea: 'textarea',
          Label: 'label',
        },
      },
    },
  },
])
