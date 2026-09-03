import type { TPageDomain } from "@/shared/config/cms/page-domains";

type TPagesAdminNavItem = {
	label: string;
	navLabel: string;
	viewPath: string;
};

export const PAGE_DOMAIN_ADMIN: Record<TPageDomain, TPagesAdminNavItem> = {
	legal: { label: "⚖️ Legal", navLabel: "Legal pages", viewPath: "/legal" },
	team: { label: "👥 Team", navLabel: "Team pages", viewPath: "/team" }
};

export const COMPANY_PAGES_ADMIN: TPagesAdminNavItem = {
	label: "📝 Company",
	navLabel: "Company",
	viewPath: "/company"
};

const PAGES_COLLECTION_ADMIN_PATH = "/collections/pages";

function buildPagesAdminHref(viewPath: string, adminRoute = "/admin"): string {
	return `${adminRoute}${PAGES_COLLECTION_ADMIN_PATH}${viewPath}`;
}

export function buildAdminPagesViewHref(
	domain: TPageDomain,
	adminRoute = "/admin"
): string {
	return buildPagesAdminHref(PAGE_DOMAIN_ADMIN[domain].viewPath, adminRoute);
}

export function buildAdminCompanyPagesHref(adminRoute = "/admin"): string {
	return buildPagesAdminHref(COMPANY_PAGES_ADMIN.viewPath, adminRoute);
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
