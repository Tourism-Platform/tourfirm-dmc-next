import { getTranslations, setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildDiscoveryBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";
import { CmsPagination } from "@/shared/ui/pagination";

import { Cms } from "@/widgets/cms";

import { findTradeFairs, getTradeFairsHub } from "@/cms/api";
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
	const hub = await getTradeFairsHub(locale);

	return createCmsPageMetadata({
		seo: hub?.seo ?? {},
		locale,
		path: ENUM_PATH.COMPANY.TRADE_FAIRS
	});
}

export default async function TradeFairsHubRoute({
	params,
	searchParams
}: TProps) {
	const { locale } = await params;
	const query = await searchParams;

	setRequestLocale(locale);

	const page = query.page ? Number(query.page) : undefined;
	const t = await getTranslations("company_page.trade_fairs");

	const [hub, tradeFairsResult] = await Promise.all([
		getTradeFairsHub(locale),
		findTradeFairs(locale, { page })
	]);

	const sections = mapCmsBlocks(
		resolveBlockData(hub?.blocks ?? [], {
			document: (hub ?? {}) as Record<string, unknown>,
			locale,
			collections: { "trade-fairs": tradeFairsResult.docs },
			query: { page: query.page }
		})
	);

	return (
		<>
			<Cms
				sections={sections}
				breadcrumbItems={buildDiscoveryBreadcrumbs([
					{
						label: "Trade fairs",
						href: ENUM_PATH.COMPANY.TRADE_FAIRS
					}
				])}
			/>
			<CmsPagination
				baseHref={ENUM_PATH.COMPANY.TRADE_FAIRS}
				pagination={{
					page: tradeFairsResult.page,
					totalPages: tradeFairsResult.totalPages,
					hasNextPage: tradeFairsResult.hasNextPage,
					hasPrevPage: tradeFairsResult.hasPrevPage
				}}
				prevLabel={t("pagination_prev")}
				nextLabel={t("pagination_next")}
				ariaLabel="Trade fairs pagination"
			/>
		</>
	);
}
