import { ListView } from "@payloadcms/next/views";
import type { AdminViewServerProps, Where } from "payload";
import { combineWhereConstraints } from "payload/shared";

import {
	type TPageDomain,
	buildPageDomainWhere
} from "@/shared/config/cms/page-domains";

async function renderDomainPagesListView(
	props: AdminViewServerProps,
	domain: TPageDomain
) {
	const existingWhere = props.initPageResult.req.query?.where as
		| Where
		| undefined;
	const domainWhere = buildPageDomainWhere(domain);

	return ListView({
		...props,
		enableRowSelections: true,
		query: {
			...props.initPageResult.req.query,
			where: combineWhereConstraints([existingWhere, domainWhere])
		}
	});
}

export async function TeamPagesListView(props: AdminViewServerProps) {
	return renderDomainPagesListView(props, "team");
}

export async function LegalPagesListView(props: AdminViewServerProps) {
	return renderDomainPagesListView(props, "legal");
}
