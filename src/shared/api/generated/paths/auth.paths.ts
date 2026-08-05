import type { TMeSchema } from "../types/auth.types";

export const AUTH_PATHS = {
	getMyAccount: {
		url: "/auth/me",
		method: "GET",
		_types: {} as { body: void; query: void; response: TMeSchema }
	},
	logoutUser: {
		url: "/auth/signout",
		method: "POST",
		_types: {} as { body: void; query: void; response: void }
	},
	googleLogin: {
		url: "/auth/google/login",
		method: "GET",
		_types: {} as { body: void; query: void; response: void }
	},
	googleCallback: {
		url: "/auth/google/callback",
		method: "GET",
		_types: {} as { body: void; query: void; response: void }
	}
} as const;
