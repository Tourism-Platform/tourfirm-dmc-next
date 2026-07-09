import Image from "next/image";

import { Link } from "@/shared/i18n";

import { Badge } from "../../shadcn-ui/badge";
import { Card, CardContent } from "../../shadcn-ui/card";
import type { TGeoDiscoveryCardProps } from "../types/geo-discovery-card.types";

export function GeoDiscoveryCard({ data }: TGeoDiscoveryCardProps) {
	return (
		<Link href={data.href} className="group block">
			<Card className="grid grid-rows-[max-content_1fr] overflow-hidden p-0 gap-0 transition-shadow group-hover:shadow-lg">
				<div className="relative h-48">
					<Image
						src={data.imageUrl}
						alt={data.title}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, 33vw"
					/>
				</div>
				<CardContent className="flex flex-col gap-2 p-4">
					<Badge variant="secondary">{data.badge}</Badge>
					<h3 className="text-base font-semibold">{data.title}</h3>
					<p className="text-muted-foreground line-clamp-3 text-sm">
						{data.description}
					</p>
				</CardContent>
			</Card>
		</Link>
	);
}
