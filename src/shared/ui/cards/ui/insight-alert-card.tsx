import type { TInsightAlertCardProps } from "../types/insight-alert-card.types";

export function InsightAlertCard({ data }: TInsightAlertCardProps) {
	return (
		<div className="bg-muted/50 border-border/60 rounded-lg border p-5 sm:p-6">
			<div className="flex gap-4">
				<span
					aria-hidden
					className="bg-primary mt-1 h-10 w-1 shrink-0 rounded-full sm:h-12"
				/>
				<div className="flex min-w-0 flex-col gap-2">
					<h3 className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase sm:text-sm">
						{data.title}
					</h3>
					<p className="font-serif text-foreground text-base leading-relaxed sm:text-lg">
						{data.description}
					</p>
				</div>
			</div>
		</div>
	);
}
