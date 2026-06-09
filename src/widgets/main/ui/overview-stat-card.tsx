"use client";

import type { LucideIcon } from "lucide-react";
import type { FC } from "react";

type TOverviewStatCardProps = {
	icon: LucideIcon;
	label: string;
	value: string;
};

export const OverviewStatCard: FC<TOverviewStatCardProps> = ({
	icon: Icon,
	value
}) => (
	<div className="flex gap-2 items-center justify-center">
		<Icon className="text-primary size-4 shrink-0" />
		<p className="text-sm leading-snug">
			{/* <span className="text-muted-foreground">{label}: </span> */}
			<span className="font-semibold">{value}</span>
		</p>
	</div>
);
