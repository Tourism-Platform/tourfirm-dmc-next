import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook
} from "payload";

import { INFORMATION_NAV_CACHE_TAG } from "@/cms/cache/cache-tags";

async function revalidateInformationNavCache(): Promise<void> {
	try {
		const { revalidateTag } = await import("next/cache");
		revalidateTag(INFORMATION_NAV_CACHE_TAG, "max");
	} catch {
		// No-op outside a Next.js request context (e.g. seed CLI).
	}
}

export const revalidateInformationNavAfterChange: CollectionAfterChangeHook = ({
	req
}) => {
	if (req.context?.isSeed) {
		return;
	}

	void revalidateInformationNavCache();
};

export const revalidateInformationNavAfterDelete: CollectionAfterDeleteHook = ({
	req
}) => {
	if (req.context?.isSeed) {
		return;
	}

	void revalidateInformationNavCache();
};
