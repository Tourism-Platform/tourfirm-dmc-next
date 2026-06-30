import { AsyncLocalStorage } from "node:async_hooks";

import type { Payload } from "payload";

export const SEED_PROFILE_CATEGORIES = [
	"payload_init",
	"media_upload",
	"resolve_seed_document",
	"payload_create",
	"payload_update_locales",
	"route_refresh",
	"navigation_globals",
	"lookup_ingest",
	"other"
] as const;

export type TSeedProfileCategory = (typeof SEED_PROFILE_CATEGORIES)[number];

type TCategoryStats = {
	wallMs: number;
	sqlCount: number;
};

export type TSeedProfiler = {
	run<T>(category: TSeedProfileCategory, operation: () => Promise<T>): Promise<T>;
	recordSql(category?: TSeedProfileCategory): void;
	getActiveCategory(): TSeedProfileCategory;
	attachSqlCounter(payload: Payload): void;
	logProfileSummary(seedMs: number): void;
};

const categoryStorage = new AsyncLocalStorage<TSeedProfileCategory>();

function createEmptyStats(): Record<TSeedProfileCategory, TCategoryStats> {
	return {
		payload_init: { wallMs: 0, sqlCount: 0 },
		media_upload: { wallMs: 0, sqlCount: 0 },
		resolve_seed_document: { wallMs: 0, sqlCount: 0 },
		payload_create: { wallMs: 0, sqlCount: 0 },
		payload_update_locales: { wallMs: 0, sqlCount: 0 },
		route_refresh: { wallMs: 0, sqlCount: 0 },
		navigation_globals: { wallMs: 0, sqlCount: 0 },
		lookup_ingest: { wallMs: 0, sqlCount: 0 },
		other: { wallMs: 0, sqlCount: 0 }
	};
}

type TPoolClient = {
	query: (...args: unknown[]) => unknown;
	on: (event: string, listener: (err: Error) => void) => void;
};

type TSeedPool = {
	query: (...args: unknown[]) => unknown;
	on: (
		event: "error" | "connect",
		listener:
			| ((err: Error) => void)
			| ((client: TPoolClient) => void)
	) => void;
};

function wrapClientQuery(
	client: TPoolClient,
	profiler: TSeedProfiler,
	flag: WeakMap<object, boolean>
): void {
	if (flag.has(client)) {
		return;
	}

	flag.set(client, true);

	const originalQuery = client.query.bind(client);

	client.query = ((...args: unknown[]) => {
		profiler.recordSql();
		return originalQuery(...args);
	}) as typeof client.query;
}

export function createSeedProfiler(): TSeedProfiler {
	const stats = createEmptyStats();
	const wrappedClients = new WeakMap<object, boolean>();

	const profiler: TSeedProfiler = {
		getActiveCategory() {
			return categoryStorage.getStore() ?? "other";
		},

		recordSql(category) {
			const key = category ?? profiler.getActiveCategory();
			stats[key].sqlCount += 1;
		},

		async run(category, operation) {
			return categoryStorage.run(category, async () => {
				const startedAt = Date.now();

				try {
					return await operation();
				} finally {
					stats[category].wallMs += Date.now() - startedAt;
				}
			});
		},

		attachSqlCounter(payload) {
			const pool = (payload.db as { pool?: TSeedPool }).pool;

			if (!pool) {
				return;
			}

			const wrapPoolQuery = () => {
				if (wrappedClients.has(pool as object)) {
					return;
				}

				wrappedClients.set(pool as object, true);

				const originalPoolQuery = pool.query.bind(pool);

				pool.query = ((...args: unknown[]) => {
					profiler.recordSql();
					return originalPoolQuery(...args);
				}) as typeof pool.query;
			};

			wrapPoolQuery();

			pool.on("connect", (client: TPoolClient) => {
				wrapClientQuery(client, profiler, wrappedClients);
			});
		},

		logProfileSummary(seedMs) {
			const rows = SEED_PROFILE_CATEGORIES.map((category) => ({
				category,
				wallMs: stats[category].wallMs,
				sqlCount: stats[category].sqlCount
			}));

			const sortedByTime = [...rows].sort((a, b) => b.wallMs - a.wallMs);
			const sortedBySql = [...rows].sort((a, b) => b.sqlCount - a.sqlCount);

			console.log("\nProfile summary (wall-clock):");
			for (const row of rows) {
				const seconds = (row.wallMs / 1000).toFixed(1);
				const pct =
					seedMs > 0
						? ((row.wallMs / seedMs) * 100).toFixed(0)
						: "0";
				console.log(
					`  ${row.category.padEnd(24)} ${seconds.padStart(7)}s  (${pct}% of seed_time)`
				);
			}

			console.log("\nProfile summary (SQL queries by category):");
			for (const row of rows) {
				console.log(
					`  ${row.category.padEnd(24)} ${String(row.sqlCount).padStart(7)} queries`
				);
			}

			const topTime = sortedByTime
				.filter((row) => row.wallMs > 0)
				.slice(0, 3)
				.map((row) => row.category);
			const topSql = sortedBySql
				.filter((row) => row.sqlCount > 0)
				.slice(0, 3)
				.map((row) => row.category);

			console.log("\nTop buckets:");
			console.log(`  wall-clock: ${topTime.join(", ") || "(none)"}`);
			console.log(`  sql_count:  ${topSql.join(", ") || "(none)"}`);
		}
	};

	return profiler;
}
