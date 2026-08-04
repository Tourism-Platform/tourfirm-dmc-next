/**
 * Fast local-only seeder. Does not replace `npm run seed` (prod path).
 *
 * Speed levers vs prod seed:
 * - localhost DB guard
 * - truncate preserves media + users (no re-upload / no admin wipe)
 * - all SUPPORTED_LOCALES by default (override via SEED_LOCAL_LOCALES)
 * - parallel geo / discovery collections
 *
 * Usage: npm run seed:local
 * Env: SEED_LOCAL_LOCALES=en,ru,uz  SEED_LOCAL_CONCURRENCY=4
 */
import fs from "node:fs/promises";
import path from "node:path";

import "./load-env.js";

import { getPayload, type CollectionSlug, type Payload } from "payload";
import pg from "pg";

import type { Media } from "@/payload-types";
import {
	mergeFooterColumnsById,
	mergeInformationAreasById,
	mergeNavItemsById
} from "@/cms/lib/merge-nav-items-by-id";
import {
	assertNoDeprecatedNavigationOrder,
	assertNoDeprecatedNavigationOrderInItems
} from "@/cms/lib/navigation-order-guard";
import { isPagePathGroup } from "@/shared/config/routes/page-path-groups";

import {
	SUPPORTED_LOCALES,
	type TSupportedLocale
} from "../config/supported-locales.js";
import { createDiscoverySeeder } from "./seed-discovery.js";
import { SeedLookupCache } from "./seed-lookup-cache.js";
import { mapWithConcurrency } from "./seed-parallel.js";
import {
	applyGeoNavOrder,
	CONTENT_DIR,
	ensureMedia,
	pickLocale,
	readYamlFile,
	refreshRouteMapStops,
	registerAttractionFromDoc,
	registerCityFromDoc,
	registerCountryFromDoc,
	registerRegionFromDoc,
	resolveAttractionSeedData,
	resolveBadgeIds,
	resolveCitySeedData,
	resolveRegionSeedData,
	resolveSeedDocument,
	resolveSeedSlug,
	seedLocalizedDoc,
	setSeedRuntimeContext
} from "./seed.js";
import { seedUiContent } from "./seed-ui-content.js";
import {
	attachSeedPoolErrorHandler,
	createSeedCostTracker,
	createSeedStageLogger,
	detectConnectionEndpoint,
	logSeedConnectionInfo,
	preloadMediaDbIndex,
	resolveSeedDatabaseUri,
	wakeDatabase
} from "./seed-timing.js";

const SEED_OP_OPTS = {
	overrideAccess: true as const,
	context: { isSeed: true } as const
};

type TMediaCache = Map<string, Media>;
type TLocale = TSupportedLocale;

type TNavContext = {
	segmentIds: Map<string, number>;
	pageIds: Map<string, number>;
	destinationSlug: string;
};

const PRESERVE_TABLES = new Set([
	"media",
	"users",
	"users_sessions",
	"payload_preferences",
	"payload_preferences_rels",
	"payload_kv"
]);

const STAGE_COUNT = 18;

function parseLocalLocales(): readonly TLocale[] {
	const raw = process.env.SEED_LOCAL_LOCALES?.trim();

	if (!raw) {
		return SUPPORTED_LOCALES;
	}

	const requested = raw
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);

	const allowed = new Set<string>(SUPPORTED_LOCALES);
	const locales = requested.filter((code): code is TLocale =>
		allowed.has(code)
	);

	if (locales.length === 0) {
		throw new Error(
			`SEED_LOCAL_LOCALES must include at least one of: ${SUPPORTED_LOCALES.join(", ")}`
		);
	}

	return locales;
}

function parseConcurrency(): number {
	const value = Number(process.env.SEED_LOCAL_CONCURRENCY ?? 4);

	if (!Number.isFinite(value) || value < 1) {
		return 4;
	}

	return Math.min(Math.floor(value), 8);
}

function assertLocalDatabase(uri: string): void {
	const endpoint = detectConnectionEndpoint(uri);

	if (endpoint !== "local") {
		throw new Error(
			`seed:local only allows localhost DB (got endpoint="${endpoint}"). Use npm run seed for remote/prod.`
		);
	}
}

function hasLocaleContent(value: unknown, locale: TLocale): boolean {
	if (
		value &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		SUPPORTED_LOCALES.some((code) => code in (value as object))
	) {
		const localized = (value as Record<string, unknown>)[locale];

		if (localized === null || localized === undefined || localized === "") {
			return false;
		}

		if (typeof localized === "object") {
			return hasLocaleContent(localized, locale);
		}

		return true;
	}

	if (Array.isArray(value)) {
		return value.some((item) => hasLocaleContent(item, locale));
	}

	if (value && typeof value === "object") {
		return Object.values(value as Record<string, unknown>).some((item) =>
			hasLocaleContent(item, locale)
		);
	}

	return false;
}

async function truncateLocalData(connectionString: string): Promise<void> {
	console.log("Truncating local data (preserving media + users)...");

	const client = new pg.Client({ connectionString });

	try {
		await client.connect();

		const tablesResult = await client.query<{ tablename: string }>(`
			SELECT tablename
			FROM pg_tables
			WHERE schemaname = 'public'
		`);

		const tableNames = tablesResult.rows
			.map((row) => row.tablename)
			.filter((name) => !PRESERVE_TABLES.has(name));

		if (tableNames.length === 0) {
			console.log("No tables to truncate");
			return;
		}

		const quoted = tableNames.map((name) => `"${name}"`).join(", ");
		await client.query(`TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE`);
		console.log(
			`Truncated ${tableNames.length} tables (kept: ${[...PRESERVE_TABLES].join(", ")})`
		);
	} finally {
		await client.end();
	}
}

function listYamlSlug(item: Record<string, unknown>, file: string): string {
	const resolved = resolveSeedSlug(item);

	if (resolved) {
		return resolved;
	}

	return file.replace(/\.yml$/, "");
}

async function listYamlFiles(dir: string): Promise<string[]> {
	try {
		return (await fs.readdir(dir))
			.filter((file) => file.endsWith(".yml"))
			.sort();
	} catch {
		return [];
	}
}

async function seedYamlCollection(
	payload: Payload,
	collection: CollectionSlug,
	dirName: string,
	locales: readonly TLocale[],
	concurrency: number,
	beforeCreate: (
		data: Record<string, unknown>,
		locale: TLocale,
		index: number
	) => Promise<Record<string, unknown>>,
	onCreated?: (doc: Record<string, unknown>) => void
): Promise<number> {
	const dir = path.join(CONTENT_DIR, dirName);
	const files = await listYamlFiles(dir);

	console.log(`Seeding ${collection} (${files.length}, concurrency=${concurrency})...`);

	await mapWithConcurrency(files, concurrency, async (file, index) => {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(dir, file)
		);
		const slug = listYamlSlug(item, file);

		const result = await seedLocalizedDoc(payload, collection, item, {
			published: true,
			locales,
			beforeCreate: (data, locale) => beforeCreate(data, locale, index)
		});

		if (result.createdDoc && onCreated) {
			onCreated(result.createdDoc);
		}

		console.log(`  + ${collection} ${slug}`);
	});

	return files.length;
}

async function seedBadges(
	payload: Payload,
	locales: readonly TLocale[],
	concurrency: number
): Promise<Map<string, number>> {
	const items = await readYamlFile<Record<string, unknown>[]>(
		path.join(CONTENT_DIR, "badges.yml")
	);
	const badgeIds = new Map<string, number>();

	console.log(`Seeding badges (${items.length})...`);

	await mapWithConcurrency(items, concurrency, async (item) => {
		if (typeof item.slug !== "string") {
			throw new Error("Badge seed item must include a string slug");
		}

		const doc = await seedLocalizedDoc(payload, "badges", item, { locales });
		badgeIds.set(item.slug, doc.id as number);
		console.log(`  + badge ${item.slug}`);
	});

	return badgeIds;
}

async function seedThemes(
	payload: Payload,
	mediaCache: TMediaCache,
	locales: readonly TLocale[],
	concurrency: number
): Promise<number> {
	const items = await readYamlFile<Record<string, unknown>[]>(
		path.join(CONTENT_DIR, "themes.yml")
	);

	console.log(`Seeding themes (${items.length})...`);

	await mapWithConcurrency(items, concurrency, async (item) => {
		const slug = resolveSeedSlug(item) ?? "theme";

		await seedLocalizedDoc(payload, "themes", item, {
			published: true,
			locales,
			beforeCreate: async (data, locale) =>
				resolveSeedDocument(payload, mediaCache, data, locale)
		});
		console.log(`  + theme ${slug}`);
	});

	return items.length;
}

async function seedSegments(
	payload: Payload,
	locales: readonly TLocale[],
	concurrency: number
): Promise<Map<string, number>> {
	const items = await readYamlFile<Record<string, unknown>[]>(
		path.join(CONTENT_DIR, "segments.yml")
	);
	const segmentIds = new Map<string, number>();

	console.log(`Seeding segments (${items.length})...`);

	await mapWithConcurrency(items, concurrency, async (item) => {
		if (typeof item.slug !== "string") {
			throw new Error("Segment seed item must include a string slug");
		}

		const doc = await seedLocalizedDoc(payload, "segments", item, {
			published: true,
			locales
		});
		segmentIds.set(item.slug, doc.id as number);
		console.log(`  + segment ${item.slug}`);
	});

	return segmentIds;
}

async function seedPages(
	payload: Payload,
	mediaCache: TMediaCache,
	lookup: SeedLookupCache,
	locales: readonly TLocale[],
	concurrency: number
): Promise<{ count: number; pageIds: Map<string, number> }> {
	const files = await listYamlFiles(path.join(CONTENT_DIR, "pages"));
	const pageIds = new Map<string, number>();

	console.log(`Seeding pages (${files.length})...`);

	await mapWithConcurrency(files, concurrency, async (file) => {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(CONTENT_DIR, "pages", file)
		);

		if (
			item.pathGroup != null &&
			item.pathGroup !== "" &&
			!isPagePathGroup(item.pathGroup)
		) {
			throw new Error(
				`Invalid pathGroup "${String(item.pathGroup)}" in ${file}`
			);
		}

		const result = await seedLocalizedDoc(payload, "pages", item, {
			published: true,
			locales,
			beforeCreate: async (data, locale) => {
				const next = { ...data };

				if (typeof next.segment === "string") {
					next.segment = lookup.getSegmentId(next.segment);
				}

				return resolveSeedDocument(payload, mediaCache, next, locale);
			}
		});

		const segmentSlug =
			typeof item.segment === "string" ? item.segment : undefined;
		const pathGroup =
			typeof item.pathGroup === "string" ? item.pathGroup : undefined;
		const pageSlug = resolveSeedSlug(item);

		if (segmentSlug && pageSlug) {
			const key = pathGroup
				? `${segmentSlug}/${pathGroup}/${pageSlug}`
				: `${segmentSlug}/${pageSlug}`;
			pageIds.set(key, result.id as number);
		}

		console.log(`  + page ${file.replace(/\.yml$/, "")}`);
	});

	return { count: files.length, pageIds };
}

async function updateGlobalLocales(
	payload: Payload,
	slug:
		| "homepage"
		| "destination"
		| "routes-hub"
		| "experiences-hub"
		| "trade-fairs-hub"
		| "blog-hub"
		| "news-hub",
	raw: Record<string, unknown>,
	mediaCache: TMediaCache,
	locales: readonly TLocale[],
	hrefPrefix?: string
): Promise<void> {
	for (const locale of locales) {
		if (!hasLocaleContent(raw, locale)) {
			console.log(`  ~ skip ${slug} locale ${locale} (no seed data)`);
			continue;
		}

		const localized = pickLocale(raw, locale) as Record<string, unknown>;
		const data = await resolveSeedDocument(
			payload,
			mediaCache,
			localized,
			locale,
			hrefPrefix ? { hrefPrefix } : undefined
		);

		await payload.updateGlobal({
			slug,
			data,
			locale,
			...SEED_OP_OPTS
		});
		console.log(`  + ${slug} locale ${locale}`);
	}
}

async function resolveNavItems(
	items: unknown[] | undefined,
	context: TNavContext
): Promise<Record<string, unknown>[]> {
	if (!items?.length) {
		return [];
	}

	assertNoDeprecatedNavigationOrderInItems(items, "navigation items");

	return Promise.all(
		items.map(async (item) => {
			if (!item || typeof item !== "object") {
				return item as Record<string, unknown>;
			}

			const entry = { ...(item as Record<string, unknown>) };
			assertNoDeprecatedNavigationOrder(entry, "navigation item");

			if (entry.type === "group" && Array.isArray(entry.groupItems)) {
				entry.groupItems = await resolveNavItems(
					entry.groupItems as unknown[],
					context
				);
			}

			if (entry.type === "page" && typeof entry.page === "string") {
				const id = context.pageIds.get(entry.page);

				if (!id) {
					throw new Error(`Page not found for nav item: ${entry.page}`);
				}

				entry.page = id;
			}

			if (typeof entry.href === "string" && entry.href === "__DESTINATION_SLUG__") {
				entry.href = `/${context.destinationSlug}`;
			}

			return entry;
		})
	);
}

async function seedNavigationLocal(
	payload: Payload,
	mediaCache: TMediaCache,
	context: TNavContext,
	locales: readonly TLocale[]
): Promise<void> {
	const raw = await readYamlFile<Record<string, unknown>>(
		path.join(CONTENT_DIR, "navigation.yml")
	);
	const headerRaw = raw.header as Record<string, unknown> | undefined;
	const footerRaw = raw.footer as Record<string, unknown> | undefined;
	const primary = locales.includes("en") ? "en" : (locales[0] ?? "en");

	if (headerRaw) {
		console.log("Seeding header global...");

		const primaryLocalized = pickLocale(headerRaw, primary) as Record<
			string,
			unknown
		>;
		const primaryNavItems = await resolveNavItems(
			primaryLocalized.navItems as unknown[] | undefined,
			context
		);
		const primaryData: Record<string, unknown> = {
			...primaryLocalized,
			navItems: primaryNavItems
		};

		if (typeof primaryData.logo === "string") {
			primaryData.logo = (
				await ensureMedia(payload, mediaCache, primaryData.logo)
			).id;
		}

		await payload.updateGlobal({
			slug: "header",
			data: primaryData,
			locale: primary,
			...SEED_OP_OPTS
		});
		console.log(`  + header locale ${primary}`);

		const headerWithIds = await payload.findGlobal({
			slug: "header",
			locale: primary,
			depth: 0,
			...SEED_OP_OPTS
		});

		for (const locale of locales) {
			if (locale === primary) {
				continue;
			}

			if (!hasLocaleContent(headerRaw, locale)) {
				continue;
			}

			const localized = pickLocale(headerRaw, locale) as Record<
				string,
				unknown
			>;
			const navItems = await resolveNavItems(
				localized.navItems as unknown[] | undefined,
				context
			);
			const mergedNavItems = mergeNavItemsById(
				headerWithIds?.navItems as Record<string, unknown>[] | undefined,
				navItems
			);
			const localizedAreas =
				(localized.informationAreas as Record<string, unknown>[] | undefined) ??
				[];
			const mergedAreas = mergeInformationAreasById(
				headerWithIds?.informationAreas as
					| Record<string, unknown>[]
					| undefined,
				localizedAreas
			);

			await payload.updateGlobal({
				slug: "header",
				data: {
					navItems: mergedNavItems,
					informationAreas: mergedAreas,
					ctaAction: localized.ctaAction
				},
				locale,
				...SEED_OP_OPTS
			});
			console.log(`  + header locale ${locale}`);
		}
	}

	if (footerRaw) {
		console.log("Seeding footer global...");

		const primaryLocalized = pickLocale(footerRaw, primary) as Record<
			string,
			unknown
		>;
		const primaryColumns = Array.isArray(primaryLocalized.columns)
			? await Promise.all(
					primaryLocalized.columns.map(async (column) => {
						if (!column || typeof column !== "object") {
							return column;
						}

						const entry = column as Record<string, unknown>;

						return {
							...entry,
							items: await resolveNavItems(
								entry.items as unknown[] | undefined,
								context
							)
						};
					})
				)
			: [];

		await payload.updateGlobal({
			slug: "footer",
			data: {
				...primaryLocalized,
				columns: primaryColumns
			},
			locale: primary,
			...SEED_OP_OPTS
		});
		console.log(`  + footer locale ${primary}`);

		const footerWithIds = await payload.findGlobal({
			slug: "footer",
			locale: primary,
			depth: 0,
			...SEED_OP_OPTS
		});

		for (const locale of locales) {
			if (locale === primary) {
				continue;
			}

			if (!hasLocaleContent(footerRaw, locale)) {
				continue;
			}

			const localized = pickLocale(footerRaw, locale) as Record<
				string,
				unknown
			>;
			const columns = Array.isArray(localized.columns)
				? await Promise.all(
						localized.columns.map(async (column) => {
							if (!column || typeof column !== "object") {
								return column;
							}

							const entry = column as Record<string, unknown>;

							return {
								...entry,
								items: await resolveNavItems(
									entry.items as unknown[] | undefined,
									context
								)
							};
						})
					)
				: [];
			const mergedColumns = mergeFooterColumnsById(
				footerWithIds?.columns as Record<string, unknown>[] | undefined,
				columns as Record<string, unknown>[]
			);

			await payload.updateGlobal({
				slug: "footer",
				data: {
					columns: mergedColumns,
					copyrightText: localized.copyrightText
				},
				locale,
				...SEED_OP_OPTS
			});
			console.log(`  + footer locale ${locale}`);
		}
	}
}

async function runLocalSeed(): Promise<void> {
	const locales = parseLocalLocales();
	const concurrency = parseConcurrency();
	const seedDbUri = resolveSeedDatabaseUri();
	const cost = createSeedCostTracker();
	const log = createSeedStageLogger(STAGE_COUNT);
	const lookup = new SeedLookupCache();

	assertLocalDatabase(seedDbUri);
	logSeedConnectionInfo(seedDbUri);
	console.log(
		`Local fast seed: locales=[${locales.join(",")}] concurrency=${concurrency}`
	);
	console.log("Tip: stop `npm run dev` while seeding to avoid DB contention.");

	process.env.PAYLOAD_SEED_MODE = "true";
	process.env.PAYLOAD_DB_PUSH = "false";
	process.env.DATABASE_URI = seedDbUri;

	log.start("Truncate local data");
	await truncateLocalData(seedDbUri);
	log.done();

	log.start("Initializing Payload");
	await wakeDatabase(seedDbUri);
	const { default: config } = await import("@payload-config");
	const payload = await getPayload({ config });
	attachSeedPoolErrorHandler(payload);
	log.done();

	cost.markSeedPhaseStart();

	const mediaDbIndex = await preloadMediaDbIndex(payload);
	setSeedRuntimeContext(lookup, mediaDbIndex);
	const mediaCache: TMediaCache = new Map();

	const seedDoc = (
		p: Payload,
		collection: CollectionSlug,
		raw: Record<string, unknown>,
		options?: {
			published?: boolean;
			beforeCreate?: (
				data: Record<string, unknown>,
				locale: TLocale
			) => Promise<Record<string, unknown>>;
		}
	) =>
		seedLocalizedDoc(p, collection, raw, {
			...options,
			locales
		});

	log.start("Seeding badges");
	const badgeIds = await seedBadges(payload, locales, concurrency);
	log.done();

	log.start("Seeding themes");
	const themesCount = await seedThemes(
		payload,
		mediaCache,
		locales,
		concurrency
	);
	await lookup.ingestThemes(payload);
	log.done();

	log.start("Seeding countries");
	const countriesCount = await seedYamlCollection(
		payload,
		"countries",
		"countries",
		locales,
		Math.min(concurrency, 2),
		async (data, locale, index) => {
			const withNavOrder = applyGeoNavOrder(data, index);
			const withBadges = resolveBadgeIds(withNavOrder, badgeIds);
			return resolveSeedDocument(payload, mediaCache, withBadges, locale, {
				deferRouteMapStops: true
			});
		},
		(doc) => registerCountryFromDoc(lookup, doc)
	);
	log.done();

	log.start("Seeding regions");
	const regionsCount = await seedYamlCollection(
		payload,
		"regions",
		"regions",
		locales,
		Math.min(concurrency, 2),
		async (data, locale, index) =>
			resolveRegionSeedData(
				payload,
				applyGeoNavOrder(data, index),
				locale,
				badgeIds,
				mediaCache
			),
		(doc) => registerRegionFromDoc(lookup, doc)
	);
	log.done();

	log.start("Seeding cities");
	const citiesCount = await seedYamlCollection(
		payload,
		"cities",
		"cities",
		locales,
		concurrency,
		async (data, locale, index) =>
			resolveCitySeedData(
				payload,
				applyGeoNavOrder(data, index),
				locale,
				badgeIds,
				mediaCache
			),
		(doc) => registerCityFromDoc(lookup, doc)
	);
	log.done();

	log.start("Seeding attractions");
	const attractionsCount = await seedYamlCollection(
		payload,
		"attractions",
		"attractions",
		locales,
		concurrency,
		async (data, locale) =>
			resolveAttractionSeedData(
				payload,
				data,
				locale,
				badgeIds,
				mediaCache
			),
		(doc) => registerAttractionFromDoc(lookup, doc)
	);
	log.done();

	const discoverySeeder = createDiscoverySeeder({
		contentDir: CONTENT_DIR,
		readYamlFile,
		seedLocalizedDoc: seedDoc,
		resolveSeedDocument,
		resolveBadgeIds,
		pickLocale,
		updateGlobal: async (p, slug, raw, cache) => {
			await updateGlobalLocales(p, slug, raw, cache, locales);
		}
	});

	log.start("Seeding experiences + routes");
	const experiencesCount = await discoverySeeder.seedExperiences(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	const routesCount = await discoverySeeder.seedRoutes(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	log.done();

	log.start("Seeding map points");
	const mapPointsCount = await discoverySeeder.seedMapPoints(payload, lookup);
	log.done();

	log.start("Seeding hubs + trade/blog/news");
	await discoverySeeder.seedRoutesHub(payload, mediaCache);
	await discoverySeeder.seedExperiencesHub(payload, mediaCache);
	const tradeFairsCount = await discoverySeeder.seedTradeFairs(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	await discoverySeeder.seedTradeFairsHub(payload, mediaCache);
	const blogCount = await discoverySeeder.seedBlog(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	await discoverySeeder.seedBlogHub(payload, mediaCache);
	const newsCount = await discoverySeeder.seedNews(
		payload,
		lookup,
		badgeIds,
		mediaCache
	);
	await discoverySeeder.seedNewsHub(payload, mediaCache);
	log.done();

	log.start("Refreshing route map stops");
	await refreshRouteMapStops(payload, "cities", badgeIds, mediaCache, {
		locales
	});
	await refreshRouteMapStops(payload, "regions", badgeIds, mediaCache, {
		locales
	});
	await refreshRouteMapStops(payload, "countries", badgeIds, mediaCache, {
		locales
	});
	log.done();

	log.start("Seeding destination + homepage");
	const destinationRaw = await readYamlFile<Record<string, unknown>>(
		path.join(CONTENT_DIR, "destination-page.yml")
	);
	const destinationSlug =
		typeof destinationRaw.slug === "object" &&
		destinationRaw.slug !== null &&
		"en" in destinationRaw.slug
			? String((destinationRaw.slug as Record<string, unknown>).en)
			: String(destinationRaw.slug ?? "central-asia");

	await updateGlobalLocales(
		payload,
		"destination",
		destinationRaw,
		mediaCache,
		locales,
		destinationSlug
	);

	const homepageRaw = await readYamlFile<Record<string, unknown>>(
		path.join(CONTENT_DIR, "main-page.yml")
	);
	await updateGlobalLocales(
		payload,
		"homepage",
		homepageRaw,
		mediaCache,
		locales,
		destinationSlug
	);
	log.done();

	log.start("Seeding segments + pages");
	const segmentIds = await seedSegments(payload, locales, concurrency);
	lookup.ingestSegments(segmentIds);
	const { count: pagesCount, pageIds } = await seedPages(
		payload,
		mediaCache,
		lookup,
		locales,
		concurrency
	);
	log.done();

	log.start("Seeding navigation");
	await seedNavigationLocal(
		payload,
		mediaCache,
		{
			segmentIds,
			pageIds,
			destinationSlug
		},
		locales
	);
	log.done();

	log.start("Seeding UI content");
	await seedUiContent(payload);
	log.done();

	console.log("Local fast seed complete:", {
		locales: [...locales],
		concurrency,
		badges: badgeIds.size,
		themes: themesCount,
		countries: countriesCount,
		regions: regionsCount,
		cities: citiesCount,
		attractions: attractionsCount,
		experiences: experiencesCount,
		routes: routesCount,
		tradeFairs: tradeFairsCount,
		blog: blogCount,
		news: newsCount,
		mapPoints: mapPointsCount,
		segments: segmentIds.size,
		pages: pagesCount
	});

	cost.logSummary("local-fast");

	if (typeof payload.db?.destroy === "function") {
		await payload.db.destroy();
	}

	process.exit(0);
}

runLocalSeed().catch((error) => {
	console.error("Local fast seed failed:", error);
	process.exit(1);
});
