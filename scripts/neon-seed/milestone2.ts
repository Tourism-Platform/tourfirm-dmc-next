import type { CollectionSlug, Payload } from "payload";

import { createDiscoverySeeder } from "../seed-discovery.js";
import {
	CONTENT_DIR,
	findSeedDocBySlug,
	pickLocale,
	readYamlFile,
	registerAttractionFromDoc,
	resolveAttractionSeedData,
	resolveBadgeIds,
	resolveSeedDocument,
	seedDiscoveryGlobal,
	seedLocalizedDocOnce,
	refreshRouteMapStops
} from "../seed.js";

import type { TNeonSeedItem } from "./loader.js";
import type { TMilestone1Context } from "./milestone1.js";
import { isRetryableNeonError, withRetry, withTimeout } from "./retry.js";

type TNeonDiscoverySeeder = ReturnType<typeof createDiscoverySeeder>;

let discoverySeeder: TNeonDiscoverySeeder | undefined;

function getDiscoverySeeder(): TNeonDiscoverySeeder {
	if (!discoverySeeder) {
		discoverySeeder = createDiscoverySeeder({
			contentDir: CONTENT_DIR,
			readYamlFile,
			seedLocalizedDoc: neonSeedLocalizedDoc,
			resolveSeedDocument,
			resolveBadgeIds,
			pickLocale,
			updateGlobal: seedDiscoveryGlobal
		});
	}

	return discoverySeeder;
}

async function neonSeedLocalizedDoc(
	payload: Payload,
	collection: CollectionSlug,
	raw: Record<string, unknown>,
	options?: {
		published?: boolean;
		beforeCreate?: (
			data: Record<string, unknown>,
			locale: "en" | "ru" | "uz"
		) => Promise<Record<string, unknown>>;
	}
): Promise<{ id: number | string; createdDoc?: Record<string, unknown> }> {
	const slugValue = raw.slug;
	const slug =
		typeof slugValue === "string"
			? slugValue
			: slugValue &&
					typeof slugValue === "object" &&
					slugValue !== null &&
					"en" in slugValue
				? String((slugValue as Record<string, unknown>).en)
				: undefined;

	if (slug) {
		const existing = await findSeedDocBySlug(payload, collection, slug);

		if (existing) {
			console.log(`  exists ${collection} ${slug} (id=${existing.id}), skip write`);
			return { id: existing.id };
		}
	}

	return seedLocalizedDocOnce(payload, collection, raw, options);
}

async function seedThemeItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	const themes = await readYamlFile<Record<string, unknown>[]>(item.filePath);
	const theme = themes[item.stageIndex];

	if (!theme) {
		throw new Error(`Theme not found at index ${item.stageIndex}`);
	}

	const result = await neonSeedLocalizedDoc(ctx.payload, "themes", theme, {
		published: true,
		beforeCreate: async (data, locale) =>
			resolveSeedDocument(ctx.payload, ctx.mediaCache, data, locale)
	});

	if (!ctx.lookup.themes.has(item.slug)) {
		ctx.lookup.registerTheme(item.slug, result.id as number);
	}
}

async function seedAttractionItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	const raw = await readYamlFile<Record<string, unknown>>(item.filePath);
	const result = await neonSeedLocalizedDoc(ctx.payload, "attractions", raw, {
		published: true,
		beforeCreate: async (data, locale) =>
			resolveAttractionSeedData(
				ctx.payload,
				data,
				locale,
				ctx.badgeIds,
				ctx.mediaCache
			)
	});

	if (result.createdDoc) {
		registerAttractionFromDoc(ctx.lookup, result.createdDoc);
	} else if (!ctx.lookup.attractions.has(item.slug)) {
		await ctx.lookup.ingestAttractions(ctx.payload);
	}
}

async function seedExperienceItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	await getDiscoverySeeder().seedExperienceFile(
		ctx.payload,
		ctx.lookup,
		ctx.badgeIds,
		ctx.mediaCache,
		item.filePath
	);
}

async function seedRouteItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	await getDiscoverySeeder().seedRouteFile(
		ctx.payload,
		ctx.lookup,
		ctx.badgeIds,
		ctx.mediaCache,
		item.filePath
	);
}

async function seedMapPointItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	if (!item.mapPoint) {
		throw new Error(`Map point payload missing for ${item.slug}`);
	}

	await getDiscoverySeeder().seedMapPointEntry(
		ctx.payload,
		ctx.lookup,
		item.mapPoint
	);
}

async function globalAlreadySeeded(
	payload: TMilestone1Context["payload"],
	slug:
		| "routes-hub"
		| "experiences-hub"
		| "trade-fairs-hub"
		| "blog-hub"
		| "news-hub"
): Promise<boolean> {
	try {
		const doc = await payload.findGlobal({
			slug,
			depth: 0,
			overrideAccess: true
		});

		return Boolean(doc && typeof doc === "object");
	} catch {
		return false;
	}
}

async function seedRoutesHubItem(ctx: TMilestone1Context): Promise<void> {
	if (await globalAlreadySeeded(ctx.payload, "routes-hub")) {
		console.log("  exists global routes-hub, skip write");
		return;
	}

	await getDiscoverySeeder().seedRoutesHub(ctx.payload, ctx.mediaCache);
}

async function seedExperiencesHubItem(ctx: TMilestone1Context): Promise<void> {
	if (await globalAlreadySeeded(ctx.payload, "experiences-hub")) {
		console.log("  exists global experiences-hub, skip write");
		return;
	}

	await getDiscoverySeeder().seedExperiencesHub(ctx.payload, ctx.mediaCache);
}

async function seedTradeFairsHubItem(ctx: TMilestone1Context): Promise<void> {
	if (await globalAlreadySeeded(ctx.payload, "trade-fairs-hub")) {
		console.log("  exists global trade-fairs-hub, skip write");
		return;
	}

	await getDiscoverySeeder().seedTradeFairsHub(ctx.payload, ctx.mediaCache);
}

async function seedBlogHubItem(ctx: TMilestone1Context): Promise<void> {
	if (await globalAlreadySeeded(ctx.payload, "blog-hub")) {
		console.log("  exists global blog-hub, skip write");
		return;
	}

	await getDiscoverySeeder().seedBlogHub(ctx.payload, ctx.mediaCache);
}

async function seedNewsHubItem(ctx: TMilestone1Context): Promise<void> {
	if (await globalAlreadySeeded(ctx.payload, "news-hub")) {
		console.log("  exists global news-hub, skip write");
		return;
	}

	await getDiscoverySeeder().seedNewsHub(ctx.payload, ctx.mediaCache);
}

async function seedTradeFairItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	await getDiscoverySeeder().seedTradeFairFile(
		ctx.payload,
		ctx.lookup,
		ctx.badgeIds,
		ctx.mediaCache,
		item.filePath
	);
}

async function seedBlogItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	await getDiscoverySeeder().seedBlogFile(
		ctx.payload,
		ctx.lookup,
		ctx.badgeIds,
		ctx.mediaCache,
		item.filePath
	);
}

async function seedNewsItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	await getDiscoverySeeder().seedNewsFile(
		ctx.payload,
		ctx.lookup,
		ctx.badgeIds,
		ctx.mediaCache,
		item.filePath
	);
}

function isInvalidIdValidationError(error: unknown): boolean {
	if (!(error instanceof Error)) {
		return false;
	}

	return (
		error.name === "ValidationError" &&
		error.message.toLowerCase().includes("invalid: id")
	);
}

async function seedRefreshRouteMapItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	const collection =
		item.stage === "refreshRouteMapCountries"
			? "countries"
			: item.stage === "refreshRouteMapRegions"
				? "regions"
				: "cities";

	try {
		await withRetry(
			() =>
				withTimeout(
					refreshRouteMapStops(
						ctx.payload,
						collection,
						ctx.badgeIds,
						ctx.mediaCache
					),
					90_000,
					`refresh ${collection} routeMap`
				),
			`refreshRouteMap:${collection}`
		);
	} catch (error) {
		if (isInvalidIdValidationError(error) || isRetryableNeonError(error)) {
			console.log(
				`  refresh skip ${collection} routeMap (${error instanceof Error ? error.message : String(error)})`
			);
			return;
		}

		const message = error instanceof Error ? error.message.toLowerCase() : "";

		if (message.includes("timed out")) {
			console.log(`  refresh skip ${collection} routeMap (timeout on Neon)`);
			return;
		}

		throw error;
	}
}

async function patchExperienceItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	await getDiscoverySeeder().patchExperienceFile(
		ctx.payload,
		ctx.lookup,
		item.filePath
	);
}

async function patchRouteItem(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	await getDiscoverySeeder().patchRouteFile(
		ctx.payload,
		ctx.lookup,
		item.filePath
	);
}

export async function seedMilestone2Item(
	ctx: TMilestone1Context,
	item: TNeonSeedItem
): Promise<void> {
	switch (item.stage) {
		case "themes":
			await seedThemeItem(ctx, item);
			return;
		case "attractions":
			await seedAttractionItem(ctx, item);
			return;
		case "experiences":
			await seedExperienceItem(ctx, item);
			return;
		case "experiencePatches":
			await patchExperienceItem(ctx, item);
			return;
		case "routes":
			await seedRouteItem(ctx, item);
			return;
		case "routePatches":
			await patchRouteItem(ctx, item);
			return;
		case "mapPoints":
			await seedMapPointItem(ctx, item);
			return;
		case "routesHub":
			await seedRoutesHubItem(ctx);
			return;
		case "experiencesHub":
			await seedExperiencesHubItem(ctx);
			return;
		case "tradeFairs":
			await seedTradeFairItem(ctx, item);
			return;
		case "blog":
			await seedBlogItem(ctx, item);
			return;
		case "news":
			await seedNewsItem(ctx, item);
			return;
		case "tradeFairsHub":
			await seedTradeFairsHubItem(ctx);
			return;
		case "blogHub":
			await seedBlogHubItem(ctx);
			return;
		case "newsHub":
			await seedNewsHubItem(ctx);
			return;
		case "refreshRouteMapCountries":
		case "refreshRouteMapRegions":
		case "refreshRouteMapCities":
			await seedRefreshRouteMapItem(ctx, item);
			return;
		default:
			throw new Error(`Unsupported milestone 2 stage: ${String(item.stage)}`);
	}
}

export function isMilestone2Stage(stage: TNeonSeedItem["stage"]): boolean {
	return ![
		"badges",
		"countries",
		"regions",
		"cities"
	].includes(stage);
}
