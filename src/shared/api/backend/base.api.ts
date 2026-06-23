import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { ENV } from "@/shared/config/env";

import { resolveBrowserLocale } from "@/entities/tour/catalog/lib/app-locale";
import { resolveCatalogApiMock } from "@/entities/tour/catalog/lib/catalog-api-mock-resolver";

import { ENUM_API_TAGS } from "./tags.config";

const rawBaseQuery = fetchBaseQuery({
	baseUrl: ENV.API_URL,
	credentials: "include"
});

const baseQueryWithMockFallback: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	if (ENV.API_MOCKING) {
		const mock = resolveCatalogApiMock(args, resolveBrowserLocale());
		if (mock !== undefined) {
			return { data: mock };
		}
	}

	return rawBaseQuery(args, api, extraOptions);
};

export const baseApi = createApi({
	baseQuery: baseQueryWithMockFallback,
	reducerPath: "baseApi",
	endpoints: () => ({}),
	tagTypes: [ENUM_API_TAGS.TOURS_CATALOG]
});
