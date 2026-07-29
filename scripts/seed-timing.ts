import pg from "pg";
import type { Payload } from "payload";

import type { TSeedProfiler } from "./seed-profiler.js";

export type TSeedCostTracker = {
	markSeedPhaseStart: () => void;
	logSummary: (mode: string) => void;
};

export function createSeedCostTracker(
	profiler?: TSeedProfiler
): TSeedCostTracker {
	const startedAt = Date.now();
	let seedPhaseStartedAt = 0;

	return {
		markSeedPhaseStart() {
			seedPhaseStartedAt = Date.now();
		},
		logSummary(mode: string) {
			const totalMs = Date.now() - startedAt;
			const seedMs =
				seedPhaseStartedAt > 0 ? Date.now() - seedPhaseStartedAt : 0;
			const infraMs =
				seedPhaseStartedAt > 0 ? seedPhaseStartedAt - startedAt : totalMs;

			console.log("\nCost summary:");
			console.log(`  mode: ${mode}`);
			console.log(`  infra_time: ${(infraMs / 1000).toFixed(1)}s`);
			console.log(`  seed_time: ${(seedMs / 1000).toFixed(1)}s`);
			console.log(`  total_time: ${(totalMs / 1000).toFixed(1)}s`);

			profiler?.logProfileSummary(seedMs);
		}
	};
}

export type TMediaDbIndexEntry = {
	id: number;
	url?: string | null;
	filename?: string | null;
};

export type TMediaDbIndex = Map<string, TMediaDbIndexEntry>;

export async function preloadMediaDbIndex(
	payload: Payload
): Promise<TMediaDbIndex> {
	const index: TMediaDbIndex = new Map();

	const result = await payload.find({
		collection: "media",
		limit: 1000,
		depth: 0,
		overrideAccess: true,
		context: { isSeed: true }
	});

	for (const doc of result.docs) {
		if (typeof doc.sourcePath === "string") {
			index.set(doc.sourcePath, {
				id: doc.id as number,
				url: doc.url,
				filename: doc.filename
			});
		}
	}

	console.log(`  Media DB index preloaded: ${index.size} entries`);
	return index;
}

export type TSeedStageLogger = {
	start: (label: string) => void;
	done: () => void;
	total: () => void;
};

export function createSeedStageLogger(stageCount: number): TSeedStageLogger {
	let currentStage = 0;
	let stageStartedAt = 0;
	const totalStartedAt = Date.now();

	return {
		start(label: string) {
			currentStage += 1;
			stageStartedAt = Date.now();
			console.log(`[${currentStage}/${stageCount}] ${label}...`);
		},
		done() {
			const elapsedSeconds = ((Date.now() - stageStartedAt) / 1000).toFixed(1);
			console.log(`✓ ${elapsedSeconds}s`);
		},
		total() {
			const elapsedSeconds = ((Date.now() - totalStartedAt) / 1000).toFixed(1);
			console.log(`\nTotal seed time: ${elapsedSeconds}s`);
		}
	};
}

export function maskConnectionUri(uri: string): string {
	try {
		const url = new URL(uri);
		const host = url.port ? `${url.hostname}:${url.port}` : url.hostname;

		return `${url.protocol}//***@${host}${url.pathname}`;
	} catch {
		return "(invalid connection string)";
	}
}

export type TConnectionEndpoint = "pooler" | "direct" | "local" | "unknown";

export function detectConnectionEndpoint(uri: string): TConnectionEndpoint {
	try {
		const hostname = new URL(uri).hostname;

		if (hostname === "localhost" || hostname === "127.0.0.1") {
			return "local";
		}

		if (hostname.includes("-pooler.")) {
			return "pooler";
		}

		if (hostname.includes(".neon.tech")) {
			return "direct";
		}

		return "unknown";
	} catch {
		return "unknown";
	}
}

export function resolveSeedDatabaseUri(): string {
	const directUri = process.env.DATABASE_URI_DIRECT?.trim();
	const defaultUri = process.env.DATABASE_URI?.trim();

	const uri = directUri || defaultUri;

	if (!uri) {
		throw new Error("DATABASE_URI is not set");
	}

	return enhanceSeedConnectionUri(uri);
}

function enhanceSeedConnectionUri(uri: string): string {
	try {
		const url = new URL(uri);

		if (!url.searchParams.has("connect_timeout")) {
			url.searchParams.set("connect_timeout", "120");
		}

		if (!url.searchParams.has("uselibpqcompat")) {
			url.searchParams.set("uselibpqcompat", "true");
		}

		return url.toString();
	} catch {
		return uri;
	}
}

export function isRetryableSeedConnectionError(error: unknown): boolean {
	if (!(error instanceof Error)) {
		return false;
	}

	const message = error.message.toLowerCase();
	const causeMessage =
		error.cause instanceof Error ? error.cause.message.toLowerCase() : "";

	const combined = `${message} ${causeMessage}`;

	return (
		combined.includes("connection terminated unexpectedly") ||
		combined.includes("timeout exceeded when trying to connect") ||
		combined.includes("econnreset") ||
		combined.includes("etimedout")
	);
}

export function isRetryableSeedError(error: unknown): boolean {
	if (isRetryableSeedConnectionError(error)) {
		return true;
	}

	if (
		error &&
		typeof error === "object" &&
		"status" in error &&
		(error as { status: number }).status === 404
	) {
		return true;
	}

	return false;
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export async function wakeDatabase(
	connectionString: string,
	maxAttempts = 5
): Promise<void> {
	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		const client = new pg.Client({ connectionString });

		try {
			await client.connect();
			await client.query("SELECT 1");
			console.log("  Database reachable (wake-up check passed)");
			return;
		} catch (error) {
			const waitMs = 5_000 * attempt;

			console.warn(
				`  ! database wake-up attempt ${attempt}/${maxAttempts} failed, waiting ${waitMs / 1000}s...`
			);

			if (attempt === maxAttempts) {
				throw error;
			}

			await sleep(waitMs);
		} finally {
			await client.end().catch(() => undefined);
		}
	}
}

export async function retrySeedOperation<T>(
	operation: (attempt: number) => Promise<T>,
	label: string,
	maxAttempts = 3
): Promise<T> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		try {
			return await operation(attempt);
		} catch (error) {
			lastError = error;

			if (!isRetryableSeedError(error) || attempt === maxAttempts) {
				throw error;
			}

			const waitMs = 10_000 * attempt;
			console.warn(
				`  ! ${label} failed (attempt ${attempt}/${maxAttempts}): ${error instanceof Error ? error.cause instanceof Error ? error.cause.message : error.message : "connection error"}, retrying in ${waitMs / 1000}s...`
			);
			await sleep(waitMs);
		}
	}

	throw lastError;
}

export function logSeedConnectionInfo(seedDbUri: string): void {
	const source = process.env.DATABASE_URI_DIRECT?.trim()
		? "DATABASE_URI_DIRECT"
		: "DATABASE_URI";
	const endpoint = detectConnectionEndpoint(seedDbUri);

	console.log(`Seed database source: ${source}`);
	console.log(`Seed connection endpoint: ${endpoint}`);
	console.log(`Seed connection: ${maskConnectionUri(seedDbUri)}`);
}

/** Required by node-pg: pool + client errors must not crash the process. */
export function attachSeedPoolErrorHandler(payload: Payload): void {
	type TPoolClient = {
		on: (event: string, listener: (err: Error) => void) => void;
	};

	type TSeedPool = {
		on: (
			event: "error" | "connect",
			listener:
				| ((err: Error) => void)
				| ((client: TPoolClient) => void)
		) => void;
	};

	const pool = (payload.db as { pool?: TSeedPool }).pool;

	if (!pool) {
		return;
	}

	const logNonFatalPgError = (source: string, err: Error) => {
		console.warn(`  ! pg ${source} error (non-fatal): ${err.message}`);
	};

	pool.on("error", (err: Error) => {
		logNonFatalPgError("pool idle client", err);
	});

	pool.on("connect", (client: TPoolClient) => {
		client.on("error", (err: Error) => {
			logNonFatalPgError("client", err);
		});
	});
}

export async function waitWithHeartbeat<T>(
	operation: Promise<T>,
	message: string,
	intervalMs = 30_000
): Promise<T> {
	const startedAt = Date.now();
	const timer = setInterval(() => {
		const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(0);
		console.log(`  … still running: ${message} (${elapsedSeconds}s elapsed)`);
	}, intervalMs);

	try {
		return await operation;
	} finally {
		clearInterval(timer);
	}
}
