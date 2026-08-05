import type { TMyAccountRead } from "../types/auth.types";

export const PROFILE_INFO_PATHS = {
	getMyAccount: {
		url: "/profile/me",
		method: "GET",
		_types: {} as { body: void; query: void; response: TMyAccountRead }
	}
} as const;
