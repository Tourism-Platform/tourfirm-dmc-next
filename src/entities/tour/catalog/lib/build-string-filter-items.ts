import type { IAccordionItem } from "@/shared/ui/custom/custom-accordion/model/types";

export const buildStringFilterItems = (
	names: string[],
	selected: string[] | undefined
): IAccordionItem[] =>
	names.map((name) => ({
		id: name,
		label: name,
		checked: (selected ?? []).includes(name)
	}));
