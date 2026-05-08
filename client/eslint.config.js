import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended, 
  eslintConfigPrettier,

  {
    ignores: [
      'node_modules/',
      '.next/', 
      'out/',
      'dist/',
      'package-lock.json'
    ],
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      'no-empty': 'warn', 
      '@typescript-eslint/no-explicit-any': 'off', 
      
      '@next/next/no-img-element': 'warn', 
      
      'no-unused-vars': 'off', 
      '@typescript-eslint/no-unused-vars': ['warn'], 
    },
  }
);
