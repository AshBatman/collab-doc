import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },
  },
  pluginJs.configs.recommended,
  {
    files: ["**/*.test.js"],  // Apply different rules for test files
    rules: {
      'no-undef': 'off', // Disable undefined variable check for test files
    },
  },
];
