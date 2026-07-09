export interface IExperienceCard {
	href?: string;
	imageUrl: string;
	badge: string;
	title: string;
	description: string;
	type?: string;
	location?: string;
	themes?: string[];
}

export type TExperienceCardProps = {
	data: IExperienceCard;
};
