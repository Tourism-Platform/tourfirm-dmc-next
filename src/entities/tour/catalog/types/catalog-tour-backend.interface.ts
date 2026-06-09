export interface ICatalogTourBackend {
	id: string;
	title: string;
	description: string;
	duration: number;
	price_from: number;
	price_to: number;
	image_url: string;
	rating: number;
	reviews_count: number;
	has_free_cancellation: boolean;
	is_recommended?: boolean;
}
