"use client";

import { useTranslations } from "next-intl";
import type { FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { withErrorBoundary } from "@/shared/ui";
import { BlogCard } from "@/shared/ui/cards";

import type { TBlogCardData } from "@/cms/lib/map-discovery-cards";

type TProps = {
	posts: TBlogCardData[];
};

const BlogSectionBase: FC<TProps> = ({ posts }) => {
	const t = useTranslations("catalog_page");

	if (!posts.length) {
		return null;
	}

	return (
		<section className="flex flex-col gap-6 sm:gap-7">
			<div className="flex items-center justify-between gap-4">
				<h2 className="text-xl font-semibold sm:text-2xl">
					{t("blog.title")}
				</h2>
				<Link
					href={ENUM_PATH.DISCOVERY.BLOG}
					className="text-primary text-sm font-medium"
				>
					{t("blog.view_all")}
				</Link>
			</div>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{posts.map((post) => (
					<BlogCard key={post.href} data={post} />
				))}
			</div>
		</section>
	);
};

export const BlogSection = withErrorBoundary(BlogSectionBase);
