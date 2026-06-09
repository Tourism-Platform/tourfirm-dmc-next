export interface ICatalogTourCard {
	id: string;
	title: string;
	description: string;
	duration: number;
	priceFrom: number;
	priceTo: number;
	imageUrl: string;
	rating: number;
	reviewsCount: number;
	hasFreeCancellation: boolean;
	isRecommended?: boolean;
}
