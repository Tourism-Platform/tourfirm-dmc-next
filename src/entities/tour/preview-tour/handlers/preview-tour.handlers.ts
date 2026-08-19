import { HttpResponse, delay, http } from "msw";

import {
	PREVIEW_OPERATOR_MOCK,
	PREVIEW_OPTION_BACKEND_MOCK,
	PREVIEW_TOUR_GENERAL_MOCK,
	PREVIEW_TOUR_OPTIONS_LIST_MOCK,
	TOUR_PREVIEW_TOUR_MOCK
} from "../mock";

export const tourPreviewTourHandlers = [
	http.get("*/tour/:tourId/public", async () => {
		await delay(300);
		return HttpResponse.json(PREVIEW_TOUR_GENERAL_MOCK);
	}),
	http.get("*/tour/:tourId/public/landing", async () => {
		await delay(300);
		return HttpResponse.json(TOUR_PREVIEW_TOUR_MOCK);
	}),
	http.get("*/tour/:tourId/public/operator", async () => {
		await delay(300);
		return HttpResponse.json(PREVIEW_OPERATOR_MOCK);
	}),
	http.get("*/tour/:tourId/public/option/all", async () => {
		await delay(300);
		return HttpResponse.json(PREVIEW_TOUR_OPTIONS_LIST_MOCK);
	}),
	http.get("*/tour/:tourId/public/option/:optionId/itinerary", async () => {
		await delay(300);
		return HttpResponse.json(PREVIEW_OPTION_BACKEND_MOCK);
	})
];
