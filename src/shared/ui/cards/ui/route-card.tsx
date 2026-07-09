import Image from "next/image";

import { Link } from "@/shared/i18n";

import { ButtonLink } from "../../buttons/ui";
import { Badge } from "../../shadcn-ui/badge";
import { Card, CardContent } from "../../shadcn-ui/card";
import type { TRouteCardProps } from "../types/route-card.types";

export function RouteCard({ data }: TRouteCardProps) {
	return (
		<Card className="grid grid-rows-[max-content_1fr] overflow-hidden p-0 gap-0 transition-shadow hover:shadow-lg">
			<Link href={data.href} className="relative block h-64">
				<Image
					src={data.imageUrl}
					alt={data.title}
					fill
					className="object-cover"
					sizes="(max-width: 1024px) 100vw, 33vw"
				/>
			</Link>
			<CardContent className="flex flex-1 flex-col gap-3 p-5">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="secondary">{data.badge}</Badge>
					{data.meta ? (
						<span className="text-muted-foreground text-xs">
							{data.meta}
						</span>
					) : null}
				</div>
				<h3 className="text-base font-semibold sm:text-lg">
					<Link href={data.href} className="hover:text-primary">
						{data.title}
					</Link>
				</h3>
				<p className="text-muted-foreground flex-1 text-sm">
					{data.description}
				</p>
				<ButtonLink
					href={data.href}
					title="Explore route"
					variant="outline"
					className="w-fit"
				/>
			</CardContent>
		</Card>
	);
}
