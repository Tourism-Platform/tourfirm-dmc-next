import { cn } from "@/shared/lib/utils";

import type { TBlitzQaCardProps } from "../types/blitz-qa-card.types";

export function BlitzQaCard({ data }: TBlitzQaCardProps) {
	return (
		<div
			className={cn(
				"flex h-full flex-col gap-2.5 rounded-[10px] border px-5 py-5 transition-transform duration-200 hover:-translate-y-1",
				data.featured
					? "border-border bg-muted"
					: "border-border bg-card"
			)}
		>
			<p
				className={cn(
					"text-[10.5px] font-semibold tracking-[0.12em] uppercase",
					data.featured ? "text-muted-foreground" : "text-primary"
				)}
			>
				{data.title}
			</p>
			<p className="text-foreground font-serif text-[17px] leading-snug italic">
				{data.description}
			</p>
		</div>
	);
}
