import fs from "node:fs/promises";
import path from "node:path";

import type { CollectionSlug, Payload } from "payload";

import type { Media } from "@/payload-types";

import type { SeedLookupCache } from "./seed-lookup-cache.js";

const LOCALES = ["en", "ru", "uz"] as const;
type TLocale = (typeof LOCALES)[number];

type TMediaCache = Map<string, Media>;

type TCityRef = {
	country: string;
	region: string;
	city: string;
};

type TSeedDiscoveryDeps = {
	contentDir: string;
	readYamlFile: <T>(filePath: string) => Promise<T>;
	seedLocalizedDoc: (
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
	) => Promise<{ id: number | string; createdDoc?: Record<string, unknown> }>;
	resolveSeedDocument: (
		payload: Payload,
		mediaCache: TMediaCache,
		data: Record<string, unknown>,
		locale: TLocale
	) => Promise<Record<string, unknown>>;
	resolveBadgeIds: (
		data: Record<string, unknown>,
		badgeIds: Map<string, number>
	) => Record<string, unknown>;
	pickLocale: (value: unknown, locale: TLocale) => unknown;
	updateGlobal: (
		payload: Payload,
		slug: "routes-hub" | "experiences-hub",
		raw: Record<string, unknown>,
		mediaCache: TMediaCache
	) => Promise<void>;
};

function resolveSeedSlug(raw: Record<string, unknown>): string {
	const slug = raw.slug;

	if (typeof slug === "string") {
		return slug;
	}

	if (slug && typeof slug === "object" && slug !== null && "en" in slug) {
		return String((slug as Record<string, unknown>).en);
	}

	throw new Error("Seed item must include slug");
}

function resolveCityRef(
	lookup: SeedLookupCache,
	ref: TCityRef
): number {
	const countryId = lookup.getCountryId(ref.country);
	const regionId = lookup.getRegionId(countryId, ref.region);

	return lookup.getCityId(regionId, ref.city);
}

function resolveSlugList(
	lookup: SeedLookupCache,
	field: "themes" | "attractions",
	slugs: unknown[]
): number[] {
	return slugs.map((slug) => {
		if (typeof slug !== "string") {
			throw new Error(`${field} slug must be a string`);
		}

		if (field === "themes") {
			return lookup.getThemeId(slug);
		}

		const id = lookup.attractions.get(slug);

		if (id === undefined) {
			throw new Error(`Attraction not found: ${slug}`);
		}

		return id;
	});
}

function resolveEntitySlugList(
	map: Map<string, number>,
	field: string,
	slugs: unknown[]
): number[] {
	return slugs.map((slug) => {
		if (typeof slug !== "string") {
			throw new Error(`${field} slug must be a string`);
		}

		const id = map.get(slug);

		if (id === undefined) {
			throw new Error(`${field} not found: ${slug}`);
		}

		return id;
	});
}

function stripDeferredRelations(data: Record<string, unknown>): Record<string, unknown> {
	const result = { ...data };

	delete result.relatedRoutes;
	delete result.relatedExperiences;
	delete result.experiences;

	return result;
}

function toRelationshipIdList(value: unknown): number[] | undefined {
	if (!Array.isArray(value)) {
		return undefined;
	}

	return value.map((entry) => {
		if (typeof entry === "number") {
			return entry;
		}

		if (entry && typeof entry === "object" && "id" in entry) {
			const id = (entry as { id: unknown }).id;

			return typeof id === "number" ? id : undefined;
		}

		return undefined;
	}).filter((id): id is number => id !== undefined);
}

function sameIdList(left?: number[], right?: number[]): boolean {
	if (!left && !right) {
		return true;
	}

	if (!left || !right || left.length !== right.length) {
		return false;
	}

	return left.every((id, index) => id === right[index]);
}

export function createDiscoverySeeder(deps: TSeedDiscoveryDeps) {
	const routesDir = path.join(deps.contentDir, "routes");
	const experiencesDir = path.join(deps.contentDir, "experiences");

	async function listYamlFiles(dir: string): Promise<string[]> {
		try {
			return (await fs.readdir(dir))
				.filter((file) => file.endsWith(".yml"))
				.sort();
		} catch {
			return [];
		}
	}

	async function resolveExperienceSeedData(
		payload: Payload,
		lookup: SeedLookupCache,
		data: Record<string, unknown>,
		locale: TLocale,
		badgeIds: Map<string, number>,
		mediaCache: TMediaCache,
		options?: { deferRelations?: boolean }
	): Promise<Record<string, unknown>> {
		const source = options?.deferRelations
			? stripDeferredRelations(data)
			: { ...data };
		const result = { ...source };

		if (typeof result.country === "string") {
			result.country = lookup.getCountryId(result.country);
		}

		const countryId = result.country as number;

		if (typeof result.region === "string") {
			result.region = lookup.getRegionId(countryId, result.region);
		}

		if (typeof result.region === "number" && typeof result.city === "string") {
			result.city = lookup.getCityId(result.region, result.city);
		}

		if (typeof result.attraction === "string") {
			const attractionId = lookup.attractions.get(result.attraction);

			if (attractionId === undefined) {
				throw new Error(`Attraction not found: ${result.attraction}`);
			}

			result.attraction = attractionId;
		}

		if (Array.isArray(result.themes)) {
			result.themes = resolveSlugList(lookup, "themes", result.themes);
		}

		if (
			!options?.deferRelations &&
			Array.isArray(result.relatedExperiences)
		) {
			result.relatedExperiences = resolveEntitySlugList(
				lookup.experiences,
				"relatedExperiences",
				result.relatedExperiences
			);
		}

		const withBadges = deps.resolveBadgeIds(result, badgeIds);

		return deps.resolveSeedDocument(payload, mediaCache, withBadges, locale);
	}

	async function resolveRouteSeedData(
		payload: Payload,
		lookup: SeedLookupCache,
		data: Record<string, unknown>,
		locale: TLocale,
		badgeIds: Map<string, number>,
		mediaCache: TMediaCache,
		options?: { deferRelations?: boolean }
	): Promise<Record<string, unknown>> {
		const source = options?.deferRelations
			? stripDeferredRelations(data)
			: { ...data };
		const result = { ...source };

		if (Array.isArray(result.countries)) {
			result.countries = result.countries.map((slug) => {
				if (typeof slug !== "string") {
					throw new Error("Country slug must be a string");
				}

				return lookup.getCountryId(slug);
			});
		}

		if (Array.isArray(result.cityRefs)) {
			result.cities = (result.cityRefs as TCityRef[]).map((ref) =>
				resolveCityRef(lookup, ref)
			);
			delete result.cityRefs;
		}

		if (Array.isArray(result.attractions)) {
			result.attractions = resolveSlugList(
				lookup,
				"attractions",
				result.attractions
			);
		}

		if (Array.isArray(result.themes)) {
			result.themes = resolveSlugList(lookup, "themes", result.themes);
		}

		if (!options?.deferRelations && Array.isArray(result.experiences)) {
			result.experiences = resolveEntitySlugList(
				lookup.experiences,
				"experiences",
				result.experiences
			);
		}

		if (!options?.deferRelations && Array.isArray(result.relatedRoutes)) {
			result.relatedRoutes = resolveEntitySlugList(
				lookup.routes,
				"relatedRoutes",
				result.relatedRoutes
			);
		}

		const withBadges = deps.resolveBadgeIds(result, badgeIds);

		return deps.resolveSeedDocument(payload, mediaCache, withBadges, locale);
	}

	async function patchDeferredRouteRelations(
		payload: Payload,
		lookup: SeedLookupCache,
		raw: Record<string, unknown>
	): Promise<void> {
		const slug = resolveSeedSlug(raw);
		const routeId = lookup.routes.get(slug);

		if (routeId === undefined) {
			throw new Error(`Route not found for relation patch: ${slug}`);
		}

		const relatedRoutes = Array.isArray(raw.relatedRoutes)
			? resolveEntitySlugList(
					lookup.routes,
					"relatedRoutes",
					raw.relatedRoutes
				)
			: undefined;
		const experiences = Array.isArray(raw.experiences)
			? resolveEntitySlugList(
					lookup.experiences,
					"experiences",
					raw.experiences
				)
			: undefined;

		if (relatedRoutes === undefined && experiences === undefined) {
			return;
		}

		const existing = await payload.findByID({
			collection: "routes",
			id: routeId,
			depth: 0,
			overrideAccess: true
		});

		const patchData: Record<string, unknown> = {};

		if (
			relatedRoutes !== undefined &&
			!sameIdList(toRelationshipIdList(existing.relatedRoutes), relatedRoutes)
		) {
			patchData.relatedRoutes = relatedRoutes;
		}

		if (
			experiences !== undefined &&
			!sameIdList(toRelationshipIdList(existing.experiences), experiences)
		) {
			patchData.experiences = experiences;
		}

		if (Object.keys(patchData).length === 0) {
			console.log(`  patch skip routes ${slug} (relations already set)`);
			return;
		}

		await payload.update({
			collection: "routes",
			id: routeId,
			data: patchData,
			overrideAccess: true,
			context: { isSeed: true }
		});
	}

	async function patchDeferredExperienceRelations(
		payload: Payload,
		lookup: SeedLookupCache,
		raw: Record<string, unknown>
	): Promise<void> {
		const slug = resolveSeedSlug(raw);
		const experienceId = lookup.experiences.get(slug);

		if (experienceId === undefined) {
			throw new Error(`Experience not found for relation patch: ${slug}`);
		}

		if (!Array.isArray(raw.relatedExperiences)) {
			return;
		}

		const relatedExperiences = resolveEntitySlugList(
			lookup.experiences,
			"relatedExperiences",
			raw.relatedExperiences
		);

		const existing = await payload.findByID({
			collection: "experiences",
			id: experienceId,
			depth: 0,
			overrideAccess: true
		});

		if (
			sameIdList(
				toRelationshipIdList(existing.relatedExperiences),
				relatedExperiences
			)
		) {
			console.log(`  patch skip experiences ${slug} (relations already set)`);
			return;
		}

		await payload.update({
			collection: "experiences",
			id: experienceId,
			data: {
				relatedExperiences
			},
			overrideAccess: true,
			context: { isSeed: true }
		});
	}

	async function seedExperiences(
		payload: Payload,
		lookup: SeedLookupCache,
		badgeIds: Map<string, number>,
		mediaCache: TMediaCache
	): Promise<number> {
		const files = await listYamlFiles(experiencesDir);

		console.log(`Seeding experiences (${files.length})...`);

		const rawItems: Record<string, unknown>[] = [];

		for (const file of files) {
			const item = await deps.readYamlFile<Record<string, unknown>>(
				path.join(experiencesDir, file)
			);
			const slug = resolveSeedSlug(item);

			const result = await deps.seedLocalizedDoc(payload, "experiences", item, {
				published: true,
				beforeCreate: async (data, locale) =>
					resolveExperienceSeedData(
						payload,
						lookup,
						data,
						locale,
						badgeIds,
						mediaCache,
						{ deferRelations: true }
					)
			});

			lookup.registerExperience(slug, result.id as number);
			rawItems.push(item);
			console.log(`  + experience ${slug}`);
		}

		for (const item of rawItems) {
			await patchDeferredExperienceRelations(payload, lookup, item);
		}

		return files.length;
	}

	async function seedRoutes(
		payload: Payload,
		lookup: SeedLookupCache,
		badgeIds: Map<string, number>,
		mediaCache: TMediaCache
	): Promise<number> {
		const files = await listYamlFiles(routesDir);

		console.log(`Seeding routes (${files.length})...`);

		const rawItems: Record<string, unknown>[] = [];

		for (const file of files) {
			const item = await deps.readYamlFile<Record<string, unknown>>(
				path.join(routesDir, file)
			);
			const slug = resolveSeedSlug(item);

			const result = await deps.seedLocalizedDoc(payload, "routes", item, {
				published: true,
				beforeCreate: async (data, locale) =>
					resolveRouteSeedData(
						payload,
						lookup,
						data,
						locale,
						badgeIds,
						mediaCache,
						{ deferRelations: true }
					)
			});

			lookup.registerRoute(slug, result.id as number);
			rawItems.push(item);
			console.log(`  + route ${slug}`);
		}

		for (const item of rawItems) {
			await patchDeferredRouteRelations(payload, lookup, item);
		}

		return files.length;
	}

	async function seedMapPoints(
		payload: Payload,
		lookup: SeedLookupCache
	): Promise<number> {
		const filePath = path.join(deps.contentDir, "map-points.yml");

		let items: Record<string, unknown>[];

		try {
			items = await deps.readYamlFile<Record<string, unknown>[]>(filePath);
		} catch {
			console.log("Seeding map points (0)...");

			return 0;
		}

		console.log(`Seeding map points (${items.length})...`);

		for (const item of items) {
			const routeSlug = item.route;

			if (typeof routeSlug !== "string") {
				throw new Error("Map point must include route slug");
			}

			const routeId = lookup.routes.get(routeSlug);

			if (routeId === undefined) {
				throw new Error(`Route not found for map point: ${routeSlug}`);
			}

			const order = item.order;

			if (typeof order !== "number") {
				throw new Error("Map point must include numeric order");
			}

			const existing = await payload.find({
				collection: "map-points",
				where: {
					and: [
						{ route: { equals: routeId } },
						{ order: { equals: order } }
					]
				},
				limit: 1,
				depth: 0,
				overrideAccess: true
			});

			if (existing.docs[0]) {
				console.log(
					`  = map point ${routeSlug} #${String(order)} (exists)`
				);
				continue;
			}

			if (typeof item.type !== "string") {
				throw new Error("Map point must include type");
			}

			if (typeof item.latitude !== "number" || typeof item.longitude !== "number") {
				throw new Error("Map point must include latitude and longitude");
			}

			const titleEn = deps.pickLocale(item.title, "en");

			const created = await payload.create({
				collection: "map-points",
				data: {
					route: routeId,
					order,
					type: item.type as
						| "CITY"
						| "ATTRACTION"
						| "OVERNIGHT"
						| "BORDER"
						| "AIRPORT"
						| "WAYPOINT",
					latitude: item.latitude,
					longitude: item.longitude,
					...(item.city && typeof item.city === "object"
						? {
								city: resolveCityRef(lookup, item.city as TCityRef)
							}
						: {}),
					...(typeof item.attraction === "string"
						? {
								attraction: (() => {
									const attractionId = lookup.attractions.get(
										item.attraction as string
									);

									if (attractionId === undefined) {
										throw new Error(
											`Attraction not found: ${String(item.attraction)}`
										);
									}

									return attractionId;
								})()
							}
						: {}),
					title: typeof titleEn === "string" ? titleEn : undefined
				},
				locale: "en",
				overrideAccess: true,
				context: { isSeed: true }
			});

			for (const locale of LOCALES) {
				if (locale === "en") {
					continue;
				}

				const title = deps.pickLocale(item.title, locale);

				if (typeof title === "string") {
					await payload.update({
						collection: "map-points",
						id: created.id,
						data: { title },
						locale,
						overrideAccess: true,
						context: { isSeed: true }
					});
				}
			}

			console.log(
				`  + map point ${routeSlug} #${String(item.order)} (${String(item.type)})`
			);
		}

		return items.length;
	}

	async function seedRoutesHub(
		payload: Payload,
		mediaCache: TMediaCache
	): Promise<void> {
		const filePath = path.join(deps.contentDir, "routes-hub.yml");
		const raw = await deps.readYamlFile<Record<string, unknown>>(filePath);

		console.log("Seeding routes hub global...");
		await deps.updateGlobal(payload, "routes-hub", raw, mediaCache);
	}

	async function seedExperiencesHub(
		payload: Payload,
		mediaCache: TMediaCache
	): Promise<void> {
		const filePath = path.join(deps.contentDir, "experiences-hub.yml");
		const raw = await deps.readYamlFile<Record<string, unknown>>(filePath);

		console.log("Seeding experiences hub global...");
		await deps.updateGlobal(payload, "experiences-hub", raw, mediaCache);
	}

	async function seedExperienceFile(
		payload: Payload,
		lookup: SeedLookupCache,
		badgeIds: Map<string, number>,
		mediaCache: TMediaCache,
		filePath: string
	): Promise<void> {
		const item = await deps.readYamlFile<Record<string, unknown>>(filePath);
		const slug = resolveSeedSlug(item);

		const result = await deps.seedLocalizedDoc(payload, "experiences", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolveExperienceSeedData(
					payload,
					lookup,
					data,
					locale,
					badgeIds,
					mediaCache,
					{ deferRelations: true }
				)
		});

		lookup.registerExperience(slug, result.id as number);
	}

	async function patchExperienceFile(
		payload: Payload,
		lookup: SeedLookupCache,
		filePath: string
	): Promise<void> {
		const item = await deps.readYamlFile<Record<string, unknown>>(filePath);
		await patchDeferredExperienceRelations(payload, lookup, item);
	}

	async function seedRouteFile(
		payload: Payload,
		lookup: SeedLookupCache,
		badgeIds: Map<string, number>,
		mediaCache: TMediaCache,
		filePath: string
	): Promise<void> {
		const item = await deps.readYamlFile<Record<string, unknown>>(filePath);
		const slug = resolveSeedSlug(item);

		const result = await deps.seedLocalizedDoc(payload, "routes", item, {
			published: true,
			beforeCreate: async (data, locale) =>
				resolveRouteSeedData(
					payload,
					lookup,
					data,
					locale,
					badgeIds,
					mediaCache,
					{ deferRelations: true }
				)
		});

		lookup.registerRoute(slug, result.id as number);
	}

	async function patchRouteFile(
		payload: Payload,
		lookup: SeedLookupCache,
		filePath: string
	): Promise<void> {
		const item = await deps.readYamlFile<Record<string, unknown>>(filePath);
		await patchDeferredRouteRelations(payload, lookup, item);
	}

	async function seedMapPointEntry(
		payload: Payload,
		lookup: SeedLookupCache,
		item: Record<string, unknown>
	): Promise<void> {
		const routeSlug = item.route;

		if (typeof routeSlug !== "string") {
			throw new Error("Map point must include route slug");
		}

		const routeId = lookup.routes.get(routeSlug);

		if (routeId === undefined) {
			throw new Error(`Route not found for map point: ${routeSlug}`);
		}

		const order = item.order;

		if (typeof order !== "number") {
			throw new Error("Map point must include numeric order");
		}

		const existing = await payload.find({
			collection: "map-points",
			where: {
				and: [{ route: { equals: routeId } }, { order: { equals: order } }]
			},
			limit: 1,
			depth: 0,
			overrideAccess: true
		});

		if (existing.docs[0]) {
			console.log(`  exists map point ${routeSlug} #${String(order)}`);
			return;
		}

		if (typeof item.type !== "string") {
			throw new Error("Map point must include type");
		}

		if (
			typeof item.latitude !== "number" ||
			typeof item.longitude !== "number"
		) {
			throw new Error("Map point must include latitude and longitude");
		}

		const titleEn = deps.pickLocale(item.title, "en");

		const created = await payload.create({
			collection: "map-points",
			data: {
				route: routeId,
				order,
				type: item.type as
					| "CITY"
					| "ATTRACTION"
					| "OVERNIGHT"
					| "BORDER"
					| "AIRPORT"
					| "WAYPOINT",
				latitude: item.latitude,
				longitude: item.longitude,
				...(item.city && typeof item.city === "object"
					? {
							city: resolveCityRef(lookup, item.city as TCityRef)
						}
					: {}),
				...(typeof item.attraction === "string"
					? {
							attraction: (() => {
								const attractionId = lookup.attractions.get(
									item.attraction as string
								);

								if (attractionId === undefined) {
									throw new Error(
										`Attraction not found: ${String(item.attraction)}`
									);
								}

								return attractionId;
							})()
						}
					: {}),
				title: typeof titleEn === "string" ? titleEn : undefined
			},
			locale: "en",
			overrideAccess: true,
			context: { isSeed: true }
		});

		for (const locale of LOCALES) {
			if (locale === "en") {
				continue;
			}

			const title = deps.pickLocale(item.title, locale);

			if (typeof title === "string") {
				await payload.update({
					collection: "map-points",
					id: created.id,
					data: { title },
					locale,
					overrideAccess: true,
					context: { isSeed: true }
				});
			}
		}
	}

	return {
		seedExperiences,
		seedRoutes,
		seedMapPoints,
		seedRoutesHub,
		seedExperiencesHub,
		seedExperienceFile,
		seedRouteFile,
		patchExperienceFile,
		patchRouteFile,
		seedMapPointEntry
	};
}
