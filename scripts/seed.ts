import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import "./load-env.js";

import pg from "pg";
import config from "@payload-config";
import { getPayload, type CollectionSlug, type Payload } from "payload";
import { parse as parseYaml } from "yaml";

import type { City, Country, Footer, Header, Media, Region } from "@/payload-types";

import {
	mergeFooterColumnsById,
	mergeNavItemsById
} from "@/cms/lib/merge-nav-items-by-id";
import {
	assertNoDeprecatedNavigationOrder,
	assertNoDeprecatedNavigationOrderInItems
} from "@/cms/lib/navigation-order-guard";

import {
	normalizeRichTextDescriptions,
	toDefaultRichText
} from "./to-default-rich-text.js";

type TRouteMapCollection = "countries" | "regions" | "cities";

const ROUTE_MAP_CONTENT_DIRS: Record<TRouteMapCollection, string> = {
	countries: "countries",
	regions: "regions",
	cities: "cities"
};

const LOCALES = ["en", "ru", "uz"] as const;
type TLocale = (typeof LOCALES)[number];

type TResolvePageOptions = {
	hrefPrefix?: string;
	deferRouteMapStops?: boolean;
};

function buildPrefixedCountryHref(
	hrefPrefix: string | undefined,
	countrySlug: string
): string {
	return hrefPrefix ? `/${hrefPrefix}/${countrySlug}` : `/${countrySlug}`;
}

function resolveBlockActions(
	actions: unknown,
	hrefPrefix?: string
): unknown {
	if (!hrefPrefix || !Array.isArray(actions)) {
		return actions;
	}

	return actions.map((action) => {
		if (!action || typeof action !== "object") {
			return action;
		}

		const entry = action as Record<string, unknown>;

		if (entry.type === "link" && typeof entry.href === "string") {
			const href = entry.href;

			if (
				!href.startsWith("#") &&
				!href.startsWith("/") &&
				!href.includes("://")
			) {
				return {
					...entry,
					href: buildPrefixedCountryHref(hrefPrefix, href)
				};
			}
		}

		return action;
	});
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content");
const MEDIA_UPLOAD_DIR = "media/uploads";
const MEDIA_UPLOAD_PATH = path.join(ROOT, MEDIA_UPLOAD_DIR);

type TMediaCache = Map<string, Media>;

const inFlightMedia = new Map<string, Promise<Media>>();

function isSourcePathUniqueViolation(error: unknown): boolean {
	if (!error || typeof error !== "object") {
		return false;
	}

	const payloadError = error as {
		message?: string;
		data?: { errors?: { path?: string }[] };
	};

	if (
		payloadError.data?.errors?.some(
			(entry) => entry.path === "sourcePath"
		)
	) {
		return true;
	}

	return String(payloadError.message ?? "").includes("sourcePath");
}

async function findMediaBySourcePath(
	payload: Payload,
	sourcePath: string
): Promise<Media | null> {
	const existing = await payload.find({
		collection: "media",
		where: {
			sourcePath: {
				equals: sourcePath
			}
		},
		limit: 1,
		pagination: false,
		depth: 0,
		overrideAccess: true
	});

	return existing.docs[0] ?? null;
}

function isLocalizedValue(
	value: unknown
): value is Record<TLocale, unknown> {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return false;
	}

	const record = value as Record<string, unknown>;
	return LOCALES.every((locale) => locale in record);
}

function pickLocale(value: unknown, locale: TLocale): unknown {
	if (isLocalizedValue(value)) {
		return value[locale];
	}

	if (Array.isArray(value)) {
		return value.map((item) => pickLocale(item, locale));
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>).map(([key, item]) => [
				key,
				pickLocale(item, locale)
			])
		);
	}

	return value;
}

async function readYamlFile<T>(filePath: string): Promise<T> {
	const raw = await fs.readFile(filePath, "utf8");
	return parseYaml(raw) as T;
}

async function resetDatabase(connectionString: string): Promise<void> {
	console.log("Resetting database schema...");

	const client = new pg.Client({ connectionString });

	try {
		await client.connect();
		await client.query("DROP SCHEMA IF EXISTS public CASCADE");
		await client.query("CREATE SCHEMA public");
		await client.query("GRANT ALL ON SCHEMA public TO public");
		console.log("Database schema reset complete");
	} finally {
		await client.end();
	}
}

async function resetMediaFolderContents(): Promise<void> {
	console.log("Resetting media upload directory...");

	await fs.mkdir(MEDIA_UPLOAD_PATH, { recursive: true });

	const entries = await fs.readdir(MEDIA_UPLOAD_PATH, { withFileTypes: true });

	for (const entry of entries) {
		await fs.rm(path.join(MEDIA_UPLOAD_PATH, entry.name), {
			recursive: true,
			force: true
		});
	}

	console.log("Media upload directory reset complete");
}

function clearCaches(): void {
	inFlightMedia.clear();
}

async function resetEnvironment(connectionString: string): Promise<void> {
	await resetDatabase(connectionString);
	await resetMediaFolderContents();
	clearCaches();
}

async function createMediaRecord(
	payload: Payload,
	sourcePath: string
): Promise<Media> {
	const filePath = path.join(ROOT, "public", sourcePath);

	try {
		return await payload.create({
			collection: "media",
			data: {
				sourcePath,
				alt: path.basename(sourcePath, path.extname(sourcePath))
			},
			filePath,
			overrideAccess: true
		});
	} catch (error) {
		if (!isSourcePathUniqueViolation(error)) {
			throw error;
		}

		const existing = await findMediaBySourcePath(payload, sourcePath);

		if (!existing) {
			throw error;
		}

		return existing;
	}
}

async function ensureMediaOnce(
	payload: Payload,
	mediaCache: TMediaCache,
	sourcePath: string
): Promise<Media> {
	const cached = mediaCache.get(sourcePath);

	if (cached) {
		return cached;
	}

	const existing = await findMediaBySourcePath(payload, sourcePath);

	if (existing) {
		mediaCache.set(sourcePath, existing);
		return existing;
	}

	const doc = await createMediaRecord(payload, sourcePath);
	mediaCache.set(sourcePath, doc);
	return doc;
}

async function ensureMedia(
	payload: Payload,
	mediaCache: TMediaCache,
	sourcePath: string
): Promise<Media> {
	const cached = mediaCache.get(sourcePath);

	if (cached) {
		return cached;
	}

	const pending = inFlightMedia.get(sourcePath);

	if (pending) {
		return pending;
	}

	const operation = ensureMediaOnce(payload, mediaCache, sourcePath).finally(
		() => {
			inFlightMedia.delete(sourcePath);
		}
	);

	inFlightMedia.set(sourcePath, operation);
	return operation;
}

async function resolveCardImage(
	payload: Payload,
	mediaCache: TMediaCache,
	card: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const result = { ...card };

	if (typeof result.image === "string") {
		result.image = (await ensureMedia(payload, mediaCache, result.image)).id;
	}

	return result;
}

async function resolveRouteIdeaCard(
	payload: Payload,
	mediaCache: TMediaCache,
	card: Record<string, unknown>,
	options?: TResolvePageOptions
): Promise<Record<string, unknown>> {
	const { countrySlug, ...rest } = card;
	const resolved = await resolveCardImage(payload, mediaCache, rest);

	if (typeof countrySlug === "string") {
		return {
			...resolved,
			ctaHref: buildPrefixedCountryHref(options?.hrefPrefix, countrySlug)
		};
	}

	return resolved;
}

async function resolveCountryCard(
	payload: Payload,
	card: Record<string, unknown>,
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<Record<string, unknown>> {
	const countrySlug = card.countrySlug;

	if (typeof countrySlug !== "string") {
		throw new Error("Country card must include countrySlug");
	}

	const result = await payload.find({
		collection: "countries",
		where: {
			slug: {
				equals: countrySlug
			}
		},
		locale,
		limit: 1,
		depth: 0,
		overrideAccess: true
	});

	const country = result.docs[0];

	if (!country) {
		throw new Error(`Country not found for slug: ${countrySlug}`);
	}

	const slug = String(country.slug);

	return {
		type: "country",
		href: buildPrefixedCountryHref(options?.hrefPrefix, slug),
		image: country.heroImage,
		badge: country.subtitle,
		title: country.title,
		description:
			typeof country.excerpt === "string"
				? toDefaultRichText(country.excerpt)
				: country.excerpt,
		featured: card.featured === true,
		cities: []
	};
}

async function resolveBlockCards(
	payload: Payload,
	mediaCache: TMediaCache,
	cards: unknown[],
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<unknown[]> {
	const resolved: unknown[] = [];

	for (const card of cards) {
		if (!card || typeof card !== "object") {
			resolved.push(card);
			continue;
		}

		const entry = card as Record<string, unknown>;

		if (entry.type === "country" && entry.countrySlug) {
			resolved.push(
				await resolveCountryCard(payload, entry, locale, options)
			);
			continue;
		}

		if (entry.type === "routeIdea") {
			resolved.push(
				await resolveRouteIdeaCard(payload, mediaCache, entry, options)
			);
			continue;
		}

		resolved.push(await resolveCardImage(payload, mediaCache, entry));
	}

	return resolved;
}

const ROUTE_MAP_ENTITY_COLLECTION = {
	country: "countries",
	region: "regions",
	city: "cities",
	attraction: "attractions"
} as const;

type TRouteMapEntityType = keyof typeof ROUTE_MAP_ENTITY_COLLECTION;

async function findRouteMapEntityId(
	payload: Payload,
	entityType: TRouteMapEntityType,
	entitySlug: string,
	locale: TLocale
): Promise<number> {
	const collection = ROUTE_MAP_ENTITY_COLLECTION[entityType];

	const result = await payload.find({
		collection,
		where: {
			slug: {
				equals: entitySlug
			}
		},
		locale,
		limit: 1,
		depth: 0,
		overrideAccess: true
	});

	const doc = result.docs[0];

	if (!doc) {
		throw new Error(
			`RouteMap ${entityType} not found for slug: ${entitySlug}`
		);
	}

	return doc.id as number;
}

async function resolveRouteMapStops(
	payload: Payload,
	stops: unknown[],
	locale: TLocale
): Promise<unknown[]> {
	return Promise.all(
		stops.map(async (stop) => {
			if (!stop || typeof stop !== "object") {
				return stop;
			}

			const entry = { ...(stop as Record<string, unknown>) };
			const entityType = entry.entityType as TRouteMapEntityType | undefined;
			const entitySlug = entry.entitySlug;

			if (!entityType || typeof entitySlug !== "string") {
				return entry;
			}

			const collection = ROUTE_MAP_ENTITY_COLLECTION[entityType];
			const id = await findRouteMapEntityId(
				payload,
				entityType,
				entitySlug,
				locale
			);

			delete entry.entitySlug;

			return {
				...entry,
				relation: {
					relationTo: collection,
					value: id
				}
			};
		})
	);
}

async function resolvePageBlocks(
	payload: Payload,
	mediaCache: TMediaCache,
	blocks: unknown[],
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<unknown[]> {
	const resolvedBlocks = await Promise.all(
		blocks.map(async (block) => {
			if (!block || typeof block !== "object") {
				return block;
			}

			const entry = { ...(block as Record<string, unknown>) };

			if (entry.blockType === "hero" || entry.blockType === "cta") {
				if (typeof entry.image === "string") {
					entry.image = (
						await ensureMedia(payload, mediaCache, entry.image)
					).id;
				}

				if (Array.isArray(entry.actions)) {
					entry.actions = resolveBlockActions(
						entry.actions,
						options?.hrefPrefix
					);
				}
			}

			if (Array.isArray(entry.cards)) {
				entry.cards = await resolveBlockCards(
					payload,
					mediaCache,
					entry.cards,
					locale,
					options
				);
			}

			if (entry.blockType === "routeMap" && Array.isArray(entry.stops)) {
				if (options?.deferRouteMapStops) {
					delete entry.stops;
				} else {
					entry.stops = await resolveRouteMapStops(
						payload,
						entry.stops,
						locale
					);
				}
			}

			return entry;
		})
	);

	return normalizeRichTextDescriptions(resolvedBlocks);
}

async function resolveTopLevelMedia(
	payload: Payload,
	mediaCache: TMediaCache,
	data: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const result: Record<string, unknown> = { ...data };

	if (typeof result.heroImage === "string") {
		result.heroImage = (
			await ensureMedia(payload, mediaCache, result.heroImage)
		).id;
	}

	if (Array.isArray(result.gallery)) {
		const resolvedGallery: unknown[] = [];

		for (const item of result.gallery) {
			if (typeof item === "string") {
				resolvedGallery.push(
					(await ensureMedia(payload, mediaCache, item)).id
				);
			} else {
				resolvedGallery.push(item);
			}
		}

		result.gallery = resolvedGallery;
	}

	return result;
}

async function resolveSeedDocument(
	payload: Payload,
	mediaCache: TMediaCache,
	data: Record<string, unknown>,
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<Record<string, unknown>> {
	const withTopLevelMedia = await resolveTopLevelMedia(
		payload,
		mediaCache,
		data
	);

	if (!Array.isArray(withTopLevelMedia.blocks)) {
		return withTopLevelMedia;
	}

	return {
		...withTopLevelMedia,
		blocks: await resolvePageBlocks(
			payload,
			mediaCache,
			withTopLevelMedia.blocks,
			locale,
			options
		)
	};
}

async function readDestinationPageSlug(): Promise<string> {
	const filePath = path.join(CONTENT_DIR, "destination-page.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);
	const slug = raw.slug;

	if (typeof slug === "object" && slug !== null && "en" in slug) {
		return String((slug as Record<string, unknown>).en);
	}

	return String(slug ?? "");
}

async function seedHomepage(
	payload: Payload,
	mediaCache: TMediaCache,
	navigationRootSlug: string
): Promise<void> {
	const filePath = path.join(CONTENT_DIR, "main-page.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);

	console.log("Seeding homepage global...");

	for (const locale of LOCALES) {
		const localized = pickLocale(raw, locale) as Record<string, unknown>;
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
			overrideAccess: true
		});

		console.log(`  + homepage locale ${locale}`);
	}
}

async function seedDestination(
	payload: Payload,
	mediaCache: TMediaCache
): Promise<string> {
	const filePath = path.join(CONTENT_DIR, "destination-page.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);

	console.log("Seeding destination global...");

	const pageSlug = await readDestinationPageSlug();

	for (const locale of LOCALES) {
		const localized = pickLocale(raw, locale) as Record<string, unknown>;
		const data = await resolveSeedDocument(
			payload,
			mediaCache,
			localized,
			locale,
			{ hrefPrefix: pageSlug }
		);

		await payload.updateGlobal({
			slug: "destination",
			data,
			locale,
			overrideAccess: true
		});

		console.log(`  + destination locale ${locale}`);
	}

	return pageSlug;
}

function resolveBadgeIds(
	data: Record<string, unknown>,
	badgeIds: Map<string, number>
): Record<string, unknown> {
	if (!Array.isArray(data.badges)) {
		return data;
	}

	return {
		...data,
		badges: data.badges.map((slug) => {
			if (typeof slug !== "string") {
				throw new Error(`Badge slug must be a string, got ${typeof slug}`);
			}

			const id = badgeIds.get(slug);
			if (!id) {
				throw new Error(`Badge not found: ${slug}`);
			}

			return id;
		})
	};
}

async function findCountryIdBySlug(
	payload: Payload,
	countrySlug: string,
	locale: TLocale
): Promise<number> {
	const result = await payload.find({
		collection: "countries",
		where: {
			slug: {
				equals: countrySlug
			}
		},
		locale,
		limit: 1,
		depth: 0,
		overrideAccess: true
	});

	const country = result.docs[0];

	if (!country) {
		throw new Error(`Country not found for slug: ${countrySlug}`);
	}

	return country.id as number;
}

async function findRegionIdBySlug(
	payload: Payload,
	countryId: number,
	regionSlug: string,
	locale: TLocale
): Promise<number> {
	const result = await payload.find({
		collection: "regions",
		where: {
			and: [
				{
					slug: {
						equals: regionSlug
					}
				},
				{
					country: {
						equals: countryId
					}
				}
			]
		},
		locale,
		limit: 1,
		depth: 0,
		overrideAccess: true
	});

	const region = result.docs[0];

	if (!region) {
		throw new Error(
			`Region not found for slug: ${regionSlug} (country id: ${countryId})`
		);
	}

	return region.id as number;
}

async function resolveRegionSeedData(
	payload: Payload,
	data: Record<string, unknown>,
	locale: TLocale,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<Record<string, unknown>> {
	const result = { ...data };

	if (typeof result.country === "string") {
		result.country = await findCountryIdBySlug(
			payload,
			result.country,
			locale
		);
	}

	const withBadges = resolveBadgeIds(result, badgeIds);

	return resolveSeedDocument(payload, mediaCache, withBadges, locale, {
		deferRouteMapStops: true
	});
}

async function resolveCitySeedData(
	payload: Payload,
	data: Record<string, unknown>,
	locale: TLocale,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<Record<string, unknown>> {
	const result = { ...data };

	if (typeof result.country === "string") {
		result.country = await findCountryIdBySlug(
			payload,
			result.country,
			locale
		);
	}

	if (typeof result.region === "string") {
		const countryId = result.country as number;

		result.region = await findRegionIdBySlug(
			payload,
			countryId,
			result.region,
			locale
		);
	}

	const withBadges = resolveBadgeIds(result, badgeIds);

	return resolveSeedDocument(payload, mediaCache, withBadges, locale, {
		deferRouteMapStops: true
	});
}

async function findCityIdBySlug(
	payload: Payload,
	countryId: number,
	regionId: number,
	citySlug: string,
	locale: TLocale
): Promise<number> {
	const result = await payload.find({
		collection: "cities",
		where: {
			and: [
				{
					slug: {
						equals: citySlug
					}
				},
				{
					country: {
						equals: countryId
					}
				},
				{
					region: {
						equals: regionId
					}
				}
			]
		},
		locale,
		limit: 1,
		depth: 0,
		overrideAccess: true
	});

	const city = result.docs[0];

	if (!city) {
		throw new Error(
			`City not found for slug: ${citySlug} (region id: ${regionId})`
		);
	}

	return city.id as number;
}

async function resolveAttractionSeedData(
	payload: Payload,
	data: Record<string, unknown>,
	locale: TLocale,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<Record<string, unknown>> {
	const result = { ...data };

	if (typeof result.country === "string") {
		result.country = await findCountryIdBySlug(
			payload,
			result.country,
			locale
		);
	}

	const countryId = result.country as number;

	if (typeof result.region === "string") {
		result.region = await findRegionIdBySlug(
			payload,
			countryId,
			result.region,
			locale
		);
	}

	const regionId = result.region as number;

	if (typeof result.city === "string") {
		result.city = await findCityIdBySlug(
			payload,
			countryId,
			regionId,
			result.city,
			locale
		);
	}

	const withBadges = resolveBadgeIds(result, badgeIds);

	return resolveSeedDocument(payload, mediaCache, withBadges, locale);
}

async function seedLocalizedDoc(
	payload: Payload,
	collection: CollectionSlug,
	raw: Record<string, unknown>,
	options?: {
		published?: boolean;
		beforeCreate?: (
			data: Record<string, unknown>,
			locale: TLocale
		) => Promise<Record<string, unknown>>;
	}
): Promise<{ id: number | string }> {
	const beforeCreate = options?.beforeCreate ?? (async (data) => data);

	const enData = await beforeCreate(
		pickLocale(raw, "en") as Record<string, unknown>,
		"en"
	);

	if (options?.published) {
		enData._status = "published";
	}

	const doc = await payload.create({
		collection,
		data: enData,
		locale: "en",
		draft: false,
		overrideAccess: true
	});

	for (const locale of LOCALES) {
		if (locale === "en") {
			continue;
		}

		const localeData = await beforeCreate(
			pickLocale(raw, locale) as Record<string, unknown>,
			locale
		);

		await payload.update({
			collection,
			id: doc.id,
			data: localeData,
			locale,
			overrideAccess: true
		});
	}

	return doc;
}

async function seedBadges(payload: Payload): Promise<Map<string, number>> {
	const filePath = path.join(CONTENT_DIR, "badges.yml");
	const items = await readYamlFile<Record<string, unknown>[]>(filePath);
	const badgeIds = new Map<string, number>();

	console.log(`Seeding badges (${items.length})...`);

	for (const item of items) {
		if (typeof item.slug !== "string") {
			throw new Error("Badge seed item must include a string slug");
		}

		const doc = await seedLocalizedDoc(payload, "badges", item);
		badgeIds.set(item.slug, doc.id as number);
		console.log(`  + badge ${item.slug}`);
	}

	return badgeIds;
}

async function seedThemes(
	payload: Payload,
	mediaCache: TMediaCache
): Promise<number> {
	const filePath = path.join(CONTENT_DIR, "themes.yml");
	const items = await readYamlFile<Record<string, unknown>[]>(filePath);

	console.log(`Seeding themes (${items.length})...`);

	for (const item of items) {
		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: String(item.slug);

		await seedLocalizedDoc(payload, "themes", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolveSeedDocument(payload, mediaCache, data, locale)
		});
		console.log(`  + theme ${slug}`);
	}

	return items.length;
}

async function seedCountries(
	payload: Payload,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<number> {
	const countriesDir = path.join(CONTENT_DIR, "countries");
	const files = (await fs.readdir(countriesDir))
		.filter((file) => file.endsWith(".yml"))
		.sort();

	console.log(`Seeding countries (${files.length})...`);

	for (const file of files) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(countriesDir, file)
		);

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		await seedLocalizedDoc(payload, "countries", item, {
			published: true,
			beforeCreate: async (data, locale) => {
				const withBadges = resolveBadgeIds(data, badgeIds);
				return resolveSeedDocument(
					payload,
					mediaCache,
					withBadges,
					locale,
					{ deferRouteMapStops: true }
				);
			}
		});

		console.log(`  + country ${slug}`);
	}

	return files.length;
}

async function refreshRouteMapStops(
	payload: Payload,
	collection: TRouteMapCollection,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<void> {
	const contentDir = path.join(
		CONTENT_DIR,
		ROUTE_MAP_CONTENT_DIRS[collection]
	);
	const files = (await fs.readdir(contentDir)).filter((file) =>
		file.endsWith(".yml")
	);

	for (const file of files) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(contentDir, file)
		);

		const blocks = item.blocks;

		if (!Array.isArray(blocks)) {
			continue;
		}

		const hasRouteMapStops = blocks.some(
			(block) =>
				block &&
				typeof block === "object" &&
				(block as Record<string, unknown>).blockType === "routeMap" &&
				Array.isArray((block as Record<string, unknown>).stops)
		);

		if (!hasRouteMapStops) {
			continue;
		}

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		const existing = await payload.find({
			collection,
			where: {
				slug: {
					equals: slug
				}
			},
			locale: "en",
			limit: 1,
			depth: 0,
			overrideAccess: true
		});

		const doc = existing.docs[0];

		if (!doc) {
			throw new Error(
				`${collection} not found for routeMap refresh: ${slug}`
			);
		}

		for (const locale of LOCALES) {
			const localeData = await resolveSeedDocument(
				payload,
				mediaCache,
				resolveBadgeIds(
					pickLocale(item, locale) as Record<string, unknown>,
					badgeIds
				),
				locale
			);

			const blocksData = localeData.blocks as
				| Country["blocks"]
				| Region["blocks"]
				| City["blocks"];

			await payload.update({
				collection,
				id: doc.id,
				data: {
					blocks: blocksData
				},
				locale,
				overrideAccess: true
			});
		}

		console.log(`  ~ ${collection} routeMap stops ${slug}`);
	}
}

async function seedRegions(
	payload: Payload,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<number> {
	const regionsDir = path.join(CONTENT_DIR, "regions");

	let files: string[];

	try {
		files = (await fs.readdir(regionsDir))
			.filter((file) => file.endsWith(".yml"))
			.sort();
	} catch {
		console.log("Seeding regions (0)...");

		return 0;
	}

	console.log(`Seeding regions (${files.length})...`);

	for (const file of files) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(regionsDir, file)
		);

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		await seedLocalizedDoc(payload, "regions", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolveRegionSeedData(
					payload,
					data,
					locale,
					badgeIds,
					mediaCache
				)
		});

		console.log(`  + region ${slug}`);
	}

	return files.length;
}

async function seedCities(
	payload: Payload,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<number> {
	const citiesDir = path.join(CONTENT_DIR, "cities");

	let files: string[];

	try {
		files = (await fs.readdir(citiesDir))
			.filter((file) => file.endsWith(".yml"))
			.sort();
	} catch {
		console.log("Seeding cities (0)...");

		return 0;
	}

	console.log(`Seeding cities (${files.length})...`);

	for (const file of files) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(citiesDir, file)
		);

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		await seedLocalizedDoc(payload, "cities", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolveCitySeedData(
					payload,
					data,
					locale,
					badgeIds,
					mediaCache
				)
		});

		console.log(`  + city ${slug}`);
	}

	return files.length;
}

async function seedAttractions(
	payload: Payload,
	badgeIds: Map<string, number>,
	mediaCache: TMediaCache
): Promise<number> {
	const attractionsDir = path.join(CONTENT_DIR, "attractions");

	let files: string[];

	try {
		files = (await fs.readdir(attractionsDir))
			.filter((file) => file.endsWith(".yml"))
			.sort();
	} catch {
		console.log("Seeding attractions (0)...");

		return 0;
	}

	console.log(`Seeding attractions (${files.length})...`);

	for (const file of files) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(attractionsDir, file)
		);

		const slug =
			typeof item.slug === "object" &&
			item.slug !== null &&
			"en" in item.slug
				? String((item.slug as Record<string, unknown>).en)
				: file.replace(/\.yml$/, "");

		await seedLocalizedDoc(payload, "attractions", item, {
			published: true,
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

	return files.length;
}

async function findSegmentIdBySlug(
	payload: Payload,
	segmentSlug: string
): Promise<number> {
	const result = await payload.find({
		collection: "segments",
		where: {
			slug: {
				equals: segmentSlug
			}
		},
		limit: 1,
		depth: 0,
		overrideAccess: true
	});

	const doc = result.docs[0];

	if (!doc) {
		throw new Error(`Segment not found: ${segmentSlug}`);
	}

	return doc.id as number;
}

async function buildPageIdMap(payload: Payload): Promise<Map<string, number>> {
	const segmentsResult = await payload.find({
		collection: "segments",
		limit: 100,
		depth: 0,
		overrideAccess: true
	});

	const segmentIdToSlug = new Map<number, string>();

	for (const segment of segmentsResult.docs) {
		if (typeof segment.slug === "string") {
			segmentIdToSlug.set(segment.id as number, segment.slug);
		}
	}

	const pagesResult = await payload.find({
		collection: "pages",
		locale: "en",
		limit: 200,
		depth: 0,
		overrideAccess: true
	});

	const pageIds = new Map<string, number>();

	for (const page of pagesResult.docs) {
		const segmentId =
			typeof page.segment === "number" ? page.segment : null;

		if (segmentId && typeof page.slug === "string") {
			const segmentSlug = segmentIdToSlug.get(segmentId);

			if (segmentSlug) {
				pageIds.set(`${segmentSlug}/${page.slug}`, page.id as number);
			}
		}
	}

	return pageIds;
}

async function resolvePageSeedData(
	payload: Payload,
	mediaCache: TMediaCache,
	data: Record<string, unknown>,
	locale: TLocale
): Promise<Record<string, unknown>> {
	const result = { ...data };

	if (typeof result.segment === "string") {
		result.segment = await findSegmentIdBySlug(payload, result.segment);
	}

	return resolveSeedDocument(payload, mediaCache, result, locale);
}

async function seedSegments(payload: Payload): Promise<Map<string, number>> {
	const filePath = path.join(CONTENT_DIR, "segments.yml");
	const items = await readYamlFile<Record<string, unknown>[]>(filePath);

	console.log(`Seeding segments (${items.length})...`);

	const segmentIds = new Map<string, number>();

	for (const item of items) {
		if (typeof item.slug !== "string") {
			throw new Error("Segment seed item must include a string slug");
		}

		const doc = await seedLocalizedDoc(payload, "segments", item, {
			published: true
		});

		segmentIds.set(item.slug, doc.id as number);
		console.log(`  + segment ${item.slug}`);
	}

	return segmentIds;
}

async function seedPages(
	payload: Payload,
	mediaCache: TMediaCache
): Promise<number> {
	const pagesDir = path.join(CONTENT_DIR, "pages");
	const files = (await fs.readdir(pagesDir))
		.filter((file) => file.endsWith(".yml"))
		.sort();

	console.log(`Seeding pages (${files.length})...`);

	for (const file of files) {
		const item = await readYamlFile<Record<string, unknown>>(
			path.join(pagesDir, file)
		);

		await seedLocalizedDoc(payload, "pages", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolvePageSeedData(payload, mediaCache, data, locale)
		});

		console.log(`  + page ${file.replace(/\.yml$/, "")}`);
	}

	return files.length;
}

type TNavigationSeedContext = {
	segmentIds: Map<string, number>;
	pageIds: Map<string, number>;
	destinationSlug: string;
};

function resolveNavHref(
	href: unknown,
	context: TNavigationSeedContext
): unknown {
	if (typeof href !== "string") {
		return href;
	}

	if (href === "__DESTINATION_SLUG__") {
		return `/${context.destinationSlug}`;
	}

	return href;
}

async function resolveNavigationItem(
	item: Record<string, unknown>,
	context: TNavigationSeedContext
): Promise<Record<string, unknown>> {
	assertNoDeprecatedNavigationOrder(item, "navigation item");

	const result = { ...item };

	if (result.type === "group" && Array.isArray(result.groupItems)) {
		result.groupItems = await resolveNavItemsArray(
			result.groupItems as unknown[],
			context
		);
	}

	if (result.type === "page" && typeof result.page === "string") {
		const id = context.pageIds.get(result.page);

		if (!id) {
			throw new Error(`Page not found for nav item: ${result.page}`);
		}

		result.page = id;
	}

	if (typeof result.href === "string") {
		result.href = resolveNavHref(result.href, context);
	}

	return result;
}

async function resolveNavItemsArray(
	items: unknown[] | undefined,
	context: TNavigationSeedContext
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

			return resolveNavigationItem(item as Record<string, unknown>, context);
		})
	);
}

async function resolveFooterColumns(
	columns: unknown[] | undefined,
	context: TNavigationSeedContext
): Promise<Record<string, unknown>[]> {
	if (!columns?.length) {
		return [];
	}

	return Promise.all(
		columns.map(async (column) => {
			if (!column || typeof column !== "object") {
				return column as Record<string, unknown>;
			}

			const entry = column as Record<string, unknown>;

			return {
				...entry,
				items: await resolveNavItemsArray(
					entry.items as unknown[] | undefined,
					context
				)
			};
		})
	);
}

async function seedNavigation(
	payload: Payload,
	mediaCache: TMediaCache,
	context: TNavigationSeedContext
): Promise<void> {
	const filePath = path.join(CONTENT_DIR, "navigation.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);

	const headerRaw = raw.header as Record<string, unknown> | undefined;

	if (headerRaw) {
		console.log("Seeding header global...");

		const enLocalized = pickLocale(headerRaw, "en") as Record<string, unknown>;
		const enNavItems = await resolveNavItemsArray(
			enLocalized.navItems as unknown[] | undefined,
			context
		);
		const enData: Record<string, unknown> = {
			...enLocalized,
			navItems: enNavItems
		};

		if (typeof enData.logo === "string") {
			enData.logo = (await ensureMedia(payload, mediaCache, enData.logo)).id;
		}

		await payload.updateGlobal({
			slug: "header",
			data: enData,
			locale: "en",
			overrideAccess: true
		});

		console.log("  + header locale en");

		const headerWithIds = await payload.findGlobal({
			slug: "header",
			locale: "en",
			depth: 0
		});

		for (const locale of LOCALES) {
			if (locale === "en") {
				continue;
			}

			const localized = pickLocale(headerRaw, locale) as Record<
				string,
				unknown
			>;
			const navItems = await resolveNavItemsArray(
				localized.navItems as unknown[] | undefined,
				context
			);
			const mergedNavItems = mergeNavItemsById(
				headerWithIds?.navItems as Record<string, unknown>[] | undefined,
				navItems
			);

			await payload.updateGlobal({
				slug: "header",
				data: {
					navItems: mergedNavItems as Header["navItems"],
					ctaAction: localized.ctaAction as Header["ctaAction"]
				},
				locale,
				overrideAccess: true
			});

			console.log(`  + header locale ${locale}`);
		}
	}

	const footerRaw = raw.footer as Record<string, unknown> | undefined;

	if (footerRaw) {
		console.log("Seeding footer global...");

		const enLocalized = pickLocale(footerRaw, "en") as Record<string, unknown>;
		const enColumns = await resolveFooterColumns(
			enLocalized.columns as unknown[] | undefined,
			context
		);

		await payload.updateGlobal({
			slug: "footer",
			data: {
				...enLocalized,
				columns: enColumns
			},
			locale: "en",
			overrideAccess: true
		});

		console.log("  + footer locale en");

		const footerWithIds = await payload.findGlobal({
			slug: "footer",
			locale: "en",
			depth: 0
		});

		for (const locale of LOCALES) {
			if (locale === "en") {
				continue;
			}

			const localized = pickLocale(footerRaw, locale) as Record<
				string,
				unknown
			>;
			const columns = await resolveFooterColumns(
				localized.columns as unknown[] | undefined,
				context
			);
			const mergedColumns = mergeFooterColumnsById(
				footerWithIds?.columns as Record<string, unknown>[] | undefined,
				columns
			);

			await payload.updateGlobal({
				slug: "footer",
				data: {
					columns: mergedColumns as Footer["columns"],
					copyrightText: localized.copyrightText as Footer["copyrightText"]
				},
				locale,
				overrideAccess: true
			});

			console.log(`  + footer locale ${locale}`);
		}
	}

	await assertNavigationLabelsSeeded(payload);
}

async function assertNavigationLabelsSeeded(payload: Payload): Promise<void> {
	for (const locale of LOCALES) {
		const header = await payload.findGlobal({
			slug: "header",
			locale,
			depth: 0
		});

		const labels =
			header?.navItems?.map((item) => item.label?.trim()).filter(Boolean) ?? [];

		if (labels.length === 0) {
			throw new Error(
				`Header nav labels were not saved for locale "${locale}"`
			);
		}
	}
}

async function main(): Promise<void> {
	if (!process.env.DATABASE_URI) {
		throw new Error("DATABASE_URI is not set");
	}

	if (!process.env.PAYLOAD_SECRET) {
		throw new Error("PAYLOAD_SECRET is not set");
	}

	await resetEnvironment(process.env.DATABASE_URI);

	const payload = await getPayload({ config });

	const mediaCache: TMediaCache = new Map();
	const badgeIds = await seedBadges(payload);
	const themesCount = await seedThemes(payload, mediaCache);
	const countriesCount = await seedCountries(payload, badgeIds, mediaCache);
	const regionsCount = await seedRegions(payload, badgeIds, mediaCache);
	const citiesCount = await seedCities(payload, badgeIds, mediaCache);
	const attractionsCount = await seedAttractions(
		payload,
		badgeIds,
		mediaCache
	);

	await refreshRouteMapStops(payload, "cities", badgeIds, mediaCache);
	await refreshRouteMapStops(payload, "regions", badgeIds, mediaCache);
	await refreshRouteMapStops(payload, "countries", badgeIds, mediaCache);
	const navigationRootSlug = await seedDestination(payload, mediaCache);
	await seedHomepage(payload, mediaCache, navigationRootSlug);
	const segmentIds = await seedSegments(payload);
	const pagesCount = await seedPages(payload, mediaCache);
	const pageIds = await buildPageIdMap(payload);

	await seedNavigation(payload, mediaCache, {
		segmentIds,
		pageIds,
		destinationSlug: navigationRootSlug
	});

	console.log("Seed complete:", {
		badges: badgeIds.size,
		themes: themesCount,
		countries: countriesCount,
		regions: regionsCount,
		cities: citiesCount,
		attractions: attractionsCount,
		homepage: true,
		destination: true,
		segments: segmentIds.size,
		pages: pagesCount,
		header: true,
		footer: true
	});

	process.exit(0);
}

main().catch((error: unknown) => {
	console.error("Seed failed:", error);
	process.exit(1);
});
