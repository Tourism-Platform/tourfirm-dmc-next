import type { TQuoteCardProps } from "../types/quote-card.types";

export function QuoteCard({ data }: TQuoteCardProps) {
	if (!data.quoteHtml) {
		return null;
	}

	return (
		<blockquote className="border-primary text-primary border-l-4 pl-5 sm:pl-6">
			<div
				className="font-serif text-xl leading-relaxed font-normal italic sm:text-2xl [&_a]:underline [&_em]:italic [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold"
				dangerouslySetInnerHTML={{ __html: data.quoteHtml }}
			/>
		</blockquote>
	);
}
