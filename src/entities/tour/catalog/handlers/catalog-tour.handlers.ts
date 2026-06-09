import { HttpResponse, delay, http } from "msw";

import {
	CATALOG_DESTINATIONS_MOCK,
	POPULAR_TOURS_MOCK,
	RECENT_SEARCHES_MOCK,
	SPECIAL_OFFERS_MOCK
} from "../mock";

export const tourCatalogHandlers = [
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
