export interface IJournalCard {
	imageUrl: string;
	meta: string;
	title: string;
}

export type TJournalCardProps = {
	data: IJournalCard;
};
