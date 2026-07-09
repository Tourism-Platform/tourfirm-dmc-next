import type { CollectionSlug, Payload } from "payload";

import type { Media } from "@/payload-types";

import {
	applyGeoNavOrder,
	findSeedDocBySlug,
	readYamlFile,
	registerCityFromDoc,
	registerCountryFromDoc,
	registerRegionFromDoc,
	resolveBadgeIds,
	resolveCitySeedData,
	resolveRegionSeedData,
	resolveSeedDocument,
	seedLocalizedDocOnce
} from "../seed.js";
import { SeedLookupCache } from "../seed-lookup-cache.js";

import type { TNeonSeedItem } from "./loader.js";

const STAGE_COLLECTION = {
	badges: "badges",
	countries: "countries",
	regions: "regions",
	cities: "cities"
} as const;

async function seedLocalizedDocIfAbsent(
	ctx: TMilestone1Context,
	collection: CollectionSlug,
	raw: Record<string, unknown>,
	slug: string,
	options?: Parameters<typeof seedLocalizedDocOnce>[3]
): Promise<{ id: number | string; createdDoc?: Record<string, unknown>; skipped: boolean }> {
	const existing = await findSeedDocBySlug(ctx.payload, collection, slug);

	if (existing) {
		console.log(`  exists ${collection} ${slug} (id=${existing.id}), skip write`);
		return { id: existing.id, skipped: true };
	}

	const result = await seedLocalizedDocOnce(ctx.payload, collection, raw, options);
	return { ...result, skipped: false };
}

export type TMilestone1Context = {
	payload: Payload;
	lookup: SeedLookupCache;
	mediaCache: Map<string, Media>;
	badgeIds: Map<string, number>;
};

async function seedBadgeItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	const items = await readYamlFile<Record<string, unknown>[]>(item.filePath);
	const badge = items.find((entry) => entry.slug === item.slug);

	if (!badge || typeof badge.slug !== "string") {
		throw new Error(`Badge not found in YAML: ${item.slug}`);
	}

	const doc = await seedLocalizedDocIfAbsent(ctx, "badges", badge, item.slug);
	ctx.badgeIds.set(badge.slug, doc.id as number);
}

async function seedCountryItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	const raw = await readYamlFile<Record<string, unknown>>(item.filePath);
	const result = await seedLocalizedDocIfAbsent(
		ctx,
		STAGE_COLLECTION.countries,
		raw,
		item.slug,
		{
			published: true,
			beforeCreate: async (data, locale) => {
				const withNavOrder = applyGeoNavOrder(data, item.stageIndex);
				const withBadges = resolveBadgeIds(withNavOrder, ctx.badgeIds);

				return resolveSeedDocument(
					ctx.payload,
					ctx.mediaCache,
					withBadges,
					locale,
					{ deferRouteMapStops: true }
				);
			}
		}
	);

	if (result.createdDoc) {
		registerCountryFromDoc(ctx.lookup, result.createdDoc);
	} else if (result.skipped) {
		await ctx.lookup.ingestCountries(ctx.payload);
	}
}

async function seedRegionItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	const raw = await readYamlFile<Record<string, unknown>>(item.filePath);
	const result = await seedLocalizedDocIfAbsent(
		ctx,
		STAGE_COLLECTION.regions,
		raw,
		item.slug,
		{
			published: true,
			beforeCreate: async (data, locale) =>
				resolveRegionSeedData(
					ctx.payload,
					applyGeoNavOrder(data, item.stageIndex),
					locale,
					ctx.badgeIds,
					ctx.mediaCache
				)
		}
	);

	if (result.createdDoc) {
		registerRegionFromDoc(ctx.lookup, result.createdDoc);
	} else if (result.skipped) {
		await ctx.lookup.ingestRegions(ctx.payload);
	}
}

async function seedCityItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	const raw = await readYamlFile<Record<string, unknown>>(item.filePath);
	const result = await seedLocalizedDocIfAbsent(
		ctx,
		STAGE_COLLECTION.cities,
		raw,
		item.slug,
		{
			published: true,
			beforeCreate: async (data, locale) =>
				resolveCitySeedData(
					ctx.payload,
					applyGeoNavOrder(data, item.stageIndex),
					locale,
					ctx.badgeIds,
					ctx.mediaCache
				)
		}
	);

	if (result.createdDoc) {
		registerCityFromDoc(ctx.lookup, result.createdDoc);
	} else if (result.skipped) {
		await ctx.lookup.ingestCities(ctx.payload);
	}
}

export async function seedMilestone1Item(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	switch (item.stage) {
		case "badges":
			await seedBadgeItem(ctx, item);
			return;
		case "countries":
			await seedCountryItem(ctx, item);
			return;
		case "regions":
			await seedRegionItem(ctx, item);
			return;
		case "cities":
			await seedCityItem(ctx, item);
			return;
		default:
			throw new Error(`Unsupported stage: ${String(item.stage)}`);
	}
}

export async function loadBadgeIds(payload: Payload): Promise<Map<string, number>> {
	const badgeIds = new Map<string, number>();
	const result = await payload.find({
		collection: "badges",
		limit: 500,
		depth: 0,
		overrideAccess: true,
		context: { isSeed: true }
	});

	for (const doc of result.docs) {
		if (typeof doc.slug === "string") {
			badgeIds.set(doc.slug, doc.id as number);
		}
	}

	return badgeIds;
}
