import { cn } from "@/shared/lib/utils";

import type { TQuoteCardProps } from "../types/quote-card.types";

export function QuoteCard({ data }: TQuoteCardProps) {
	if (!data.quoteHtml) {
		return null;
	}

	const isWide = data.variant === "wide";

	return (
		<figure
			className={cn(
				"relative m-0",
				isWide ? "pl-7 sm:pl-9" : "pl-5 sm:pl-6"
			)}
		>
			<span
				aria-hidden
				className="from-primary to-primary/0 absolute top-1.5 bottom-0 left-0 w-[3px] rounded-full bg-gradient-to-b"
			/>
			<blockquote
				className={cn(
					"text-foreground m-0 font-serif font-normal italic",
					isWide
						? "text-[23px] leading-snug sm:text-3xl lg:text-4xl"
						: "text-xl leading-relaxed sm:text-2xl"
				)}
			>
				<div
					className="[&_a]:underline [&_em]:text-primary [&_em]:italic [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold"
					dangerouslySetInnerHTML={{ __html: data.quoteHtml }}
				/>
			</blockquote>
			{data.caption ? (
				<figcaption className="text-muted-foreground mt-4 flex items-center gap-3 text-[10.5px] font-semibold tracking-[0.16em] uppercase">
					<span
						aria-hidden
						className="bg-primary/40 h-px w-8 shrink-0"
					/>
					{data.caption}
				</figcaption>
			) : null}
		</figure>
	);
}
