import { getTranslations, setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildDiscoveryBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";
import { CmsPagination } from "@/shared/ui/pagination";

import { Cms } from "@/widgets/cms";

import { findNews, getNewsHub } from "@/cms/api";
import { mapCmsBlocks, resolveBlockData } from "@/cms/lib";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: TypedLocale }>;
	searchParams: Promise<{
		page?: string;
	}>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	const hub = await getNewsHub(locale);

	return createCmsPageMetadata({
		seo: hub?.seo ?? {},
		locale,
		path: ENUM_PATH.COMPANY.NEWS
	});
}

export default async function NewsHubRoute({ params, searchParams }: TProps) {
	const { locale } = await params;
	const query = await searchParams;

	setRequestLocale(locale);

	const page = query.page ? Number(query.page) : undefined;
	const t = await getTranslations("company_page.news");

	const [hub, newsResult] = await Promise.all([
		getNewsHub(locale),
		findNews(locale, { page })
	]);

	const sections = mapCmsBlocks(
		resolveBlockData(hub?.blocks ?? [], {
			document: (hub ?? {}) as Record<string, unknown>,
			locale,
			collections: { news: newsResult.docs },
			query: { page: query.page }
		})
	);

	return (
		<>
			<Cms
				sections={sections}
				breadcrumbItems={buildDiscoveryBreadcrumbs([
					{ label: "News", href: ENUM_PATH.COMPANY.NEWS }
				])}
			/>
			<CmsPagination
				baseHref={ENUM_PATH.COMPANY.NEWS}
				pagination={{
					page: newsResult.page,
					totalPages: newsResult.totalPages,
					hasNextPage: newsResult.hasNextPage,
					hasPrevPage: newsResult.hasPrevPage
				}}
				prevLabel={t("pagination_prev")}
				nextLabel={t("pagination_next")}
				ariaLabel="News pagination"
			/>
		</>
	);
}
