"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { FC } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib";
import { Card, CardContent } from "@/shared/ui";

import { BLOG_POSTS_MOCK } from "../model";

const variantClasses = {
	accent: "bg-accent",
	secondary: "bg-secondary",
	muted: "bg-muted"
} as const;

export const BlogSection: FC = () => {
	const t = useTranslations("main_page");

	return (
		<section className="flex flex-col gap-6 sm:gap-7">
			<h2 className="text-xl font-semibold sm:text-2xl">
				{t("blog.title")}
			</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				{BLOG_POSTS_MOCK.map((post) => (
					<Card
						key={post.id}
						className={cn(
							"overflow-hidden py-0",
							variantClasses[post.variant]
						)}
					>
						<CardContent className="grid grid-cols-[1fr_min-content] items-center gap-4 py-4">
							<div className="flex flex-col gap-2">
								<span className="text-muted-foreground text-xs">
									{post.date}
								</span>
								<h3 className="text-sm font-semibold leading-snug sm:text-base">
									{post.title}
								</h3>
								<Link
									href={post.href}
									className="text-primary inline-flex items-center gap-1 text-sm font-medium"
								>
									{t("blog.read_more")}
									<ArrowRight className="size-4" />
								</Link>
							</div>
							<div className="relative size-16 shrink-0 overflow-hidden rounded-lg sm:size-20">
								<Image
									src={post.imageUrl}
									alt=""
									fill
									className="object-cover"
									sizes="80px"
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
};
