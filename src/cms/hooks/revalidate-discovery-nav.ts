import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook
} from "payload";

import {
	EXPERIENCES_NAV_CACHE_TAG,
	ROUTES_NAV_CACHE_TAG
} from "@/cms/cache/cache-tags";

async function revalidateRoutesNavCache(): Promise<void> {
	try {
		const { revalidateTag } = await import("next/cache");
		revalidateTag(ROUTES_NAV_CACHE_TAG, "max");
	} catch {
		// No-op outside a Next.js request context (e.g. seed CLI).
	}
}

async function revalidateExperiencesNavCache(): Promise<void> {
	try {
		const { revalidateTag } = await import("next/cache");
		revalidateTag(EXPERIENCES_NAV_CACHE_TAG, "max");
	} catch {
		// No-op outside a Next.js request context (e.g. seed CLI).
	}
}

export const revalidateRoutesNavAfterChange: CollectionAfterChangeHook = ({
	req
}) => {
	if (req.context?.isSeed) {
		return;
	}

	void revalidateRoutesNavCache();
};

export const revalidateRoutesNavAfterDelete: CollectionAfterDeleteHook = ({
	req
}) => {
	if (req.context?.isSeed) {
		return;
	}

	void revalidateRoutesNavCache();
};

export const revalidateExperiencesNavAfterChange: CollectionAfterChangeHook = ({
	req
}) => {
	if (req.context?.isSeed) {
		return;
	}

	void revalidateExperiencesNavCache();
};

export const revalidateExperiencesNavAfterDelete: CollectionAfterDeleteHook = ({
	req
}) => {
	if (req.context?.isSeed) {
		return;
	}

	void revalidateExperiencesNavCache();
};
