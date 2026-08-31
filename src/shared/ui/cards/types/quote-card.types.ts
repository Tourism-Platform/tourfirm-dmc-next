export type TQuoteCardData = {
	quoteHtml: string;
	caption?: string;
	variant?: "default" | "wide";
};

export type TQuoteCardProps = {
	data: TQuoteCardData;
};
