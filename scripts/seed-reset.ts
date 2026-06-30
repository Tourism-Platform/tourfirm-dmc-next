import pg from "pg";

export function isSeedFullReset(): boolean {
	return process.env.SEED_FULL_RESET === "true";
}

export function logSeedResetMode(): void {
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
		await client.query("DROP SCHEMA IF EXISTS public CASCADE");
		await client.query("CREATE SCHEMA public");
		await client.query("GRANT ALL ON SCHEMA public TO public");
		console.log("Database schema reset complete");
	} finally {
		await client.end();
	}
}

export async function truncateDatabaseData(
	connectionString: string
): Promise<void> {
	console.log("Truncating database data (schema preserved)...");

	const client = new pg.Client({ connectionString });

	try {
		await client.connect();

		const tablesResult = await client.query<{ tablename: string }>(`
			SELECT tablename
			FROM pg_tables
			WHERE schemaname = 'public'
		`);

		const tableNames = tablesResult.rows.map((row) => row.tablename);

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

	await truncateDatabaseData(connectionString);
}
