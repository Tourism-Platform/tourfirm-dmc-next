import type { LucideIcon } from "lucide-react";

export type TValuePointCardData = {
	title: string;
	description?: string;
	icon?: LucideIcon;
};

export type TValuePointCardProps = {
	data: TValuePointCardData;
};
