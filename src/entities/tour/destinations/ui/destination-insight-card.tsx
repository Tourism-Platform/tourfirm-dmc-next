"use client";

import type { FC } from "react";

import type { IDestinationInsightCard } from "../types";

interface IDestinationInsightCardProps {
	data: IDestinationInsightCard;
}

export const DestinationInsightCard: FC<IDestinationInsightCardProps> = ({
	data
}) => {
	const Icon = data.icon;

	return (
		<article className="bg-card flex flex-col gap-3 rounded-xl border p-5 sm:p-6">
			<div className="flex items-center gap-2">
				<Icon className="text-primary size-5 shrink-0" />
				<h3 className="text-base font-semibold sm:text-lg">
					{data.title}
				</h3>
			</div>
			<p className="text-muted-foreground text-sm sm:text-base">
				{data.description}
			</p>
		</article>
	);
};
