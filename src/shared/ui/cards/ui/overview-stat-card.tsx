import type { TOverviewStatCardProps } from "../types/overview-stat-card.types";

export function OverviewStatCard({
	icon: Icon,
	value
}: TOverviewStatCardProps) {
	return (
		<div className="bg-background flex h-full items-center gap-3 rounded-xl border px-4 py-3 shadow-xs">
			<span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
				<Icon className="size-4" />
			</span>
			<p className="text-sm leading-snug">
				<span className="font-semibold">{value}</span>
			</p>
		</div>
	);
}
