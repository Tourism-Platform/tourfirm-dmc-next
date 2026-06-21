import { HttpResponse, delay, http } from "msw";

import {
	CATALOG_PREVIEW_OPERATOR_MOCK,
	CATALOG_PREVIEW_OPTION_BACKEND_MOCK,
	CATALOG_PREVIEW_TOUR_GENERAL_MOCK,
	CATALOG_PREVIEW_TOUR_LANDING_MOCK,
	CATALOG_PREVIEW_TOUR_OPTIONS_LIST_MOCK
} from "../mock";

export const catalogPreviewHandlers = [
	http.get("*/tour/:tourId/public", async () => {
		await delay(300);
		return HttpResponse.json(CATALOG_PREVIEW_TOUR_GENERAL_MOCK);
	}),
	http.get("*/tour/:tourId/public/landing", async () => {
		await delay(300);
		return HttpResponse.json(CATALOG_PREVIEW_TOUR_LANDING_MOCK);
	}),
	http.get("*/tour/:tourId/public/operator", async () => {
		await delay(300);
		return HttpResponse.json(CATALOG_PREVIEW_OPERATOR_MOCK);
	}),
	http.get("*/tour/:tourId/public/option/all", async () => {
		await delay(300);
		return HttpResponse.json(CATALOG_PREVIEW_TOUR_OPTIONS_LIST_MOCK);
	}),
	http.get("*/tour/:tourId/public/option/:optionId", async () => {
		await delay(300);
		return HttpResponse.json(CATALOG_PREVIEW_OPTION_BACKEND_MOCK);
	})
];
