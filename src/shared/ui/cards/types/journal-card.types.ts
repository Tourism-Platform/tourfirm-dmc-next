export interface IJournalCard {
	imageUrl: string;
	imageAlt: string;
	meta: string;
	title: string;
	href: string;
}

export type TJournalCardProps = {
	data: IJournalCard;
	statusLabel: string;
};
