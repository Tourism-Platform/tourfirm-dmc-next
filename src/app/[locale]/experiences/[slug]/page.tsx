import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { buildExperienceDetailBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { ExperienceDetailPage } from "@/page/experiences";

import {
	findExperienceBySlug,
	findSimilarExperiences,
	getDestination
} from "@/cms/api";
import { getExperienceThemeIds } from "@/cms/lib/map-discovery-cards";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: TypedLocale; slug: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, slug } = await params;
	const experience = await findExperienceBySlug(locale, slug);

	if (!experience) {
		return {};
	}

	return createCmsPageMetadata({
		seo: experience.seo ?? {},
		locale,
		path: `/experiences/${slug}`
	});
}

export default async function ExperienceDetailRoute({ params }: TProps) {
	const { locale, slug } = await params;

	setRequestLocale(locale);

	const [experience, destination] = await Promise.all([
		findExperienceBySlug(locale, slug),
		getDestination(locale)
	]);

	if (!experience) {
		notFound();
	}

	const similarExperiences = await findSimilarExperiences(
		locale,
		experience.id,
		getExperienceThemeIds(experience)
	);

	return (
		<ExperienceDetailPage
			experience={experience}
			navigationRootSlug={destination?.slug ?? "destinations"}
			breadcrumbItems={buildExperienceDetailBreadcrumbs(
				experience.title,
				experience.slug
			)}
			similarExperiences={similarExperiences}
		/>
	);
}
