type TPrimitive = string | number | boolean | null | undefined;

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEmptyLeaf(value: unknown): boolean {
	return value === null || value === undefined || value === "";
}

export function deepMergeUiContent<T>(fallback: T, current: T): T {
	if (typeof fallback === "string") {
		return (isEmptyLeaf(current) ? fallback : current) as T;
	}

	if (Array.isArray(fallback)) {
		return (
			Array.isArray(current) && current.length ? current : fallback
		) as T;
	}

	if (!isPlainObject(fallback)) {
		return (current ?? fallback) as T;
	}

	const result: Record<string, unknown> = { ...fallback };
	const currentObj: Record<string, unknown> = isPlainObject(current)
		? current
		: {};
	const fallbackObj = fallback as Record<string, unknown>;

	for (const key of Object.keys(fallbackObj)) {
		result[key] = deepMergeUiContent(
			fallbackObj[key],
			currentObj[key] ?? fallbackObj[key]
		);
	}

	for (const key of Object.keys(currentObj)) {
		if (!(key in result)) {
			result[key] = currentObj[key];
		}
	}

	return result as T;
}

export function mapHeaderUiTexts(
	fallback: Record<string, unknown> | null | undefined,
	current: Record<string, unknown> | null | undefined
) {
	const fb = (fallback?.uiTexts ?? {}) as Record<string, unknown>;
	const cur = (current?.uiTexts ?? {}) as Record<string, unknown>;
	return deepMergeUiContent(
		fb,
		cur
	) as import("./ui-content.types").TUiHeader;
}

export function mapFooterUiTexts(
	fallback: Record<string, unknown> | null | undefined,
	current: Record<string, unknown> | null | undefined
) {
	const fb = (fallback?.uiTexts ?? {}) as Record<string, unknown>;
	const cur = (current?.uiTexts ?? {}) as Record<string, unknown>;
	return deepMergeUiContent(
		fb,
		cur
	) as import("./ui-content.types").TUiFooter;
}

export function mapGlobalUiContent<T extends TPrimitive | object>(
	fallback: T,
	current: T
): T {
	return deepMergeUiContent(fallback, current);
}
