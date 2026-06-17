import type { TBlockRenderProps } from "../types/block-render.types";
import type { TCardRenderProps } from "@/shared/ui/cards/types/card-render.types";

type TBlockSectionConfig = Omit<TBlockRenderProps, "cards"> & {
	cards?: (t: (key: string) => string) => TCardRenderProps[];
};

export function mapBlockSection(
	section: TBlockSectionConfig,
	t: (key: string) => string
): TBlockRenderProps {
	return {
		blockType: section.blockType,
		eyebrow: section.eyebrow ? t(section.eyebrow) : undefined,
		title: section.title ? t(section.title) : undefined,
		note: section.note ? t(section.note) : undefined,
		description: section.description
			? t(section.description)
			: undefined,
		gridClassName: section.gridClassName,
		actions: section.actions?.map((action) => ({
			...action,
			item: {
				...action.item,
				title: t(action.item.title)
			}
		})),
		cards: section.cards?.(t) ?? []
	};
}
