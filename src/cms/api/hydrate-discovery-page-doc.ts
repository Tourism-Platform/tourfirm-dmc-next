import type { CollectionSlug, getPayload } from "payload";
import "server-only";

import { toGeoLocale } from "./geo-locale";
import { hydrateGeoPageDoc } from "./hydrate-geo-page-doc";

type TPayload = Awaited<ReturnType<typeof getPayload>>;

type TLeanMedia = {
	id: number;
	url?: string | null;
	alt?: string | null;
	width?: number | null;
	height?: number | null;
	filename?: string | null;
};

const SINGLE_RELATIONS = [
	"country",
	"city",
	"region",
	"attraction",
	"heroImage",
	"coverImage"
] as const;

const MANY_RELATIONS: { field: string; collection: CollectionSlug }[] = [
	{ field: "themes", collection: "themes" },
	{ field: "countries", collection: "countries" },
	{ field: "cities", collection: "cities" },
	{ field: "attractions", collection: "attractions" },
	{ field: "experiences", collection: "experiences" },
	{ field: "relatedExperiences", collection: "experiences" },
	{ field: "relatedRoutes", collection: "routes" },
	{ field: "relatedCountries", collection: "countries" },
	{ field: "relatedCities", collection: "cities" },
	{ field: "gallery", collection: "media" },
	{ field: "badges", collection: "badges" }
];

const FIELD_COLLECTION: Record<string, CollectionSlug> = {
	country: "countries",
	city: "cities",
	region: "regions",
	attraction: "attractions",
	heroImage: "media",
	coverImage: "media"
};

const LEAN_SELECT: Record<string, Record<string, true>> = {
	media: {
		id: true,
		url: true,
		alt: true,
		width: true,
		height: true,
		filename: true
	},
	themes: { id: true, title: true, slug: true },
	badges: { id: true, title: true },
	countries: {
		id: true,
		slug: true,
		title: true,
		subtitle: true,
		excerpt: true,
		heroImage: true
	},
	regions: {
		id: true,
		slug: true,
		title: true,
		subtitle: true,
		excerpt: true,
		heroImage: true
	},
	cities: {
		id: true,
		slug: true,
		title: true,
		subtitle: true,
		excerpt: true,
		heroImage: true,
		country: true
	},
	attractions: {
		id: true,
		slug: true,
		title: true,
		subtitle: true,
		excerpt: true,
		heroImage: true
	},
	experiences: {
		id: true,
		slug: true,
		title: true,
		excerpt: true,
		type: true,
		heroImage: true,
		country: true,
		city: true,
		themes: true
	},
	routes: {
		id: true,
		slug: true,
		title: true,
		excerpt: true,
		heroImage: true,
		durationDays: true,
		countries: true,
		themes: true
	}
};

export const DISCOVERY_PAGE_DEPTH = 0 as const;

const DISCOVERY_COMMON_SELECT = {
	id: true,
	slug: true,
	title: true,
	excerpt: true,
	content: true,
	heroImage: true,
	blocks: true,
	seo: true
} as const;

const DISCOVERY_SELECT_BY_COLLECTION: Record<string, Record<string, true>> = {
	experiences: {
		...DISCOVERY_COMMON_SELECT,
		subtitle: true,
		type: true,
		duration: true,
		themes: true,
		country: true,
		city: true,
		region: true,
		attraction: true,
		relatedExperiences: true,
		gallery: true,
		badges: true,
		catalogQuery: true
	},
	routes: {
		...DISCOVERY_COMMON_SELECT,
		subtitle: true,
		durationDays: true,
		themes: true,
		countries: true,
		cities: true,
		attractions: true,
		experiences: true,
		relatedRoutes: true,
		gallery: true,
		badges: true,
		catalogQuery: true
	},
	blog: {
		...DISCOVERY_COMMON_SELECT,
		subtitle: true,
		coverImage: true,
		cardMeta: true,
		publishDate: true,
		badges: true,
		relatedCountries: true,
		relatedCities: true,
		relatedRoutes: true
	},
	news: {
		...DISCOVERY_COMMON_SELECT,
		publishDate: true,
		categories: true
	},
	"trade-fairs": {
		...DISCOVERY_COMMON_SELECT,
		stand: true,
		countryName: true,
		participants: true,
		gallery: true,
		badges: true
	}
};

export function getDiscoveryPageSelect(
	collection: string
): Record<string, true> {
	return (
		DISCOVERY_SELECT_BY_COLLECTION[collection] ?? DISCOVERY_COMMON_SELECT
	);
}

export const DISCOVERY_DOCUMENT_CACHE_VERSION = "lean-v1" as const;

function relationIds(value: unknown): number[] {
	if (typeof value === "number") {
		return [value];
	}

	if (Array.isArray(value)) {
		return value.filter((item): item is number => typeof item === "number");
	}

	if (value && typeof value === "object" && "docs" in value) {
		const docs = (value as { docs?: unknown[] }).docs ?? [];
		return docs
			.map((doc) =>
				typeof doc === "number"
					? doc
					: doc && typeof doc === "object" && "id" in doc
						? Number((doc as { id: unknown }).id)
						: null
			)
			.filter((id): id is number => typeof id === "number" && id > 0);
	}

	return [];
}

async function fetchByIds(
	payload: TPayload,
	collection: CollectionSlug,
	locale: string,
	ids: number[]
): Promise<Map<number, Record<string, unknown>>> {
	const unique = [...new Set(ids)].filter((id) => id > 0);
	const map = new Map<number, Record<string, unknown>>();

	if (unique.length === 0) {
		return map;
	}

	const result = await payload.find({
		collection,
		locale: toGeoLocale(locale),
		fallbackLocale: "en",
		depth: 0,
		limit: unique.length,
		pagination: false,
		select: LEAN_SELECT[collection] ?? {
			id: true,
			slug: true,
			title: true
		},
		where: { id: { in: unique } }
	});

	for (const doc of result.docs) {
		const id = Number((doc as { id?: unknown }).id);
		if (id > 0) {
			map.set(id, doc as unknown as Record<string, unknown>);
		}
	}

	return map;
}

function patchValue(
	value: unknown,
	byId: Map<number, Record<string, unknown>>
): unknown {
	if (typeof value === "number") {
		return byId.get(value) ?? value;
	}

	if (Array.isArray(value)) {
		return value.map((item) => patchValue(item, byId));
	}

	if (value && typeof value === "object" && "docs" in value) {
		const docs = (value as { docs?: unknown[] }).docs ?? [];
		return {
			...value,
			docs: docs.map((item) => patchValue(item, byId))
		};
	}

	return value;
}

function collectMediaIdsFromDoc(doc: Record<string, unknown>): number[] {
	const ids: number[] = [];

	for (const field of ["heroImage", "coverImage"] as const) {
		if (typeof doc[field] === "number") {
			ids.push(doc[field] as number);
		}
	}

	const gallery = doc.gallery;
	if (Array.isArray(gallery)) {
		for (const item of gallery) {
			if (typeof item === "number") {
				ids.push(item);
			}
		}
	}

	return ids;
}

function collectNestedMediaIds(docs: Record<string, unknown>[]): number[] {
	const ids: number[] = [];

	for (const doc of docs) {
		ids.push(...collectMediaIdsFromDoc(doc));
	}

	return ids;
}

/**
 * Depth 0 collection docs keep relations as IDs.
 * Hydrate only card/meta/block media needed for SSR — not nested geo blocks.
 */
export async function hydrateDiscoveryPageDoc(
	payload: TPayload,
	locale: string,
	collection: string,
	doc: Record<string, unknown>
): Promise<Record<string, unknown>> {
	const withBlocks = await hydrateGeoPageDoc(payload, locale, doc);
	const next: Record<string, unknown> = { ...withBlocks };

	if (collection === "experiences" && typeof next.id === "number") {
		const routes = await payload.find({
			collection: "routes",
			locale: toGeoLocale(locale),
			fallbackLocale: "en",
			depth: 0,
			limit: 12,
			pagination: false,
			select: LEAN_SELECT.routes,
			where: {
				and: [
					{ _status: { equals: "published" } },
					{ experiences: { contains: next.id } }
				]
			}
		});
		next.relatedRoutes = {
			docs: routes.docs,
			hasNextPage: false,
			totalDocs: routes.docs.length
		};
	}

	const needed = new Map<CollectionSlug, Set<number>>();

	function add(collectionSlug: CollectionSlug, ids: number[]) {
		if (ids.length === 0) {
			return;
		}
		const set = needed.get(collectionSlug) ?? new Set<number>();
		for (const id of ids) {
			set.add(id);
		}
		needed.set(collectionSlug, set);
	}

	for (const field of SINGLE_RELATIONS) {
		const collectionSlug = FIELD_COLLECTION[field];
		if (!collectionSlug) {
			continue;
		}
		add(collectionSlug, relationIds(next[field]));
	}

	for (const { field, collection: collectionSlug } of MANY_RELATIONS) {
		add(collectionSlug, relationIds(next[field]));
	}

	const fetched = new Map<
		CollectionSlug,
		Map<number, Record<string, unknown>>
	>();

	await Promise.all(
		[...needed.entries()].map(async ([collectionSlug, ids]) => {
			fetched.set(
				collectionSlug,
				await fetchByIds(payload, collectionSlug, locale, [...ids])
			);
		})
	);

	const relatedDocs: Record<string, unknown>[] = [];
	for (const map of fetched.values()) {
		relatedDocs.push(...map.values());
	}

	if (
		next.relatedRoutes &&
		typeof next.relatedRoutes === "object" &&
		"docs" in next.relatedRoutes
	) {
		relatedDocs.push(
			...(((next.relatedRoutes as { docs?: Record<string, unknown>[] })
				.docs ?? []) as Record<string, unknown>[])
		);
	}

	const nestedNeeded = new Map<CollectionSlug, Set<number>>();

	function addNested(collectionSlug: CollectionSlug, ids: number[]) {
		if (ids.length === 0) {
			return;
		}
		const existing = fetched.get(collectionSlug);
		const set = nestedNeeded.get(collectionSlug) ?? new Set<number>();
		for (const id of ids) {
			if (!existing?.has(id)) {
				set.add(id);
			}
		}
		if (set.size > 0) {
			nestedNeeded.set(collectionSlug, set);
		}
	}

	for (const related of relatedDocs) {
		addNested("countries", relationIds(related.country));
		addNested("countries", relationIds(related.countries));
		addNested("cities", relationIds(related.city));
		addNested("themes", relationIds(related.themes));
		addNested("attractions", relationIds(related.attraction));
	}

	await Promise.all(
		[...nestedNeeded.entries()].map(async ([collectionSlug, ids]) => {
			const extra = await fetchByIds(payload, collectionSlug, locale, [
				...ids
			]);
			const current =
				fetched.get(collectionSlug) ??
				new Map<number, Record<string, unknown>>();
			for (const [id, doc] of extra) {
				current.set(id, doc);
			}
			fetched.set(collectionSlug, current);
			relatedDocs.push(...extra.values());
		})
	);

	const mediaIds = [
		...collectMediaIdsFromDoc(next),
		...collectNestedMediaIds(relatedDocs)
	];
	const mediaMap = await fetchByIds(payload, "media", locale, mediaIds);

	function withMedia(doc: Record<string, unknown>): Record<string, unknown> {
		const patched = { ...doc };
		for (const field of ["heroImage", "coverImage"] as const) {
			if (typeof patched[field] === "number") {
				patched[field] =
					mediaMap.get(patched[field] as number) ?? patched[field];
			}
		}
		if (Array.isArray(patched.gallery)) {
			patched.gallery = patched.gallery.map((item) =>
				typeof item === "number" ? (mediaMap.get(item) ?? item) : item
			);
		}
		return patched;
	}

	for (const map of fetched.values()) {
		for (const [id, related] of map) {
			map.set(id, withMedia(related));
		}
	}

	for (const field of SINGLE_RELATIONS) {
		const collectionSlug = FIELD_COLLECTION[field];
		if (!collectionSlug) {
			continue;
		}
		if (collectionSlug === "media") {
			next[field] = patchValue(next[field], mediaMap);
			continue;
		}
		const map = fetched.get(collectionSlug);
		if (map) {
			next[field] = patchValue(next[field], map);
		}
	}

	for (const { field, collection: collectionSlug } of MANY_RELATIONS) {
		if (collectionSlug === "media") {
			next[field] = patchValue(next[field], mediaMap);
			continue;
		}
		const map = fetched.get(collectionSlug);
		if (map) {
			next[field] = patchValue(next[field], map);
		}
	}

	function patchNestedCard(
		doc: Record<string, unknown>
	): Record<string, unknown> {
		const patched = withMedia({ ...doc });
		const countryMap = fetched.get("countries");
		const cityMap = fetched.get("cities");
		const themeMap = fetched.get("themes");
		if (countryMap) {
			patched.country = patchValue(patched.country, countryMap);
			patched.countries = patchValue(patched.countries, countryMap);
		}
		if (cityMap) {
			patched.city = patchValue(patched.city, cityMap);
		}
		if (themeMap) {
			patched.themes = patchValue(patched.themes, themeMap);
		}
		return patched;
	}

	if (
		next.relatedRoutes &&
		typeof next.relatedRoutes === "object" &&
		"docs" in next.relatedRoutes
	) {
		const join = next.relatedRoutes as { docs?: Record<string, unknown>[] };
		next.relatedRoutes = {
			...join,
			docs: (join.docs ?? []).map((doc) => patchNestedCard(doc))
		};
	}

	for (const field of [
		"relatedExperiences",
		"experiences",
		"relatedRoutes"
	] as const) {
		if (!Array.isArray(next[field])) {
			continue;
		}
		next[field] = (next[field] as Record<string, unknown>[]).map((item) =>
			item && typeof item === "object" ? patchNestedCard(item) : item
		);
	}

	return withMedia(next);
}
