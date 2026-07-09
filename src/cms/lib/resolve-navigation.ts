import "server-only";

import { isDestinationsHref } from "@/shared/lib/routing/is-destinations-href";
import {
	isExperiencesHref,
	isRoutesHref
} from "@/shared/lib/routing/is-discovery-href";
import type {
	TNavigationTarget,
	TResolvedFooterColumn,
	TResolvedNavItem,
	TResolvedNavLink
} from "@/shared/types/navigation.types";

import { resolveNavigationItemLabel } from "./navigation-item-label";
import { resolvePagePath } from "./resolve-page-path";
import type { Footer, Header, Page } from "@/payload-types";

type THeaderNavItem = NonNullable<Header["navItems"]>[number];
type TFooterNavItem = NonNullable<
	NonNullable<Footer["columns"]>[number]["items"]
>[number];
type TNavItem = THeaderNavItem | TFooterNavItem;
type TGroupChildItem = NonNullable<
	NonNullable<THeaderNavItem["groupItems"]>[number]
>;

function resolveExternalHref(
	href: string | null | undefined,
	type: "external" | "custom"
): string | undefined {
	if (!href?.trim()) {
		return undefined;
	}

	const value = href.trim();

	if (type === "external") {
		return value;
	}

	return value.startsWith("/") ? value : `/${value}`;
}

function getPopulatedPage(page: TNavItem["page"]): Page | null {
	if (!page || typeof page === "number") {
		return null;
	}

	return page;
}

function toTarget(value: string | null | undefined): TNavigationTarget {
	return value === "_blank" ? "_blank" : "_self";
}

function resolveNavIcon(
	icon: string | null | undefined,
	parentIcon?: string
): string | undefined {
	const value = icon?.trim();

	if (value) {
		return value;
	}

	return parentIcon?.trim() || undefined;
}

function mapLeafNavItem(
	item: TNavItem | TGroupChildItem,
	key: string,
	fallbackLabel: string,
	parentIcon?: string
): TResolvedNavItem | null {
	if (item.type === "page") {
		const page = getPopulatedPage(item.page);

		if (!page) {
			return null;
		}

		return {
			key,
			label: resolveNavigationItemLabel(
				item,
				page.title ?? fallbackLabel
			),
			description: item.description?.trim() || undefined,
			href: resolvePagePath(page),
			target: toTarget(item.target),
			icon: resolveNavIcon(item.icon, parentIcon)
		};
	}

	if (item.type === "external" || item.type === "custom") {
		const href = resolveExternalHref(item.href, item.type);

		if (!href) {
			return null;
		}

		return {
			key,
			label: resolveNavigationItemLabel(item, fallbackLabel),
			description: item.description?.trim() || undefined,
			href,
			target: toTarget(item.target),
			icon: resolveNavIcon(item.icon, parentIcon)
		};
	}

	return null;
}

function mapGroupChildren(
	items: TGroupChildItem[] | null | undefined,
	parentKey: string,
	parentIcon?: string
): TResolvedNavItem[] {
	return (items ?? [])
		.map((child, index) => {
			const key = child.id ?? `${parentKey}-item-${index}`;
			const fallback = `Item ${String(index + 1).padStart(2, "0")}`;

			return mapLeafNavItem(child, key, fallback, parentIcon);
		})
		.filter((item): item is TResolvedNavItem => item !== null);
}

function mapNavItemLink(
	item: TNavItem,
	key: string,
	itemIndex: number
): Pick<TResolvedNavLink, "href" | "sections" | "target"> {
	const fallback = `Item ${String(itemIndex + 1).padStart(2, "0")}`;

	if (item.type === "group") {
		const children = mapGroupChildren(
			item.groupItems,
			key,
			item.icon ?? undefined
		);

		if (children.length === 0) {
			return { sections: [] };
		}

		return {
			sections: [{ items: children }]
		};
	}

	const leaf = mapLeafNavItem(item, key, fallback);

	if (!leaf?.href) {
		return { sections: [] };
	}

	return {
		href: leaf.href,
		target: leaf.target,
		sections: []
	};
}

// INVARIANT: header nav order = CMS header.navItems[] array order only.
export function resolveHeaderNavigation(
	locale: string,
	navItems: Header["navItems"] | null | undefined,
	destinationSlug?: string
): TResolvedNavLink[] {
	void locale;

	if (!navItems?.length) {
		return [];
	}

	return navItems.map((item, index) => {
		const key = item.id ?? String(index);
		const resolved = mapNavItemLink(item, key, index);
		const isDestinationsMega =
			item.icon === "map-pin" &&
			destinationSlug != null &&
			isDestinationsHref(resolved.href, destinationSlug);
		const isRoutesMega =
			item.icon === "route" && isRoutesHref(resolved.href);
		const isExperiencesMega =
			item.icon === "heart-handshake" && isExperiencesHref(resolved.href);

		let variant: TResolvedNavLink["variant"] = "default";

		if (isDestinationsMega) {
			variant = "destinations-mega";
		} else if (isRoutesMega) {
			variant = "routes-mega";
		} else if (isExperiencesMega) {
			variant = "experiences-mega";
		}

		return {
			key,
			label: resolveNavigationItemLabel(
				item,
				`Item ${String(index + 1).padStart(2, "0")}`
			),
			icon: item.icon ?? undefined,
			variant,
			...resolved
		};
	});
}

// INVARIANT: footer column and item order = CMS footer.columns[] / items[] array order only.
export function resolveFooterNavigation(
	locale: string,
	columns: Footer["columns"] | null | undefined
): TResolvedFooterColumn[] {
	void locale;

	if (!columns?.length) {
		return [];
	}

	return columns.map((column, columnIndex) => {
		const columnKey = column.id ?? String(columnIndex);
		const items = column.items ?? [];

		const links = items.flatMap((item, itemIndex) => {
			const key = item.id ?? `${columnKey}-${itemIndex}`;
			const resolved = mapNavItemLink(item, key, itemIndex);

			if (item.type === "group") {
				return (resolved.sections[0]?.items ?? []).map(
					(child, childIndex) => ({
						key: child.key || `${key}-${childIndex}`,
						label: child.label,
						href: child.href ?? "#",
						target: child.target
					})
				);
			}

			return [
				{
					key,
					label: resolveNavigationItemLabel(
						item,
						`Item ${String(itemIndex + 1).padStart(2, "0")}`
					),
					href: resolved.href ?? "#",
					target: resolved.target
				}
			];
		});

		return {
			key: columnKey,
			title: column.title,
			links
		};
	});
}
