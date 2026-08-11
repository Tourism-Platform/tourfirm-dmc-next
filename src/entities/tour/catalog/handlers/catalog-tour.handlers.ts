import { HttpResponse, delay, http } from "msw";

import {
	CATALOG_DESTINATIONS_MOCK,
	CATALOG_REGIONS_MOCK,
	POPULAR_TOURS_MOCK,
	PRICE_HISTOGRAM_MOCK,
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
	http.get("*/catalog/tours/filters/regions", async ({ request }) => {
		await delay(300);
		const url = new URL(request.url);
		const page = Number(url.searchParams.get("page")) || 1;
		const limit = Number(url.searchParams.get("limit")) || 5;

		const start = (page - 1) * limit;
		const end = start + limit;
		const pagedData = CATALOG_REGIONS_MOCK.slice(start, end);

		return HttpResponse.json({
			data: pagedData,
			total: CATALOG_REGIONS_MOCK.length
		});
	}),
	http.get("*/catalog/tours/filters/price-histogram", async () => {
		await delay(300);
		return HttpResponse.json(PRICE_HISTOGRAM_MOCK);
	}),
	http.get("*/tour/catalog/public", async ({ request }) => {
		await delay(300);
		const url = new URL(request.url);
		const skip = Number(url.searchParams.get("skip")) || 0;
		const limit = Number(url.searchParams.get("limit")) || 10;
		const q = url.searchParams.get("q")?.toLowerCase();

		let filteredTours = [...POPULAR_TOURS_MOCK];

		if (q) {
			filteredTours = filteredTours.filter((tour) =>
				(tour.title ?? "").toLowerCase().includes(q)
			);
		}

		return HttpResponse.json(filteredTours.slice(skip, skip + limit));
	})
];
