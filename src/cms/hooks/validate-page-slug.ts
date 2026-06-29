import { isReservedRootPageSlug } from "@/shared/config/routes/reserved-path-segments";

import {
	hasSegmentRelation,
	normalizeSlug,
	validateSlugFormat
} from "../lib/slug-utils";

type TValidatePageSlugArgs = {
	siblingData?: Record<string, unknown>;
};

export function validatePageSlug(
	value: unknown,
	{ siblingData }: TValidatePageSlugArgs = {}
): string | true {
	const slug = normalizeSlug(value);

	if (!slug) {
		return "Slug is required";
	}

	const formatError = validateSlugFormat(slug);

	if (formatError !== true) {
		return formatError;
	}

	if (!hasSegmentRelation(siblingData) && isReservedRootPageSlug(slug)) {
		return "This slug is reserved for a system route";
	}

	return true;
}
