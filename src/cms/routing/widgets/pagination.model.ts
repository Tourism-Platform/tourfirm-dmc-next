import { buildCmsRoutePath } from "../build-cms-route-path";

import type { TWidgetModelBuilder } from "./widget-model.types";

export const buildPaginationModel =
	(routeKey: string): TWidgetModelBuilder =>
	({ data }) => {
		if (!data.pagination || !data.list) {
			return null;
		}

		return {
			key: "pagination",
			props: {
				baseHref: buildCmsRoutePath(routeKey),
				pagination: data.pagination
			}
		};
	};
