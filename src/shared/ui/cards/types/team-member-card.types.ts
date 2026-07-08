import type { LucideIcon } from "lucide-react";

export interface ITeamMemberCard {
	icon: LucideIcon;
	title: string;
	description: string;
	href: string;
}

export type TTeamMemberCardProps = {
	data: ITeamMemberCard;
};
