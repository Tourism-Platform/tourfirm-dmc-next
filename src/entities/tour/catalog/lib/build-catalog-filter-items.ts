import type { TOptionsKeys } from "@/shared/i18n/i18n.config";
import type { IAccordionItem } from "@/shared/ui/custom/custom-accordion/model/types";

export const buildCatalogFilterItems = <T extends string>(
	keys: readonly T[],
	labels: Record<T, TOptionsKeys>,
	selected: T[] | undefined,
	translate: (key: TOptionsKeys) => string
): IAccordionItem[] =>
	keys.map((id) => ({
		id,
		label: translate(labels[id]),
		checked: (selected ?? []).includes(id)
	}));
