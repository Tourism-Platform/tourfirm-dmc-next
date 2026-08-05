import { ENUM_API_TAGS, PROFILE_INFO_PATHS } from "@/shared/api";

import { authApi } from "@/entities/auth/api/auth.api";

import { mapAccountToFrontend } from "../converters";
import type { TAccountBackend, TAccountSchema } from "../types";

export const accountApi = authApi.injectEndpoints({
	endpoints: (builder) => ({
		getAccount: builder.query<TAccountSchema, void>({
			query: () => PROFILE_INFO_PATHS.getMyAccount,
			transformResponse: (response: TAccountBackend) =>
				mapAccountToFrontend(response),
			providesTags: [ENUM_API_TAGS.USER]
		})
	})
});

export const { useGetAccountQuery } = accountApi;
