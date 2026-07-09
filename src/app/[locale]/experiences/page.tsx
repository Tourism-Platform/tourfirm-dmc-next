import { setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildDiscoveryBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { ExperiencesHubPage } from "@/page/experiences";

import { findExperiences, getExperiencesHub } from "@/cms/api";

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

	const [hub, experiencesResult] = await Promise.all([
		getExperiencesHub(locale),
		findExperiences(locale, { page })
	]);

	return (
		<ExperiencesHubPage
			hub={hub}
			experiences={experiencesResult.docs}
			breadcrumbItems={buildDiscoveryBreadcrumbs([
				{ label: "Experiences", href: ENUM_PATH.DISCOVERY.EXPERIENCES }
			])}
			pagination={{
				page: experiencesResult.page,
				totalPages: experiencesResult.totalPages,
				hasNextPage: experiencesResult.hasNextPage,
				hasPrevPage: experiencesResult.hasPrevPage
			}}
		/>
	);
}
