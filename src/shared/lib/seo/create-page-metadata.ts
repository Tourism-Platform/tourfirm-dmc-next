import type { Metadata } from "next";

import { ENV } from "@/shared/config";

export const OG_IMAGE = "/assets/images/og/main.png";
export const FAVICON = "/assets/images/logo.svg";

type TCreatePageMetadataParams = {
	title: string;
	description: string;
	locale: string;
	path?: string;
};

export function buildPageUrl(locale: string, path = "/"): string {
	const normalizedPath = path === "/" ? "" : path;

	return `${ENV.SITE_URL}/${locale}${normalizedPath}`;
}

export function createPageMetadata({
	title,
	description,
	locale,
	path = "/"
}: TCreatePageMetadataParams): Metadata {
	const url = buildPageUrl(locale, path);

	return {
		title,
		description,
		metadataBase: new URL(ENV.SITE_URL),
		icons: {
			icon: FAVICON
		},
		openGraph: {
			title,
			description,
			locale,
			type: "website",
			url,
			images: [
				{
					url: OG_IMAGE,
					width: 1200,
					height: 630,
					alt: title
				}
			]
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [OG_IMAGE]
		}
	};
}
