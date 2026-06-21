import { ENV } from "@/shared/config";

export const toCatalogPreviewPublicImageUrl = (path: string): string => {
	if (/^https?:\/\//i.test(path)) {
		return path;
	}

	const base = (ENV.API_URL ?? "").replace(/\/$/, "");
	const normalized = path.startsWith("/") ? path : `/${path}`;

	return `${base}${normalized}`;
};
