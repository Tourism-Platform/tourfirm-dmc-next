export type TTourDestinationCard = {
	href: string;
	imageUrl: string;
	badge?: string;
	title: string;
	description?: string;
	cities?: string[];
	featured?: boolean;
	className?: string;
};

export type TTourDestinationCardProps = {
	data: TTourDestinationCard;
};
