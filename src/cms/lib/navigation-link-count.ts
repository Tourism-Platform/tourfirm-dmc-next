export type TNavigationItemLinkCountSource = {
	type?: "page" | "group" | "external" | "custom" | null;
	groupItems?: TNavigationItemLinkCountSource[] | null;
};

export function getNavigationItemLinkCount(
	item: TNavigationItemLinkCountSource
): number {
	if (item.type === "group") {
		return (item.groupItems ?? []).reduce(
			(sum, child) => sum + getNavigationItemLinkCount(child),
			0
		);
	}

	if (
		item.type === "page" ||
		item.type === "custom" ||
		item.type === "external"
	) {
		return 1;
	}

	return 0;
}

export function getColumnLinkCount(
	items: TNavigationItemLinkCountSource[] | null | undefined
): number {
	return (items ?? []).reduce(
		(sum, item) => sum + getNavigationItemLinkCount(item),
		0
	);
}
