"use client";

import { useRowLabel } from "@payloadcms/ui";

type TUserMenuItemRow = {
	title?: string | null;
	href?: string | null;
};

export function UserMenuItemRowLabel() {
	const { data, rowNumber } = useRowLabel<TUserMenuItemRow>();
	const fallback = `Item ${String(rowNumber).padStart(2, "0")}`;
	const title = data?.title?.trim();
	const href = data?.href?.trim();

	if (title && href) {
		return (
			<span>
				{title} — {href}
			</span>
		);
	}

	return <span>{title || href || fallback}</span>;
}
