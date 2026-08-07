/**
 * Fast Neon shell schema ensure (no full drizzle push).
 * Creates/updates only missing UI globals + tours page tables.
 *
 * Usage: npm run db:ensure:neon-shell
 */
import "./load-env.js";

import type pg from "pg";
import { Client } from "pg";

import { ensureUiBookingSchema } from "./ensure-ui-booking-schema.js";
import {
	ensureUiCatalogSchema,
	ensureUiOrdersSchema
} from "./ensure-ui-catalog-orders-schema.js";
import { ensureUiPreviewSchema } from "./ensure-ui-preview-schema.js";
import { convertKeysDeep } from "./seed/lib/convert-keys.js";
import { hasUiTextFile, loadUiTextFile } from "./seed/lib/load-ui-text.js";

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

async function ensureUiTextGlobalFromJson(
	tableName: string,
	jsonFileName: string
): Promise<void> {
	const uri = process.env.DATABASE_URI;

	if (!uri) {
		throw new Error("DATABASE_URI is not set");
	}

	if (!(await hasUiTextFile("en", jsonFileName))) {
		throw new Error(`Missing ui-texts/en/${jsonFileName}`);
	}

	const shape = convertKeysDeep(
		await loadUiTextFile<Record<string, unknown>>("en", jsonFileName)
	);
	const localeColumns = flattenLocaleColumns(shape);
	const localesTable = `${tableName}_locales`;
	const client = new Client({ connectionString: uri });
	await client.connect();

	try {
		const exists = await client.query(
			`SELECT to_regclass($1) AS reg`,
			[`public.${tableName}`]
		);

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
				console.log(`${tableName} already exists — skip`);
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
					`Added ${missing.length} columns to ${localesTable}`
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

async function tableExists(
	client: pg.Client,
	tableName: string
): Promise<boolean> {
	const result = await client.query(`SELECT to_regclass($1) AS reg`, [
		`public.${tableName}`
	]);
	return Boolean(result.rows[0]?.reg);
}

async function listTablesLike(
	client: pg.Client,
	prefix: string
): Promise<string[]> {
	const result = await client.query(
		`SELECT tablename
		 FROM pg_tables
		 WHERE schemaname = 'public' AND tablename LIKE $1
		 ORDER BY 1`,
		[`${prefix}%`]
	);
	return result.rows.map((row) => row.tablename as string);
}

async function cloneTableStructure(
	client: pg.Client,
	source: string,
	target: string
): Promise<void> {
	if (await tableExists(client, target)) {
		console.log(`  ~ exists ${target}`);
		return;
	}

	await client.query(
		`CREATE TABLE "${target}" (LIKE "${source}" INCLUDING DEFAULTS INCLUDING IDENTITY INCLUDING COMMENTS)`
	);

	await client.query(`
		DO $$
		BEGIN
			IF EXISTS (
				SELECT 1 FROM information_schema.columns
				WHERE table_schema = 'public' AND table_name = '${target}' AND column_name = 'id'
			) AND NOT EXISTS (
				SELECT 1 FROM pg_constraint
				WHERE conrelid = 'public.${target}'::regclass AND contype = 'p'
			) THEN
				ALTER TABLE "${target}" ADD PRIMARY KEY (id);
			END IF;
		END $$;
	`);

	console.log(`  + cloned ${source} → ${target}`);
}

async function ensureCardTypeEnumValues(client: pg.Client): Promise<void> {
	const needed = ["catalogFeed", "tourDestination"] as const;

	const enums = await client.query(`
		SELECT DISTINCT t.typname AS enum_name
		FROM pg_type t
		JOIN pg_enum e ON t.oid = e.enumtypid
		WHERE t.typname LIKE '%cards_type'
			OR t.typname LIKE '%rows_left_type'
			OR t.typname LIKE '%rows_right_type'
		ORDER BY 1
	`);

	let added = 0;

	for (const row of enums.rows) {
		const enumName = row.enum_name as string;

		for (const value of needed) {
			const exists = await client.query(
				`SELECT 1
				 FROM pg_enum e
				 JOIN pg_type t ON t.oid = e.enumtypid
				 WHERE t.typname = $1 AND e.enumlabel = $2`,
				[enumName, value]
			);

			if (exists.rowCount && exists.rowCount > 0) continue;

			await client.query(
				`ALTER TYPE "${enumName}" ADD VALUE IF NOT EXISTS '${value}'`
			);
			added += 1;
		}
	}

	console.log(
		`Ensured card type enum values (${added} added across ${enums.rows.length} enums)`
	);
}

async function ensureImageUrlColumns(client: pg.Client): Promise<void> {
	const result = await client.query(`
		SELECT c.table_name
		FROM information_schema.columns c
		WHERE c.table_schema = 'public'
			AND c.column_name = 'image_id'
			AND NOT EXISTS (
				SELECT 1
				FROM information_schema.columns u
				WHERE u.table_schema = 'public'
					AND u.table_name = c.table_name
					AND u.column_name = 'image_url'
			)
		ORDER BY c.table_name
	`);

	const tables = result.rows.map((row) => row.table_name as string);

	if (tables.length === 0) {
		console.log("image_url columns already present — skip");
		return;
	}

	await client.query("BEGIN");
	try {
		for (const table of tables) {
			await client.query(
				`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "image_url" varchar`
			);
		}
		await client.query("COMMIT");
		console.log(`Added image_url to ${tables.length} tables`);
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	}
}

async function ensureRegularBlockColumns(client: pg.Client): Promise<void> {
	const columns: Array<{ name: string; sqlType: string }> = [
		{ name: "display_mode", sqlType: "varchar" },
		{ name: "cards_source_type", sqlType: "varchar" },
		{ name: "cards_source_field", sqlType: "varchar" },
		{ name: "cards_source_collection", sqlType: "varchar" },
		{ name: "cards_source_empty_label", sqlType: "varchar" }
	];

	const tablesResult = await client.query(`
		SELECT table_name
		FROM information_schema.tables
		WHERE table_schema = 'public'
			AND table_name ~ '_blocks_regular$'
		ORDER BY 1
	`);
	const tables = tablesResult.rows.map((row) => row.table_name as string);
	let added = 0;

	await client.query("BEGIN");
	try {
		for (const table of tables) {
			for (const column of columns) {
				const exists = await client.query(
					`SELECT 1
					 FROM information_schema.columns
					 WHERE table_schema = 'public'
						 AND table_name = $1
						 AND column_name = $2`,
					[table, column.name]
				);

				if (exists.rowCount && exists.rowCount > 0) continue;

				await client.query(
					`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${column.name}" ${column.sqlType}`
				);
				added += 1;
			}
		}
		await client.query("COMMIT");
		console.log(
			`Ensured regular block source columns (${added} added across ${tables.length} tables)`
		);
	} catch (error) {
		await client.query("ROLLBACK");
		throw error;
	}
}

async function ensureHeaderUserMenuItems(client: pg.Client): Promise<void> {
	const headerLocaleColumns = [
		"ui_texts_user_menu_login",
		"ui_texts_user_menu_logout",
		"ui_texts_user_menu_default_user_name"
	];

	for (const column of headerLocaleColumns) {
		await client.query(
			`ALTER TABLE "header_locales" ADD COLUMN IF NOT EXISTS "${column}" varchar`
		);
	}
	console.log("Ensured header_locales userMenu columns");

	if (await tableExists(client, "header_user_menu_items")) {
		console.log("header_user_menu_items already exists — skip");
		return;
	}

	await client.query(`
		CREATE TABLE "header_user_menu_items" (
			"_order" integer NOT NULL,
			"_parent_id" integer NOT NULL,
			"id" varchar PRIMARY KEY,
			"href" varchar,
			"icon" varchar
		);
	`);
	await client.query(`
		ALTER TABLE "header_user_menu_items"
			ADD CONSTRAINT "header_user_menu_items_parent_id_fk"
			FOREIGN KEY ("_parent_id") REFERENCES "header"("id") ON DELETE CASCADE;
	`);
	await client.query(`
		CREATE TABLE "header_user_menu_items_locales" (
			"title" varchar,
			"id" serial PRIMARY KEY,
			"_locale" "_locales" NOT NULL,
			"_parent_id" varchar NOT NULL
		);
	`);
	await client.query(`
		ALTER TABLE "header_user_menu_items_locales"
			ADD CONSTRAINT "header_user_menu_items_locales_parent_id_fk"
			FOREIGN KEY ("_parent_id") REFERENCES "header_user_menu_items"("id") ON DELETE CASCADE;
	`);
	console.log("Created header_user_menu_items + locales");
}

async function ensureToursSchema(client: pg.Client): Promise<void> {
	console.log("Ensuring tours global tables...");

	if (!(await tableExists(client, "homepage"))) {
		throw new Error(
			"homepage table missing on Neon — cannot clone tours schema"
		);
	}

	await cloneTableStructure(client, "homepage", "tours");
	await cloneTableStructure(client, "homepage_locales", "tours_locales");
	await cloneTableStructure(client, "homepage_rels", "tours_rels");

	await client.query(`
		DO $$
		BEGIN
			IF NOT EXISTS (
				SELECT 1 FROM pg_constraint
				WHERE conrelid = 'public.tours'::regclass AND contype = 'p'
			) THEN
				ALTER TABLE tours ADD PRIMARY KEY (id);
			END IF;
		END $$;
	`);

	// Parent row for global
	const toursCount = await client.query(`SELECT COUNT(*)::int AS c FROM tours`);
	if ((toursCount.rows[0]?.c as number) === 0) {
		await client.query(
			`INSERT INTO tours ("updated_at", "created_at") VALUES (now(), now())`
		);
	}

	await client.query(`
		DO $$
		BEGIN
			IF NOT EXISTS (
				SELECT 1 FROM pg_constraint
				WHERE conrelid = 'public.tours_locales'::regclass AND contype = 'p'
			) THEN
				ALTER TABLE tours_locales ADD PRIMARY KEY (id);
			END IF;
			IF NOT EXISTS (
				SELECT 1 FROM pg_constraint
				WHERE conrelid = 'public.tours_rels'::regclass AND contype = 'p'
			) THEN
				ALTER TABLE tours_rels ADD PRIMARY KEY (id);
			END IF;
		END $$;
	`);

	await client.query(`
		CREATE UNIQUE INDEX IF NOT EXISTS tours_locales_locale_parent_id_unique
		ON tours_locales (_locale, _parent_id)
	`);
	console.log("  ~ ensured tours_locales (_locale, _parent_id) unique");


	// Fix locales FK → tours
	await client.query(`
		ALTER TABLE tours_locales DROP CONSTRAINT IF EXISTS homepage_locales_parent_id_fk;
		ALTER TABLE tours_locales DROP CONSTRAINT IF EXISTS tours_locales_parent_id_fk;
		ALTER TABLE tours_locales
			ADD CONSTRAINT tours_locales_parent_id_fk
			FOREIGN KEY ("_parent_id") REFERENCES tours("id") ON DELETE CASCADE;
	`);

	await client.query(`
		DO $$
		BEGIN
			ALTER TABLE tours_rels DROP CONSTRAINT IF EXISTS homepage_rels_parent_fk;
			ALTER TABLE tours_rels DROP CONSTRAINT IF EXISTS tours_rels_parent_fk;
			IF NOT EXISTS (
				SELECT 1 FROM pg_constraint WHERE conname = 'tours_rels_parent_fk'
			) THEN
				ALTER TABLE tours_rels
					ADD CONSTRAINT tours_rels_parent_fk
					FOREIGN KEY ("parent_id") REFERENCES tours("id") ON DELETE CASCADE;
			END IF;
		END $$;
	`);

	const regularTables = await listTablesLike(
		client,
		"homepage_blocks_regular"
	);
	for (const source of regularTables) {
		const target = source.replace(/^homepage_/, "tours_");
		await cloneTableStructure(client, source, target);
	}

	const ctaTables = await listTablesLike(client, "homepage_blocks_cta");
	for (const source of ctaTables) {
		const target = source.replace(/^homepage_/, "tours_");
		await cloneTableStructure(client, source, target);
	}

	// mostPopularTours ≈ hero without image
	if (!(await tableExists(client, "tours_blocks_most_popular_tours"))) {
		await client.query(`
			CREATE TABLE "tours_blocks_most_popular_tours" (
				"_order" integer NOT NULL,
				"_parent_id" integer NOT NULL,
				"_path" text NOT NULL,
				"_locale" "_locales" NOT NULL,
				"id" varchar PRIMARY KEY,
				"eyebrow" varchar,
				"title" varchar,
				"description" jsonb,
				"block_name" varchar
			);
		`);
		await client.query(`
			ALTER TABLE "tours_blocks_most_popular_tours"
				ADD CONSTRAINT "tours_blocks_most_popular_tours_parent_id_fk"
				FOREIGN KEY ("_parent_id") REFERENCES "tours"("id") ON DELETE CASCADE;
		`);
		console.log("  + created tours_blocks_most_popular_tours");
	}

	// specialOffers ≈ cta fields + actions
	if (!(await tableExists(client, "tours_blocks_special_offers"))) {
		await client.query(`
			CREATE TABLE "tours_blocks_special_offers" (
				"_order" integer NOT NULL,
				"_parent_id" integer NOT NULL,
				"_path" text NOT NULL,
				"_locale" "_locales" NOT NULL,
				"id" varchar PRIMARY KEY,
				"eyebrow" varchar,
				"title" varchar,
				"description" jsonb,
				"block_name" varchar
			);
		`);
		await client.query(`
			ALTER TABLE "tours_blocks_special_offers"
				ADD CONSTRAINT "tours_blocks_special_offers_parent_id_fk"
				FOREIGN KEY ("_parent_id") REFERENCES "tours"("id") ON DELETE CASCADE;
		`);
		console.log("  + created tours_blocks_special_offers");
	}

	if (!(await tableExists(client, "tours_blocks_special_offers_actions"))) {
		await cloneTableStructure(
			client,
			"homepage_blocks_cta_actions",
			"tours_blocks_special_offers_actions"
		);
	}

	// Point top-level block parent FKs to tours
	for (const table of [
		"tours_blocks_regular",
		"tours_blocks_cta",
		"tours_blocks_most_popular_tours",
		"tours_blocks_special_offers"
	]) {
		if (!(await tableExists(client, table))) continue;

		await client.query(`
			DO $$
			BEGIN
				BEGIN
					ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "homepage_blocks_regular_parent_id_fk";
					ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "homepage_blocks_cta_parent_id_fk";
					ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "homepage_blocks_hero_parent_id_fk";
				EXCEPTION WHEN undefined_object THEN NULL;
				END;

				IF NOT EXISTS (
					SELECT 1 FROM pg_constraint WHERE conname = '${table}_parent_id_fk'
				) THEN
					ALTER TABLE "${table}"
						ADD CONSTRAINT "${table}_parent_id_fk"
						FOREIGN KEY ("_parent_id") REFERENCES "tours"("id") ON DELETE CASCADE;
				END IF;
			END $$;
		`);
	}

	console.log("tours schema ensure done");
}

async function main(): Promise<void> {
	const uri = process.env.DATABASE_URI_DIRECT?.trim();

	if (!uri) {
		throw new Error("DATABASE_URI_DIRECT is not set");
	}

	process.env.DATABASE_URI = uri;

	console.log("Ensuring Neon shell UI schemas...");
	await ensureUiCatalogSchema();
	await ensureUiOrdersSchema();
	await ensureUiBookingSchema();
	await ensureUiPreviewSchema();
	await ensureUiTextGlobalFromJson("ui_login", "login_page.json");
	await ensureUiTextGlobalFromJson("ui_tours", "tours_page.json");

	const client = new Client({ connectionString: uri });
	await client.connect();
	try {
		await ensureCardTypeEnumValues(client);
		await ensureImageUrlColumns(client);
		await ensureRegularBlockColumns(client);
		await ensureHeaderUserMenuItems(client);
		await ensureToursSchema(client);
	} finally {
		await client.end();
	}

	console.log("Neon shell schema ensure complete");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
