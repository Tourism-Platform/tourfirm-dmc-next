import { HttpResponse, delay, http } from "msw";

import { POPULAR_TOURS_MOCK, RECENT_SEARCHES_MOCK } from "../mock";

const CATALOG_FILTERS_MOCK = {
	countries: ["Uzbekistan", "Kazakhstan", "Kyrgyzstan"],
	cities: ["Samarkand", "Bukhara", "Khiva", "Tashkent", "Fergana"]
};

const CATALOG_SUGGEST_MOCK = [
	{ value: "Samarkand", kind: "city" },
	{ value: "Uzbekistan", kind: "country" },
	{ value: "Registan", kind: "place" }
];

export const tourCatalogHandlers = [
	http.get("*/catalog/recently-searched", async () => {
		await delay(300);
		return HttpResponse.json(RECENT_SEARCHES_MOCK);
	}),
	http.get("*/tour/catalog/filters", async () => {
		await delay(300);
		return HttpResponse.json(CATALOG_FILTERS_MOCK);
	}),
	http.get("*/tour/catalog/suggest", async ({ request }) => {
		await delay(300);
		const url = new URL(request.url);
		const q = url.searchParams.get("q")?.toLowerCase() ?? "";
		const items = q
			? CATALOG_SUGGEST_MOCK.filter((item) =>
					item.value.toLowerCase().includes(q)
				)
			: CATALOG_SUGGEST_MOCK;

		return HttpResponse.json(items);
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

		const data = filteredTours.slice(skip, skip + limit);

		return HttpResponse.json({
			data,
			total_count: filteredTours.length
		});
	})
];
