import { Globe2 } from "lucide-react";

import { Card } from "../../shadcn-ui/card";
import type { TAboutGeographySummaryCardProps } from "../types/about-geography-summary-card.types";

export function AboutGeographySummaryCard({
	title,
	countries,
	note
}: TAboutGeographySummaryCardProps) {
	return (
		<Card className="gap-3 py-0 shadow-none p-5 sm:gap-4 sm:p-6">
			<div className="flex items-center gap-2">
				<Globe2 className="text-primary size-5 shrink-0" />
				<h3 className="text-base font-semibold sm:text-lg">{title}</h3>
			</div>
			<p className="text-foreground text-sm font-medium sm:text-base">
				{countries}
			</p>
			<p className="text-muted-foreground text-sm sm:text-base">{note}</p>
		</Card>
	);
}
