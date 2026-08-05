/**
 * Seed Neon globals needed for public site after wipe:
 * ui-common, homepage, destination, segments, pages, header, footer.
 * Usage: npx tsx scripts/seed-neon-globals.ts
 */
import path from "node:path";

import "./load-env.js";

import { getPayload } from "payload";

import { SUPPORTED_LOCALES } from "../config/supported-locales.js";
import {
	CONTENT_DIR,
	buildNavigationContextFromDb,
	pickLocale,
	readYamlFile,
	resolveSeedDocument,
	seedNavigation,
	seedPages,
	seedSegments,
	setSeedRuntimeContext
} from "./seed.js";
import { SeedLookupCache } from "./seed-lookup-cache.js";
import { seedUiContent } from "./seed-ui-content.js";
import {
	attachSeedPoolErrorHandler,
	maskConnectionUri,
	preloadMediaDbIndex,
	wakeDatabase
} from "./seed-timing.js";

const SEED_OP_OPTS = {
	overrideAccess: true as const,
	context: { isSeed: true } as const
};

function rawHasLocaleContent(value: unknown, locale: string): boolean {
	if (!value || typeof value !== "object") {
		return false;
	}

	if (
		"en" in (value as object) ||
		"ru" in (value as object) ||
		"uz" in (value as object)
	) {
		const localized = (value as Record<string, unknown>)[locale];
		return localized !== null && localized !== undefined && localized !== "";
	}

	if (Array.isArray(value)) {
		return value.some((item) => rawHasLocaleContent(item, locale));
	}

	return Object.values(value as Record<string, unknown>).some((item) =>
		rawHasLocaleContent(item, locale)
	);
}

async function main(): Promise<void> {
	const uri = process.env.DATABASE_URI_DIRECT?.trim();

	if (!uri) {
		throw new Error("DATABASE_URI_DIRECT is not set");
	}

	process.env.DATABASE_URI = uri;
	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";

	console.log(`Seeding Neon globals → ${maskConnectionUri(uri)}`);
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
	await lookup.ingestThemes(payload);
	await lookup.ingestRoutes(payload);
	await lookup.ingestExperiences(payload);
	await lookup.ingestTradeFairs(payload);
	await lookup.ingestBlog(payload);
	await lookup.ingestNews(payload);

	const mediaCache = new Map();

	console.log("Seeding UI content (localeAvailability)...");
	await seedUiContent(payload);

	const destinationRaw = await readYamlFile<Record<string, unknown>>(
		path.join(CONTENT_DIR, "destination-page.yml")
	);
	let navigationRootSlug = "destinations";

	console.log("Seeding destination...");
	for (const locale of SUPPORTED_LOCALES) {
		if (!rawHasLocaleContent(destinationRaw, locale)) {
			continue;
		}

		const localized = pickLocale(destinationRaw, locale) as Record<
			string,
			unknown
		>;
		const data = await resolveSeedDocument(
			payload,
			mediaCache,
			localized,
			locale
		);

		if (locale === "en" && typeof data.slug === "string") {
			navigationRootSlug = data.slug;
		}

		await payload.updateGlobal({
			slug: "destination",
			data,
			locale,
			...SEED_OP_OPTS
		});
		console.log(`  + destination ${locale}`);
	}

	const homepageRaw = await readYamlFile<Record<string, unknown>>(
		path.join(CONTENT_DIR, "main-page.yml")
	);

	console.log("Seeding homepage...");
	for (const locale of SUPPORTED_LOCALES) {
		if (!rawHasLocaleContent(homepageRaw, locale)) {
			continue;
		}

		const localized = pickLocale(homepageRaw, locale) as Record<
			string,
			unknown
		>;
		const data = await resolveSeedDocument(
			payload,
			mediaCache,
			localized,
			locale,
			{ hrefPrefix: navigationRootSlug }
		);

		await payload.updateGlobal({
			slug: "homepage",
			data,
			locale,
			...SEED_OP_OPTS
		});
		console.log(`  + homepage ${locale}`);
	}

	const existingSegments = await payload.find({
		collection: "segments",
		limit: 1,
		depth: 0,
		overrideAccess: true
	});

	if (existingSegments.totalDocs === 0) {
		const segmentIds = await seedSegments(payload);
		lookup.ingestSegments(segmentIds);
	} else {
		console.log(`Segments already present (${existingSegments.totalDocs}+), skip`);
		const all = await payload.find({
			collection: "segments",
			limit: 500,
			depth: 0,
			pagination: false,
			overrideAccess: true
		});
		const segmentIds = new Map<string, number>();
		for (const doc of all.docs) {
			if (typeof doc.slug === "string") {
				segmentIds.set(doc.slug, doc.id as number);
			}
		}
		lookup.ingestSegments(segmentIds);
	}

	const existingPages = await payload.find({
		collection: "pages",
		limit: 1,
		depth: 0,
		overrideAccess: true
	});

	if (existingPages.totalDocs === 0) {
		await seedPages(payload, mediaCache);
	} else {
		console.log(`Pages already present (${existingPages.totalDocs}+), skip`);
	}

	const navContext = await buildNavigationContextFromDb(payload);
	console.log(
		`Nav context: segments=${navContext.segmentIds.size}, pages=${navContext.pageIds.size}, destination=/${navContext.destinationSlug}`
	);
	await seedNavigation(payload, mediaCache, navContext);

	const header = await payload.findGlobal({
		slug: "header",
		locale: "en",
		depth: 0,
		overrideAccess: true
	});
	const footer = await payload.findGlobal({
		slug: "footer",
		locale: "en",
		depth: 0,
		overrideAccess: true
	});

	console.log(
		JSON.stringify({
			verify: {
				headerNavItems: Array.isArray(header?.navItems)
					? header.navItems.length
					: 0,
				headerHasLogo: Boolean(header?.logo),
				footerColumns: Array.isArray(footer?.columns)
					? footer.columns.length
					: 0,
				footerSocial: Array.isArray(footer?.socialLinks)
					? footer.socialLinks.length
					: 0
			}
		})
	);

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("Neon globals seed complete");
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
