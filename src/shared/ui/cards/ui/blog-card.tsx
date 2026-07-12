import Image from "next/image";

import { Link } from "@/shared/i18n";

import { Card } from "../../shadcn-ui/card";
import type { TBlogCardProps } from "../types/blog-card.types";

export function BlogCard({ data }: TBlogCardProps) {
	const content = (
		<Card className="flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
			<div className="relative h-40">
				<Image
					src={data.imageUrl}
					alt={data.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
			</div>
			<div className="flex flex-1 flex-col gap-2 p-5">
				<span className="text-muted-foreground text-xs">
					{data.meta}
				</span>
				<h3 className="text-base leading-snug font-semibold">
					{data.title}
				</h3>
			</div>
		</Card>
	);

	if (data.href) {
		return (
			<Link href={data.href} className="block h-full">
				{content}
			</Link>
		);
	}

	return content;
}
