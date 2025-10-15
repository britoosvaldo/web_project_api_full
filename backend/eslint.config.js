import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["node_modules", "dist", "coverage"]),
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,

      sourceType: "script",
      globals: {
        ...globals.node,
      },
    },

    plugins: {},
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "next" }],

      "no-console": "off",
    },
  },
]);
