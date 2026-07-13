import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook
} from "payload";

import { DESTINATIONS_NAV_CACHE_TAG } from "@/cms/cache/cache-tags";

async function revalidateDestinationsNavCache(): Promise<void> {
	try {
		const { revalidateTag } = await import("next/cache");
		revalidateTag(DESTINATIONS_NAV_CACHE_TAG, "max");
	} catch {
		// No-op outside a Next.js request context (e.g. seed CLI).
	}
}

export const revalidateDestinationsNavAfterChange: CollectionAfterChangeHook =
	({ req }) => {
		if (req.context?.isSeed) {
			return;
		}

		void revalidateDestinationsNavCache();
	};

export const revalidateDestinationsNavAfterDelete: CollectionAfterDeleteHook =
	({ req }) => {
		if (req.context?.isSeed) {
			return;
		}

		void revalidateDestinationsNavCache();
	};
