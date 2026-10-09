import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "scratch/**",
      "scripts/**",
      "src/data/**",
      "**/*.mjs",
      "**/*.cjs",
    ],
  },

  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "@next/next": { rules: { "no-img-element": { create: () => ({}) } } },
      "react-hooks": { rules: { "exhaustive-deps": { create: () => ({}) } } },
      "react": { rules: { "no-danger": { create: () => ({}) } } },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "prefer-const": "warn",
      "no-undef": "off", // TypeScript handles this
    },
  },
];
