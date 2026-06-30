"use client";

import { useRowLabel } from "@payloadcms/ui";

import { resolveNavigationItemLabel } from "@/cms/lib/navigation-item-label";
import type { TNavigationItemLabelSource } from "@/cms/lib/navigation-item-label";

export function NavigationItemRowLabel() {
	const { data, rowNumber } = useRowLabel<TNavigationItemLabelSource>();
	const fallback = `Item ${String(rowNumber).padStart(2, "0")}`;

	return <span>{resolveNavigationItemLabel(data ?? {}, fallback)}</span>;
}
