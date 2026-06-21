import { HttpResponse, delay, http } from "msw";

import { resolveRequestLocale } from "../lib/resolve-request-locale";
import { TOUR_PACKAGE_MOCKS_BY_LOCALE } from "../mock/generated";

export const catalogPreviewHandlers = [
	http.get("*/tour/:tourId/public", async ({ params, request }) => {
		await delay(300);
		const locale = resolveRequestLocale(request);
		const mock =
			TOUR_PACKAGE_MOCKS_BY_LOCALE[locale][String(params.tourId)];

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock.general);
	}),
	http.get("*/tour/:tourId/public/landing", async ({ params, request }) => {
		await delay(300);
		const locale = resolveRequestLocale(request);
		const mock =
			TOUR_PACKAGE_MOCKS_BY_LOCALE[locale][String(params.tourId)];

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock.landing);
	}),
	http.get("*/tour/:tourId/public/operator", async ({ params, request }) => {
		await delay(300);
		const locale = resolveRequestLocale(request);
		const mock =
			TOUR_PACKAGE_MOCKS_BY_LOCALE[locale][String(params.tourId)];

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock.operator);
	}),
	http.get(
		"*/tour/:tourId/public/option/all",
		async ({ params, request }) => {
			await delay(300);
			const locale = resolveRequestLocale(request);
			const mock =
				TOUR_PACKAGE_MOCKS_BY_LOCALE[locale][String(params.tourId)];

			if (!mock) {
				return HttpResponse.json(
					{ message: "Tour not found" },
					{ status: 404 }
				);
			}

			return HttpResponse.json(mock.options);
		}
	),
	http.get(
		"*/tour/:tourId/public/option/:optionId",
		async ({ params, request }) => {
			await delay(300);
			const locale = resolveRequestLocale(request);
			const mock =
				TOUR_PACKAGE_MOCKS_BY_LOCALE[locale][String(params.tourId)];

			if (!mock) {
				return HttpResponse.json(
					{ message: "Tour not found" },
					{ status: 404 }
				);
			}

			if (String(params.optionId) !== mock.optionDetail.id) {
				return HttpResponse.json(
					{ message: "Option not found" },
					{ status: 404 }
				);
			}

			return HttpResponse.json(mock.optionDetail);
		}
	)
];
