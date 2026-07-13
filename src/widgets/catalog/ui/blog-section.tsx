"use client";

import type { FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";
import { withErrorBoundary } from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";
import { BlogCard } from "@/shared/ui/cards";

import type { TBlogCardData } from "@/cms/lib/map-discovery-cards";

type TProps = {
	posts: TBlogCardData[];
};

const BlogSectionBase: FC<TProps> = ({ posts }) => {
	const { catalog } = useUiContent();

	if (!posts.length) {
		return null;
	}

	return (
		<section className="flex flex-col gap-6 sm:gap-7">
			<div className="flex items-center justify-between gap-4">
				<h2 className="text-xl font-semibold sm:text-2xl">
					{catalog.blog.title}
				</h2>
				<Link
					href={ENUM_PATH.DISCOVERY.BLOG}
					className="text-primary text-sm font-medium"
				>
					{catalog.blog.viewAll}
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
