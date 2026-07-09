import pg from "pg";

const REQUIRED_TABLES = [
	"badges",
	"countries",
	"regions",
	"cities",
	"media",
	"themes",
	"attractions",
	"experiences",
	"routes",
	"map_points"
] as const;

export type TNeonTableCounts = {
	tables: number;
	indexes: number;
	foreignKeys: number;
};

function resolveDirectUri(): string {
	const uri = process.env.DATABASE_URI_DIRECT?.trim();

	if (!uri) {
		throw new Error("DATABASE_URI_DIRECT is not set");
	}

	return uri;
}

export function createNeonPool(): pg.Pool {
	return new pg.Pool({
		connectionString: resolveDirectUri(),
		max: 5,
		connectionTimeoutMillis: 30_000,
		idleTimeoutMillis: 30_000,
		keepAlive: true
	});
}

export async function wakePool(pool: pg.Pool): Promise<void> {
	await pool.query("SELECT 1");
	console.log("  Neon direct connection OK (SELECT 1)");
}

export async function assertSchemaReady(pool: pg.Pool): Promise<void> {
	const result = await pool.query<{ table_name: string }>(
		`
			SELECT table_name
			FROM information_schema.tables
			WHERE table_schema = 'public'
				AND table_name = ANY($1::text[])
		`,
		[REQUIRED_TABLES]
	);

	const found = new Set(result.rows.map((row) => row.table_name));
	const missing = REQUIRED_TABLES.filter((table) => !found.has(table));

	if (missing.length > 0) {
		throw new Error(
			[
				"Payload schema is not ready on Neon.",
				`Missing tables: ${missing.join(", ")}`,
				"Create schema once outside neon-seed (dev push or restore), then rerun with PAYLOAD_DB_PUSH=false."
			].join("\n")
		);
	}

	console.log(`  Schema preflight OK (${REQUIRED_TABLES.length} core tables present)`);
}

export async function getTableCounts(pool: pg.Pool): Promise<TNeonTableCounts> {
	const [tables, indexes, foreignKeys] = await Promise.all([
		pool.query<{ count: string }>(
			`SELECT COUNT(*)::text AS count FROM information_schema.tables WHERE table_schema = 'public'`
		),
		pool.query<{ count: string }>(
			`SELECT COUNT(*)::text AS count FROM pg_indexes WHERE schemaname = 'public'`
		),
		pool.query<{ count: string }>(
			`
				SELECT COUNT(*)::text AS count
				FROM information_schema.table_constraints
				WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY'
			`
		)
	]);

	return {
		tables: Number(tables.rows[0]?.count ?? 0),
		indexes: Number(indexes.rows[0]?.count ?? 0),
		foreignKeys: Number(foreignKeys.rows[0]?.count ?? 0)
	};
}

export async function closePool(pool: pg.Pool): Promise<void> {
	await pool.end();
}
