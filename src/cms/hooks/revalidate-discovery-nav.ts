import { revalidateTag } from "next/cache";
import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook
} from "payload";

export const ROUTES_NAV_CACHE_TAG = "routes-nav";
export const EXPERIENCES_NAV_CACHE_TAG = "experiences-nav";

function revalidateRoutesNavCache(): void {
	try {
		revalidateTag(ROUTES_NAV_CACHE_TAG, "max");
	} catch {
		// No-op outside a Next.js request context (e.g. seed CLI).
	}
}

function revalidateExperiencesNavCache(): void {
	try {
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

	revalidateRoutesNavCache();
};

export const revalidateRoutesNavAfterDelete: CollectionAfterDeleteHook = ({
	req
}) => {
	if (req.context?.isSeed) {
		return;
	}

	revalidateRoutesNavCache();
};

export const revalidateExperiencesNavAfterChange: CollectionAfterChangeHook = ({
	req
}) => {
	if (req.context?.isSeed) {
		return;
	}

	revalidateExperiencesNavCache();
};

export const revalidateExperiencesNavAfterDelete: CollectionAfterDeleteHook = ({
	req
}) => {
	if (req.context?.isSeed) {
		return;
	}

	revalidateExperiencesNavCache();
};
