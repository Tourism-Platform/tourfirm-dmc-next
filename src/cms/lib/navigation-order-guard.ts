export function assertNoDeprecatedNavigationOrder(
	item: Record<string, unknown>,
	context: string
): void {
	if (process.env.NODE_ENV !== "development") {
		return;
	}

	if ("order" in item) {
		throw new Error(
			`navigation: deprecated "order" field in ${context}. Use array position instead.`
		);
	}
}

export function assertNoDeprecatedNavigationOrderInItems(
	items: unknown[] | undefined,
	context: string
): void {
	for (const [index, item] of (items ?? []).entries()) {
		if (item && typeof item === "object") {
			assertNoDeprecatedNavigationOrder(
				item as Record<string, unknown>,
				`${context}[${index}]`
			);
		}
	}
}
