export type TPortraitCardData = {
	imageUrl: string;
	imageAlt: string;
	title?: string;
	description?: string;
};

export type TPortraitCardProps = {
	data: TPortraitCardData;
};
