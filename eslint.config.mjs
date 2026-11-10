import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    // Files and folders ESLint should never touch
    ignores: ['.features-gen/**', 'node_modules/**', 'dist/**'],
  },
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['src/**/*.ts'],
    rules: {
      // Allow _prefix convention for intentionally unused parameters
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Test helpers often don't need explicit return types
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Warn rather than error — test code sometimes needs escape hatches
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
);
