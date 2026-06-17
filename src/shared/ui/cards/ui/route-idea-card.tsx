import Image from "next/image";

import { Link } from "@/shared/i18n";

import { Badge } from "../../shadcn-ui/badge";
import { Button } from "../../shadcn-ui/button";
import { Card, CardContent } from "../../shadcn-ui/card";
import type { TRouteIdeaCardProps } from "../types/route-idea-card.types";

export function RouteIdeaCard({ data }: TRouteIdeaCardProps) {
	return (
		<Card className="grid grid-rows-[max-content_1fr] overflow-hidden p-0 gap-0">
			<div className="relative h-64">
				<Image
					src={data.imageUrl}
					alt={data.title}
					fill
					className="object-cover"
					sizes="(max-width: 1024px) 100vw, 33vw"
				/>
			</div>
			<CardContent className="flex flex-1 flex-col gap-3 p-5">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="secondary">{data.badge}</Badge>
					<span className="text-muted-foreground text-xs">
						{data.meta}
					</span>
				</div>
				<h3 className="text-base font-semibold sm:text-lg">
					{data.title}
				</h3>
				<p className="text-muted-foreground flex-1 text-sm">
					{data.description}
				</p>
				<Button asChild variant="outline" className="w-fit">
					<Link href={data.ctaHref}>{data.ctaLabel}</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
