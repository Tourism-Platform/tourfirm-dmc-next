export interface IPriceHistogramRequest {
	min: number;
	max: number;
	step: number;
}

export interface IPriceHistogramItem {
	range: string;
	count: number;
}
