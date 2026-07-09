export interface IGeoDiscoveryCard {
	href: string;
	imageUrl: string;
	badge: string;
	title: string;
	description: string;
}

export type TGeoDiscoveryCardProps = {
	data: IGeoDiscoveryCard;
};
