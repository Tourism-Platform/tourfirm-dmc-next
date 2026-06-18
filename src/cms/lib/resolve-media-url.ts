import { ENV } from "@/shared/config";

import type { Media } from "@/payload-types";

export function resolveMediaUrl(
	media: number | Media | null | undefined
): string {
	if (!media || typeof media === "number") {
		return "";
	}

	return media.url ?? "";
}

export function resolveAbsoluteMediaUrl(
	media: number | Media | null | undefined
): string {
	const url = resolveMediaUrl(media);

	if (!url) {
		return "";
	}

	if (url.startsWith("http")) {
		return url;
	}

	return `${ENV.SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}
