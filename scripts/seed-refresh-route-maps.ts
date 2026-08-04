/**
 * Refresh routeMap stops for cities → regions → countries (local).
 * Use after partial seeds that defer stops.
 */
import "./load-env.js";

import { getPayload } from "payload";

import {
	refreshRouteMapStops,
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
		throw new Error("routeMap refresh is local-only");
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

	const locales = SUPPORTED_LOCALES;

	console.log("Refreshing routeMap stops (cities)...");
	await refreshRouteMapStops(payload, "cities", badgeIds, mediaCache, {
		locales
	});

	console.log("Refreshing routeMap stops (regions)...");
	await refreshRouteMapStops(payload, "regions", badgeIds, mediaCache, {
		locales
	});

	console.log("Refreshing routeMap stops (countries)...");
	await refreshRouteMapStops(payload, "countries", badgeIds, mediaCache, {
		locales
	});

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("RouteMap stops refresh complete");
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
