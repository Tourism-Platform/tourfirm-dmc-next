import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";

import type { Payload } from "payload";
import type { TypedLocale } from "payload";
import { Client } from "pg";
import { parse as parseYaml } from "yaml";

import { SEED_OP_OPTS } from "../lib/constants.js";
import { CATALOG_PAGE_FILE } from "../lib/paths.js";

const LOCALES: TypedLocale[] = ["en", "ru", "uz"];

type TCatalogSeedFile = Record<
	string,
	{
		seo?: Record<string, unknown>;
		blocks?: unknown[];
	}
>;

function newSeedId(): string {
	return randomBytes(12).toString("hex");
}

function withFreshIds(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map((item) => {
			if (!item || typeof item !== "object" || Array.isArray(item)) {
				return withFreshIds(item);
			}

			const entry = item as Record<string, unknown>;
			const next: Record<string, unknown> = { id: newSeedId() };

			for (const [key, nested] of Object.entries(entry)) {
				if (key === "id") continue;
				next[key] = withFreshIds(nested);
			}

			return next;
		});
	}

	if (value && typeof value === "object") {
		const entry = value as Record<string, unknown>;
		const next: Record<string, unknown> = {};

		for (const [key, nested] of Object.entries(entry)) {
			next[key] = withFreshIds(nested);
		}

		return next;
	}

	return value;
}

async function withPg<T>(fn: (client: Client) => Promise<T>): Promise<T> {
	const uri = process.env.DATABASE_URI;
	if (!uri) throw new Error("DATABASE_URI is not set");
	const client = new Client({ connectionString: uri });
	await client.connect();
	try {
		return await fn(client);
	} finally {
		await client.end();
	}
}

async function clearToursBlocks(client: Client): Promise<void> {
	const tables = (
		await client.query(`
			SELECT tablename
			FROM pg_tables
			WHERE schemaname = 'public' AND tablename LIKE 'tours_blocks%'
		`)
	).rows.map((row) => row.tablename as string);

	for (const table of tables) {
		await client.query(`DELETE FROM "${table}"`);
	}
}

/**
 * Snapshot all tours_blocks* rows, then restore after a later locale write.
 * Needed because Payload updateGlobal reuses fallback block/action IDs and
 * hits PK(id) when seeding the next locale.
 */
async function snapshotToursBlocks(
	client: Client
): Promise<Array<{ table: string; rows: Record<string, unknown>[] }>> {
	const tables = (
		await client.query(`
			SELECT tablename
			FROM pg_tables
			WHERE schemaname = 'public' AND tablename LIKE 'tours_blocks%'
			ORDER BY 1
		`)
	).rows.map((row) => row.tablename as string);

	const snap: Array<{ table: string; rows: Record<string, unknown>[] }> = [];

	for (const table of tables) {
		const result = await client.query(`SELECT * FROM "${table}"`);
		snap.push({ table, rows: result.rows as Record<string, unknown>[] });
	}

	return snap;
}

async function restoreToursBlocks(
	client: Client,
	snap: Array<{ table: string; rows: Record<string, unknown>[] }>
): Promise<void> {
	const withMeta = [];

	for (const entry of snap) {
		if (entry.rows.length === 0) continue;

		const parentType = await client.query(
			`SELECT data_type
			 FROM information_schema.columns
			 WHERE table_schema = 'public'
				 AND table_name = $1
				 AND column_name = '_parent_id'`,
			[entry.table]
		);
		const dataType = parentType.rows[0]?.data_type as string | undefined;
		withMeta.push({
			...entry,
			// integer parent → top-level blocks (tours id); varchar → nested
			rank: dataType === "integer" ? 0 : 1,
			depth: (entry.table.match(/_/g) ?? []).length
		});
	}

	withMeta.sort(
		(a, b) =>
			a.rank - b.rank || a.depth - b.depth || a.table.localeCompare(b.table)
	);

	for (const { table, rows } of withMeta) {
		const columns = Object.keys(rows[0]!);
		const colList = columns.map((c) => `"${c}"`).join(", ");
		const jsonCols = await client.query(
			`SELECT column_name
			 FROM information_schema.columns
			 WHERE table_schema = 'public'
				 AND table_name = $1
				 AND data_type IN ('json', 'jsonb')`,
			[table]
		);
		const jsonSet = new Set(
			jsonCols.rows.map((row) => row.column_name as string)
		);

		for (const row of rows) {
			const bindValues = columns.map((c) => {
				const value = row[c];
				if (value == null || !jsonSet.has(c)) return value;
				return JSON.stringify(value);
			});
			const params = columns
				.map((c, i) => (jsonSet.has(c) ? `$${i + 1}::jsonb` : `$${i + 1}`))
				.join(", ");
			await client.query(
				`INSERT INTO "${table}" (${colList}) VALUES (${params})`,
				bindValues
			);
		}
	}
}

export async function seedToursPage(payload: Payload): Promise<void> {
	console.log("Seeding tours page...");

	const raw = await fs.readFile(CATALOG_PAGE_FILE, "utf8");
	const data = parseYaml(raw) as TCatalogSeedFile;

	await withPg(async (client) => {
		await clearToursBlocks(client);
	});

	let snapshot: Array<{ table: string; rows: Record<string, unknown>[] }> =
		[];

	for (const locale of LOCALES) {
		const localeData = data[locale];

		if (!localeData) {
			console.log(`  ~ skip tours locale ${locale}`);
			continue;
		}

		await withPg(async (client) => {
			await clearToursBlocks(client);
		});

		await payload.updateGlobal({
			slug: "tours",
			locale,
			fallbackLocale: false,
			draft: false,
			data: {
				seo: localeData.seo ?? {},
				blocks: withFreshIds(localeData.blocks ?? []) as unknown[]
			},
			...SEED_OP_OPTS
		});

		await withPg(async (client) => {
			const current = await snapshotToursBlocks(client);
			// Merge prior locales' rows with current locale rows
			const merged = new Map<string, Record<string, unknown>[]>();

			for (const entry of snapshot) {
				merged.set(entry.table, [...entry.rows]);
			}

			for (const entry of current) {
				const existing = merged.get(entry.table) ?? [];
				merged.set(entry.table, [...existing, ...entry.rows]);
			}

			snapshot = [...merged.entries()].map(([table, rows]) => ({
				table,
				rows
			}));

			await clearToursBlocks(client);
			await restoreToursBlocks(client, snapshot);
		});

		console.log(`  + tours locale ${locale}`);
	}
}
