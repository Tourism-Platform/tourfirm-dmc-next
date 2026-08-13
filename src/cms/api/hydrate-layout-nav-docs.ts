import "server-only";

import { relationId } from "./relation-id";
import type { Footer, Header, Media, Page } from "@/payload-types";

export const LAYOUT_NAV_PAGE_DEPTH = 1 as const;

export const LAYOUT_NAV_PAGE_SELECT = {
	slug: true,
	title: true,
	pathGroup: true,
	segment: true
} as const;

export const LAYOUT_GLOBAL_CACHE_VERSION = "v2-lean-select";

type TNavItemLike = {
	page?: number | Page | null;
	groupItems?: TNavItemLike[] | null;
};

function collectItemPageIds(
	items: TNavItemLike[] | null | undefined,
	ids: Set<number>
): void {
	for (const item of items ?? []) {
		const pageId = relationId(item.page);
		if (pageId != null) {
			ids.add(pageId);
		}
		collectItemPageIds(item.groupItems, ids);
	}
}

export function collectHeaderPageIds(doc: Header): number[] {
	const ids = new Set<number>();
	collectItemPageIds(doc.navItems as TNavItemLike[] | undefined, ids);
	return [...ids];
}

export function collectFooterPageIds(doc: Footer): number[] {
	const ids = new Set<number>();
	for (const column of doc.columns ?? []) {
		collectItemPageIds(column.items as TNavItemLike[] | undefined, ids);
	}
	return [...ids];
}

export function collectHeaderMediaIds(doc: Header): number[] {
	const logoId = relationId(doc.logo);
	return logoId == null ? [] : [logoId];
}

function pagesById(pages: Page[]): Map<number, Page> {
	return new Map(pages.map((page) => [page.id, page]));
}

function resolvePage(
	page: number | Page | null | undefined,
	byId: Map<number, Page>
): number | Page | null | undefined {
	const id = relationId(page);
	if (id == null) {
		return page;
	}
	return byId.get(id) ?? page;
}

function hydrateNavItems<T extends TNavItemLike>(
	items: T[] | null | undefined,
	byId: Map<number, Page>
): T[] | null | undefined {
	if (!items) {
		return items;
	}

	return items.map((item) => ({
		...item,
		page: resolvePage(item.page, byId),
		groupItems: hydrateNavItems(item.groupItems, byId)
	}));
}

export function hydrateHeaderNavDocs(
	doc: Header,
	pages: Page[],
	media: Media[]
): Header {
	const byId = pagesById(pages);
	const logoId = relationId(doc.logo);
	const logo =
		logoId == null
			? doc.logo
			: (media.find((item) => item.id === logoId) ?? doc.logo);

	return {
		...doc,
		logo,
		navItems: hydrateNavItems(
			doc.navItems as TNavItemLike[] | undefined,
			byId
		) as Header["navItems"]
	};
}

export function hydrateFooterNavDocs(doc: Footer, pages: Page[]): Footer {
	const byId = pagesById(pages);

	return {
		...doc,
		columns: doc.columns?.map((column) => ({
			...column,
			items: hydrateNavItems(
				column.items as TNavItemLike[] | undefined,
				byId
			)
		})) as Footer["columns"]
	};
}
