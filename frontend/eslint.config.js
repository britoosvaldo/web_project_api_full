import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      react, // ⬅️ ADICIONE
    },
    settings: {
      react: { version: "detect" }, // ⬅️ BOM TER
    },
    rules: {
      "react/jsx-uses-vars": "error", // ⬅️ FAZ O JSX CONTAR COMO “USO”
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off",
      // opcional: deixar no-unused-vars como aviso enquanto limpa
      // "no-unused-vars": "warn",
    },
  },
]);
