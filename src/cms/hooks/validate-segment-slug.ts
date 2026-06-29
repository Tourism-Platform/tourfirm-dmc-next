import { isReservedSegmentSlug } from "@/shared/config/routes/reserved-path-segments";

import { normalizeSlug, validateSlugFormat } from "../lib/slug-utils";

export function validateSegmentSlug(value: unknown): string | true {
	const slug = normalizeSlug(value);

	if (!slug) {
		return "Slug is required";
	}

	const formatError = validateSlugFormat(slug);

	if (formatError !== true) {
		return formatError;
	}

	if (isReservedSegmentSlug(slug)) {
		return "This slug is reserved for a system route";
	}

	return true;
}
