import type { ICardItem } from "../types/card-render.types";

export interface IBlogCard {
	href: string;
	imageUrl: string;
	meta: string;
	title: string;
}

export type TBlogCardProps = {
	data: IBlogCard;
};

export function toBlogCardItem(data: IBlogCard): ICardItem {
	return {
		href: data.href,
		imageUrl: data.imageUrl,
		meta: data.meta,
		title: data.title
	};
}
