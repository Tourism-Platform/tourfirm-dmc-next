import fs from "node:fs/promises";
import path from "node:path";

import "./load-env.js";

import pg from "pg";

import { convertKeysDeep } from "./seed/lib/convert-keys.js";
import { buildPreviewLabelsTemplate } from "./seed/lib/preview-labels.js";
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

async function loadPreviewShape(): Promise<Record<string, unknown>> {
	const [tour, option, options] = await Promise.all([
		fs.readFile(
			path.join(UI_TEXTS_DIR, "en", "preview_tour_page.json"),
			"utf8"
		),
		fs.readFile(
			path.join(UI_TEXTS_DIR, "en", "preview_option_page.json"),
			"utf8"
		),
		fs.readFile(path.join(UI_TEXTS_DIR, "en", "options.json"), "utf8")
	]);

	return {
		tour: convertKeysDeep(JSON.parse(tour)),
		option: convertKeysDeep(JSON.parse(option)),
		labels: convertKeysDeep(
			buildPreviewLabelsTemplate(JSON.parse(options) as Record<string, unknown>)
		)
	};
}

export async function ensureUiPreviewSchema(): Promise<void> {
	const uri = process.env.DATABASE_URI;

	if (!uri) {
		throw new Error("DATABASE_URI is not set");
	}

	const client = new pg.Client({ connectionString: uri });
	await client.connect();

	try {
		const exists = await client.query(
			"SELECT to_regclass('public.ui_preview') AS reg"
		);

		if (exists.rows[0]?.reg) {
			console.log("ui_preview already exists — skip schema ensure");
			return;
		}

		const shape = await loadPreviewShape();
		const localeColumns = flattenLocaleColumns(shape);
		const localeColumnDefs = localeColumns
			.map((column) => `"${column}" varchar`)
			.join(",\n  ");

		await client.query("BEGIN");

		try {
			await client.query(`
				CREATE TABLE "ui_preview" (
					"id" serial PRIMARY KEY,
					"updated_at" timestamptz DEFAULT now(),
					"created_at" timestamptz DEFAULT now()
				);
			`);

			await client.query(`
				CREATE TABLE "ui_preview_locales" (
					"id" serial PRIMARY KEY,
					"_locale" "_locales" NOT NULL,
					"_parent_id" integer NOT NULL,
					${localeColumnDefs},
					CONSTRAINT "ui_preview_locales_parent_id_fk"
						FOREIGN KEY ("_parent_id") REFERENCES "ui_preview"("id") ON DELETE CASCADE
				);
			`);

			await client.query(`
				INSERT INTO "ui_preview" ("updated_at", "created_at")
				VALUES (now(), now());
			`);

			await client.query("COMMIT");
			console.log("Created ui_preview + ui_preview_locales");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		}
	} finally {
		await client.end();
	}
}

const isDirectRun = process.argv[1]?.includes("ensure-ui-preview-schema");

if (isDirectRun) {
	ensureUiPreviewSchema().catch((error) => {
		console.error("ensure-ui-preview-schema failed:", error);
		process.exit(1);
	});
}
