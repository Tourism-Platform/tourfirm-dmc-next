import type { TPageDomain } from "@/shared/config/cms/page-domains";

export const PAGE_DOMAIN_ADMIN: Record<
	TPageDomain,
	{ label: string; navLabel: string; viewPath: string }
> = {
	legal: { label: "⚖️ Legal", navLabel: "Legal pages", viewPath: "/legal" },
	team: { label: "👥 Team", navLabel: "Team pages", viewPath: "/team" }
};

const PAGES_COLLECTION_ADMIN_PATH = "/collections/pages";

export function buildAdminPagesViewHref(
	domain: TPageDomain,
	adminRoute = "/admin"
): string {
	const { viewPath } = PAGE_DOMAIN_ADMIN[domain];

	return `${adminRoute}${PAGES_COLLECTION_ADMIN_PATH}${viewPath}`;
}

export function resolvePageDomainFromAdminPath(
	urlSuffix: string | undefined
): TPageDomain | null {
	if (!urlSuffix) {
		return null;
	}

	for (const [domain, config] of Object.entries(PAGE_DOMAIN_ADMIN)) {
		if (
			urlSuffix.includes(
				`${PAGES_COLLECTION_ADMIN_PATH}${config.viewPath}`
			)
		) {
			return domain as TPageDomain;
		}
	}

	return null;
}
