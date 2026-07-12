import { getTranslations, setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildDiscoveryBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";
import { CmsPagination } from "@/shared/ui/pagination";

import { Cms } from "@/widgets/cms";

import { findExperiences, getExperiencesHub } from "@/cms/api";
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
	const hub = await getExperiencesHub(locale);

	return createCmsPageMetadata({
		seo: hub?.seo ?? {},
		locale,
		path: ENUM_PATH.DISCOVERY.EXPERIENCES
	});
}

export default async function ExperiencesHubRoute({
	params,
	searchParams
}: TProps) {
	const { locale } = await params;
	const query = await searchParams;

	setRequestLocale(locale);

	const page = query.page ? Number(query.page) : undefined;
	const t = await getTranslations("discovery_page.experiences");

	const [hub, experiencesResult] = await Promise.all([
		getExperiencesHub(locale),
		findExperiences(locale, { page })
	]);

	const sections = mapCmsBlocks(
		resolveBlockData(hub?.blocks ?? [], {
			document: (hub ?? {}) as Record<string, unknown>,
			locale,
			collections: { experiences: experiencesResult.docs },
			query: { page: query.page }
		})
	);

	return (
		<>
			<Cms
				sections={sections}
				breadcrumbItems={buildDiscoveryBreadcrumbs([
					{
						label: "Experiences",
						href: ENUM_PATH.DISCOVERY.EXPERIENCES
					}
				])}
			/>
			<CmsPagination
				baseHref={ENUM_PATH.DISCOVERY.EXPERIENCES}
				pagination={{
					page: experiencesResult.page,
					totalPages: experiencesResult.totalPages,
					hasNextPage: experiencesResult.hasNextPage,
					hasPrevPage: experiencesResult.hasPrevPage
				}}
				prevLabel={t("pagination_prev")}
				nextLabel={t("pagination_next")}
				ariaLabel="Experiences pagination"
			/>
		</>
	);
}
