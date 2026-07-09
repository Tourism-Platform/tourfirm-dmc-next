import type { TDiscoveryNavItem } from "@/shared/types/discovery-nav.types";

export function resolveDiscoveryNavColumnCount(itemCount: number): number {
	if (itemCount <= 5) {
		return 1;
	}

	if (itemCount <= 10) {
		return 2;
	}

	return 3;
}

export function splitDiscoveryNavColumns(
	items: TDiscoveryNavItem[],
	maxColumns = 3
): TDiscoveryNavItem[][] {
	if (!items.length) {
		return [];
	}

	const columnCount = Math.min(
		maxColumns,
		resolveDiscoveryNavColumnCount(items.length)
	);
	const perColumn = Math.ceil(items.length / columnCount);
	const columns: TDiscoveryNavItem[][] = [];

	for (let index = 0; index < columnCount; index += 1) {
		const start = index * perColumn;
		const slice = items.slice(start, start + perColumn);

		if (slice.length) {
			columns.push(slice);
		}
	}

	return columns;
}
