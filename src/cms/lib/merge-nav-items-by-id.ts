type TNavItemRecord = Record<string, unknown>;

function asRecord(value: unknown): TNavItemRecord | undefined {
	if (!value || typeof value !== "object" || Array.isArray(value)) {
		return undefined;
	}

	return value as TNavItemRecord;
}

export function mergeNavItemsById(
	existing: TNavItemRecord[] | null | undefined,
	localized: TNavItemRecord[]
): TNavItemRecord[] {
	return localized.map((item, index) => {
		const existingItem = asRecord(existing?.[index]);
		const merged: TNavItemRecord = { ...item };

		if (existingItem?.id != null) {
			merged.id = existingItem.id;
		}

		if (item.type === "group" && Array.isArray(item.groupItems)) {
			merged.groupItems = mergeNavItemsById(
				existingItem?.groupItems as TNavItemRecord[] | undefined,
				item.groupItems as TNavItemRecord[]
			);
		}

		return merged;
	});
}

export function mergeFooterColumnsById(
	existing: TNavItemRecord[] | null | undefined,
	localized: TNavItemRecord[]
): TNavItemRecord[] {
	return localized.map((column, index) => {
		const existingColumn = asRecord(existing?.[index]);
		const merged: TNavItemRecord = { ...column };

		if (existingColumn?.id != null) {
			merged.id = existingColumn.id;
		}

		if (Array.isArray(column.items)) {
			merged.items = mergeNavItemsById(
				existingColumn?.items as TNavItemRecord[] | undefined,
				column.items as TNavItemRecord[]
			);
		}

		return merged;
	});
}
