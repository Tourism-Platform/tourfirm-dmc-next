import {
	type BaseQueryFn,
	type FetchArgs,
	type FetchBaseQueryError,
	fetchBaseQuery
} from "@reduxjs/toolkit/query/react";

import { ENV } from "@/shared/config";

import { logout } from "@/entities/user/account/slice/user.slice";

export const authBaseQuery: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	const baseQuery = fetchBaseQuery({
		baseUrl: ENV.API_URL,
		credentials: "include"
	});

	const result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		api.dispatch(logout());
	}

	return result;
};
