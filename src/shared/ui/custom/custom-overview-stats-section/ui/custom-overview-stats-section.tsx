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

	return cn(
		"grid-cols-1 sm:grid-cols-2",
		LG_GRID_COLS[Math.min(cols, LG_GRID_COLS.length) - 1]
	);
}

export function OverviewStatsSection({ cards }: TOverviewStatsSectionProps) {
	const isDetailed = cards.some(
		(card) =>
			Boolean(card.item.label) ||
			Boolean(card.item.hint) ||
			Boolean(card.item.langs?.length)
	);

	if (!isDetailed) {
		const isOdd = cards.length % 2 === 1;

		return (
			<section className="full-bleed">
				<div
					className={cn(
						"mx-auto grid max-w-7xl gap-3 px-4 py-6 sm:gap-4 sm:px-6 lg:gap-4 lg:px-8 lg:py-8",
						getOverviewStatsGridClassName(cards.length)
					)}
				>
					{cards.map((card, index) => {
						const isLastOdd = isOdd && index === cards.length - 1;

						return (
							<div
								key={String(index)}
								className={cn(
									isLastOdd && "col-span-2 lg:col-span-1"
								)}
							>
								<CardRender
									type={CardType.OverviewStat}
									item={card.item}
								/>
							</div>
						);
					})}
				</div>
			</section>
		);
	}

	return (
		<section className="relative z-10 -mt-16 px-4 sm:-mt-20 sm:px-6 lg:px-8">
			<div className="border-border bg-card mx-auto max-w-7xl overflow-hidden rounded-[18px] border shadow-xs">
				<div
					className={cn(
						"grid",
						getOverviewStatsGridClassName(cards.length)
					)}
				>
					{cards.map((card, index) => (
						<div
							key={String(index)}
							className="border-border border-b last:border-b-0 sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
						>
							<CardRender
								type={CardType.OverviewStat}
								item={card.item}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
