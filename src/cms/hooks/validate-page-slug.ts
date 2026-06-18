import { isReservedPathSegment } from "@/shared/config/routes/reserved-path-segments";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validatePageSlug(value: unknown): string | true {
	if (typeof value !== "string" || !value.trim()) {
		return "Slug is required";
	}

	const slug = value.trim();

	if (!SLUG_PATTERN.test(slug)) {
		return "Slug must contain only lowercase letters, numbers, and hyphens";
	}

	if (isReservedPathSegment(slug)) {
		return "This slug is reserved for a system route";
	}

	return true;
}
