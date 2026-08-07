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
				"h-full overflow-hidden py-0",
				data.className ?? "bg-accent"
			)}
		>
			<CardContent className="grid h-full min-h-32 grid-cols-[1fr_auto] items-stretch gap-4 py-5 sm:min-h-36 sm:gap-5 sm:py-6">
				<div className="flex min-h-0 flex-col justify-between gap-3">
					<div className="flex flex-col gap-2">
						{data.meta ? (
							<span className="text-muted-foreground text-xs">
								{data.meta}
							</span>
						) : null}
						<h3 className="text-base leading-snug font-semibold sm:text-lg">
							{data.title}
						</h3>
					</div>
					<Link
						href={href}
						className="text-primary inline-flex items-center gap-1 text-sm font-medium"
					>
						{readMore}
						<ArrowRight className="size-4" />
					</Link>
				</div>
				{data.imageUrl ? (
					<div className="relative size-28 shrink-0 self-center overflow-hidden rounded-xl sm:size-32">
						<Image
							src={data.imageUrl}
							alt=""
							fill
							className="object-cover"
							sizes="128px"
						/>
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}
