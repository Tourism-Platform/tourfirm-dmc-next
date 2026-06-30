import { isReservedRootPageSlug } from "@/shared/config";

import { findPageBySlug } from "../api/find-page-by-slug";
import { getDestination } from "../api/get-destination";

import type { Destination, Page, Segment } from "@/payload-types";

export type TCmsRoute =
	| { kind: "destination"; document: Destination }
	| { kind: "page"; document: Page }
	| { kind: "segment-page"; document: Page; segment: Segment };

export async function resolveCmsRoute(
	locale: string,
	slug: string
): Promise<TCmsRoute | null> {
	if (isReservedRootPageSlug(slug)) {
		return null;
	}

	const destination = await getDestination(locale);

	if (destination?.slug === slug) {
		return { kind: "destination", document: destination };
	}

	const page = await findPageBySlug(locale, slug);

	if (page) {
		return { kind: "page", document: page };
	}

	return null;
}
