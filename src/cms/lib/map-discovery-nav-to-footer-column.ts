import type { TDiscoveryNavTree } from "@/shared/types/discovery-nav.types";
import type { TResolvedFooterColumn } from "@/shared/types/navigation.types";

export function mapDiscoveryNavToFooterColumn(
	tree: TDiscoveryNavTree,
	key: string,
	title: string,
	viewAllLabel: string
): TResolvedFooterColumn | null {
	if (!tree.items.length) {
		return null;
	}

	return {
		key,
		title,
		links: [
			...tree.items.map((item) => ({
				key: item.id,
				label: item.title,
				href: item.href
			})),
			{
				key: `${key}-hub`,
				label: viewAllLabel,
				href: tree.rootHref
			}
		]
	};
}

/** @deprecated Prefer mapDiscoveryNavToFooterColumn */
export function mapExperiencesNavToFooterColumn(
	tree: TDiscoveryNavTree,
	title: string,
	viewAllLabel: string
): TResolvedFooterColumn | null {
	return mapDiscoveryNavToFooterColumn(
		tree,
		"experiences-footer",
		title,
		viewAllLabel
	);
}
