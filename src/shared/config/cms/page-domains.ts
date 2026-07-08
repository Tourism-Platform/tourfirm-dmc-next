import type { Where } from "payload";

import type { Page } from "@/payload-types";

export const PAGE_DOMAINS = {
	legal: {
		segmentSlug: "legal",
		pathGroup: null
	},
	team: {
		segmentSlug: "company",
		pathGroup: "team"
	}
} as const;

export type TPageDomain = keyof typeof PAGE_DOMAINS;

// Порядок важен на случай появления пересекающихся доменов в будущем.
// Сейчас правила взаимоисключающие — порядок не влияет на результат.
export const DOMAIN_CHECK_ORDER: TPageDomain[] = ["team", "legal"];

type TPageDomainSource = Pick<Page, "segment" | "pathGroup">;

function getPageSegmentSlug(page: TPageDomainSource): string | null {
	const { segment } = page;

	if (segment == null) {
		return null;
	}

	if (typeof segment === "object" && "slug" in segment) {
		return segment.slug;
	}

	return null;
}

export function matchesPageDomain(
	page: TPageDomainSource,
	domain: TPageDomain
): boolean {
	const rule = PAGE_DOMAINS[domain];
	const segmentSlug = getPageSegmentSlug(page);

	if (segmentSlug !== rule.segmentSlug) {
		return false;
	}

	if (rule.pathGroup === null) {
		return !page.pathGroup;
	}

	return page.pathGroup === rule.pathGroup;
}

export function getPageDomain(page: TPageDomainSource): TPageDomain | null {
	for (const domain of DOMAIN_CHECK_ORDER) {
		if (matchesPageDomain(page, domain)) {
			return domain;
		}
	}

	return null;
}

export function buildPageDomainWhere(domain: TPageDomain): Where {
	const rule = PAGE_DOMAINS[domain];

	const segmentFilter: Where = {
		"segment.slug": {
			equals: rule.segmentSlug
		}
	};

	if (rule.pathGroup === null) {
		return {
			and: [
				segmentFilter,
				{
					pathGroup: {
						exists: false
					}
				}
			]
		};
	}

	return {
		and: [
			segmentFilter,
			{
				pathGroup: {
					equals: rule.pathGroup
				}
			}
		]
	};
}
