import type { LucideIcon } from "lucide-react";

export type TMiniTableRow = {
	icon: LucideIcon;
	title: string;
	description: string;
};

export type TMiniTableCardData = {
	title: string;
	icon?: LucideIcon;
	rows: TMiniTableRow[];
};

export type TMiniTableCardProps = {
	data: TMiniTableCardData;
};
