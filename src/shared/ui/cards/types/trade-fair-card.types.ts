import type { ICardItem } from "../types/card-render.types";

export interface ITradeFairCard {
	href?: string;
	imageUrl?: string;
	title: string;
	stand: string;
	country: string;
	participants: string;
}

export type TTradeFairCardProps = {
	data: ITradeFairCard;
};

export function toTradeFairCardItem(data: ITradeFairCard): ICardItem {
	return {
		href: data.href,
		imageUrl: data.imageUrl,
		title: data.title,
		stand: data.stand,
		country: data.country,
		participants: data.participants
	};
}
