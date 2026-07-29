import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";
import type { TResolvedFooterColumn } from "@/shared/types/navigation.types";

export function mapExperiencesNavToFooterColumn(
	tree: TDiscoveryNavTree,
	title: string,
	viewAllLabel: string
): TResolvedFooterColumn | null {
	if (!tree.items.length) {
		return null;
	}

	return {
		key: "experiences-footer",
		title,
		links: [
			...tree.items.map((item) => ({
				key: item.id,
				label: item.title,
				href: item.href
			})),
			{
				key: "experiences-hub",
				label: viewAllLabel,
				href: tree.rootHref
			}
		]
	};
}
