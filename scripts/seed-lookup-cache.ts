import type { Payload } from "payload";

import { buildNavigationGeoPath } from "@/shared/lib/routing/build-navigation-geo-path";
import type { Country } from "@/payload-types";

type TCountryCardSource = Pick<
	Country,
	"id" | "slug" | "heroImage" | "subtitle" | "title" | "excerpt"
>;

export class SeedLookupCache {
	readonly countries = new Map<string, number>();
	readonly countryCards = new Map<string, TCountryCardSource>();
	readonly regions = new Map<string, number>();
	readonly cities = new Map<string, number>();
	readonly segments = new Map<string, number>();
	readonly attractions = new Map<string, number>();
	private readonly countrySlugById = new Map<number, string>();
	private readonly regionMetaById = new Map<
		number,
		{ countryId: number; slug: string }
	>();
	private readonly cityMetaById = new Map<
		number,
		{ regionId: number; slug: string }
	>();
	private readonly attractionCityBySlug = new Map<string, number>();
	readonly themes = new Map<string, number>();
	readonly routes = new Map<string, number>();
	readonly experiences = new Map<string, number>();
	readonly tradeFairs = new Map<string, number>();
	readonly blog = new Map<string, number>();
	readonly news = new Map<string, number>();

	async ingestCountries(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "countries",
			locale: "en",
			limit: 200,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			if (typeof doc.slug !== "string") {
				continue;
			}

			this.countries.set(doc.slug, doc.id as number);
			this.countrySlugById.set(doc.id as number, doc.slug);
			this.countryCards.set(doc.slug, {
				id: doc.id as number,
				slug: doc.slug,
				heroImage: doc.heroImage,
				subtitle: doc.subtitle,
				title: doc.title,
				excerpt: doc.excerpt
			});
		}
	}

	async ingestRegions(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "regions",
			locale: "en",
			limit: 500,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			const countryId =
				typeof doc.country === "number" ? doc.country : null;
			const slug = typeof doc.slug === "string" ? doc.slug : null;

			if (countryId && slug) {
				this.regions.set(`${countryId}:${slug}`, doc.id as number);
				this.regionMetaById.set(doc.id as number, {
					countryId,
					slug
				});
			}
		}
	}

	async ingestCities(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "cities",
			locale: "en",
			limit: 500,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			const regionId = typeof doc.region === "number" ? doc.region : null;
			const slug = typeof doc.slug === "string" ? doc.slug : null;

			if (regionId && slug) {
				this.cities.set(`${regionId}:${slug}`, doc.id as number);
				this.cityMetaById.set(doc.id as number, { regionId, slug });
			}
		}
	}

	async ingestAttractions(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "attractions",
			locale: "en",
			limit: 500,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			if (typeof doc.slug !== "string") {
				continue;
			}

			this.attractions.set(doc.slug, doc.id as number);
			const cityId = this.toRelId(doc.city);

			if (cityId !== undefined) {
				this.attractionCityBySlug.set(doc.slug, cityId);
			}
		}
	}

	ingestSegments(segmentIds: Map<string, number>): void {
		for (const [slug, id] of segmentIds) {
			this.segments.set(slug, id);
		}
	}

	async ingestSegmentsFromDb(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "segments",
			locale: "en",
			limit: 50,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			if (typeof doc.slug === "string") {
				this.segments.set(doc.slug, doc.id as number);
			}
		}
	}

	registerCountry(doc: TCountryCardSource): void {
		this.countries.set(doc.slug, doc.id);
		this.countrySlugById.set(doc.id, doc.slug);
		this.countryCards.set(doc.slug, doc);
	}

	registerRegion(countryId: number, slug: string, id: number): void {
		this.regions.set(`${countryId}:${slug}`, id);
		this.regionMetaById.set(id, { countryId, slug });
	}

	registerCity(regionId: number, slug: string, id: number): void {
		this.cities.set(`${regionId}:${slug}`, id);
		this.cityMetaById.set(id, { regionId, slug });
	}

	registerAttraction(slug: string, id: number, cityId?: number): void {
		this.attractions.set(slug, id);

		if (cityId !== undefined) {
			this.attractionCityBySlug.set(slug, cityId);
		}
	}

	registerTheme(slug: string, id: number): void {
		this.themes.set(slug, id);
	}

	registerRoute(slug: string, id: number): void {
		this.routes.set(slug, id);
	}

	registerExperience(slug: string, id: number): void {
		this.experiences.set(slug, id);
	}

	registerTradeFair(slug: string, id: number): void {
		this.tradeFairs.set(slug, id);
	}

	registerBlog(slug: string, id: number): void {
		this.blog.set(slug, id);
	}

	registerNews(slug: string, id: number): void {
		this.news.set(slug, id);
	}

	getDiscoveryDocId(collection: string, slug: string): number {
		const maps: Record<string, Map<string, number>> = {
			routes: this.routes,
			experiences: this.experiences,
			"trade-fairs": this.tradeFairs,
			blog: this.blog,
			news: this.news
		};
		const map = maps[collection];

		if (!map) {
			throw new Error(`Unsupported discovery collection: ${collection}`);
		}

		const id = map.get(slug);

		if (id === undefined) {
			throw new Error(`${collection} not found in lookup cache: ${slug}`);
		}

		return id;
	}

	async ingestThemes(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "themes",
			locale: "en",
			limit: 200,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			if (typeof doc.slug === "string") {
				this.themes.set(doc.slug, doc.id as number);
			}
		}
	}

	async ingestRoutes(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "routes",
			locale: "en",
			limit: 500,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			if (typeof doc.slug === "string") {
				this.routes.set(doc.slug, doc.id as number);
			}
		}
	}

	async ingestExperiences(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "experiences",
			locale: "en",
			limit: 500,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			if (typeof doc.slug === "string") {
				this.experiences.set(doc.slug, doc.id as number);
			}
		}
	}

	async ingestTradeFairs(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "trade-fairs",
			locale: "en",
			limit: 500,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			if (typeof doc.slug === "string") {
				this.tradeFairs.set(doc.slug, doc.id as number);
			}
		}
	}

	async ingestBlog(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "blog",
			locale: "en",
			limit: 500,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			if (typeof doc.slug === "string") {
				this.blog.set(doc.slug, doc.id as number);
			}
		}
	}

	async ingestNews(payload: Payload): Promise<void> {
		const result = await payload.find({
			collection: "news",
			locale: "en",
			limit: 500,
			depth: 0,
			overrideAccess: true
		});

		for (const doc of result.docs) {
			if (typeof doc.slug === "string") {
				this.news.set(doc.slug, doc.id as number);
			}
		}
	}

	getCountryId(slug: string): number {
		const id = this.countries.get(slug);

		if (id === undefined) {
			throw new Error(`Country not found in lookup cache: ${slug}`);
		}

		return id;
	}

	getRegionId(countryId: number, slug: string): number {
		const id = this.regions.get(`${countryId}:${slug}`);

		if (id === undefined) {
			throw new Error(
				`Region not found in lookup cache: ${slug} (country id: ${countryId})`
			);
		}

		return id;
	}

	getCityId(regionId: number, slug: string): number {
		const id = this.cities.get(`${regionId}:${slug}`);

		if (id === undefined) {
			throw new Error(
				`City not found in lookup cache: ${slug} (region id: ${regionId})`
			);
		}

		return id;
	}

	getThemeId(slug: string): number {
		const id = this.themes.get(slug);

		if (id === undefined) {
			throw new Error(`Theme not found in lookup cache: ${slug}`);
		}

		return id;
	}

	getSegmentId(slug: string): number {
		const id = this.segments.get(slug);

		if (id === undefined) {
			throw new Error(`Segment not found in lookup cache: ${slug}`);
		}

		return id;
	}

	getRouteMapEntityId(
		entityType: "country" | "region" | "city" | "attraction",
		entitySlug: string
	): number {
		if (entityType === "country") {
			return this.getCountryId(entitySlug);
		}

		if (entityType === "attraction") {
			const id = this.attractions.get(entitySlug);

			if (id === undefined) {
				throw new Error(
					`Attraction not found in lookup cache: ${entitySlug}`
				);
			}

			return id;
		}

		if (entityType === "region") {
			for (const [key, id] of this.regions) {
				if (key.endsWith(`:${entitySlug}`)) {
					return id;
				}
			}

			throw new Error(`Region not found in lookup cache: ${entitySlug}`);
		}

		for (const [key, id] of this.cities) {
			if (key.endsWith(`:${entitySlug}`)) {
				return id;
			}
		}

		throw new Error(`City not found in lookup cache: ${entitySlug}`);
	}

	getGeoHref(
		entityType: "country" | "region" | "city" | "attraction",
		entitySlug: string,
		navigationRootSlug: string
	): string {
		return buildNavigationGeoPath(
			navigationRootSlug,
			this.getGeoPathSegments(entityType, entitySlug)
		);
	}

	private toRelId(value: unknown): number | undefined {
		if (typeof value === "number") {
			return value;
		}

		if (value && typeof value === "object" && "id" in value) {
			const id = (value as { id: unknown }).id;

			return typeof id === "number" ? id : undefined;
		}

		return undefined;
	}

	private getGeoPathSegments(
		entityType: "country" | "region" | "city" | "attraction",
		entitySlug: string
	): string[] {
		if (entityType === "country") {
			this.getCountryId(entitySlug);

			return [entitySlug];
		}

		if (entityType === "region") {
			for (const meta of this.regionMetaById.values()) {
				if (meta.slug === entitySlug) {
					const countrySlug = this.countrySlugById.get(meta.countryId);

					if (!countrySlug) {
						throw new Error(
							`Country slug missing for region: ${entitySlug}`
						);
					}

					return [countrySlug, entitySlug];
				}
			}

			throw new Error(`Region not found in lookup cache: ${entitySlug}`);
		}

		if (entityType === "city") {
			for (const meta of this.cityMetaById.values()) {
				if (meta.slug === entitySlug) {
					const region = this.regionMetaById.get(meta.regionId);

					if (!region) {
						throw new Error(
							`Region missing for city: ${entitySlug}`
						);
					}

					const countrySlug = this.countrySlugById.get(
						region.countryId
					);

					if (!countrySlug) {
						throw new Error(
							`Country slug missing for city: ${entitySlug}`
						);
					}

					return [countrySlug, region.slug, entitySlug];
				}
			}

			throw new Error(`City not found in lookup cache: ${entitySlug}`);
		}

		const cityId = this.attractionCityBySlug.get(entitySlug);

		if (cityId === undefined) {
			throw new Error(
				`Attraction city missing in lookup cache: ${entitySlug}`
			);
		}

		const city = this.cityMetaById.get(cityId);

		if (!city) {
			throw new Error(`City missing for attraction: ${entitySlug}`);
		}

		const region = this.regionMetaById.get(city.regionId);

		if (!region) {
			throw new Error(`Region missing for attraction: ${entitySlug}`);
		}

		const countrySlug = this.countrySlugById.get(region.countryId);

		if (!countrySlug) {
			throw new Error(
				`Country slug missing for attraction: ${entitySlug}`
			);
		}

		return [countrySlug, region.slug, city.slug, entitySlug];
	}

	getCountryCard(countrySlug: string): TCountryCardSource {
		const country = this.countryCards.get(countrySlug);

		if (!country) {
			throw new Error(`Country card not found in lookup cache: ${countrySlug}`);
		}

		return country;
	}
}
