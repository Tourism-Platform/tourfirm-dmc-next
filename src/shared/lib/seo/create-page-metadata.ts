import type { Metadata } from "next";

import { ENV } from "@/shared/config";
import { getPathname } from "@/shared/i18n";

const OG_IMAGE = "/assets/images/og/main.png";
const FAVICON = "/assets/images/logo.svg";

type TCreatePageMetadataParams = {
	title: string;
	description: string;
	locale: string;
	path?: string;
};

function buildPageUrl(locale: string, path = "/"): string {
	const pathname = getPathname({ locale, href: path });

	return `${ENV.SITE_URL}${pathname}`;
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
