"use client";

import { Link, NavGroup } from "@payloadcms/ui";

import type { TPageDomain } from "@/shared/config/cms/page-domains";

import {
	COMPANY_PAGES_ADMIN,
	PAGE_DOMAIN_ADMIN,
	buildAdminCompanyPagesHref,
	buildAdminPagesViewHref
} from "@/cms/admin/page-domain-admin.config";

export function DomainPagesNavLinks() {
	return (
		<>
			<NavGroup label={COMPANY_PAGES_ADMIN.label}>
				<Link className="nav__link" href={buildAdminCompanyPagesHref()}>
					{COMPANY_PAGES_ADMIN.navLabel}
				</Link>
			</NavGroup>
			{(Object.keys(PAGE_DOMAIN_ADMIN) as TPageDomain[]).map((domain) => {
				const { label, navLabel } = PAGE_DOMAIN_ADMIN[domain];

				return (
					<NavGroup key={domain} label={label}>
						<Link
							className="nav__link"
							href={buildAdminPagesViewHref(domain)}
						>
							{navLabel}
						</Link>
					</NavGroup>
				);
			})}
		</>
	);
}
