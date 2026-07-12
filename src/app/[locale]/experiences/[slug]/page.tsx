import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { buildExperienceDetailBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { Cms } from "@/widgets/cms";
import { ExperienceMetaBar } from "@/widgets/discovery";

import {
	findExperienceBySlug,
	findSimilarExperiences,
	getDestination
} from "@/cms/api";
import {
	getExperienceThemeIds,
	mapCmsBlocks,
	resolveBlockData
} from "@/cms/lib";

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

	const country =
		typeof experience.country === "object" ? experience.country : null;
	const city = typeof experience.city === "object" ? experience.city : null;
	const themes =
		experience.themes
			?.map((theme) =>
				typeof theme === "object" ? theme.title : undefined
			)
			.filter((title): title is string => Boolean(title)) ?? [];
	const location = [city?.title, country?.title].filter(Boolean).join(", ");

	const sections = mapCmsBlocks(
		resolveBlockData(experience.blocks, {
			document: experience as unknown as Record<string, unknown>,
			locale,
			navigation: { rootSlug: destination?.slug ?? "destinations" },
			collections: { similarExperiences }
		})
	);

	return (
		<>
			<Cms
				sections={sections}
				breadcrumbItems={buildExperienceDetailBreadcrumbs(
					experience.title,
					experience.slug
				)}
			/>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:gap-14 sm:px-6 sm:py-20 lg:gap-16 lg:px-8">
				<ExperienceMetaBar
					type={
						experience.type
							? experience.type.replaceAll("_", " ").toLowerCase()
							: undefined
					}
					duration={experience.duration}
					location={location}
					themes={themes}
				/>
			</div>
		</>
	);
}
