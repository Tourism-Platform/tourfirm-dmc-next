import { HttpResponse, delay, http } from "msw";

import {
	getCatalogRegionsMock,
	getCatalogToursMock
} from "../lib/catalog-api-mock-resolver";
import { CATALOG_DESTINATIONS_MOCK, RECENT_SEARCHES_MOCK } from "../mock";
import {
	POPULAR_TOURS_MOCK,
	PRICE_HISTOGRAM_MOCK,
	SPECIAL_OFFERS_MOCK
} from "../mock/generated";

export const tourCatalogHandlers = [
	http.get("*/tours/catalog", async ({ request }) => {
		await delay(300);
		const url = new URL(request.url);
		return HttpResponse.json(getCatalogToursMock(url.searchParams));
	}),
	http.get("*/tours/catalog/filters/regions", async ({ request }) => {
		await delay(300);
		const url = new URL(request.url);
		return HttpResponse.json(getCatalogRegionsMock(url.searchParams));
	}),
	http.get("*/tours/catalog/filters/price-histogram", async () => {
		await delay(300);
		return HttpResponse.json(PRICE_HISTOGRAM_MOCK);
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
	http.get("*/tours/popular", async () => {
		await delay(300);
		return HttpResponse.json({
			data: POPULAR_TOURS_MOCK,
			total: POPULAR_TOURS_MOCK.length
		});
	}),
	http.get("*/tours/special-offers", async () => {
		await delay(300);
		return HttpResponse.json({
			data: SPECIAL_OFFERS_MOCK,
			total: SPECIAL_OFFERS_MOCK.length
		});
	})
];
