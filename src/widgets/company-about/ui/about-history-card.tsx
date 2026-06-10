"use client";

import type { FC } from "react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

type TAboutHistoryCardProps = {
	year: string;
	title: string;
	description: string;
};

export const AboutHistoryCard: FC<TAboutHistoryCardProps> = ({
	year,
	title,
	description
}) => (
	<div className="flex flex-col gap-4">
		<Badge
			size="md"
			variant="secondary"
			className="bg-primary/10 text-primary w-fit rounded-full border-transparent"
		>
			{year}
		</Badge>
		<Card className="gap-3 py-0 shadow-none">
			<CardHeader className="px-5 pt-5 pb-0 sm:px-6 block">
				<CardTitle className="text-base sm:text-lg">{title}</CardTitle>
			</CardHeader>
			<CardContent className="px-5 pb-5 sm:px-6">
				<p className="text-muted-foreground text-sm sm:text-base">
					{description}
				</p>
			</CardContent>
		</Card>
	</div>
);
