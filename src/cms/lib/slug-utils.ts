export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeSlug(value: unknown): string | null {
	if (typeof value !== "string" || !value.trim()) {
		return null;
	}

	return value.trim();
}

export function validateSlugFormat(slug: string): string | true {
	if (!SLUG_PATTERN.test(slug)) {
		return "Slug must contain only lowercase letters, numbers, and hyphens";
	}

	return true;
}

export type TRelationValue =
	| string
	| number
	| { id: string | number }
	| null
	| undefined;

export function getRelationId(value: TRelationValue): string | number | null {
	if (value == null) {
		return null;
	}

	if (typeof value === "string" || typeof value === "number") {
		return value;
	}

	if (typeof value === "object" && "id" in value && value.id != null) {
		return value.id;
	}

	return null;
}

export function hasSegmentRelation(
	siblingData?: Record<string, unknown> | null
): boolean {
	return getRelationId(siblingData?.segment as TRelationValue) != null;
}
