import type { ICardItem } from "../types/card-render.types";

export interface INewsCard {
	href: string;
	imageUrl: string;
	meta: string;
	title: string;
}

export type TNewsCardProps = {
	data: INewsCard;
};

export function toNewsCardItem(data: INewsCard): ICardItem {
	return {
		href: data.href,
		imageUrl: data.imageUrl,
		meta: data.meta,
		title: data.title
	};
}
