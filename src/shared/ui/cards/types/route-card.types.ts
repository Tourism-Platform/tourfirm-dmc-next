export interface IRouteCard {
	href: string;
	imageUrl: string;
	badge: string;
	meta: string;
	title: string;
	description: string;
	countries: string[];
	themes: string[];
}

export type TRouteCardProps = {
	data: IRouteCard;
};
