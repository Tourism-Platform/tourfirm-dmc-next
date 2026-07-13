import { SUPPORTED_LOCALES } from "@config/supported-locales";

type TMatchPathResult = {
	params: Record<string, string>;
};

const LOCALE_PREFIXES = new Set<string>(SUPPORTED_LOCALES);

function normalizePath(path: string): string[] {
	const parts = path.split("/").filter(Boolean);

	if (parts.length > 0 && LOCALE_PREFIXES.has(parts[0])) {
		parts.shift();
	}

	return parts;
}

export function matchPath(
	pattern: string,
	pathname: string
): TMatchPathResult | null {
	const patternParts = normalizePath(pattern);
	const pathParts = normalizePath(pathname);
	const params: Record<string, string> = {};

	if (patternParts.length !== pathParts.length) {
		return null;
	}

	for (let index = 0; index < patternParts.length; index += 1) {
		const patternPart = patternParts[index];
		const pathPart = pathParts[index];

		if (patternPart.startsWith(":")) {
			params[patternPart.slice(1)] = pathPart;
			continue;
		}

		if (patternPart !== pathPart) {
			return null;
		}
	}

	return { params };
}
