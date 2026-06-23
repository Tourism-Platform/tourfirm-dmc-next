import { HttpResponse, delay, http } from "msw";

import { resolveRequestLocale } from "../lib/app-locale";
import { resolveCatalogApiMock } from "../lib/catalog-api-mock-resolver";

const toPreviewArgs = (pathname: string) => ({ url: pathname });

export const catalogPreviewHandlers = [
	http.get("*/tour/:tourId/public", async ({ params, request }) => {
		await delay(300);
		const locale = resolveRequestLocale(request);
		const mock = resolveCatalogApiMock(
			toPreviewArgs(`/tour/${String(params.tourId)}/public`),
			locale
		);

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock);
	}),
	http.get("*/tour/:tourId/public/landing", async ({ params, request }) => {
		await delay(300);
		const locale = resolveRequestLocale(request);
		const mock = resolveCatalogApiMock(
			toPreviewArgs(`/tour/${String(params.tourId)}/public/landing`),
			locale
		);

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock);
	}),
	http.get("*/tour/:tourId/public/operator", async ({ params, request }) => {
		await delay(300);
		const locale = resolveRequestLocale(request);
		const mock = resolveCatalogApiMock(
			toPreviewArgs(`/tour/${String(params.tourId)}/public/operator`),
			locale
		);

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock);
	}),
	http.get(
		"*/tour/:tourId/public/option/all",
		async ({ params, request }) => {
			await delay(300);
			const locale = resolveRequestLocale(request);
			const mock = resolveCatalogApiMock(
				toPreviewArgs(
					`/tour/${String(params.tourId)}/public/option/all`
				),
				locale
			);

			if (!mock) {
				return HttpResponse.json(
					{ message: "Tour not found" },
					{ status: 404 }
				);
			}

			return HttpResponse.json(mock);
		}
	),
	http.get(
		"*/tour/:tourId/public/option/:optionId",
		async ({ params, request }) => {
			await delay(300);
			const locale = resolveRequestLocale(request);
			const mock = resolveCatalogApiMock(
				toPreviewArgs(
					`/tour/${String(params.tourId)}/public/option/${String(params.optionId)}`
				),
				locale
			);

			if (!mock) {
				return HttpResponse.json(
					{ message: "Option not found" },
					{ status: 404 }
				);
			}

			return HttpResponse.json(mock);
		}
	)
];
