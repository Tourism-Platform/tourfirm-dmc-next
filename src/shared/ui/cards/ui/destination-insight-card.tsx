import { Card } from "../../shadcn-ui/card";
import type { TDestinationInsightCardProps } from "../types/destination-insight-card.types";

export function DestinationInsightCard({ data }: TDestinationInsightCardProps) {
	const Icon = data.icon;

	return (
		<Card className="gap-3 py-0 shadow-none p-5 sm:p-6 h-full">
			<div className="flex items-center gap-2">
				<Icon className="text-primary size-5 shrink-0" />
				<h3 className="text-base font-semibold sm:text-lg">
					{data.title}
				</h3>
			</div>
			<p className="text-muted-foreground text-sm sm:text-base">
				{data.description}
			</p>
		</Card>
	);
}
