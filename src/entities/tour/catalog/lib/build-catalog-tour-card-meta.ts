import { formatUiText } from "@/shared/ui-content";
import type { TUiTours } from "@/shared/ui-content";

import type { ICatalogTourCard } from "../types";

export type TCatalogTourCardMetaItem = {
	key: "duration" | "group" | "age" | "options";
	label: string;
};

export function buildCatalogTourCardMeta(
	tour: ICatalogTourCard,
	card: TUiTours["card"]
): TCatalogTourCardMetaItem[] {
	const groupLabel =
		tour.groupSizeMin != null && tour.groupSizeMin > 0
			? formatUiText(card.group, {
					min: tour.groupSizeMin,
					max: tour.groupSizeMax
				})
			: String(tour.groupSizeMax);

	const ageLabel =
		tour.ageFrom != null && tour.ageTo != null
			? formatUiText(card.age, {
					from: tour.ageFrom,
					to: tour.ageTo
				})
			: null;

	const items: TCatalogTourCardMetaItem[] = [
		{
			key: "duration",
			label: formatUiText(card.duration, {
				days: tour.days,
				nights: tour.nights
			})
		},
		{
			key: "group",
			label: groupLabel
		}
	];

	if (ageLabel) {
		items.push({
			key: "age",
			label: ageLabel
		});
	}

	if (tour.optionCount != null && tour.optionCount > 0) {
		items.push({
			key: "options",
			label: formatUiText(card.options, {
				count: tour.optionCount
			})
		});
	}

	return items;
}
