export interface IExperienceCard {
	imageUrl: string;
	badge: string;
	title: string;
	description: string;
}

export type TExperienceCardProps = {
	data: IExperienceCard;
};
