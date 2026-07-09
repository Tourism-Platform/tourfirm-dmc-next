import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildThemeDetailBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { ThemeHubPage } from "@/page/themes";

import { findExperiences, findRoutes, findThemeBySlug } from "@/cms/api";

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

	return (
		<ThemeHubPage
			theme={theme}
			routes={routesResult.docs}
			experiences={experiencesResult.docs}
			breadcrumbItems={buildThemeDetailBreadcrumbs(
				theme.title,
				theme.slug
			)}
		/>
	);
}
