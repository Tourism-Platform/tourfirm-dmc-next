import type { TCardRenderProps } from "@/shared/ui/cards/types/card-render.types";
import type { TRouteMapStop } from "@/shared/ui/route-map";

import type { TBlockRenderProps } from "../types/block-render.types";

type TBlockSectionConfig = Omit<TBlockRenderProps, "cards" | "stops"> & {
	cards?: (t: (key: string) => string) => TCardRenderProps[];
	stops?: (t: (key: string) => string) => TRouteMapStop[];
};

export function mapBlockSection(
	section: TBlockSectionConfig,
	t: (key: string) => string
): TBlockRenderProps {
	return {
		...section,
		eyebrow: section.eyebrow ? t(section.eyebrow) : undefined,
		title: section.title ? t(section.title) : undefined,
		note: section.note ? t(section.note) : undefined,
		description: section.description ? t(section.description) : undefined,
		actions: section.actions?.map((action) => ({
			...action,
			item: {
				...action.item,
				title: t(action.item.title)
			}
		})),
		cards: section.cards?.(t) ?? [],
		stops: section.stops?.(t)
	};
}
