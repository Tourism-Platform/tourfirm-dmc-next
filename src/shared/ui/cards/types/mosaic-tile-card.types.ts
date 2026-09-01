export type TMosaicTileCardData = {
	imageUrl: string;
	badge?: string;
	title: string;
	description?: string;
	href?: string;
};

export type TMosaicTileCardProps = {
	data: TMosaicTileCardData;
};
