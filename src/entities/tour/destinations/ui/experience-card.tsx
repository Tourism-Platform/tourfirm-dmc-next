"use client";

import Image from "next/image";
import type { FC } from "react";

import { Badge, Card } from "@/shared/ui";

import type { IExperienceCard } from "../types";

interface IExperienceCardProps {
	data: IExperienceCard;
}

export const ExperienceCard: FC<IExperienceCardProps> = ({ data }) => (
	<Card className="flex flex-col overflow-hidden p-0">
		<div className="relative h-48">
			<Image
				src={data.imageUrl}
				alt={data.imageAlt}
				fill
				className="object-cover"
				sizes="(max-width: 768px) 100vw, 33vw"
			/>
		</div>
		<div className="flex flex-1 flex-col gap-3 p-5">
			<Badge variant="secondary">{data.badge}</Badge>
			<h3 className="text-base font-semibold sm:text-lg">{data.title}</h3>
			<p className="text-muted-foreground text-sm">{data.description}</p>
		</div>
	</Card>
);
