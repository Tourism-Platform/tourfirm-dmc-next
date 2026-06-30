import { cn } from "@/shared/lib/utils";
import { CardType } from "@/shared/ui/cards";
import { CardRender } from "@/shared/ui/cards/ui/card-render";

import type { TOverviewStatsSectionProps } from "../model/types/custom-overview-stats-section.types";

const LG_GRID_COLS = [
	"lg:grid-cols-1",
	"lg:grid-cols-2",
	"lg:grid-cols-3",
	"lg:grid-cols-4",
	"lg:grid-cols-5",
	"lg:grid-cols-6",
	"lg:grid-cols-7",
	"lg:grid-cols-8"
] as const;

function getOverviewStatsGridClassName(count: number) {
	const cols = Math.max(count, 1);
	const smCols = Math.min(cols, 2);

	return cn(
		"grid-cols-1",
		smCols === 2 && "sm:grid-cols-2",
		LG_GRID_COLS[Math.min(cols, LG_GRID_COLS.length) - 1]
	);
}

export function OverviewStatsSection({ cards }: TOverviewStatsSectionProps) {
	return (
		<section className="border-b bg-muted/40">
			<div
				className={cn(
					"mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:px-6 lg:gap-4 lg:py-8",
					getOverviewStatsGridClassName(cards.length)
				)}
			>
				{cards.map((card, index) => (
					<CardRender
						key={String(index)}
						type={CardType.OverviewStat}
						item={card.item}
					/>
				))}
			</div>
		</section>
	);
}
