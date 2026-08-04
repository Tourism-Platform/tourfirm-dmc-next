/**
 * Re-seed one region YAML (local). Usage: tsx scripts/seed-region-only.ts bukhara-region
 */
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
	const slugArg = process.argv[2];

	if (!slugArg) {
		throw new Error("Usage: tsx scripts/seed-region-only.ts <region-slug>");
	}

	const uri = resolveSeedDatabaseUri();

	if (detectConnectionEndpoint(uri) !== "local") {
		throw new Error("region-only seed is local-only");
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

	const file = `${slugArg}.yml`;
	const item = await readYamlFile<Record<string, unknown>>(
		path.join(CONTENT_DIR, "regions", file)
	);
	const slug = resolveSeedSlug(item) ?? slugArg;
	const countrySlug =
		typeof item.country === "string" ? item.country : undefined;

	console.log(`Re-seeding region ${slug}...`);

	const result = await seedLocalizedDocOnce(payload, "regions", item, {
		published: true,
		skipSlugLookup: false,
		locales: SUPPORTED_LOCALES,
		beforeCreate: async (data, locale) =>
			resolveRegionSeedData(
				payload,
				applyGeoNavOrder(data, 0),
				locale,
				badgeIds,
				mediaCache
			)
	});

	if (result.createdDoc) {
		registerRegionFromDoc(lookup, result.createdDoc);
	}

	console.log(`Refreshing routeMap stops for region ${slug}...`);
	await refreshRouteMapStops(payload, "regions", badgeIds, mediaCache, {
		locales: SUPPORTED_LOCALES,
		...(countrySlug ? { countrySlug } : {})
	});

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log(`Region ${slug} re-seed complete`);
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
