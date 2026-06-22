import { HttpResponse, delay, http } from "msw";

import { resolveCatalogApiMock } from "../lib/catalog-api-mock-resolver";

const toPreviewArgs = (pathname: string) => ({ url: pathname });

export const catalogPreviewHandlers = [
	http.get("*/tour/:tourId/public", async ({ params }) => {
		await delay(300);
		const mock = resolveCatalogApiMock(
			toPreviewArgs(`/tour/${String(params.tourId)}/public`)
		);

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock);
	}),
	http.get("*/tour/:tourId/public/landing", async ({ params }) => {
		await delay(300);
		const mock = resolveCatalogApiMock(
			toPreviewArgs(`/tour/${String(params.tourId)}/public/landing`)
		);

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock);
	}),
	http.get("*/tour/:tourId/public/operator", async ({ params }) => {
		await delay(300);
		const mock = resolveCatalogApiMock(
			toPreviewArgs(`/tour/${String(params.tourId)}/public/operator`)
		);

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock);
	}),
	http.get("*/tour/:tourId/public/option/all", async ({ params }) => {
		await delay(300);
		const mock = resolveCatalogApiMock(
			toPreviewArgs(`/tour/${String(params.tourId)}/public/option/all`)
		);

		if (!mock) {
			return HttpResponse.json(
				{ message: "Tour not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock);
	}),
	http.get("*/tour/:tourId/public/option/:optionId", async ({ params }) => {
		await delay(300);
		const mock = resolveCatalogApiMock(
			toPreviewArgs(
				`/tour/${String(params.tourId)}/public/option/${String(params.optionId)}`
			)
		);

		if (!mock) {
			return HttpResponse.json(
				{ message: "Option not found" },
				{ status: 404 }
			);
		}

		return HttpResponse.json(mock);
	})
];
