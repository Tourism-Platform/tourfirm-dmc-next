import { HttpResponse, delay, http } from "msw";

import {
	CATALOG_DESTINATIONS_MOCK,
	POPULAR_TOURS_MOCK,
	RECENT_SEARCHES_MOCK
} from "../mock";

export const tourCatalogHandlers = [
	http.get("*/catalog/recently-searched", async () => {
		await delay(300);
		return HttpResponse.json(RECENT_SEARCHES_MOCK);
	}),
	http.get("*/catalog/tours/filters/destinations", async () => {
		await delay(300);
		return HttpResponse.json({
			data: CATALOG_DESTINATIONS_MOCK,
			total: CATALOG_DESTINATIONS_MOCK.length
		});
	}),
	http.get("*/tour/catalog/public", async () => {
		await delay(300);
		return HttpResponse.json(POPULAR_TOURS_MOCK);
	})
];
