import type { TypedLocale } from "payload";

import { Catalog } from "@/widgets/catalog";

import { findFeaturedBlogPosts } from "@/cms/api/find-blog-posts";
import { mapBlogToCard } from "@/cms/lib/map-discovery-cards";

type TProps = {
	locale: TypedLocale;
};

export async function CatalogPage({ locale }: TProps) {
	const blogPosts = await findFeaturedBlogPosts(locale, 3);

	return <Catalog blogPosts={blogPosts.map(mapBlogToCard)} />;
}
