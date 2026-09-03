import { ListView } from "@payloadcms/next/views";
import type { AdminViewServerProps, Where } from "payload";
import { combineWhereConstraints } from "payload/shared";

import {
	type TPageDomain,
	buildPageDomainWhere
} from "@/shared/config/cms/page-domains";

const COMPANY_PAGES_WHERE: Where = {
	"segment.slug": {
		equals: "company"
	},
	pathGroup: {
		exists: false
	}
};

async function renderPagesListView(props: AdminViewServerProps, where: Where) {
	const existingWhere = props.initPageResult.req.query?.where as
		| Where
		| undefined;

	return ListView({
		...props,
		enableRowSelections: true,
		query: {
			...props.initPageResult.req.query,
			where: combineWhereConstraints([existingWhere, where])
		}
	});
}

async function renderDomainPagesListView(
	props: AdminViewServerProps,
	domain: TPageDomain
) {
	return renderPagesListView(props, buildPageDomainWhere(domain));
}

export async function CompanyPagesListView(props: AdminViewServerProps) {
	return renderPagesListView(props, COMPANY_PAGES_WHERE);
}

export async function TeamPagesListView(props: AdminViewServerProps) {
	return renderDomainPagesListView(props, "team");
}

export async function LegalPagesListView(props: AdminViewServerProps) {
	return renderDomainPagesListView(props, "legal");
}
