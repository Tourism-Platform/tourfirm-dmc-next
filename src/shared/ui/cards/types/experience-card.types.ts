export interface IExperienceCard {
	imageUrl: string;
	imageAlt: string;
	badge: string;
	title: string;
	description: string;
}

export type TExperienceCardProps = {
	data: IExperienceCard;
};
