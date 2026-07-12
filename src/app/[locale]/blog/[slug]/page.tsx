import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { buildBlogDetailBreadcrumbs } from "@/shared/lib/routing/build-discovery-breadcrumbs";
import { createCmsPageMetadata } from "@/shared/lib/seo";

import { Cms } from "@/widgets/cms";

import { findBlogPostBySlug } from "@/cms/api";
import { mapCmsBlocks } from "@/cms/lib";

export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: TypedLocale; slug: string }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, slug } = await params;
	const post = await findBlogPostBySlug(locale, slug);

	if (!post) {
		return {};
	}

	return createCmsPageMetadata({
		seo: post.seo ?? {},
		locale,
		path: `/blog/${slug}`
	});
}

export default async function BlogDetailRoute({ params }: TProps) {
	const { locale, slug } = await params;

	setRequestLocale(locale);

	const post = await findBlogPostBySlug(locale, slug);

	if (!post) {
		notFound();
	}

	return (
		<Cms
			sections={mapCmsBlocks(post.blocks)}
			breadcrumbItems={buildBlogDetailBreadcrumbs(post.title, post.slug)}
		/>
	);
}
