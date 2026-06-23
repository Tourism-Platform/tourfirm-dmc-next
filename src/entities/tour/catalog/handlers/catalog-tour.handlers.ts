import { HttpResponse, delay, http } from "msw";

import { resolveRequestLocale } from "../lib/app-locale";
import {
	getCatalogRegionsMock,
	getCatalogToursMock
} from "../lib/catalog-api-mock-resolver";
import { CATALOG_DESTINATIONS_MOCK, RECENT_SEARCHES_MOCK } from "../mock";
import { getMocksByLocale } from "../mock/generated";

export const tourCatalogHandlers = [
	http.get("*/tours/catalog", async ({ request }) => {
		await delay(300);
		const locale = resolveRequestLocale(request);
		const url = new URL(request.url);
		return HttpResponse.json(getCatalogToursMock(url.searchParams, locale));
	}),
	http.get("*/tours/catalog/filters/regions", async ({ request }) => {
		await delay(300);
		const locale = resolveRequestLocale(request);
		const url = new URL(request.url);
		return HttpResponse.json(
			getCatalogRegionsMock(url.searchParams, locale)
		);
	}),
	http.get("*/tours/catalog/filters/price-histogram", async ({ request }) => {
		await delay(300);
		const locale = resolveRequestLocale(request);
		return HttpResponse.json(getMocksByLocale(locale).priceHistogram);
	}),
	http.get("*/tours/recently-searched", async () => {
		await delay(300);
		return HttpResponse.json(RECENT_SEARCHES_MOCK);
	}),
	http.get("*/tours/catalog/filters/destinations", async () => {
		await delay(300);
		return HttpResponse.json({
			data: CATALOG_DESTINATIONS_MOCK,
			total: CATALOG_DESTINATIONS_MOCK.length
		});
	}),
	http.get("*/tours/popular", async ({ request }) => {
		await delay(300);
		const { popularTours } = getMocksByLocale(
			resolveRequestLocale(request)
		);
		return HttpResponse.json({
			data: popularTours,
			total: popularTours.length
		});
	}),
	http.get("*/tours/special-offers", async ({ request }) => {
		await delay(300);
		const { specialOffers } = getMocksByLocale(
			resolveRequestLocale(request)
		);
		return HttpResponse.json({
			data: specialOffers,
			total: specialOffers.length
		});
	})
];
