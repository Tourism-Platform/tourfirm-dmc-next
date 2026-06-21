import { type TAppLocale, normalizeAppLocale } from "./app-locale";

const LOCALE_PATTERN = /\/(en|ru|uz)(?:\/|$)/;

export type { TAppLocale };

export function resolveRequestLocale(request: Request): TAppLocale {
	const cookie = request.headers.get("cookie") ?? "";
	const cookieMatch = cookie.match(/NEXT_LOCALE=(en|ru|uz)/);
	if (cookieMatch) return normalizeAppLocale(cookieMatch[1]);

	const referer = request.headers.get("referer") ?? "";
	const refererMatch = referer.match(LOCALE_PATTERN);
	if (refererMatch) return normalizeAppLocale(refererMatch[1]);

	return normalizeAppLocale();
}
