/**
 * Re-seed collections listed in scripts/_reseed-*.txt after href fixes.
 */
import fs from "node:fs";
import path from "node:path";

import "./load-env.js";

import { getPayload } from "payload";

import {
	CONTENT_DIR,
	applyGeoNavOrder,
	readYamlFile,
	refreshRouteMapStops,
	resolveAttractionSeedData,
	resolveCitySeedData,
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

function readSlugs(file: string): string[] {
	const full = path.join("scripts", file);
	if (!fs.existsSync(full)) return [];
	return fs
		.readFileSync(full, "utf8")
		.split(/\r?\n/)
		.map((s) => s.trim())
		.filter(Boolean);
}

async function main(): Promise<void> {
	const uri = resolveSeedDatabaseUri();
	if (detectConnectionEndpoint(uri) !== "local") {
		throw new Error("href-fix reseed is local-only");
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

	const regionSlugs = readSlugs("_reseed-regions.txt");
	const citySlugs = readSlugs("_reseed-cities.txt");
	const attractionSlugs = readSlugs("_reseed-attractions.txt");

	console.log(
		`Reseeding regions=${regionSlugs.length} cities=${citySlugs.length} attractions=${attractionSlugs.length}`
	);

	for (const [index, slug] of regionSlugs.entries()) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(CONTENT_DIR, "regions", `${slug}.yml`)
		);
		await seedLocalizedDocOnce(payload, "regions", item, {
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
		console.log(`  + region ${slug}`);
	}

	for (const [index, slug] of citySlugs.entries()) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(CONTENT_DIR, "cities", `${slug}.yml`)
		);
		await seedLocalizedDocOnce(payload, "cities", item, {
			published: true,
			skipSlugLookup: false,
			locales: SUPPORTED_LOCALES,
			beforeCreate: async (data, locale) =>
				resolveCitySeedData(
					payload,
					applyGeoNavOrder(data, index),
					locale,
					badgeIds,
					mediaCache
				)
		});
		console.log(`  + city ${slug}`);
	}

	for (const slug of attractionSlugs) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(CONTENT_DIR, "attractions", `${slug}.yml`)
		);
		await seedLocalizedDocOnce(payload, "attractions", item, {
			published: true,
			skipSlugLookup: false,
			locales: SUPPORTED_LOCALES,
			beforeCreate: async (data, locale) =>
				resolveAttractionSeedData(
					payload,
					data,
					locale,
					badgeIds,
					mediaCache
				)
		});
		console.log(`  + attraction ${resolveSeedSlug(item) ?? slug}`);
	}

	console.log("Refreshing routeMap stops for Uzbekistan...");
	await refreshRouteMapStops(payload, "cities", badgeIds, mediaCache, {
		locales: SUPPORTED_LOCALES,
		countrySlug: "uzbekistan"
	});
	await refreshRouteMapStops(payload, "regions", badgeIds, mediaCache, {
		locales: SUPPORTED_LOCALES,
		countrySlug: "uzbekistan"
	});

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("Href-fix reseed complete");
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
