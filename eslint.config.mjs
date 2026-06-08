import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"node_modules/**",
		"next-env.d.ts"
	]),

	...nextVitals,
	...nextTs,

	{
		files: ["**/*.{ts,tsx}"],
		ignores: ["**/*.config.{ts,js,mjs}", "next.config.ts"],
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			boundaries,
			unicorn
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error"],
			"no-console": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"react-refresh/only-export-components": "off",
			"@typescript-eslint/no-require-imports": [
				"error",
				{
					allow: ["/next\\.config\\.(js|ts|mjs)$/"]
				}
			],

			"unicorn/filename-case": [
				"error",
				{
					cases: {
						kebabCase: true,
						camelCase: false,
						pascalCase: false
					},
					ignore: [
						/^use[A-Z][a-zA-Z]*\.(ts|tsx)$/,
						/^with[A-Z][a-zA-Z]*\.(ts|tsx)$/,
						/^[a-z][a-z0-9]*\.(service|api|util|config|types|interface|store|hook|slice)\.ts$/,
						/^[a-z][a-z0-9]*\.(service|store|api|util|config|hook|slice)\.(types|interface)\.ts$/,
						/^(page|layout|loading|error|not-found|template|default)\.tsx?$/,
						/^(globals|metadata)\.css$/,
						/^\.[a-z][a-z0-9-]*rc(\.(js|ts|json))?$/,
						/^proxy\.ts$/
					]
				}
			],

			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "interface",
					format: ["PascalCase"],
					prefix: ["I"]
				},
				{
					selector: "typeAlias",
					format: ["PascalCase"],
					filter: {
						regex: "^ENUM_[A-Z]",
						match: false
					},
					prefix: ["T"]
				},
				{
					selector: "variable",
					modifiers: ["const", "exported"],
					types: ["string", "number", "boolean"],
					format: ["UPPER_CASE"]
				},
				{
					selector: "function",
					format: ["camelCase", "PascalCase"]
				},
				{
					selector: "variable",
					modifiers: ["const", "exported"],
					filter: {
						regex: "^use[A-Z]",
						match: true
					},
					format: ["camelCase"]
				},
				{
					selector: "function",
					filter: {
						regex: "^use[A-Z]",
						match: true
					},
					format: ["camelCase"]
				}
			],

			"boundaries/element-types": [
				"error",
				{
					default: "disallow",
					rules: [
						{
							from: "app",
							allow: [
								"app",
								"pages",
								"widgets",
								"features",
								"entities",
								"shared"
							]
						},
						{
							from: "pages",
							allow: ["widgets", "features", "entities", "shared"]
						},
						{
							from: "widgets",
							allow: ["features", "entities", "shared"]
						},
						{
							from: "features",
							allow: ["entities", "shared", "features"]
						},
						{
							from: "entities",
							allow: ["entities", "shared"]
						},
						{ from: "shared", allow: ["shared"] }
					]
				}
			],

			"boundaries/no-private": "error"
		},
		settings: {
			"boundaries/elements": [
				{ type: "app", pattern: "src/app/**/*" },
				{ type: "pages", pattern: "src/pages/**/*" },
				{ type: "widgets", pattern: "src/widgets/**/*" },
				{ type: "features", pattern: "src/features/**/*" },
				{ type: "entities", pattern: "src/entities/**/*" },
				{ type: "shared", pattern: "src/shared/**/*" }
			],
			"boundaries/ignore": [
				"**/*.test.{ts,tsx}",
				"**/*.spec.{ts,tsx}",
				"**/*.stories.{ts,tsx}"
			],
			react: { version: "detect" },
			"import/resolver": {
				typescript: {
					project: ["./tsconfig.json"]
				}
			}
		}
	},

	{
		files: ["src/shared/ui/**/*.ts", "src/shared/ui/**/*.tsx"],
		rules: {
			"@typescript-eslint/naming-convention": "off",
			"@typescript-eslint/no-explicit-any": "off"
		}
	},

	{
		files: ["**/*.d.ts"],
		rules: {
			"@typescript-eslint/naming-convention": "off"
		}
	},

	{
		files: ["**/*.config.{ts,js,mjs}", "next.config.ts"],
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.node
		},
		rules: {
			"@typescript-eslint/no-require-imports": "off",
			"no-console": "off"
		}
	}
]);
