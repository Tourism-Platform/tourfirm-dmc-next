/**
 * Neon shell seed (no geo / discovery collections):
 * 1) npm run db:ensure:neon-shell
 * 2) npm run seed:neon:globals
 *
 * Seeds: ui-*, destination, homepage, segments, pages, navigation, tours.
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
import { seedToursPage } from "./seed/seeders/tours-page.js";
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

	console.log(`Seeding Neon shell globals → ${maskConnectionUri(uri)}`);
	await wakeDatabase(uri);

	const { default: config } = await import("@payload-config");
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);

	const lookup = new SeedLookupCache();
	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(lookup, mediaDbIndex);

	const mediaCache = new Map();

	console.log("Seeding UI content...");
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
			locale,
			{ skipMissingRelations: true }
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
			{
				hrefPrefix: navigationRootSlug,
				skipMissingRelations: true
			}
		);

		await payload.updateGlobal({
			slug: "homepage",
			data,
			locale,
			...SEED_OP_OPTS
		});
		console.log(`  + homepage ${locale}`);
	}

	console.log("Seeding segments...");
	const segmentIds = await seedSegments(payload);
	lookup.ingestSegments(segmentIds);

	console.log("Seeding pages...");
	await seedPages(payload, mediaCache, { skipMissingRelations: true });

	const navContext = await buildNavigationContextFromDb(payload);
	console.log(
		`Nav context: segments=${navContext.segmentIds.size}, pages=${navContext.pageIds.size}, destination=/${navContext.destinationSlug}`
	);
	await seedNavigation(payload, mediaCache, navContext);

	console.log("Seeding tours page (catalog.yml)...");
	await seedToursPage(payload);

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
	const homepage = await payload.findGlobal({
		slug: "homepage",
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
				homepageBlocks: Array.isArray(homepage?.blocks)
					? homepage.blocks.length
					: 0
			}
		})
	);

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	console.log("Neon shell globals seed complete");
	process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
