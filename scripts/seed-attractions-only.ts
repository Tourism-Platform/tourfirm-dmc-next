/**
 * Re-seed attractions (local). Optional: pass slugs as args to limit scope.
 * Usage:
 *   tsx scripts/seed-attractions-only.ts
 *   tsx scripts/seed-attractions-only.ts poi-kalyan-complex ark-citadel
 */
import fs from "node:fs/promises";
import path from "node:path";

import "./load-env.js";

import { getPayload } from "payload";

import {
	CONTENT_DIR,
	readYamlFile,
	resolveAttractionSeedData,
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
	const only = new Set(process.argv.slice(2).filter(Boolean));

	const uri = resolveSeedDatabaseUri();

	if (detectConnectionEndpoint(uri) !== "local") {
		throw new Error("attractions-only seed is local-only");
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

	let files = (await fs.readdir(path.join(CONTENT_DIR, "attractions")))
		.filter((file) => file.endsWith(".yml"))
		.sort();

	if (only.size > 0) {
		files = files.filter((file) => only.has(file.replace(/\.yml$/, "")));
	}

	console.log(`Re-seeding attractions (${files.length})...`);

	for (const file of files) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(CONTENT_DIR, "attractions", file)
		);
		const slug = resolveSeedSlug(item) ?? file.replace(/\.yml$/, "");

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

		console.log(`  + attraction ${slug}`);
	}

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("Attractions re-seed complete");
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
