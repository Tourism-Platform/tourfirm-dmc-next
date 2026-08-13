import "server-only";

/** Payload relationship field may be a bare id or a populated doc. */
export function relationId(value: unknown): number | null {
	if (typeof value === "number" && Number.isFinite(value)) {
		return value;
	}

	if (
		value &&
		typeof value === "object" &&
		"id" in value &&
		typeof (value as { id: unknown }).id === "number"
	) {
		return (value as { id: number }).id;
	}

	return null;
}
