import Image from "next/image";

import { Link } from "@/shared/i18n";

import { Badge } from "../../shadcn-ui/badge";
import { Card, CardContent } from "../../shadcn-ui/card";
import type { TExperienceCardProps } from "../types/experience-card.types";

export function ExperienceCard({ data }: TExperienceCardProps) {
	const image = (
		<div className="relative h-64">
			<Image
				src={data.imageUrl}
				alt={data.title}
				fill
				className="object-cover"
				sizes="(max-width: 768px) 100vw, 33vw"
			/>
		</div>
	);

	return (
		<Card className="grid grid-rows-[max-content_1fr] overflow-hidden p-0 gap-0 transition-shadow hover:shadow-lg">
			{data.href ? <Link href={data.href}>{image}</Link> : image}
			<CardContent className="flex flex-1 flex-col gap-3 p-5">
				<div className="flex flex-wrap items-center gap-2">
					<Badge variant="secondary">{data.badge}</Badge>
					{data.location ? (
						<span className="text-muted-foreground text-xs">
							{data.location}
						</span>
					) : null}
				</div>
				<h3 className="text-base font-semibold sm:text-lg">
					{data.href ? (
						<Link href={data.href} className="hover:text-primary">
							{data.title}
						</Link>
					) : (
						data.title
					)}
				</h3>
				<p className="text-muted-foreground text-sm">
					{data.description}
				</p>
			</CardContent>
		</Card>
	);
}
