import { Card } from "../../shadcn-ui/card";
import type { TDestinationInsightCardProps } from "../types/destination-insight-card.types";

export function DestinationInsightCard({ data }: TDestinationInsightCardProps) {
	const Icon = data.icon;

	return (
		<Card className="gap-3 py-0 shadow-none p-5 sm:p-6 h-full ">
			<div className="flex items-center gap-2">
				<span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
					<Icon className="size-4" />
				</span>
				<h3 className="text-base font-semibold sm:text-lg">
					{data.title}
				</h3>
			</div>
			{data.description ? (
				<p className="text-muted-foreground text-sm sm:text-base">
					{data.description}
				</p>
			) : null}
		</Card>
	);
}
