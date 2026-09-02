import type { LucideIcon } from "lucide-react";

export type TTeamMemberCardData = {
	title: string;
	href?: string;
	imageUrl?: string;
	badge?: string;
	description?: string;
	langs?: string[];
	featured?: boolean;
	icon?: LucideIcon;
};

export type TTeamMemberCardProps = {
	data: TTeamMemberCardData;
};
