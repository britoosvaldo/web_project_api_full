import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Ignora pastas comuns de build/coverage
  globalIgnores(["node_modules", "dist", "coverage"]),
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      // Seu backend usa require()/module.exports -> CommonJS
      sourceType: "script",
      globals: {
        ...globals.node,
      },
    },
    // Sem plugins React no backend
    plugins: {},
    rules: {
      // Permite ter o parâmetro `next` não utilizado em middlewares
      "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
      // Útil no servidor para logs
      "no-console": "off",
    },
  },
]);
