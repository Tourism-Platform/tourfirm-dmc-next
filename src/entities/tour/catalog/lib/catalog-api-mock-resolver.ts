import type { FetchArgs } from "@reduxjs/toolkit/query";

import { CATALOG_DURATION_PRESETS } from "../config/catalog-duration.config";
import { CATALOG_DESTINATIONS_MOCK, RECENT_SEARCHES_MOCK } from "../mock";
import {
	CATALOG_REGIONS_MOCK,
	CATALOG_TOURS_MOCK,
	POPULAR_TOURS_MOCK,
	PRICE_HISTOGRAM_MOCK,
	SPECIAL_OFFERS_MOCK,
	TOUR_PACKAGE_MOCKS
} from "../mock/generated";
import type { ENUM_CATALOG_DURATION_TYPE } from "../types/catalog-duration.types";

const matchesDuration = (
	tourDuration: number,
	selected: ENUM_CATALOG_DURATION_TYPE[]
) =>
	selected.some((key) => {
		const preset = CATALOG_DURATION_PRESETS[key];
		return tourDuration >= preset.from && tourDuration <= preset.to;
	});

const normalizePathname = (pathname: string) => {
	const withoutApi = pathname.replace(/^\/api/, "");
	return withoutApi.replace(/\/+$/, "") || "/";
};

const parseRequest = (args: string | FetchArgs) => {
	if (typeof args === "string") {
		const url = new URL(args, "http://localhost");
		return {
			pathname: normalizePathname(url.pathname),
			searchParams: url.searchParams
		};
	}

	const [pathPart, queryPart] = args.url.split("?");
	const pathname = normalizePathname(
		pathPart.startsWith("http") ? new URL(pathPart).pathname : pathPart
	);
	const searchParams = new URLSearchParams(queryPart);

	if (args.params) {
		for (const [key, value] of Object.entries(args.params)) {
			if (value === undefined || value === null) continue;
			searchParams.set(key, String(value));
		}
	}

	return { pathname, searchParams };
};

export const getCatalogToursMock = (searchParams: URLSearchParams) => {
	const catalogTours = CATALOG_TOURS_MOCK;
	const catalogRegions = CATALOG_REGIONS_MOCK;
	const page = Number(searchParams.get("page")) || 1;
	const limit = Number(searchParams.get("limit")) || 10;
	const search = searchParams.get("search")?.toLowerCase();
	const destination = searchParams.get("destination")?.toLowerCase();
	const regions = searchParams.get("region")?.split(",").filter(Boolean);
	const durations = searchParams
		.get("duration")
		?.split(",")
		.filter(Boolean) as ENUM_CATALOG_DURATION_TYPE[] | undefined;
	const durationDaysMinParam = searchParams.get("durationDaysMin");
	const durationDaysMaxParam = searchParams.get("durationDaysMax");
	const priceFromParam = searchParams.get("priceFrom");
	const priceToParam = searchParams.get("priceTo");

	let filteredTours = [...catalogTours];

	if (search) {
		filteredTours = filteredTours.filter((tour) =>
			tour.title.toLowerCase().includes(search)
		);
	}

	if (destination) {
		filteredTours = filteredTours.filter(
			(tour) =>
				tour.id.toLowerCase().includes(destination) ||
				tour.title.toLowerCase().includes(destination) ||
				tour.image_url.toLowerCase().includes(destination)
		);
	}

	if (regions?.length) {
		const regionTitles = catalogRegions
			.filter((region) => regions.includes(region.id))
			.map((region) => region.title.toLowerCase());

		filteredTours = filteredTours.filter((tour) =>
			regionTitles.some(
				(title) =>
					tour.title.toLowerCase().includes(title) ||
					tour.image_url.toLowerCase().includes(title)
			)
		);
	}

	if (durations?.length) {
		filteredTours = filteredTours.filter((tour) =>
			matchesDuration(tour.duration, durations)
		);
	} else if (durationDaysMinParam !== null && durationDaysMaxParam !== null) {
		const durationDaysMin = Number(durationDaysMinParam);
		const durationDaysMax = Number(durationDaysMaxParam);

		if (!Number.isNaN(durationDaysMin) && !Number.isNaN(durationDaysMax)) {
			filteredTours = filteredTours.filter(
				(tour) =>
					tour.duration >= durationDaysMin &&
					tour.duration <= durationDaysMax
			);
		}
	}

	if (priceFromParam !== null && priceToParam !== null) {
		const priceFrom = Number(priceFromParam);
		const priceTo = Number(priceToParam);

		if (!Number.isNaN(priceFrom) && !Number.isNaN(priceTo)) {
			filteredTours = filteredTours.filter(
				(tour) =>
					tour.price_from >= priceFrom && tour.price_from <= priceTo
			);
		}
	}

	const total = filteredTours.length;
	const start = (page - 1) * limit;

	return {
		data: filteredTours.slice(start, start + limit),
		total
	};
};

export const getCatalogRegionsMock = (searchParams: URLSearchParams) => {
	const page = Number(searchParams.get("page")) || 1;
	const limit = Number(searchParams.get("limit")) || 5;
	const start = (page - 1) * limit;

	return {
		data: CATALOG_REGIONS_MOCK.slice(start, start + limit),
		total: CATALOG_REGIONS_MOCK.length
	};
};

const getTourPackageMock = (tourId: string) =>
	TOUR_PACKAGE_MOCKS[tourId] ?? null;

export const resolveCatalogApiMock = (
	args: string | FetchArgs
): unknown | undefined => {
	const { pathname, searchParams } = parseRequest(args);

	if (pathname === "/tours/catalog") {
		return getCatalogToursMock(searchParams);
	}

	if (pathname === "/tours/catalog/filters/regions") {
		return getCatalogRegionsMock(searchParams);
	}

	if (pathname === "/tours/catalog/filters/price-histogram") {
		return PRICE_HISTOGRAM_MOCK;
	}

	if (pathname === "/tours/catalog/filters/destinations") {
		return {
			data: CATALOG_DESTINATIONS_MOCK,
			total: CATALOG_DESTINATIONS_MOCK.length
		};
	}

	if (pathname === "/tours/recently-searched") {
		return RECENT_SEARCHES_MOCK;
	}

	if (pathname === "/tours/popular") {
		return {
			data: POPULAR_TOURS_MOCK,
			total: POPULAR_TOURS_MOCK.length
		};
	}

	if (pathname === "/tours/special-offers") {
		return {
			data: SPECIAL_OFFERS_MOCK,
			total: SPECIAL_OFFERS_MOCK.length
		};
	}

	const tourPublicMatch = pathname.match(/^\/tour\/([^/]+)\/public$/);
	if (tourPublicMatch) {
		return getTourPackageMock(tourPublicMatch[1])?.general;
	}

	const tourLandingMatch = pathname.match(
		/^\/tour\/([^/]+)\/public\/landing$/
	);
	if (tourLandingMatch) {
		return getTourPackageMock(tourLandingMatch[1])?.landing;
	}

	const tourOperatorMatch = pathname.match(
		/^\/tour\/([^/]+)\/public\/operator$/
	);
	if (tourOperatorMatch) {
		return getTourPackageMock(tourOperatorMatch[1])?.operator;
	}

	const tourOptionsMatch = pathname.match(
		/^\/tour\/([^/]+)\/public\/option\/all$/
	);
	if (tourOptionsMatch) {
		return getTourPackageMock(tourOptionsMatch[1])?.options;
	}

	const tourOptionDetailMatch = pathname.match(
		/^\/tour\/([^/]+)\/public\/option\/([^/]+)$/
	);
	if (tourOptionDetailMatch) {
		const [, tourId, optionId] = tourOptionDetailMatch;
		const mock = getTourPackageMock(tourId);

		if (!mock || mock.optionDetail.id !== optionId) {
			return undefined;
		}

		return mock.optionDetail;
	}

	return undefined;
};
