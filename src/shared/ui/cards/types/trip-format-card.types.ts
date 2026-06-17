import type { LucideIcon } from "lucide-react";

export interface ITripFormatCardItem {
	id: string;
	badge: string;
	title: string;
	description: string;
	icon: LucideIcon;
}

export type TTripFormatCardProps = {
	data: ITripFormatCardItem;
};
