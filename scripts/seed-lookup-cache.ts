import type { Payload } from "payload";

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
	readonly themes = new Map<string, number>();
	readonly routes = new Map<string, number>();
	readonly experiences = new Map<string, number>();

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
			if (typeof doc.slug === "string") {
				this.attractions.set(doc.slug, doc.id as number);
			}
		}
	}

	ingestSegments(segmentIds: Map<string, number>): void {
		for (const [slug, id] of segmentIds) {
			this.segments.set(slug, id);
		}
	}

	registerCountry(doc: TCountryCardSource): void {
		this.countries.set(doc.slug, doc.id);
		this.countryCards.set(doc.slug, doc);
	}

	registerRegion(countryId: number, slug: string, id: number): void {
		this.regions.set(`${countryId}:${slug}`, id);
	}

	registerCity(regionId: number, slug: string, id: number): void {
		this.cities.set(`${regionId}:${slug}`, id);
	}

	registerAttraction(slug: string, id: number): void {
		this.attractions.set(slug, id);
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

	getCountryCard(countrySlug: string): TCountryCardSource {
		const country = this.countryCards.get(countrySlug);

		if (!country) {
			throw new Error(`Country card not found in lookup cache: ${countrySlug}`);
		}

		return country;
	}
}
