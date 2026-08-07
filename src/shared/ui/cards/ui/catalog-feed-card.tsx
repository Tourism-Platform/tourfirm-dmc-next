import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

import { Card, CardContent } from "../../shadcn-ui/card";
import type { ICardItem } from "../types/card-render.types";

type TCatalogFeedCardProps = {
	data: ICardItem;
};

export function CatalogFeedCard({ data }: TCatalogFeedCardProps) {
	const readMore = data.readMoreLabel ?? data.ctaLabel ?? "Read more";
	const href = data.href ?? "#";

	return (
		<Card
			className={cn(
				"overflow-hidden py-0",
				data.className ?? "bg-accent"
			)}
		>
			<CardContent className="grid grid-cols-[1fr_min-content] items-center gap-4 py-4">
				<div className="flex flex-col gap-2">
					{data.meta ? (
						<span className="text-muted-foreground text-xs">
							{data.meta}
						</span>
					) : null}
					<h3 className="text-sm leading-snug font-semibold sm:text-base">
						{data.title}
					</h3>
					<Link
						href={href}
						className="text-primary inline-flex items-center gap-1 text-sm font-medium"
					>
						{readMore}
						<ArrowRight className="size-4" />
					</Link>
				</div>
				{data.imageUrl ? (
					<div className="relative size-16 shrink-0 overflow-hidden rounded-lg sm:size-20">
						<Image
							src={data.imageUrl}
							alt=""
							fill
							className="object-cover"
							sizes="80px"
						/>
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}
