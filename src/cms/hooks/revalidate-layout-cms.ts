import type { GlobalAfterChangeHook } from "payload";

import {
	DESTINATION_GLOBAL_CACHE_TAG,
	FOOTER_CACHE_TAG,
	HEADER_CACHE_TAG,
	LOCALE_AVAILABILITY_CACHE_TAG,
	UI_CONTENT_CACHE_TAG
} from "@/cms/cache/cache-tags";

async function revalidateTags(tags: string[]): Promise<void> {
	try {
		const { revalidateTag } = await import("next/cache");

		for (const tag of tags) {
			revalidateTag(tag, "max");
		}
	} catch {
		// No-op outside a Next.js request context (e.g. seed CLI).
	}
}

function createRevalidateGlobalHook(tags: string[]): GlobalAfterChangeHook {
	return ({ req }) => {
		if (req.context?.isSeed) {
			return;
		}

		void revalidateTags(tags);
	};
}

export const revalidateHeaderCache = createRevalidateGlobalHook([
	HEADER_CACHE_TAG,
	UI_CONTENT_CACHE_TAG
]);

export const revalidateFooterCache = createRevalidateGlobalHook([
	FOOTER_CACHE_TAG,
	UI_CONTENT_CACHE_TAG
]);

export const revalidateDestinationGlobalCache = createRevalidateGlobalHook([
	DESTINATION_GLOBAL_CACHE_TAG
]);

export const revalidateUiContentCache = createRevalidateGlobalHook([
	UI_CONTENT_CACHE_TAG
]);

export const revalidateUiCommonCache = createRevalidateGlobalHook([
	UI_CONTENT_CACHE_TAG,
	LOCALE_AVAILABILITY_CACHE_TAG
]);
