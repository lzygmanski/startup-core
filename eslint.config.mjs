import eslint from '@eslint/js';
import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.agents/**',
      '.codex/**',
      '.nx/**',
      'cdk.out/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@nx': nx,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      'import/order': [
        'error',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
        },
      ],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: false,
          depConstraints: [
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['type:ui', 'type:contract'] },
            {
              sourceTag: 'type:service',
              onlyDependOnLibsWithTags: [
                'type:application',
                'type:domain',
                'type:adapter',
                'type:contract',
              ],
            },
            { sourceTag: 'type:domain', onlyDependOnLibsWithTags: ['type:domain'] },
            {
              sourceTag: 'type:application',
              onlyDependOnLibsWithTags: ['type:domain', 'type:contract'],
            },
            {
              sourceTag: 'type:adapter',
              onlyDependOnLibsWithTags: ['type:application', 'type:domain', 'type:contract'],
            },
            { sourceTag: 'type:contract', onlyDependOnLibsWithTags: ['type:contract'] },
            { sourceTag: 'type:ui', onlyDependOnLibsWithTags: ['type:ui', 'type:contract'] },
            { sourceTag: 'type:infra', onlyDependOnLibsWithTags: ['type:infra'] },
          ],
        },
      ],
    },
  },
);
