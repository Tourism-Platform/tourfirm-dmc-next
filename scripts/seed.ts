import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import "./load-env.js";

import config from "@payload-config";
import { getPayload, type CollectionSlug, type Payload } from "payload";
import { parse as parseYaml } from "yaml";

const LOCALES = ["en", "ru", "uz"] as const;
type TLocale = (typeof LOCALES)[number];

type TResolvePageOptions = {
	hrefPrefix?: string;
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

const DESTINATION_FILENAMES = [
	"uzbekistan.jpg",
	"kazahstan.jpg",
	"kirgizstan.jpg",
	"tadjikistan.jpg",
	"turkmenistan.jpg"
] as const;

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

async function dropCollection(
	payload: Payload,
	collection: CollectionSlug
): Promise<number> {
	console.log(`Dropping ${collection}...`);
	let deleted = 0;

	while (true) {
		const result = await payload.find({
			collection,
			limit: 100,
			pagination: false,
			depth: 0,
			overrideAccess: true
		});

		if (result.docs.length === 0) {
			break;
		}

		for (const doc of result.docs) {
			await payload.delete({
				collection,
				id: doc.id,
				overrideAccess: true
			});
			deleted += 1;
		}
	}

	console.log(`Deleted ${deleted} from ${collection}`);
	return deleted;
}

async function dropDestinationMedia(payload: Payload): Promise<number> {
	console.log("Dropping destination media...");
	let deleted = 0;

	for (const filename of DESTINATION_FILENAMES) {
		const result = await payload.find({
			collection: "media",
			where: {
				filename: {
					equals: filename
				}
			},
			limit: 100,
			pagination: false,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			await payload.delete({
				collection: "media",
				id: doc.id,
				overrideAccess: true
			});
			deleted += 1;
		}
	}

	console.log(`Deleted ${deleted} destination media file(s)`);
	return deleted;
}

async function ensureMedia(
	payload: Payload,
	mediaCache: Map<string, number>,
	relativePath: string
): Promise<number> {
	const cached = mediaCache.get(relativePath);
	if (cached) {
		return cached;
	}

	const filename = path.basename(relativePath);
	const existing = await payload.find({
		collection: "media",
		where: {
			filename: {
				equals: filename
			}
		},
		limit: 1,
		pagination: false,
		depth: 0,
		overrideAccess: true
	});

	if (existing.docs[0]) {
		const id = existing.docs[0].id as number;
		mediaCache.set(relativePath, id);
		return id;
	}

	const filePath = path.join(ROOT, "public", relativePath);
	const doc = await payload.create({
		collection: "media",
		data: {
			alt: path.basename(relativePath, path.extname(relativePath))
		},
		filePath,
		overrideAccess: true
	});

	mediaCache.set(relativePath, doc.id);
	return doc.id;
}

async function resolveCardImage(
	payload: Payload,
	mediaCache: Map<string, number>,
	card: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const result = { ...card };

	if (typeof result.image === "string") {
		result.image = await ensureMedia(payload, mediaCache, result.image);
	}

	return result;
}

async function resolveRouteIdeaCard(
	payload: Payload,
	mediaCache: Map<string, number>,
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
		description: country.excerpt,
		featured: card.featured === true,
		cities: []
	};
}

async function resolveHomepageCards(
	payload: Payload,
	mediaCache: Map<string, number>,
	cards: unknown[],
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<unknown[]> {
	return Promise.all(
		cards.map(async (card) => {
			if (!card || typeof card !== "object") {
				return card;
			}

			const entry = card as Record<string, unknown>;

			if (entry.type === "country" && entry.countrySlug) {
				return resolveCountryCard(payload, entry, locale, options);
			}

			if (entry.type === "routeIdea") {
				return resolveRouteIdeaCard(payload, mediaCache, entry, options);
			}

			return resolveCardImage(payload, mediaCache, entry);
		})
	);
}

async function resolvePageBlocks(
	payload: Payload,
	mediaCache: Map<string, number>,
	blocks: unknown[],
	locale: TLocale,
	options?: TResolvePageOptions
): Promise<unknown[]> {
	return Promise.all(
		blocks.map(async (block) => {
			if (!block || typeof block !== "object") {
				return block;
			}

			const entry = { ...(block as Record<string, unknown>) };

			if (entry.blockType === "hero" || entry.blockType === "cta") {
				if (typeof entry.image === "string") {
					entry.image = await ensureMedia(payload, mediaCache, entry.image);
				}

				if (Array.isArray(entry.actions)) {
					entry.actions = resolveBlockActions(
						entry.actions,
						options?.hrefPrefix
					);
				}
			}

			if (Array.isArray(entry.cards)) {
				entry.cards = await resolveHomepageCards(
					payload,
					mediaCache,
					entry.cards,
					locale,
					options
				);
			}

			return entry;
		})
	);
}

async function seedHomepage(
	payload: Payload,
	mediaCache: Map<string, number>
): Promise<void> {
	const filePath = path.join(CONTENT_DIR, "main-page.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);

	console.log("Seeding homepage global...");

	for (const locale of LOCALES) {
		const localized = pickLocale(raw, locale) as Record<string, unknown>;
		const blocks = Array.isArray(localized.blocks) ? localized.blocks : [];
		const resolvedBlocks = await resolvePageBlocks(
			payload,
			mediaCache,
			blocks,
			locale
		);

		const data: Record<string, unknown> = {
			...localized,
			blocks: resolvedBlocks
		};

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
	mediaCache: Map<string, number>
): Promise<void> {
	const filePath = path.join(CONTENT_DIR, "destination-page.yml");
	const raw = await readYamlFile<Record<string, unknown>>(filePath);

	console.log("Seeding destination global...");

	for (const locale of LOCALES) {
		const localized = pickLocale(raw, locale) as Record<string, unknown>;
		const blocks = Array.isArray(localized.blocks) ? localized.blocks : [];
		const pageSlug = String(localized.slug ?? "");
		const resolvedBlocks = await resolvePageBlocks(
			payload,
			mediaCache,
			blocks,
			locale,
			{ hrefPrefix: pageSlug }
		);

		const data: Record<string, unknown> = {
			...localized,
			blocks: resolvedBlocks
		};

		await payload.updateGlobal({
			slug: "destination",
			data,
			locale,
			overrideAccess: true
		});

		console.log(`  + destination locale ${locale}`);
	}
}

async function resolveMediaFields(
	payload: Payload,
	mediaCache: Map<string, number>,
	data: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const result: Record<string, unknown> = { ...data };

	if (typeof result.heroImage === "string") {
		result.heroImage = await ensureMedia(
			payload,
			mediaCache,
			result.heroImage
		);
	}

	if (Array.isArray(result.blocks)) {
		result.blocks = await Promise.all(
			result.blocks.map(async (block) => {
				if (!block || typeof block !== "object") {
					return block;
				}

				const entry = { ...(block as Record<string, unknown>) };

				if (
					entry.blockType === "hero" &&
					typeof entry.image === "string"
				) {
					entry.image = await ensureMedia(
						payload,
						mediaCache,
						entry.image
					);
				}

				return entry;
			})
		);
	}

	return result;
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

async function seedThemes(payload: Payload): Promise<number> {
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

		await seedLocalizedDoc(payload, "themes", item, { published: true });
		console.log(`  + theme ${slug}`);
	}

	return items.length;
}

async function seedCountries(
	payload: Payload,
	badgeIds: Map<string, number>,
	mediaCache: Map<string, number>
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
			beforeCreate: async (data) => {
				const withBadges = resolveBadgeIds(data, badgeIds);
				return resolveMediaFields(payload, mediaCache, withBadges);
			}
		});

		console.log(`  + country ${slug}`);
	}

	return files.length;
}

async function main(): Promise<void> {
	if (!process.env.DATABASE_URI) {
		throw new Error("DATABASE_URI is not set");
	}

	if (!process.env.PAYLOAD_SECRET) {
		throw new Error("PAYLOAD_SECRET is not set");
	}

	const payload = await getPayload({ config });

	await dropCollection(payload, "countries");
	await dropCollection(payload, "themes");
	await dropCollection(payload, "badges");
	await dropDestinationMedia(payload);

	const mediaCache = new Map<string, number>();
	const badgeIds = await seedBadges(payload);
	const themesCount = await seedThemes(payload);
	const countriesCount = await seedCountries(payload, badgeIds, mediaCache);
	await seedHomepage(payload, mediaCache);
	await seedDestination(payload, mediaCache);

	console.log("Seed complete:", {
		badges: badgeIds.size,
		themes: themesCount,
		countries: countriesCount,
		homepage: true,
		destination: true
	});

	process.exit(0);
}

main().catch((error: unknown) => {
	console.error("Seed failed:", error);
	process.exit(1);
});
