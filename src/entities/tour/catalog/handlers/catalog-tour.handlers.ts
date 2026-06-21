import { HttpResponse, delay, http } from "msw";

import { CATALOG_DURATION_PRESETS } from "../config/catalog-duration.config";
import {
	CATALOG_DESTINATIONS_MOCK,
	CATALOG_REGIONS_MOCK,
	CATALOG_TOURS_MOCK,
	POPULAR_TOURS_MOCK,
	PRICE_HISTOGRAM_MOCK,
	RECENT_SEARCHES_MOCK,
	SPECIAL_OFFERS_MOCK
} from "../mock";
import type { ENUM_CATALOG_DURATION_TYPE } from "../types/catalog-duration.types";

const matchesDuration = (
	tourDuration: number,
	selected: ENUM_CATALOG_DURATION_TYPE[]
) =>
	selected.some((key) => {
		const preset = CATALOG_DURATION_PRESETS[key];
		return tourDuration >= preset.from && tourDuration <= preset.to;
	});

export const tourCatalogHandlers = [
	http.get("*/tours/catalog", async ({ request }) => {
		await delay(300);
		const url = new URL(request.url);
		const page = Number(url.searchParams.get("page")) || 1;
		const limit = Number(url.searchParams.get("limit")) || 10;
		const search = url.searchParams.get("search")?.toLowerCase();
		const destination = url.searchParams.get("destination")?.toLowerCase();
		const regions = url.searchParams
			.get("region")
			?.split(",")
			.filter(Boolean);
		const durations = url.searchParams
			.get("duration")
			?.split(",")
			.filter(Boolean) as ENUM_CATALOG_DURATION_TYPE[] | undefined;
		const durationDaysMinParam = url.searchParams.get("durationDaysMin");
		const durationDaysMaxParam = url.searchParams.get("durationDaysMax");
		const priceFromParam = url.searchParams.get("priceFrom");
		const priceToParam = url.searchParams.get("priceTo");

		let filteredTours = [...CATALOG_TOURS_MOCK];

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
			const regionTitles = CATALOG_REGIONS_MOCK.filter((region) =>
				regions.includes(region.id)
			).map((region) => region.title.toLowerCase());

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
		} else if (
			durationDaysMinParam !== null &&
			durationDaysMaxParam !== null
		) {
			const durationDaysMin = Number(durationDaysMinParam);
			const durationDaysMax = Number(durationDaysMaxParam);

			if (
				!Number.isNaN(durationDaysMin) &&
				!Number.isNaN(durationDaysMax)
			) {
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
						tour.price_from >= priceFrom &&
						tour.price_from <= priceTo
				);
			}
		}

		const total = filteredTours.length;
		const start = (page - 1) * limit;
		const data = filteredTours.slice(start, start + limit);

		return HttpResponse.json({ data, total });
	}),
	http.get("*/tours/catalog/filters/regions", async ({ request }) => {
		await delay(300);
		const url = new URL(request.url);
		const page = Number(url.searchParams.get("page")) || 1;
		const limit = Number(url.searchParams.get("limit")) || 5;
		const start = (page - 1) * limit;
		const data = CATALOG_REGIONS_MOCK.slice(start, start + limit);

		return HttpResponse.json({
			data,
			total: CATALOG_REGIONS_MOCK.length
		});
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
