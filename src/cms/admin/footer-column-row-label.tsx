"use client";

import { useRowLabel } from "@payloadcms/ui";

import { getColumnLinkCount } from "@/cms/lib/navigation-link-count";
import type { TNavigationItemLinkCountSource } from "@/cms/lib/navigation-link-count";

type TFooterColumnRowData = {
	title?: string | null;
	items?: TNavigationItemLinkCountSource[] | null;
};

export function FooterColumnRowLabel() {
	const { data, rowNumber } = useRowLabel<TFooterColumnRowData>();

	const title =
		data?.title?.trim() || `Column ${String(rowNumber).padStart(2, "0")}`;
	const linkCount = getColumnLinkCount(data?.items);

	if (linkCount > 0) {
		return (
			<span>
				{title} ({linkCount})
			</span>
		);
	}

	return <span>{title}</span>;
}
