import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildThemeDetailBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { Cms } from "@/widgets/cms";
import { DiscoveryFilterBar } from "@/widgets/discovery";

import { findExperiences, findRoutes, findThemeBySlug } from "@/cms/api";
import { mapCmsBlocks, resolveBlockData } from "@/cms/lib";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: TypedLocale; slug: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, slug } = await params;
	const theme = await findThemeBySlug(locale, slug);

	if (!theme) {
		return {};
	}

	return createCmsPageMetadata({
		seo: theme.seo ?? {},
		locale,
		path: ENUM_PATH.DISCOVERY.themeDetail(slug)
	});
}

export default async function ThemeHubRoute({ params }: TProps) {
	const { locale, slug } = await params;

	setRequestLocale(locale);

	const theme = await findThemeBySlug(locale, slug);

	if (!theme) {
		notFound();
	}

	const [routesResult, experiencesResult] = await Promise.all([
		findRoutes(locale, { theme: slug, limit: 12 }),
		findExperiences(locale, { theme: slug, limit: 12 })
	]);

	const sections = mapCmsBlocks(
		resolveBlockData(theme.blocks, {
			document: theme as unknown as Record<string, unknown>,
			locale,
			collections: {
				routes: routesResult.docs,
				experiences: experiencesResult.docs
			}
		})
	);

	return (
		<>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
				<DiscoveryFilterBar
					filters={[
						{
							label: "All routes",
							value: "routes",
							href: `${ENUM_PATH.DISCOVERY.ROUTES}?theme=${theme.slug}`,
							active: false
						},
						{
							label: "All experiences",
							value: "experiences",
							href: `${ENUM_PATH.DISCOVERY.EXPERIENCES}?theme=${theme.slug}`,
							active: false
						}
					]}
				/>
			</div>
			<Cms
				sections={sections}
				breadcrumbItems={buildThemeDetailBreadcrumbs(
					theme.title,
					theme.slug
				)}
			/>
		</>
	);
}
