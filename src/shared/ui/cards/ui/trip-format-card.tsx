import { Badge } from "../../shadcn-ui/badge";
import type { TTripFormatCardProps } from "../types/trip-format-card.types";

import { DestinationInsightCard } from "./destination-insight-card";

export function TripFormatCard({ data }: TTripFormatCardProps) {
	return (
		<div className="flex flex-col gap-3">
			<Badge variant="secondary" className="w-fit">
				{data.badge}
			</Badge>
			<DestinationInsightCard
				data={{
					icon: data.icon,
					title: data.title,
					description: data.description
				}}
			/>
		</div>
	);
}
