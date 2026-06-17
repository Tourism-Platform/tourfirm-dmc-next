export interface IRouteIdeaCard {
	imageUrl: string;
	imageAlt: string;
	badge: string;
	meta: string;
	title: string;
	description: string;
	ctaHref: string;
	ctaLabel: string;
}

export type TRouteIdeaCardProps = {
	data: IRouteIdeaCard;
};
