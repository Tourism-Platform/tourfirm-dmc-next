import { getTranslations } from "next-intl/server";

import { ENUM_PATH } from "@/shared/config";
import type { TBreadcrumbItem } from "@/shared/lib/routing/build-geo-breadcrumbs";

import { ExperiencesHub } from "@/widgets/experiences";

import { mapCmsBlocks } from "@/cms/lib";
import { mapExperienceToCard } from "@/cms/lib/map-discovery-cards";
import type {
	Experience,
	ExperiencesHub as TExperiencesHubGlobal
} from "@/payload-types";

type TProps = {
	hub: TExperiencesHubGlobal | null;
	experiences: Experience[];
	breadcrumbItems: TBreadcrumbItem[];
	pagination: {
		page: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
};

export async function ExperiencesHubPage({
	hub,
	experiences,
	breadcrumbItems,
	pagination
}: TProps) {
	const t = await getTranslations("discovery_page.experiences");

	return (
		<ExperiencesHub
			title={hub?.title ?? "Experiences"}
			subtitle={hub?.subtitle ?? undefined}
			eyebrow={t("eyebrow")}
			catalogTitle={t("catalog_title")}
			catalogDescription={t("catalog_description")}
			emptyLabel={t("empty")}
			paginationPrevLabel={t("pagination_prev")}
			paginationNextLabel={t("pagination_next")}
			introSections={mapCmsBlocks(hub?.blocks ?? [])}
			cards={experiences.map(mapExperienceToCard)}
			breadcrumbItems={breadcrumbItems}
			baseHref={ENUM_PATH.DISCOVERY.EXPERIENCES}
			pagination={pagination}
		/>
	);
}
