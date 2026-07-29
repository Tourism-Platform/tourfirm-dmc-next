import type { TInformationNavTree } from "@/shared/types/information-nav.types";
import type { TResolvedFooterColumn } from "@/shared/types/navigation.types";

export function mapInformationAreasToFooterColumns(
	tree: TInformationNavTree,
	viewAllLabel: string
): TResolvedFooterColumn[] {
	return tree.areas.map((area) => ({
		key: `information-${area.key}`,
		title: area.label,
		links: [
			...area.items.map((item) => ({
				key: item.id,
				label: item.title,
				href: item.href
			})),
			{
				key: `${area.key}-hub`,
				label: viewAllLabel,
				href: area.hubHref
			}
		]
	}));
}
