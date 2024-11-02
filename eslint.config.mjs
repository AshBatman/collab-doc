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
        process: "readonly",  // Add this line to ignore process.env
      },
    },
  },
  pluginJs.configs.recommended,
];
