import { AUTH_PATHS } from "@/shared/api";
import { ENV } from "@/shared/config";

export function useGoogleLogin() {
	const handleGoogleLogin = () => {
		const baseUrl = ENV.API_URL.replace(/\/$/, "");
		window.location.assign(`${baseUrl}${AUTH_PATHS.googleLogin.url}`);
	};

	return { handleGoogleLogin };
}
