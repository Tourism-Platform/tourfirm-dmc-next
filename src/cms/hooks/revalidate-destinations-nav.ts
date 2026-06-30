import { revalidateTag } from "next/cache";
import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook
} from "payload";

export const DESTINATIONS_NAV_CACHE_TAG = "destinations-nav";

function revalidateDestinationsNavCache(): void {
	try {
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

		revalidateDestinationsNavCache();
	};

export const revalidateDestinationsNavAfterDelete: CollectionAfterDeleteHook =
	({ req }) => {
		if (req.context?.isSeed) {
			return;
		}

		revalidateDestinationsNavCache();
	};
