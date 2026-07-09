import "../load-env.js";

import { getPayload } from "payload";

import {
	attachSeedPoolErrorHandler,
	preloadMediaDbIndex
} from "../seed-timing.js";
import { SeedLookupCache } from "../seed-lookup-cache.js";
import { setSeedRuntimeContext } from "../seed.js";

import {
	createFreshCheckpoint,
	getCheckpointPath,
	loadCheckpoint,
	saveCheckpoint,
	type TNeonSeedCheckpoint
} from "./checkpoint.js";
import {
	collectDryRunReport,
	loadNeonSeedItems,
	printDryRunReport,
	type TNeonSeedItem
} from "./loader.js";
import { loadBadgeIds, type TMilestone1Context } from "./milestone1.js";
import {
	assertSchemaReady,
	closePool,
	createNeonPool,
	getTableCounts,
	wakePool
} from "./neon-client.js";
import { withRetry } from "./retry.js";
import { seedNeonItem } from "./seed-item.js";

type TCliOptions = {
	dryRun: boolean;
	resume: boolean;
	limit?: number;
	abortAfter?: number;
};

function parseCliOptions(argv: string[]): TCliOptions {
	const dryRun = argv.includes("--dry-run");
	const resume = !argv.includes("--no-resume");

	const limitArg = argv.find((arg) => arg.startsWith("--limit="));
	const abortArg = argv.find((arg) => arg.startsWith("--abort-after="));

	const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;
	const abortAfter = abortArg ? Number(abortArg.split("=")[1]) : undefined;

	if (limitArg && (!Number.isFinite(limit) || (limit ?? 0) <= 0)) {
		throw new Error("--limit must be a positive number");
	}

	if (abortArg && (!Number.isFinite(abortAfter) || (abortAfter ?? 0) <= 0)) {
		throw new Error("--abort-after must be a positive number");
	}

	return { dryRun, resume, limit, abortAfter };
}

function configureNeonSeedEnv(): void {
	const directUri = process.env.DATABASE_URI_DIRECT?.trim();

	if (!directUri) {
		throw new Error("DATABASE_URI_DIRECT is not set");
	}

	process.env.DATABASE_URI = directUri;
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.PAYLOAD_SEED_MODE = "true";
}

async function ingestLookupCache(
	lookup: SeedLookupCache,
	payload: Awaited<ReturnType<typeof getPayload>>
): Promise<void> {
	const steps: Array<[string, () => Promise<void>]> = [
		["countries", () => lookup.ingestCountries(payload)],
		["regions", () => lookup.ingestRegions(payload)],
		["cities", () => lookup.ingestCities(payload)],
		["themes", () => lookup.ingestThemes(payload)],
		["attractions", () => lookup.ingestAttractions(payload)],
		["experiences", () => lookup.ingestExperiences(payload)],
		["routes", () => lookup.ingestRoutes(payload)]
	];

	for (const [label, ingest] of steps) {
		await withRetry(ingest, `ingest ${label}`);
	}
}

async function persistCheckpointAfterSuccess(
	checkpoint: TNeonSeedCheckpoint,
	item: TNeonSeedItem
): Promise<TNeonSeedCheckpoint> {
	const nextCheckpoint: TNeonSeedCheckpoint = {
		...checkpoint,
		completedItems: item.itemIndex,
		lastCompleted: {
			stage: item.stage,
			slug: item.slug,
			itemIndex: item.itemIndex
		},
		updatedAt: new Date().toISOString()
	};

	await saveCheckpoint(nextCheckpoint);
	return nextCheckpoint;
}

async function runNeonSeed(): Promise<void> {
	const options = parseCliOptions(process.argv.slice(2));
	const startedAt = Date.now();

	if (options.dryRun) {
		const report = await collectDryRunReport();
		printDryRunReport(report);
		return;
	}

	configureNeonSeedEnv();

	const items = await loadNeonSeedItems();
	const pool = createNeonPool();

	try {
		await withRetry(() => wakePool(pool), "neon wake");
		await assertSchemaReady(pool);

		const { default: config } = await import("@payload-config");
		const payload = await withRetry(() => getPayload({ config }), "payload init");

		attachSeedPoolErrorHandler(payload);

		const mediaDbIndex = await preloadMediaDbIndex(payload);
		const lookup = new SeedLookupCache();
		setSeedRuntimeContext(lookup, mediaDbIndex);

		const mediaCache: TMilestone1Context["mediaCache"] = new Map();
		const badgeIds = await loadBadgeIds(payload);

		if (options.resume) {
			await ingestLookupCache(lookup, payload);
		}

		let checkpoint = options.resume
			? (await loadCheckpoint()) ?? createFreshCheckpoint()
			: createFreshCheckpoint();

		if (!options.resume) {
			await saveCheckpoint(checkpoint);
		}

		console.log("Neon seed (milestone 1 + 2)");
		console.log(`  items total: ${items.length}`);
		console.log(`  checkpoint: ${getCheckpointPath()}`);
		console.log(`  resume from item: ${checkpoint.completedItems + 1}`);
		console.log(`  PAYLOAD_DB_PUSH=${process.env.PAYLOAD_DB_PUSH}`);

		const ctx: TMilestone1Context = {
			payload,
			lookup,
			mediaCache,
			badgeIds
		};

		let processedThisRun = 0;

		for (const item of items) {
			if (item.itemIndex <= checkpoint.completedItems) {
				console.log(
					`  skip [${item.itemIndex}/${items.length}] ${item.stage} ${item.slug}`
				);
				continue;
			}

			console.log(
				`  seed [${item.itemIndex}/${items.length}] ${item.stage} ${item.slug}`
			);

			await withRetry(
				() => seedNeonItem(ctx, item),
				`${item.stage}:${item.slug}`
			);

			checkpoint = await persistCheckpointAfterSuccess(checkpoint, item);
			processedThisRun += 1;

			console.log(
				`  done [${item.itemIndex}/${items.length}] checkpoint saved`
			);

			if (options.limit && processedThisRun >= options.limit) {
				console.log(`  limit reached (${options.limit} items this run)`);
				break;
			}

			if (options.abortAfter && item.itemIndex >= options.abortAfter) {
				console.log(
					`  abort-after reached (${options.abortAfter} items completed)`
				);
				console.log("  process exited intentionally");
				return;
			}
		}

		const counts = await getTableCounts(pool);
		const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);

		console.log("\nNeon seed summary:");
		console.log(`  completed items: ${checkpoint.completedItems}/${items.length}`);
		console.log(`  processed this run: ${processedThisRun}`);
		console.log(`  elapsed: ${elapsedSec}s`);
		console.log(`  neon tables: ${counts.tables}`);
		console.log(`  neon indexes: ${counts.indexes}`);
		console.log(`  neon foreign keys: ${counts.foreignKeys}`);
		console.log(`  checkpoint: ${getCheckpointPath()}`);
	} finally {
		await closePool(pool);
	}
}

runNeonSeed().catch((error: unknown) => {
	console.error("Neon seed failed:", error);
	process.exit(1);
});
