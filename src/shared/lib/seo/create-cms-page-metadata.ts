import type { Metadata } from "next";

import { ENV } from "@/shared/config";
import { resolveAbsoluteMediaUrl } from "@/shared/lib/media/resolve-media-url";

import { FAVICON, OG_IMAGE, buildPageUrl } from "./create-page-metadata";
import type { Homepage, Media } from "@/payload-types";

type TCmsSeo = NonNullable<Homepage["seo"]>;

type TCreateCmsPageMetadataParams = {
	seo: TCmsSeo;
	locale: string;
	path?: string;
};

function resolveOgImages(seo: TCmsSeo, fallbackTitle: string) {
	const media = seo.ogImage as number | Media | null | undefined;
	const url = resolveAbsoluteMediaUrl(media);

	if (url && typeof media === "object" && media !== null) {
		return [
			{
				url,
				width: media.width ?? 1200,
				height: media.height ?? 630,
				alt: media.alt ?? fallbackTitle
			}
		];
	}

	return [
		{
			url: OG_IMAGE,
			width: 1200,
			height: 630,
			alt: fallbackTitle
		}
	];
}

export function createCmsPageMetadata({
	seo,
	locale,
	path = "/"
}: TCreateCmsPageMetadataParams): Metadata {
	const title = seo.metaTitle ?? "";
	const description = seo.metaDescription ?? "";
	const ogTitle = seo.ogTitle ?? title;
	const ogDescription = seo.ogDescription ?? description;
	const url = seo.canonicalOverride ?? buildPageUrl(locale, path);
	const images = resolveOgImages(seo, title);
	const imageUrls = images.map((image) => image.url);

	return {
		title,
		description,
		metadataBase: new URL(ENV.SITE_URL),
		alternates: {
			canonical: url
		},
		robots: seo.robotsNoindex ? { index: false, follow: true } : undefined,
		icons: {
			icon: FAVICON
		},
		openGraph: {
			title: ogTitle,
			description: ogDescription,
			locale,
			type: "website",
			url,
			images
		},
		twitter: {
			card: "summary_large_image",
			title: ogTitle,
			description: ogDescription,
			images: imageUrls
		}
	};
}
