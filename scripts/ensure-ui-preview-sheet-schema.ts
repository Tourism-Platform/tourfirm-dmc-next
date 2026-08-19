import fs from "node:fs/promises";
import path from "node:path";

import "./load-env.js";

import pg from "pg";

import { convertKeysDeep } from "./seed/lib/convert-keys.js";
import { UI_TEXTS_DIR } from "./seed/lib/paths.js";

function camelToSnake(value: string): string {
	return value
		.replace(/([A-Z])/g, "_$1")
		.toLowerCase()
		.replace(/^_/, "");
}

function flattenLocaleColumns(
	value: Record<string, unknown>,
	prefix = ""
): string[] {
	const columns: string[] = [];

	for (const [key, nested] of Object.entries(value)) {
		const segment = camelToSnake(key);
		const fullKey = prefix ? `${prefix}_${segment}` : segment;

		if (nested && typeof nested === "object" && !Array.isArray(nested)) {
			columns.push(
				...flattenLocaleColumns(nested as Record<string, unknown>, fullKey)
			);
			continue;
		}

		columns.push(fullKey);
	}

	return columns;
}

async function loadSheetShape(): Promise<Record<string, unknown>> {
	const raw = await fs.readFile(
		path.join(UI_TEXTS_DIR, "en", "preview_option_sheet.json"),
		"utf8"
	);

	return convertKeysDeep(JSON.parse(raw));
}

export async function ensureUiPreviewSheetSchema(): Promise<void> {
	const uri = process.env.DATABASE_URI;

	if (!uri) {
		throw new Error("DATABASE_URI is not set");
	}

	const client = new pg.Client({ connectionString: uri });
	await client.connect();

	const tableName = "ui_preview_sheet";
	const localesTable = `${tableName}_locales`;

	try {
		const exists = await client.query(
			`SELECT to_regclass('public.${tableName}') AS reg`
		);

		const shape = await loadSheetShape();
		const localeColumns = flattenLocaleColumns(shape);

		if (exists.rows[0]?.reg) {
			const existing = await client.query(
				`SELECT column_name FROM information_schema.columns
				 WHERE table_schema = 'public' AND table_name = $1`,
				[localesTable]
			);
			const existingNames = new Set(
				existing.rows.map((row: { column_name: string }) => row.column_name)
			);

			const missing = localeColumns.filter(
				(column) => !existingNames.has(column)
			);

			if (missing.length === 0) {
				console.log(`${tableName} already exists — skip schema ensure`);
				return;
			}

			await client.query("BEGIN");
			try {
				for (const column of missing) {
					await client.query(
						`ALTER TABLE "${localesTable}" ADD COLUMN IF NOT EXISTS "${column}" varchar`
					);
				}
				await client.query("COMMIT");
				console.log(
					`Added ${missing.length} columns to ${localesTable}: ${missing.join(", ")}`
				);
			} catch (error) {
				await client.query("ROLLBACK");
				throw error;
			}
			return;
		}

		const localeColumnDefs = localeColumns
			.map((column) => `"${column}" varchar`)
			.join(",\n  ");

		await client.query("BEGIN");

		try {
			await client.query(`
				CREATE TABLE "${tableName}" (
					"id" serial PRIMARY KEY,
					"updated_at" timestamptz DEFAULT now(),
					"created_at" timestamptz DEFAULT now()
				);
			`);

			await client.query(`
				CREATE TABLE "${localesTable}" (
					"id" serial PRIMARY KEY,
					"_locale" "_locales" NOT NULL,
					"_parent_id" integer NOT NULL,
					${localeColumnDefs},
					CONSTRAINT "${localesTable}_parent_id_fk"
						FOREIGN KEY ("_parent_id") REFERENCES "${tableName}"("id") ON DELETE CASCADE
				);
			`);

			await client.query(`
				INSERT INTO "${tableName}" ("updated_at", "created_at")
				VALUES (now(), now());
			`);

			await client.query("COMMIT");
			console.log(`Created ${tableName} + ${localesTable}`);
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		}
	} finally {
		await client.end();
	}
}

const isDirectRun = process.argv[1]?.includes("ensure-ui-preview-sheet-schema");

if (isDirectRun) {
	ensureUiPreviewSheetSchema()
		.then(() => {
			console.log("ensure-ui-preview-sheet-schema complete");
		})
		.catch((error) => {
			console.error("ensure-ui-preview-sheet-schema failed:", error);
			process.exit(1);
		});
}
