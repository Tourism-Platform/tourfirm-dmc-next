import fs from "node:fs/promises";
import path from "node:path";

import "../load-env.js";

import pg from "pg";

import { ensureUiPreviewSheetSchema } from "../ensure-ui-preview-sheet-schema.js";
import { hasUiTextFile } from "./lib/load-ui-text.js";
import { UI_TEXTS_DIR } from "./lib/paths.js";
import { SUPPORTED_LOCALES } from "../../config/supported-locales.js";

async function seedUiPreviewSheetViaPg(): Promise<void> {
	const uri = process.env.DATABASE_URI;

	if (!uri) {
		throw new Error("DATABASE_URI is not set");
	}

	const client = new pg.Client({ connectionString: uri });
	await client.connect();

	try {
		const parent = await client.query(
			`SELECT id FROM ui_preview_sheet ORDER BY id ASC LIMIT 1`
		);
		const parentId = parent.rows[0]?.id as number | undefined;

		if (!parentId) {
			throw new Error("ui_preview_sheet row is missing");
		}

		console.log("Seeding ui-preview-sheet...");

		for (const locale of SUPPORTED_LOCALES) {
			if (!(await hasUiTextFile(locale, "preview_option_sheet.json"))) {
				console.log(
					`  ~ skip ui-preview-sheet locale ${locale} (no preview_option_sheet.json)`
				);
				continue;
			}

			const raw = await fs.readFile(
				path.join(UI_TEXTS_DIR, locale, "preview_option_sheet.json"),
				"utf8"
			);
			const sheet = JSON.parse(raw) as Record<string, string>;
			const columns = Object.keys(sheet);
			const values = columns.map((column) => sheet[column]);

			await client.query("BEGIN");
			try {
				await client.query(
					`DELETE FROM ui_preview_sheet_locales
					 WHERE _parent_id = $1 AND _locale = $2`,
					[parentId, locale]
				);

				const columnSql = columns.map((column) => `"${column}"`).join(", ");
				const placeholders = columns
					.map((_, index) => `$${index + 3}`)
					.join(", ");

				await client.query(
					`INSERT INTO ui_preview_sheet_locales
						("_locale", "_parent_id", ${columnSql})
					 VALUES ($1, $2, ${placeholders})`,
					[locale, parentId, ...values]
				);
				await client.query("COMMIT");
			} catch (error) {
				await client.query("ROLLBACK");
				throw error;
			}

			console.log(`  + ui-preview-sheet locale ${locale}`);
		}
	} finally {
		await client.end();
	}
}

async function main(): Promise<void> {
	await ensureUiPreviewSheetSchema();
	await seedUiPreviewSheetViaPg();
	console.log("seed:ui-preview-sheet complete");
	process.exit(0);
}

main().catch((error) => {
	console.error("seed:ui-preview-sheet failed:", error);
	process.exit(1);
});
