export type TAppLocale = "en" | "ru" | "uz";

const LOCALE_PATTERN = /\/(en|ru|uz)(?:\/|$)/;

export function normalizeAppLocale(locale?: string | null): TAppLocale {
	if (locale === "ru" || locale === "uz" || locale === "en") return locale;
	return "en";
}

export function resolveBrowserLocale(): TAppLocale {
	if (typeof document === "undefined") return "en";

	const cookieMatch = document.cookie.match(/NEXT_LOCALE=(en|ru|uz)/);
	if (cookieMatch) return normalizeAppLocale(cookieMatch[1]);

	const pathMatch = window.location.pathname.match(LOCALE_PATTERN);
	if (pathMatch) return normalizeAppLocale(pathMatch[1]);

	return "en";
}

export function resolveRequestLocale(request: Request): TAppLocale {
	const cookie = request.headers.get("cookie") ?? "";
	const cookieMatch = cookie.match(/NEXT_LOCALE=(en|ru|uz)/);
	if (cookieMatch) return normalizeAppLocale(cookieMatch[1]);

	const referer = request.headers.get("referer") ?? "";
	const refererMatch = referer.match(LOCALE_PATTERN);
	if (refererMatch) return normalizeAppLocale(refererMatch[1]);

	return "en";
}

export const catalogApiCacheKey = (endpointName: string, queryArgs: unknown) =>
	`${endpointName}|${resolveBrowserLocale()}|${JSON.stringify(queryArgs)}`;
