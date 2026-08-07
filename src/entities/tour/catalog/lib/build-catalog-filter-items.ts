import type { IAccordionItem } from "@/shared/ui/custom/custom-accordion/model/types";

export const buildCatalogFilterItems = <T extends string>(
	keys: readonly T[],
	labels: Record<T, string>,
	selected: T[] | undefined
): IAccordionItem[] =>
	keys.map((id) => ({
		id,
		label: labels[id],
		checked: (selected ?? []).includes(id)
	}));
