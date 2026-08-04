/**
 * Re-seed all regions (local). Updates existing docs; preserves media.
 */
import fs from "node:fs/promises";
import path from "node:path";

import "./load-env.js";

import { getPayload } from "payload";

import {
	CONTENT_DIR,
	applyGeoNavOrder,
	readYamlFile,
	refreshRouteMapStops,
	registerRegionFromDoc,
	resolveRegionSeedData,
	resolveSeedSlug,
	seedLocalizedDocOnce,
	setSeedRuntimeContext
} from "./seed.js";
import { SeedLookupCache } from "./seed-lookup-cache.js";
import { SUPPORTED_LOCALES } from "../config/supported-locales.js";
import {
	attachSeedPoolErrorHandler,
	detectConnectionEndpoint,
	preloadMediaDbIndex,
	resolveSeedDatabaseUri,
	wakeDatabase
} from "./seed-timing.js";

async function main(): Promise<void> {
	const uri = resolveSeedDatabaseUri();

	if (detectConnectionEndpoint(uri) !== "local") {
		throw new Error("regions-only seed is local-only");
	}

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = uri;

	await wakeDatabase(uri);
	const { default: config } = await import("@payload-config");
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const lookup = new SeedLookupCache();
	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(lookup, mediaDbIndex);
	await lookup.ingestCountries(payload);
	await lookup.ingestRegions(payload);
	await lookup.ingestCities(payload);
	await lookup.ingestAttractions(payload);

	const mediaCache = new Map();
	const badges = await payload.find({
		collection: "badges",
		locale: "en",
		limit: 100,
		depth: 0,
		overrideAccess: true
	});
	const badgeIds = new Map<string, number>();

	for (const badge of badges.docs) {
		if (typeof badge.slug === "string") {
			badgeIds.set(badge.slug, badge.id as number);
		}
	}

	const files = (await fs.readdir(path.join(CONTENT_DIR, "regions")))
		.filter((file) => file.endsWith(".yml"))
		.sort();

	console.log(`Re-seeding regions (${files.length})...`);

	for (const [index, file] of files.entries()) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(CONTENT_DIR, "regions", file)
		);
		const slug = resolveSeedSlug(item) ?? file.replace(/\.yml$/, "");

		const result = await seedLocalizedDocOnce(payload, "regions", item, {
			published: true,
			skipSlugLookup: false,
			locales: SUPPORTED_LOCALES,
			beforeCreate: async (data, locale) =>
				resolveRegionSeedData(
					payload,
					applyGeoNavOrder(data, index),
					locale,
					badgeIds,
					mediaCache
				)
		});

		if (result.createdDoc) {
			registerRegionFromDoc(lookup, result.createdDoc);
		}

		console.log(`  + region ${slug}`);
	}

	console.log("Refreshing region routeMap stops...");
	await refreshRouteMapStops(payload, "regions", badgeIds, mediaCache, {
		locales: SUPPORTED_LOCALES
	});

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("Regions re-seed complete");
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
