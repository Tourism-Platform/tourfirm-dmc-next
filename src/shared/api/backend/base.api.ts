import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { ENV } from "@/shared/config/env";

import { ENUM_API_TAGS } from "./tags.config";

export const baseApi = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: ENV.API_URL,
		credentials: "include"
	}),
	reducerPath: "baseApi",
	endpoints: () => ({}),
	tagTypes: [
		ENUM_API_TAGS.TOURS_CATALOG,
		ENUM_API_TAGS.TOUR_PREVIEW,
		ENUM_API_TAGS.AUTH_ACCOUNT,
		ENUM_API_TAGS.USER
	]
});
