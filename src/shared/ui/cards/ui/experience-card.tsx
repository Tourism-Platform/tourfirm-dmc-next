import Image from "next/image";

import { Badge } from "../../shadcn-ui/badge";
import { Card, CardContent } from "../../shadcn-ui/card";
import type { TExperienceCardProps } from "../types/experience-card.types";

export function ExperienceCard({ data }: TExperienceCardProps) {
	return (
		<Card className="grid grid-rows-[max-content_1fr] overflow-hidden p-0 gap-0">
			<div className="relative h-64">
				<Image
					src={data.imageUrl}
					alt={data.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
			</div>
			<CardContent className="flex flex-1 flex-col gap-3 p-5">
				<Badge variant="secondary">{data.badge}</Badge>
				<h3 className="text-base font-semibold sm:text-lg">
					{data.title}
				</h3>
				<p className="text-muted-foreground text-sm">
					{data.description}
				</p>
			</CardContent>
		</Card>
	);
}
