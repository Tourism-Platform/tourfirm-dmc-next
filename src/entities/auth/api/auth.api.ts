import { createApi } from "@reduxjs/toolkit/query/react";

import { ENUM_API_TAGS } from "@/shared/api";

import { authBaseQuery } from "./auth-base-query";

export const authApi = createApi({
	baseQuery: authBaseQuery,
	reducerPath: "authApi",
	endpoints: () => ({}),
	tagTypes: [ENUM_API_TAGS.USER, ENUM_API_TAGS.AUTH_ACCOUNT]
});
