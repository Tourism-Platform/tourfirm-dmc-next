import { GEO_PATHS, baseApi } from "@/shared/api";
import type { GeoFeature } from "@/shared/api";

import { mapGeoFeaturesToOptions } from "../converters";
import type { TGeoOption, TGeoSearchParams } from "../types";

export const geoApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		searchGeo: builder.query<TGeoOption[], TGeoSearchParams>({
			query: (params) => ({
				...GEO_PATHS.search,
				params
			}),
			transformResponse: (response: GeoFeature[]) =>
				mapGeoFeaturesToOptions(response)
		})
	})
});

export const { useSearchGeoQuery, useLazySearchGeoQuery } = geoApi;
