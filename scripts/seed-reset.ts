import pg from "pg";

function isLockLimitError(error: unknown): boolean {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code?: string }).code === "53200"
	);
}

async function dropPublicTablesIndividually(
	client: pg.Client
): Promise<number> {
	const tablesResult = await client.query<{ tablename: string }>(`
		SELECT tablename
		FROM pg_tables
		WHERE schemaname = 'public'
	`);

	for (const { tablename } of tablesResult.rows) {
		await client.query(
			`DROP TABLE IF EXISTS public."${tablename.replace(/"/g, '""')}" CASCADE`
		);
	}

	return tablesResult.rows.length;
}

async function recreatePublicSchema(client: pg.Client): Promise<void> {
	await client.query("DROP SCHEMA IF EXISTS public CASCADE");
	await client.query("CREATE SCHEMA public");
	await client.query("GRANT ALL ON SCHEMA public TO public");
}

export function isSeedFullReset(): boolean {
	return process.env.SEED_FULL_RESET === "true";
}

export function shouldSkipDatabaseReset(): boolean {
	return (
		process.env.SEED_SKIP_RESET === "true" ||
		process.env.SEED_RESUME === "true"
	);
}

export function shouldSkipExistingDocs(): boolean {
	return (
		process.env.SEED_SKIP_EXISTING === "true" ||
		process.env.SEED_RESUME === "true"
	);
}

export function logSeedResetMode(): void {
	if (shouldSkipDatabaseReset()) {
		console.log(
			"Seed reset mode: skip (resume — no TRUNCATE / DROP, upsert by slug)"
		);
		return;
	}

	console.log(
		`Seed reset mode: ${isSeedFullReset() ? "full (DROP SCHEMA)" : "fast (TRUNCATE data)"}`
	);
}

export async function resetDatabaseSchema(
	connectionString: string
): Promise<void> {
	console.log("Resetting database schema (DROP SCHEMA)...");

	const client = new pg.Client({ connectionString });

	try {
		await client.connect();

		try {
			await recreatePublicSchema(client);
		} catch (error) {
			if (!isLockLimitError(error)) {
				throw error;
			}

			console.warn(
				"  ! DROP SCHEMA hit lock limit, dropping tables individually..."
			);
			const dropped = await dropPublicTablesIndividually(client);
			console.log(`  Dropped ${dropped} tables`);
			await recreatePublicSchema(client);
		}

		console.log("Database schema reset complete");
	} finally {
		await client.end();
	}
}

const PRESERVE_FAST_RESET_TABLES = new Set([
	"media",
	"users",
	"users_sessions",
	"payload_preferences",
	"payload_preferences_rels",
	"payload_kv"
]);

export function shouldPreserveMediaOnFastReset(): boolean {
	return process.env.SEED_PRESERVE_MEDIA !== "false";
}

export async function truncateDatabaseData(
	connectionString: string,
	options?: { preserveTables?: ReadonlySet<string> }
): Promise<void> {
	const preserveTables = options?.preserveTables;
	const modeLabel = preserveTables?.size
		? `preserving ${[...preserveTables].join(", ")}`
		: "all tables";

	console.log(`Truncating database data (${modeLabel}, schema preserved)...`);

	const client = new pg.Client({ connectionString });

	try {
		await client.connect();

		const tablesResult = await client.query<{ tablename: string }>(`
			SELECT tablename
			FROM pg_tables
			WHERE schemaname = 'public'
		`);

		const tableNames = tablesResult.rows
			.map((row) => row.tablename)
			.filter((name) => !preserveTables?.has(name));

		if (tableNames.length === 0) {
			console.log("No tables to truncate");
			return;
		}

		const quoted = tableNames.map((name) => `"${name}"`).join(", ");
		await client.query(
			`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`
		);
		console.log(`Truncated ${tableNames.length} tables`);
	} finally {
		await client.end();
	}
}

export async function resetDatabase(
	connectionString: string,
	fullReset: boolean
): Promise<void> {
	if (fullReset) {
		await resetDatabaseSchema(connectionString);
		return;
	}

	await truncateDatabaseData(
		connectionString,
		shouldPreserveMediaOnFastReset()
			? { preserveTables: PRESERVE_FAST_RESET_TABLES }
			: undefined
	);
}
