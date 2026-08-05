import { ENV } from "@/shared/config";

export function resolveApiAssetUrl(
	path: string | null | undefined
): string | undefined {
	if (!path?.trim()) {
		return undefined;
	}

	if (path.startsWith("http")) {
		return path;
	}

	const base = ENV.API_URL.replace(/\/$/, "");
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;

	return `${base}${normalizedPath}`;
}
