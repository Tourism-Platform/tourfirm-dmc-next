export type TNavigationItemLabelSource = {
	type?: "page" | "group" | "external" | "custom" | null;
	label?: string | null;
	page?: { title?: string | null } | number | null;
};

function getPopulatedPageTitle(
	page: TNavigationItemLabelSource["page"]
): string | null {
	if (!page || typeof page === "number") {
		return null;
	}

	return page.title?.trim() || null;
}

export function resolveNavigationItemLabel(
	item: TNavigationItemLabelSource,
	fallback: string
): string {
	const trimmed = item.label?.trim();

	if (trimmed) {
		return trimmed;
	}

	if (item.type === "page") {
		const title = getPopulatedPageTitle(item.page);

		if (title) {
			return title;
		}
	}

	return fallback;
}
