import { ENUM_PATH } from "@/shared/config";
import { resolveMediaUrl } from "@/shared/lib/media/resolve-media-url";
import {
	buildAttractionHref,
	buildCityHref,
	buildCountryHref
} from "@/shared/lib/routing/build-geo-entity-href";

import { richTextToPlain } from "./rich-text-to-plain";
import type {
	Attraction,
	City,
	Country,
	Experience,
	Route,
	Theme
} from "@/payload-types";

export type TRouteCardData = {
	href: string;
	imageUrl: string;
	badge: string;
	meta: string;
	title: string;
	description: string;
	countries: string[];
	themes: string[];
};

export type TExperienceCardData = {
	href: string;
	imageUrl: string;
	badge: string;
	title: string;
	description: string;
	type?: string;
	location: string;
	themes: string[];
};

export type TGeoCardData = {
	href: string;
	imageUrl: string;
	badge: string;
	title: string;
	description: string;
};

const EXPERIENCE_TYPE_LABELS: Record<string, string> = {
	WORKSHOP: "Workshop",
	MASTERCLASS: "Masterclass",
	TASTING: "Tasting",
	GUIDED_TOUR: "Guided tour",
	FOOD_EXPERIENCE: "Food experience",
	CULTURAL_EVENT: "Cultural event",
	PERFORMANCE: "Performance",
	OUTDOOR_ACTIVITY: "Outdoor activity",
	ADVENTURE_ACTIVITY: "Adventure activity",
	WELLNESS_ACTIVITY: "Wellness activity",
	STAY_EXPERIENCE: "Stay experience"
};

function mapThemes(themes: (number | Theme)[] | null | undefined): string[] {
	return (
		themes
			?.map((theme) =>
				typeof theme === "object" ? theme.title : undefined
			)
			.filter((title): title is string => Boolean(title)) ?? []
	);
}

function mapCountries(
	countries: (number | Country)[] | null | undefined
): string[] {
	return (
		countries
			?.map((country) =>
				typeof country === "object" ? country.title : undefined
			)
			.filter((title): title is string => Boolean(title)) ?? []
	);
}

function formatDurationDays(durationDays?: number | null): string {
	if (!durationDays) {
		return "";
	}

	return durationDays === 1 ? "1 day" : `${durationDays} days`;
}

export function mapRouteToCard(route: Route): TRouteCardData {
	const countries = mapCountries(route.countries);
	const themes = mapThemes(route.themes);
	const duration = formatDurationDays(route.durationDays);
	const meta = [duration, countries.join(" · ")].filter(Boolean).join(" · ");

	return {
		href: ENUM_PATH.DISCOVERY.routeDetail(route.slug),
		imageUrl: resolveMediaUrl(route.heroImage),
		badge: themes[0] ?? "Route",
		meta,
		title: route.title,
		description:
			route.excerpt ?? richTextToPlain(route.content).slice(0, 180),
		countries,
		themes
	};
}

export type TTradeFairCardData = {
	href: string;
	imageUrl: string;
	title: string;
	stand: string;
	country: string;
	participants: string;
};

export type TBlogCardData = {
	href: string;
	imageUrl: string;
	meta: string;
	title: string;
};

export type TNewsCardData = {
	href: string;
	imageUrl: string;
	meta: string;
	title: string;
};

function formatCardMeta(
	publishDate?: string | null,
	cardMeta?: string | null
): string {
	if (cardMeta) {
		return cardMeta;
	}

	if (!publishDate) {
		return "";
	}

	return new Date(publishDate).toLocaleDateString("en", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}

export function mapTradeFairToCard(
	tradeFair: import("@/payload-types").TradeFair
): TTradeFairCardData {
	return {
		href: ENUM_PATH.COMPANY.tradeFairDetail(tradeFair.slug),
		imageUrl: resolveMediaUrl(tradeFair.heroImage),
		title: tradeFair.title,
		stand: tradeFair.stand ?? "",
		country: tradeFair.countryName ?? "",
		participants: tradeFair.participants ?? ""
	};
}

export function mapBlogToCard(
	blog: import("@/payload-types").Blog
): TBlogCardData {
	return {
		href: ENUM_PATH.DISCOVERY.blogDetail(blog.slug),
		imageUrl: resolveMediaUrl(blog.coverImage),
		meta: formatCardMeta(blog.publishDate, blog.cardMeta),
		title: blog.title
	};
}

export function mapNewsToCard(
	news: import("@/payload-types").News
): TNewsCardData {
	const firstCategory = news.categories?.[0];
	const categoryLabel =
		firstCategory &&
		typeof firstCategory === "object" &&
		"category" in firstCategory &&
		typeof firstCategory.category === "string"
			? firstCategory.category
			: undefined;
	const dateLabel = formatCardMeta(news.publishDate, null);
	const meta = [categoryLabel, dateLabel].filter(Boolean).join(" · ");

	return {
		href: ENUM_PATH.COMPANY.newsDetail(news.slug),
		imageUrl: resolveMediaUrl(news.heroImage),
		meta,
		title: news.title
	};
}

export function mapExperienceToCard(
	experience: Experience
): TExperienceCardData {
	const country =
		typeof experience.country === "object" ? experience.country.title : "";
	const city =
		typeof experience.city === "object"
			? experience.city?.title
			: undefined;
	const location = [city, country].filter(Boolean).join(", ");
	const typeLabel = experience.type
		? (EXPERIENCE_TYPE_LABELS[experience.type] ?? experience.type)
		: undefined;

	return {
		href: ENUM_PATH.DISCOVERY.experienceDetail(experience.slug),
		imageUrl: resolveMediaUrl(experience.heroImage),
		badge: typeLabel ?? mapThemes(experience.themes)[0] ?? "Experience",
		title: experience.title,
		description:
			experience.excerpt ??
			richTextToPlain(experience.content).slice(0, 180),
		type: typeLabel,
		location,
		themes: mapThemes(experience.themes)
	};
}

export function mapCountryToGeoCard(
	country: Country,
	navigationRootSlug: string
): TGeoCardData {
	return {
		href: buildCountryHref(navigationRootSlug, country),
		imageUrl: resolveMediaUrl(country.heroImage),
		badge: country.subtitle ?? "Country",
		title: country.title,
		description:
			country.excerpt ?? richTextToPlain(country.content).slice(0, 140)
	};
}

export function mapCityToGeoCard(
	city: City,
	navigationRootSlug: string
): TGeoCardData {
	const country =
		typeof city.country === "object" ? city.country.title : undefined;

	return {
		href: buildCityHref(navigationRootSlug, city),
		imageUrl: resolveMediaUrl(city.heroImage),
		badge: country ?? "City",
		title: city.title,
		description: city.excerpt ?? richTextToPlain(city.content).slice(0, 140)
	};
}

export function mapAttractionToGeoCard(
	attraction: Attraction,
	navigationRootSlug: string
): TGeoCardData {
	return {
		href: buildAttractionHref(navigationRootSlug, attraction),
		imageUrl: resolveMediaUrl(attraction.heroImage),
		badge: attraction.type ?? "Attraction",
		title: attraction.title,
		description:
			attraction.excerpt ??
			richTextToPlain(attraction.content).slice(0, 140)
	};
}

export function buildCatalogHref(catalogQuery?: string | null): string {
	if (!catalogQuery?.trim()) {
		return ENUM_PATH.MAIN.CATALOG;
	}

	const query = catalogQuery.startsWith("?")
		? catalogQuery
		: `?${catalogQuery}`;

	return `${ENUM_PATH.MAIN.CATALOG}${query}`;
}

export function extractMapPoints(route: Route) {
	const docs = route.mapPoints?.docs;

	if (!docs?.length) {
		return [];
	}

	return docs.filter(
		(point): point is Exclude<typeof point, number> =>
			typeof point === "object" && point !== null
	);
}

export function resolveRelatedRoutes(route: Route): Route[] {
	const items: Route[] = [];

	if (Array.isArray(route.relatedRoutes)) {
		for (const item of route.relatedRoutes) {
			if (typeof item === "object" && item !== null) {
				items.push(item);
			}
		}
	}

	return items;
}

export function resolveRelatedExperiences(
	experience: Experience
): Experience[] {
	const items: Experience[] = [];

	if (Array.isArray(experience.relatedExperiences)) {
		for (const item of experience.relatedExperiences) {
			if (typeof item === "object" && item !== null) {
				items.push(item);
			}
		}
	}

	return items;
}

export function resolveExperienceRoutes(experience: Experience): Route[] {
	const docs = experience.relatedRoutes?.docs;

	if (!docs?.length) {
		return [];
	}

	return docs.filter(
		(route): route is Route => typeof route === "object" && route !== null
	);
}

export function resolveRouteExperiences(route: Route): Experience[] {
	if (!route.experiences?.length) {
		return [];
	}

	return route.experiences.filter(
		(item): item is Experience => typeof item === "object" && item !== null
	);
}

export function getExperienceThemeIds(experience: Experience): number[] {
	return (
		experience.themes
			?.map((theme) => (typeof theme === "object" ? theme.id : theme))
			.filter((id): id is number => typeof id === "number") ?? []
	);
}
