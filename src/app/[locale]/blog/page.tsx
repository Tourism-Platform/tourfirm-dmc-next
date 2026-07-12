import { getTranslations, setRequestLocale } from "next-intl/server";
import type { TypedLocale } from "payload";

import { ENUM_PATH } from "@/shared/config";
import { buildDiscoveryBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";
import { CmsPagination } from "@/shared/ui/pagination";

import { Cms } from "@/widgets/cms";

import { findBlogPosts, getBlogHub } from "@/cms/api";
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
	const hub = await getBlogHub(locale);

	return createCmsPageMetadata({
		seo: hub?.seo ?? {},
		locale,
		path: ENUM_PATH.DISCOVERY.BLOG
	});
}

export default async function BlogHubRoute({ params, searchParams }: TProps) {
	const { locale } = await params;
	const query = await searchParams;

	setRequestLocale(locale);

	const page = query.page ? Number(query.page) : undefined;
	const t = await getTranslations("discovery_page.blog");

	const [hub, blogResult] = await Promise.all([
		getBlogHub(locale),
		findBlogPosts(locale, { page })
	]);

	const sections = mapCmsBlocks(
		resolveBlockData(hub?.blocks ?? [], {
			document: (hub ?? {}) as Record<string, unknown>,
			locale,
			collections: { blog: blogResult.docs },
			query: { page: query.page }
		})
	);

	return (
		<>
			<Cms
				sections={sections}
				breadcrumbItems={buildDiscoveryBreadcrumbs([
					{ label: "Blog", href: ENUM_PATH.DISCOVERY.BLOG }
				])}
			/>
			<CmsPagination
				baseHref={ENUM_PATH.DISCOVERY.BLOG}
				pagination={{
					page: blogResult.page,
					totalPages: blogResult.totalPages,
					hasNextPage: blogResult.hasNextPage,
					hasPrevPage: blogResult.hasPrevPage
				}}
				prevLabel={t("pagination_prev")}
				nextLabel={t("pagination_next")}
				ariaLabel="Blog pagination"
			/>
		</>
	);
}
