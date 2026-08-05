import { AUTH_PATHS, ENUM_API_TAGS, baseApi } from "@/shared/api";

import { mapAuthAccountToFrontend } from "../converters";
import type { IAuthAccount, TAuthAccountBackend } from "../types";

import { authApi } from "./auth.api";

export const AuthService = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAuthAccount: build.query<IAuthAccount, void>({
			query: () => AUTH_PATHS.getMyAccount,
			transformResponse: (response: TAuthAccountBackend) =>
				mapAuthAccountToFrontend(response),
			providesTags: [ENUM_API_TAGS.AUTH_ACCOUNT]
		}),
		signOut: build.mutation<void, void>({
			query: () => AUTH_PATHS.logoutUser,
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				await queryFulfilled;
				dispatch(baseApi.util.resetApiState());
				dispatch(authApi.util.resetApiState());
			}
		})
	})
});

export const { useGetAuthAccountQuery, useSignOutMutation } = AuthService;
