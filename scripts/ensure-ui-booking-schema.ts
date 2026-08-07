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

async function loadBookingShape(): Promise<Record<string, unknown>> {
	const raw = await fs.readFile(
		path.join(UI_TEXTS_DIR, "en", "preview_booking_page.json"),
		"utf8"
	);

	return convertKeysDeep(JSON.parse(raw));
}

export async function ensureUiBookingSchema(): Promise<void> {
	const uri = process.env.DATABASE_URI;

	if (!uri) {
		throw new Error("DATABASE_URI is not set");
	}

	const client = new pg.Client({ connectionString: uri });
	await client.connect();

	try {
		const exists = await client.query(
			"SELECT to_regclass('public.ui_booking') AS reg"
		);

		if (exists.rows[0]?.reg) {
			console.log("ui_booking already exists — skip schema ensure");
			return;
		}

		const shape = await loadBookingShape();
		const localeColumns = flattenLocaleColumns(shape);
		const localeColumnDefs = localeColumns
			.map((column) => `"${column}" varchar`)
			.join(",\n  ");

		await client.query("BEGIN");

		try {
			await client.query(`
				CREATE TABLE "ui_booking" (
					"id" serial PRIMARY KEY,
					"updated_at" timestamptz DEFAULT now(),
					"created_at" timestamptz DEFAULT now()
				);
			`);

			await client.query(`
				CREATE TABLE "ui_booking_locales" (
					"id" serial PRIMARY KEY,
					"_locale" "_locales" NOT NULL,
					"_parent_id" integer NOT NULL,
					${localeColumnDefs},
					CONSTRAINT "ui_booking_locales_parent_id_fk"
						FOREIGN KEY ("_parent_id") REFERENCES "ui_booking"("id") ON DELETE CASCADE
				);
			`);

			await client.query(`
				INSERT INTO "ui_booking" ("updated_at", "created_at")
				VALUES (now(), now());
			`);

			await client.query("COMMIT");
			console.log("Created ui_booking + ui_booking_locales");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		}
	} finally {
		await client.end();
	}
}

const isDirectRun = process.argv[1]?.includes("ensure-ui-booking-schema");

if (isDirectRun) {
	ensureUiBookingSchema().catch((error) => {
		console.error("ensure-ui-booking-schema failed:", error);
		process.exit(1);
	});
}
