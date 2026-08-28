import type { LucideIcon } from "lucide-react";

export interface IDestinationInsightCard {
	icon: LucideIcon;
	title: string;
	description?: string;
}

export type TDestinationInsightCardProps = {
	data: IDestinationInsightCard;
};
